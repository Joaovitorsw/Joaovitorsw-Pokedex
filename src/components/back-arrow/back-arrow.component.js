import backArrowTemplate from "./back-arrow.component.html";
import backArrowStyle from "./back-arrow.component.scss";

export class BackArrowComponent extends HTMLElement {
  connectedCallback() {
    const style = backArrowStyle;
    this.innerHTML = backArrowTemplate;
  }
}
customElements.define("back-arrow", BackArrowComponent);
