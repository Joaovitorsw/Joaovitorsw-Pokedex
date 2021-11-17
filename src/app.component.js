import { ROUTES } from "./constants/ROUTES.js";
import { FireBaseService } from "./services/fire-base.service.js";
import { LoadingScreenService } from "./services/loading-screen.service";
import { PokeAPIService } from "./services/poke-api.service.js";

export class AppComponent {
  #pokeAPIService;
  #loadingScreenService;
  #fireBaseService;

  constructor() {
    this.#pokeAPIService = new PokeAPIService();
    this.#loadingScreenService = new LoadingScreenService();
    this.#fireBaseService = new FireBaseService();
  }
  async renderPage() {
    $main.innerHTML = "";
    this.#loadingScreenService.LoadingPage();

    const hashedRoute = window.location.hash;
    const targetRoute = this.getTargetRoute(hashedRoute);

    const [fragment, param] = targetRoute.split("/");
    const hasParam = !!param;
    await this.#pokeAPIService.requestPokemons();
    const $html = hasParam ? await ROUTES[fragment].getTemplate(param) : await ROUTES[fragment].getTemplate();
    $main.appendChild($html);
    this.#loadingScreenService.removeLoadingScreen();
  }

  getTargetRoute(hash) {
    const hashIsEmpty = hash === "";
    return hashIsEmpty ? "home" : hash.replace("#", "").replace("?", "");
  }

  addHashListener() {
    window.addEventListener("hashchange", this.renderPage.bind(this));
  }

  addWindowLoadListener() {
    window.addEventListener("load", async () => {
      this.renderPage();
      this.addHashListener();
    });
  }
}
const singlePageApplication = new AppComponent();

singlePageApplication.addWindowLoadListener();
export const $main = document.querySelector("#root");

const emptyHash = window.location.hash === "";
const defaultRoute = () => (window.location.href = "?#");

if (emptyHash) defaultRoute();
