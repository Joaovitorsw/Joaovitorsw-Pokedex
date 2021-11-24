import { Validators } from "../../classes/validator";
import { FireBaseService } from "../../services/fire-base.service";
import { UtilsService } from "../../services/utils.service";
import userSettingsTemplate from "./user-settings.component.html";
import userSettingsStyle from "./user-settings.component.scss";

export class UserSettingsComponent extends HTMLElement {
  #fireBaseService;
  #validators;
  constructor() {
    super();
    this.#fireBaseService = new FireBaseService();
    this.#validators = new Validators();
  }
  connectedCallback() {
    this.#fireBaseService.start();
    const style = userSettingsStyle;

    this.#fireBaseService.profile$.subscribe((user) => {
      const img = require("../../assets/images/pokemon-trainer-pokemon.svg");
      const profilePicture = user.photoURL ?? img;
      const template = UtilsService.bindModelToView({ profilePicture }, userSettingsTemplate);
      this.innerHTML = template;
      const $submit = this.querySelector(".button-submit");
      const $cancel = this.querySelector(".button-cancel");
      $submit.disabled = true;
      const $avatar = this.querySelector(".avatar");
      const $imageInput = this.querySelector("#imageInput");
      const $p = this.querySelector(".image-input p");
      const reader = new FileReader();
      $imageInput.addEventListener("change", async () => {
        const imageFile = $imageInput.files[0];
        if (imageFile.size > 2097152) {
          UtilsService.notificationAlert("error", "File is too big!");
          $imageInput.value = "";
          $submit.disabled = true;
          return;
        }
        $submit.disabled = false;
        $p.innerText = imageFile.name;
        reader.readAsDataURL(imageFile);
        reader.onload = () => $avatar.setAttribute("src", reader.result);
      });

      $submit.addEventListener("click", async () => {
        const hasUser = this.#validators.isValidAllProperties();
        const imageFile = $imageInput.files[0];
        const callback = () => {
          $name.value = "";
          $email.value = "";
          $password.value = "";
          $newPassword.value = "";
          $submit.disabled = true;
          $passwordError.classList.remove("invalid");
          $cancel.disabled = false;
          this.#validators.resetProperties();
        };

        if (!!imageFile) await this.#fireBaseService.uploadFile(imageFile);
        if (hasUser) {
          $cancel.disabled = true;
          await this.#fireBaseService.updateProfile($name.value, $email.value, $password.value, $newPassword.value, callback);
          $passwordError.innerText = "Wrong Password";
          $passwordError.classList.add("invalid");
        }
      });
      const $name = document.querySelector(".full-name");
      const $nameError = $name.parentElement.querySelector(".form-error");
      $name.addEventListener("input", () => {
        this.#validators.isValidName($name.value);
        $nameError.classList.add("invalid");
        if (this.#validators.name) $nameError.classList.remove("invalid");
        this.buttonEnable();
      });
      const $email = document.querySelector(".email");
      const $emailError = $email.parentElement.querySelector(".form-error");
      $email.addEventListener("input", () => {
        this.#validators.isValidEmail($email.value);
        $emailError.classList.add("invalid");
        if (this.#validators.email) $emailError.classList.remove("invalid");
        this.buttonEnable();
      });
      const $password = document.querySelector(".password");
      const $passwordError = $password.parentElement.querySelector(".form-error");
      $password.addEventListener("input", () => {
        this.#validators.isValidPassword($password.value);
        $passwordError.innerText = "Invalid Password";
        $passwordError.classList.add("invalid");
        if (this.#validators.password) $passwordError.classList.remove("invalid");
        this.buttonEnable();
      });
      const $newPassword = document.querySelector(".passwordNew");
      const $passwordMatchError = $newPassword.parentElement.querySelector(".form-error");
      $newPassword.addEventListener("input", () => {
        $passwordMatchError.classList.add("invalid");
        this.#validators.isValidNewPassword($newPassword.value);
        if (this.#validators.newPassword) $passwordMatchError.classList.remove("invalid");
        this.buttonEnable();
      });
    });
  }
  buttonEnable() {
    const hasUser = this.#validators.isValidAllProperties();
    const $submit = this.querySelector(".button-submit");
    $submit.disabled = !hasUser;
  }
}
customElements.define("user-settings", UserSettingsComponent);
