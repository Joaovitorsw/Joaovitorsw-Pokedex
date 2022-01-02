import { Validators } from "../../classes/validator.js";
import { FireBaseService } from "../../services/fire-base.service.js";
import { UtilsService } from "../../services/utils.service.js";
import loginScreenTemplate from "../login-screen/login-screen.component.html";
import loginScreenStyle from "../login-screen/login-screen.component.scss";
export class LoginScreenComponent extends HTMLElement {
  #fireBaseService;
  #validators;
  constructor() {
    super();
    this.$html = document.documentElement;
    this.#validators = new Validators();
    this.#fireBaseService = new FireBaseService();
    this.#fireBaseService.login$.subscribe(() => this.removeScreen());
    this.#fireBaseService.profile$.subscribe(({ displayName, photoURL }) => {
      const hasLogin = new CustomEvent("login-event", {
        detail: {
          displayName,
          photoURL,
        },
      });
      this.dispatchEvent(hasLogin);
    });
  }

  enableFireBase() {
    this.#fireBaseService.start();
  }

  removeScreen() {
    this.$html.classList.remove("login");
    const $loginScreen = document.querySelector("login-screen");
    $loginScreen.remove();
  }
  connectedCallback() {
    const style = loginScreenStyle;
    const img = require("../../assets/images/icons8-insignia-3-stars-96.png");
    const template = UtilsService.bindModelToView({ img }, loginScreenTemplate);
    this.innerHTML = template;
    this.$html.classList.add("login");
    this.setListeners();
  }

  setListeners() {
    const $exitButton = this.querySelector(".exit");
    $exitButton.addEventListener("click", () => this.removeScreen());

    const $loginEmail = this.querySelector(".login-form input[type=email]");
    const $loginPassword = this.querySelector(".login-form input[type=password]");
    const $loginA = this.querySelector(".login-form a");
    const $loginSubmit = this.querySelector(".login-form .submit");
    $loginEmail.addEventListener("input", () => {
      this.#validators.isValidEmail($loginEmail.value);
      UtilsService.elementClassToggleWithCondition($loginEmail, "invalid", !this.#validators.email);
      this.buttonEnable();
    });
    $loginPassword.addEventListener("input", () => {
      this.#validators.isValidPassword($loginPassword.value);
      UtilsService.elementClassToggleWithCondition($loginPassword, "invalid", !this.#validators.password);
      this.buttonEnable();
    });
    $loginA.addEventListener("click", () => this.changeForm("none", "flex"));
    $loginSubmit.addEventListener(
      "click",
      UtilsService.throttleEvent(() => {
        const valideUser = this.#validators.email && this.#validators.password;
        if (valideUser) {
          const email = $loginEmail.value;
          const password = $loginPassword.value;
          this.#fireBaseService.login(email, password);
        }
      }, 3000)
    );
    const $registerEmail = this.querySelector(".register-form input[type=email]");
    const [$registerPassword, $registerMatchPassword] = this.querySelectorAll(".register-form input[type=password]");
    const $registerName = this.querySelector(".register-form input[type=text]");
    const $registerA = this.querySelector(".register-form a");
    const $registerSubmit = this.querySelector(".register-form .submit");
    $registerEmail.addEventListener("input", () => {
      this.#validators.isValidEmail($registerEmail.value);
      UtilsService.elementClassToggleWithCondition($registerEmail, "invalid", !this.#validators.email);
      this.buttonEnable();
    });
    $registerPassword.addEventListener("input", () => {
      this.#validators.isValidPassword($registerPassword.value);
      UtilsService.elementClassToggleWithCondition($registerPassword, "invalid", !this.#validators.password);
      this.buttonEnable();
    });
    $registerMatchPassword.addEventListener("input", () => {
      this.#validators.passwordIsMatch($registerMatchPassword.value, $registerPassword.value);
      UtilsService.elementClassToggleWithCondition($registerMatchPassword, "invalid", !this.#validators.passwordMatch);
      this.buttonEnable();
    });
    $registerName.addEventListener("input", () => {
      this.#validators.isValidName($registerName.value);
      UtilsService.elementClassToggleWithCondition($registerName, "invalid", !this.#validators.name);
      this.buttonEnable();
    });
    $registerA.addEventListener("click", () => this.changeForm("flex", "none"));
    $registerSubmit.addEventListener(
      "click",
      UtilsService.throttleEvent(() => {
        const valideUser = this.#validators.email && this.#validators.password && this.#validators.name;
        if (valideUser) {
          const email = $registerEmail.value;
          const password = $registerPassword.value;
          const name = $registerName.value;
          this.#fireBaseService.register(email, password, name);
        }
      }, 3000)
    );
  }

  changeForm(display1, display2) {
    const $registerForm = this.querySelector(".register-form");
    const $loginForm = this.querySelector(".login-form");
    $loginForm.style.display = display1;
    $registerForm.style.display = display2;
  }

  buttonEnable() {
    const $buttonRegister = this.querySelector(".register-form button");
    const $buttonLogin = this.querySelector(".login-form button");
    const validLogin = !(this.#validators.email && this.#validators.password);
    const validRegister = !this.#validators.isValidAllProperties();
    $buttonRegister.disabled = validRegister;
    $buttonLogin.disabled = validLogin;
    if (validLogin) $buttonLogin.disabled = validLogin;
    if (validRegister) $buttonRegister.disabled = validRegister;
  }

  logoff() {
    this.#fireBaseService.logoff();
  }
}
customElements.define("login-screen", LoginScreenComponent);
