import { Observable } from "../../classes/observable";
import menuTemplate from "./menu-gen.component.html";
import menuStyle from "./menu-gen.component.scss";

export class MenuComponent extends HTMLElement {
  constructor() {
    super();
    this.selectOption$ = new Observable();
  }
  connectedCallback() {
    const style = menuStyle;
    this.innerHTML = menuTemplate;
    this.$selectBox = document.querySelector(".select-box");
    this.$menuList = this.$selectBox.querySelectorAll(".option");
    this.$optionsContainer = this.$selectBox.querySelector(".options-container");
    this.$selectBox.addEventListener("click", () => this.$optionsContainer.classList.toggle("active"));
    this.$selectItem = document.querySelector(".selected h1");

    this.$menuList.forEach(($itemMenu) => {
      $itemMenu.addEventListener("click", () => {
        const selected = this.getSelectOption($itemMenu);
        this.selectOption$.publish(selected);
      });
    });
  }
  getSelectOption($itemMenu) {
    this.changeSelectedText($itemMenu);
    const selectedGeneration = this.createGenerationObject($itemMenu);
    return selectedGeneration;
  }
  changeSelectedText($itemMenu) {
    const generation = $itemMenu.querySelector("label").innerText;
    this.$selectItem.innerText = generation;
  }

  createGenerationObject($itemMenu) {
    const generationRange = `${$itemMenu.querySelector("input").value}`.split(":");
    const selectedGeneration = { start: parseFloat(generationRange[0]), end: parseFloat(generationRange[1]) };
    return selectedGeneration;
  }
}
customElements.define("menu-gen", MenuComponent);
