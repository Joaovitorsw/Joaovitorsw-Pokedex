import favStarTemplate from "./fav-star.component.html";
import favStarStyle from "./fav-star.component.scss";

export class FavStarComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const style = favStarStyle;
    this.innerHTML = favStarTemplate;
    this.$favContent = this.querySelector(".fav-content");
    this.addEventListener("click", this.toggleStar);
  }
  toggleStar() {
    this.$favContent.classList.toggle("active");
  }
}
customElements.define("fav-star", FavStarComponent);
