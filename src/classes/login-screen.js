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
}
