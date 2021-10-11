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
}
