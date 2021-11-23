import { $main } from "../../app.component";
import loadingScreenTemplate from "../loading-screen/loading-screen.component.html";
import loadingScreenStyle from "../loading-screen/loading-screen.component.scss";
export class LoadingScreenComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const style = loadingScreenStyle;
    this.innerHTML = loadingScreenTemplate;
  }

  loadingPage() {
    this.resetPage();
    $main.appendChild(this);
  }

  resetPage() {
    window.scrollTo(0, 0);
    document.documentElement.classList.add("loading");
  }

  removeLoadingScreen(time = 500) {
    setTimeout(() => this.classList.add("fade-out"), time);
    setTimeout(() => {
      $main.removeChild(this);
      document.documentElement.classList.remove("loading");
    }, time * 3);
  }
}
customElements.define("loading-screen", LoadingScreenComponent);
