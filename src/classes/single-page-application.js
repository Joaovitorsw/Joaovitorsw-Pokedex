import { ROUTES } from "../constants/ROUTES.js";
import { $main } from "../script.js";
import { HomeUI } from "../classes/home-ui.js";
import { BasicStorage } from "./basic-storage.js";
import { FloatingLabelUI } from "./floating-label-ui.js";

export class SinglePageApplication {
  static addHashListener() {
    window.addEventListener("hashchange", SinglePageApplication.renderPage);
  }

  static getTargetRoute(hash) {
    const hashIsEmpty = hash === "";
    return hashIsEmpty ? "home" : hash.replace("#", "");
  }

  static async renderPage() {
    const hashedRoute = window.location.hash;
    const targetRoute = SinglePageApplication.getTargetRoute(hashedRoute);

    const [fragment, param] = targetRoute.split("/");
    const renderPageFn = ROUTES[fragment];

    const hasParam = !!param;
    const html = hasParam ? await renderPageFn(param) : await renderPageFn();

    $main.innerHTML = "";
    $main.appendChild(html);

    SinglePageApplication.infinityScrollListener();
    await SinglePageApplication.firstLoading();

    FloatingLabelUI.FloatingLabelUI();
    HomeUI.fetchPokemons(24);
  }

  static async firstLoading() {
    const cachedPokemons = BasicStorage.get("pokemons");
    if (cachedPokemons.length < 897) await HomeUI.createCache();
  }

  static infinityScrollListener() {
    let number = 26;

    window.addEventListener("scroll", async () => {
      if (HomeUI.searchIsEmpty) {
        const isEndScroll = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 550;
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
