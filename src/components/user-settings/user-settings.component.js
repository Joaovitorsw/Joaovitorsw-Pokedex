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
        }
        $submit.disabled = false;
        $p.innerText = imageFile.name;
        reader.readAsDataURL(imageFile);
        reader.onload = () => $avatar.setAttribute("src", reader.result);
      });

      $submit.addEventListener("click", async () => {
        const hasUser = this.#validators.isValidAllProperties();
        if (hasUser) {
          await this.#fireBaseService.updateProfile($name.value, $email.value, $password.value);
          $name.value = "";
          $email.value = "";
          $password.value = "";
          $passwordMatch.value = "";
          this.#validators.resetProperties();
          $submit.disabled = true;
        }

        if (!!$imageInput.files[0]) await this.#fireBaseService.uploadFile($imageInput.files[0]);
      });
      const $name = document.querySelector(".full-name");
      $name.addEventListener("input", () => {
        this.#validators.isValidName($name.value);
        this.buttonEnable();
      });
      const $email = document.querySelector(".email");
      $email.addEventListener("input", () => {
        this.#validators.isValidEmail($email.value);
        this.buttonEnable();
      });
      const $password = document.querySelector(".password");
      $password.addEventListener("input", () => {
        this.#validators.isValidPassword($password.value);
        this.buttonEnable();
      });
      const $passwordMatch = document.querySelector(".passwordMatch");
      $passwordMatch.addEventListener("input", () => {
        this.#validators.passwordIsMatch($password.value, $passwordMatch.value);
        this.buttonEnable();
      });
    });
  }
  buttonEnable() {
    const hasUser = this.#validators.isValidAllProperties();
    console.log(hasUser);
    const $submit = this.querySelector(".button-submit");
    $submit.disabled = !hasUser;
  }
}
customElements.define("user-settings", UserSettingsComponent);
