import { FireBaseService } from "../../services/fire-base.service.js";
import { UtilsService } from "../../services/utils.service.js";
import { loginScreenStyle } from "../login-screen/login-screen.component.scss";
export class LoginScreenComponent extends HTMLElement {
  #firebaseService;
  #name;
  #email;
  #password;
  #passwordMatch;

  constructor() {
    super();
    this.#name = false;
    this.#email = false;
    this.#password = false;
    this.#passwordMatch = false;
    this.$html = document.documentElement;
    this.#firebaseService = new FireBaseService(this);
    this.#firebaseService.profile$.subscribe(({ displayName, photoURL }) => {
      const myEvent = new CustomEvent("login-event", {
        detail: { displayName, photoURL },
      });
      this.dispatchEvent(myEvent);
    });
  }

  startFireBase() {
    this.#firebaseService.start();
  }

  removeScreen() {
    this.innerHTML = "";
    this.$html.classList.remove("login");
    const $loginScreen = document.querySelector("login-screen");
    $loginScreen.remove();
  }
  connectedCallback() {
    this.innerHTML = "";
    const style = loginScreenStyle;
    this.#createButton();
    this.#createForm();
    UtilsService.fade(this);
    this.$html.classList.add("login");
    this.#buttonEnable();
    this.startFireBase();
  }

  #createButton() {
    const $button = UtilsService.createElementWithClass("button", "exit");
    $button.innerText = "X";
    $button.addEventListener("click", () => this.removeScreen());
    this.append($button);
  }
  #createForm() {
    const $form = UtilsService.createElementWithClass("div", "form");
    const image = require("../../assets/images/icons8-insignia-3-stars-96.png");
    $form.innerHTML = `
    <div class="thumbnail">
    <img src="${image}" />
    </div>
    `;
    const $registerForm = this.#generateRegisterForm();
    const $loginForm = this.#generateLoginForm();
    $form.append($registerForm);
    $form.append($loginForm);
    this.append($form);
  }

  #generateLoginForm() {
    const $loginForm = UtilsService.createElementWithClass("form", "login-form");

    const $inputEmail = UtilsService.createInputWithTypeAndPlaceholder("email", "Email address");
    const $errorEmail = UtilsService.createInputError("form-error", "Invalid email address");
    const mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $inputEmail.addEventListener("input", () => this.#regexIsValid($inputEmail, mailPattern, "#email"), 500);

    $loginForm.append($inputEmail);
    $loginForm.append($errorEmail);

    const $inputPassword = UtilsService.createInputWithTypeAndPlaceholder("password", "Password");
    const $errorPassword = UtilsService.createInputError("form-error", "Invalid password");
    const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{9,16}$/;

    $inputPassword.addEventListener("input", () => this.#regexIsValid($inputPassword, passwordPattern, "#password"));

    $loginForm.append($inputPassword);
    $loginForm.append($errorPassword);

    const $button = UtilsService.createElementWithClass("button", "submit");
    $button.innerText = "Login";
    $button.addEventListener("click", () => {
      if (this.#email && this.#password) {
        const email = $inputEmail.value;
        const password = $inputPassword.value;
        this.#firebaseService.login(email, password);
      }
    });
    $button.disabled = true;
    const $p = UtilsService.createElementWithClass("p", "message");
    $p.innerText = `Not registered?`;
    const $a = document.createElement("a");
    $a.innerText = "Create an account";
    $a.addEventListener("click", () => {
      this.#changeForm("none", "flex");
    });

    $loginForm.append($button);
    $p.append($a);
    $loginForm.append($p);

    return $loginForm;
  }

  #generateRegisterForm() {
    const $inputText = UtilsService.createInputWithTypeAndPlaceholder("text", "Name");
    const $errorText = UtilsService.createInputError("form-error", "Name is incorrect");
    const $registerForm = UtilsService.createElementWithClass("form", "register-form");
    const namePattern = /[A-Z][a-z]* [A-Z][a-z]*/;

    $inputText.addEventListener("input", () => this.#regexIsValid($inputText, namePattern, "#name"), 500);

    $registerForm.append($inputText);
    $registerForm.append($errorText);

    const $inputEmail = UtilsService.createInputWithTypeAndPlaceholder("email", "Email address");
    const $errorEmail = UtilsService.createInputError("form-error", "Invalid email address");
    const mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $inputEmail.addEventListener("input", () => this.#regexIsValid($inputEmail, mailPattern, "#email"), 500);

    $registerForm.append($inputEmail);
    $registerForm.append($errorEmail);

    const $inputPassword = UtilsService.createInputWithTypeAndPlaceholder("password", "Password");
    const $errorPassword = UtilsService.createInputError("form-error", "Invalid password");
    const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{9,16}$/;

    $inputPassword.addEventListener("input", () => this.#regexIsValid($inputPassword, passwordPattern, "#password"));

    $registerForm.append($inputPassword);
    $registerForm.append($errorPassword);

    const $inputConfirmPassword = UtilsService.createInputWithTypeAndPlaceholder("password", "Confirm Password");
    const $errorConfirmPassword = UtilsService.createInputError("form-error", "Passwords do not match");

    $inputConfirmPassword.addEventListener(
      "input",
      () => this.#passwordIsValid($inputConfirmPassword, $inputPassword, "#passwordMatch"),
      500
    );
    const $button = UtilsService.createElementWithClass("button", "submit");
    $button.innerText = "Create";
    $button.disabled = true;
    $button.addEventListener("click", () => {
      if (this.#name && this.#email && this.#password && this.#passwordMatch) {
        const name = $inputText.value;
        const email = $inputEmail.value;
        const password = $inputPassword.value;
        this.#firebaseService.register(name, email, password);
      }
    });
    const $p = UtilsService.createElementWithClass("p", "message");
    $p.innerText = `Already registered?`;
    const $a = document.createElement("a");
    $a.innerText = "Sign In";
    $a.addEventListener("click", () => {
      this.#changeForm("flex", "none");
    });

    $registerForm.append($inputConfirmPassword);
    $registerForm.append($errorConfirmPassword);
    $registerForm.append($button);
    $p.append($a);
    $registerForm.append($p);

    return $registerForm;
  }

  #changeForm(display1, display2) {
    const $registerForm = this.querySelector(".register-form");
    const $loginForm = this.querySelector(".login-form");

    $loginForm.style.display = display1;
    $registerForm.style.display = display2;
  }

  #buttonEnable() {
    const $buttonRegister = this.querySelector(".register-form button");
    const $buttonLogin = this.querySelector(".login-form button");
    $buttonRegister.disabled = true;
    $buttonLogin.disabled = true;
    const valid = this.#email && this.#password;
    if (valid) $buttonLogin.disabled = false;
    if (valid && this.#passwordMatch && this.#name) $buttonRegister.disabled = false;
  }

  #regexIsValid($input, pattern, property) {
    const validate = {
      "#name": () => (this.#name = isValid),
      "#email": () => (this.#email = isValid),
      "#password": () => (this.#password = isValid),
    };
    $input.classList.add("invalid");
    const isValid = pattern.test($input.value);
    if (isValid) {
      $input.classList.remove("invalid");
    }
    validate[property]();
    this.#buttonEnable();
  }

  #passwordIsValid($input, $inputConfirmPassword, property) {
    const validate = {
      "#passwordMatch": () => (this.#passwordMatch = isValid),
    };
    $input.classList.add("invalid");
    const isValid = $input.value === $inputConfirmPassword.value;
    if (isValid) {
      $input.classList.remove("invalid");
    }

    validate[property]();
    this.#buttonEnable();
  }

  logoff() {
    this.#firebaseService.logoff();
  }
}
customElements.define("login-screen", LoginScreenComponent);
