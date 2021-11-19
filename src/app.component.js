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
  renderPage() {
    $main.innerHTML = "";
    this.#loadingScreenService.LoadingPage();

    const hashedRoute = window.location.hash;
    const targetRoute = this.getTargetRoute(hashedRoute);

    const [fragment, param] = targetRoute.split("/");
    const hasParam = !!param;
    const page = hasParam ? new ROUTES[fragment](param) : new ROUTES[fragment]();

    setTimeout(async () => {
      await this.#pokeAPIService.requestPokemons();
      const $html = await page.getTemplate();
      $main.appendChild($html);
      const timer = fragment === "home" ? 700 : 400;
      this.#loadingScreenService.removeLoadingScreen(timer);
    }, 400);
  }

  getTargetRoute(hash) {
    const hashIsEmpty = hash === "";
    return hashIsEmpty ? "home" : hash.replace("#", "").replace("?", "");
  }

  addHashListener() {
    window.addEventListener("hashchange", this.renderPage.bind(this));
  }

  addWindowLoadListener() {
    window.addEventListener("load", () => {
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
