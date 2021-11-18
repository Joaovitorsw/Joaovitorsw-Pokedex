import { UtilsService } from "../../services/utils.service";
import customAlertTemplate from "./custom-alert.component.html";
import customAlertStyle from "./custom-alert.component.scss";
export class CustomAlertComponent extends HTMLElement {
  connectedCallback() {
    const style = customAlertStyle;
    const { type, message } = this;
    const object = { type, message };
    const template = UtilsService.bindModelToView(object, customAlertTemplate);
    this.innerHTML = template;
    UtilsService.fade(this);
    setTimeout(() => UtilsService.fadeOut(this), 2000);
  }
}
customElements.define("custom-alert", CustomAlertComponent);
