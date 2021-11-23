import { Observable } from "../../classes/observable";
import { UtilsService } from "../../services/utils.service";
import { searchTemplate } from "./search-bar.component.html";
import { searchStyle } from "./search-bar.component.scss";

export class SearchBarComponent extends HTMLElement {
  constructor() {
    super();
    this.searchTerm$ = new Observable();
  }
  connectedCallback() {
    const style = searchStyle;
    const img = require("../../assets/images/search-bar-icon.svg");

    const template = UtilsService.bindModelToView({ img }, searchTemplate);
    this.innerHTML = template;
    const $searchBarInput = this.querySelector(".search-bar-input");
    $searchBarInput.addEventListener("change", (event) => {
      const hasValueInput = event.target.value !== "";
      const classFn = hasValueInput ? UtilsService.elementClassAdd : UtilsService.elementClassRemove;
      classFn($searchBarLabel, "active");
    });
    $searchBarInput.addEventListener(
      "input",
      UtilsService.debounceEvent(() => {
        const userText = $searchBarInput.value.toLowerCase();
        this.searchTerm$.publish(userText);
      }, 800)
    );
  }
}

customElements.define("search-bar", SearchBarComponent);
