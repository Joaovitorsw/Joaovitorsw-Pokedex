import { Observable } from "../../classes/observable";
import { UtilsService } from "../../services/utils.service";
import searchStyle from "./search-bar.component.scss";

export class SearchBarComponent extends HTMLElement {
  constructor() {
    super();
    this.searchTerm$ = new Observable();
  }
  connectedCallback() {
    const style = searchStyle;

    const $searchBar = UtilsService.createElementWithClass("div", "search-bar");
    const $searchBarIcon = UtilsService.createElementWithClass("img", "search-bar-icon");
    $searchBarIcon.setAttribute("alt", "search-bar-icon");
    const $searchBarInput = UtilsService.createElementWithClass("input", "search-bar-input");
    $searchBarInput.setAttribute("type", "text");
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
    const $searchBarLabel = UtilsService.createElementWithClass("label", "search-bar-label");
    $searchBarLabel.innerHTML = "Search for pokemon...";
    $searchBar.append($searchBarIcon);
    $searchBar.append($searchBarInput);
    $searchBar.append($searchBarLabel);
    this.append($searchBar);
  }
}

customElements.define("search-bar", SearchBarComponent);
