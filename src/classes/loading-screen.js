import { Utils } from "./utils.js";
import { $main } from "../script.js";

export class LoadingScreen {
  static createContent() {
    const $loadingScreen = Utils.createElementWithClass("div", "loader");
    $loadingScreen.innerHTML = ` 
    <div class="pokeball">
    <div class="pokeball-button"></div>
    </div>
  `;
    return $loadingScreen;
  }

  static async loadingScreen(callback, hasReturn, param) {
    const $loadingScreen = LoadingScreen.createContent();
    $main.appendChild($loadingScreen);
    window.scrollTo(0, 0);
    document.documentElement.classList.add("loading");

    if (hasReturn) {
      await callback(param);
      $loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        document.documentElement.classList.remove("loading");
      }, 500);
      return await callback(param);
    } else {
      await callback();
    }
    $loadingScreen.classList.add("fade-out");
    setTimeout(() => {
      document.documentElement.classList.remove("loading");
      $main.removeChild($loadingScreen);
    }, 500);
  }
}
