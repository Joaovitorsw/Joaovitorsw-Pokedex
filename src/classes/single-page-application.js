import { ROUTES } from "../constants/ROUTES.js";
import { HomeUI } from "../classes/home-ui.js";
import { BasicStorage } from "./basic-storage.js";
import { FloatingLabelUI } from "./floating-label-ui.js";
import { MenuUI } from "./menu-ui.js";
import { PokemonDetailsUI } from "./pokemon-details-ui.js";
import { $main } from "../script.js";
import { FireBase } from "./fire-base.js";
import { LoginScreen } from "./login-screen.js";

export class SinglePageApplication {
  static addHashListener() {
    window.addEventListener("hashchange", SinglePageApplication.renderPage);
  }

  static getTargetRoute(hash) {
    const hashIsEmpty = hash === "";
    return hashIsEmpty ? "home" : hash.replace("#", "").replace("?", "");
  }

  static async renderPage() {
    const hashedRoute = window.location.hash;
    const targetRoute = SinglePageApplication.getTargetRoute(hashedRoute);

    const [fragment, param] = targetRoute.split("/");

    const renderPageFn = ROUTES[fragment];

    const hasParam = !!param;
    const $html = hasParam ? await renderPageFn(param) : await renderPageFn();

    $main.innerHTML = "";
    $main.appendChild($html);
    const loginScreen = new LoginScreen();
    const isHome = $html.className === "homepage";
    const addonsFn = isHome ? SinglePageApplication.homePage : SinglePageApplication.pokemonDetails;
    await SinglePageApplication.firstLoading();

    if (FireBase.notConnected) loginScreen.show();

    addonsFn();
  }

  static homePage() {
    HomeUI.searchIsEmpty = true;
    HomeUI.count = 1;
    MenuUI.menuUI();
    FloatingLabelUI.FloatingLabelUI();
    HomeUI.fetchPokemons(24);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    SinglePageApplication.infinityScrollListener();
  }

  static pokemonDetails() {
    HomeUI.searchIsEmpty = false;
    PokemonDetailsUI.UI();
  }

  static async firstLoading() {
    const cachedPokemons = BasicStorage.get("pokemons");
    if (cachedPokemons.length < 897) await HomeUI.createCache();
  }

  static infinityScrollListener() {
    let number = 26;
    window.addEventListener("scroll", async () => {
      if (HomeUI.searchIsEmpty) {
        const isEndScroll = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600;
        if (isEndScroll) {
          HomeUI.count >= HomeUI.maxPokemons ? (number = -1) : (number += 4);
          await HomeUI.fetchPokemons(++number);
        }
      }
    });
  }

  static addWindowLoadListener() {
    window.addEventListener("load", async () => {
      await SinglePageApplication.renderPage();
      SinglePageApplication.addHashListener();
    });
  }
}
