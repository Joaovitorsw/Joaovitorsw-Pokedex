import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component.js";
import { ROUTES } from "./constants/ROUTES.js";
import { FireBaseService } from "./services/fire-base.service.js";
import { PokeAPIService } from "./services/poke-api.service.js";

export class AppComponent {
  #pokeAPIService;
  #loadingScreen;
  #fireBaseService;
  #actuallyInstancy;
  constructor() {
    this.#pokeAPIService = new PokeAPIService();
    this.declarations = [LoadingScreenComponent];
    this.#fireBaseService = new FireBaseService();
  }
  renderPage() {
    this.reset();
    this.#loadingScreen = document.createElement("loading-screen");
    this.#loadingScreen.loadingPage();

    const hashedRoute = window.location.hash;
    const targetRoute = this.getTargetRoute(hashedRoute);

    const [fragment, param] = targetRoute.split("/");
    const hasParam = !!param;
    this.#actuallyInstancy = hasParam ? new ROUTES[fragment](param) : new ROUTES[fragment]();

    setTimeout(async () => {
      await this.#pokeAPIService.requestPokemons();
      const $html = await this.#actuallyInstancy.getTemplate();
      $main.appendChild($html);
      const timer = fragment === "home" ? 700 : 400;
      this.#loadingScreen.removeLoadingScreen(timer);
    }, 400);
  }

  reset() {
    $main.innerHTML = "";
    window.removeEventListener("scroll", this.#actuallyInstancy?.infinityScrollFn);
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
