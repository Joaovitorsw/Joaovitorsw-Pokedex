import { Utils } from "./utils.js";

export class LoadingScreen {
  static createContent() {
    const $loadingScreen = Utils.createElementWithClass("div", "loader");
    $loadingScreen.innerHTML = ` <div class="pokeball">
    <div class="pokeball-button"></div>
  </div>
  `;
    return $loadingScreen;
  }
}
