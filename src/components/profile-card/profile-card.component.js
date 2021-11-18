import { $main } from "../../app.component";
import { LoginScreenComponent } from "../login-screen/login-screen.component";
import profileCardTemplate from "./profile-card.component.html";
import profileCardStyle from "./profile-card.component.scss";

export class ProfileCardComponent extends HTMLElement {
  constructor() {
    super();
    this.declarations = [LoginScreenComponent];
    this.defaultImg = require("../../assets/images/pokemon-trainer-pokemon.svg");
  }

  connectedCallback() {
    const style = profileCardStyle;
    this.innerHTML = profileCardTemplate;
    this.$name = document.querySelector(".name");
    this.$signIn = document.querySelector(".sing-in");
    this.$logoff = document.querySelector(".logoff");
    this.$userImg = document.querySelector(".user-img");
    this.$userImg.setAttribute("src", this.defaultImg);
    this.$name.innerText = "Trainer";
    this.$img = document.querySelector(".img");
    this.$loginScreen = document.createElement("login-screen");

    this.$loginScreen.addEventListener("login-event", (event) => {
      this.update(event.detail.displayName, event.detail.photoURL);
      this.setLogoff();
    });
    this.$signIn.addEventListener("click", () => {
      $main.appendChild(this.$loginScreen);
    });
    this.$logoff.addEventListener("click", () => {
      this.$loginScreen.logoff();
      this.setLogin();
      this.update("Trainer", this.defaultImg);
    });
    this.$loginScreen.startFireBase();
  }

  setLogin() {
    const $a = this.$img.querySelector("a");
    this.$img.classList.remove("logged");
    $a.remove();
    this.$signIn.style.display = "block";
    this.$logoff.style.display = "none";
  }

  setLogoff() {
    this.$signIn.style.display = "none";
    this.$logoff.style.display = "block";
    const hasSettings = this.$img.querySelector("a");
    if (hasSettings) return;
    const $settings = document.createElement("a");
    $settings.setAttribute("href", "?#settings");
    const image = require("../../assets/images/config-icon.png");
    const $img = document.createElement("img");
    $img.classList.add("config-img");
    $img.setAttribute("src", image);
    $settings.innerText = `Settings`;
    $settings.appendChild($img);
    this.$img.classList.add("logged");
    this.$img.appendChild($settings);
  }

  update(name, url) {
    this.$userImg.setAttribute("src", url);
    this.$name.innerText = name;
  }
}
customElements.define("profile-card", ProfileCardComponent);
