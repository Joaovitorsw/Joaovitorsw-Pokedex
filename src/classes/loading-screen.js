import { Utils } from "./utils.js";

export class LoadingScreen {
  static createContent() {
    const $loadingScreen = Utils.createElementWithClass("div", "loader");
    $loadingScreen.innerHTML = `<div class="pokeball"><span></span></div>`;
    return $loadingScreen;
  }
}
