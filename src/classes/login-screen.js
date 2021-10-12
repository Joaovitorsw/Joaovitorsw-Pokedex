import { $main } from "../script.js";
import { FireBase } from "./fire-base.js";
import { Utils } from "./utils.js";

export class LoginScreen {
  $exit;
  $loginScreen;
  $registerForm;
  actuallyForm = "login-form";
  $loginForm;
  $email;
  $button;
  email;
  password;
  firstListener = false;
  emailIsValid = false;
  passwordIsValid = false;
  userIsValid = false;
  $password;
  $html = document.documentElement;

  show() {
    this.#loginScreenUI();
  }

  #loginScreenUI() {
    const $loginScreen = this.#createLoginScreen();
    $main.append($loginScreen);
    this.$html.classList.add("login");
    this.#formSelector();
  }

  #createLoginScreen() {
    const $loginScreen = Utils.createElementWithClass("div", "login-screen");
    $loginScreen.innerHTML = `
    <button class="exit">X</button>
     <div class="form">
        <div class="thumbnail">
            <img>
        </div>
        <form class="register-form">
            <input type="text" placeholder="Email address"/>
            <span class="form-error">Invalid email address</span>
            <input type="password" placeholder="Password"/>
            <span class="form-error">Invalid email address</span>
            <button disabled>Create</button>
            <p class="message">Already registered? 
            <a>Sign In</a>
            </p>
        </form>
        <form class="login-form">
            <input type="text" placeholder="Email address"/>
            <span class="form-error">Invalid email address</span>
            <input type="password" placeholder="Password"/>
            <span class="form-error">Invalid email address</span>
            <button disabled>Login</button>
            <p class="message">Not registered? 
            <a>Create an account</a>
            </p>
        </form>
     </div>
          `;
    return $loginScreen;
  }

  #formSelector() {
    this.$loginForm = document.querySelector(".login-form");
    this.$registerForm = document.querySelector(".register-form");

    const $loginHRef = this.$loginForm.querySelector("a");
    const $registerHRef = this.$registerForm.querySelector("a");

    $loginHRef.addEventListener("click", () => {
      this.#changeForm("none", "flex");
      this.actuallyForm = "register-form";
      this.#loginScreenRecoveryElements();
    });
    $registerHRef.addEventListener("click", () => {
      this.#changeForm("flex", "none");
      this.actuallyForm = "login-form";
      this.#loginScreenRecoveryElements();
    });
    this.#loginScreenRecoveryElements();
  }

  #changeForm(property1, property2) {
    this.$loginForm.style.display = property1;
    this.$registerForm.style.display = property2;
  }

  #loginScreenRecoveryElements() {
    this.$exit = document.querySelector(".exit");
    this.$loginScreen = document.querySelector(".login-screen");
    this.$email = document.querySelector(`.${this.actuallyForm} input[type=text]`);
    this.$password = document.querySelector(`.${this.actuallyForm} input[type=password]`);
    this.$button = document.querySelector(`.${this.actuallyForm} button`);
    this.#loginScreenEventListener();
  }

  #loginScreenEventListener() {
    this.$exit.addEventListener("click", () => this.#removeLoginScreen());
    this.$email.addEventListener(
      "input",
      Utils.debounceEvent(() => {
        this.#isValid(this.$email);
        this.#submitRemoveDisable();
      }, 300)
    );
    this.$password.addEventListener(
      "input",
      Utils.debounceEvent(() => {
        this.#isValid(this.$password);
        this.#submitRemoveDisable();
      }, 300)
    );
  }

  #isValid($input) {
    const $inputType = $input.getAttribute("type");
    const mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{9,16}$/;
    const pattern = $inputType === "text" ? mailPattern : passwordPattern;

    const isValid = pattern.test($input.value);
    this.$button.disabled = true;
    $input.classList.add("invalid");
    if (isValid) {
      $inputType === "text" ? (this.emailIsValid = true) : (this.passwordIsValid = true);
      $inputType === "text" ? (this.email = $input.value) : (this.password = $input.value);
      $input.classList.remove("invalid");
    }
    this.userIsValid = this.emailIsValid && this.passwordIsValid;
    if (this.userIsValid) this.$button.disabled = false;
  }

  #submitRemoveDisable() {
    if (this.firstListener) return;
    if (this.userIsValid) {
      const enterKey = 13;
      this.$email.addEventListener("keyup", (keyEvent) => {
        if (keyEvent.keyCode === enterKey) this.#submitButton();
      });
      this.$password.addEventListener("keyup", (keyEvent) => {
        if (keyEvent.keyCode === enterKey) this.#submitButton();
      });
      this.$button.addEventListener("click", () => this.#submitButton());
      this.firstListener = true;
    }
  }

  #submitButton() {
    const actuallyFn = this.actuallyForm === "login-form" ? FireBase.login : FireBase.register;
    actuallyFn(this.email, this.password);
    this.#removeLoginScreen();
  }

  #removeLoginScreen() {
    this.$loginScreen.classList.add("fade-out");
    setTimeout(() => {
      this.$loginScreen.remove();
      this.$html.classList.remove("login");
    }, 500);
  }
}
