import { BasicStorage } from "./basic-storage.js";
import { HomeUI } from "./home-ui.js";
import { Utils } from "./utils.js";

export class FloatingLabelUI {
  static $homePage;
  static $searchInput;
  static $searchLabel;

  static FloatingLabelUI() {
    FloatingLabelUI.$homePage = document.querySelector(".homepage");
    FloatingLabelUI.$searchInput = document.querySelector(".search-bar-input");
    FloatingLabelUI.$searchLabel = document.querySelector(".search-bar-label");
  }

  static debounceEvent(callback, timeout) {
    let timer;

    return () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
      }, timeout);
    };
  }

  static hasValue() {
    const inputValue = FloatingLabelUI.$searchInput.value;
    const hasValueInput = inputValue !== "";
    const classFn = hasValueInput ? Utils.elementClassAdd : Utils.elementClassRemove;
    classFn(this.$searchLabel, "active");
  }
}
