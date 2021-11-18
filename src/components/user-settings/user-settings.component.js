import { FireBaseService } from "../../services/fire-base.service";
import { UtilsService } from "../../services/utils.service";
import userSettingsTemplate from "./user-settings.component.html";
import userSettingsStyle from "./user-settings.component.scss";

export class UserSettingsComponent extends HTMLElement {
  #fireBaseService;
  constructor() {
    super();
    this.#fireBaseService = new FireBaseService();
  }
  connectedCallback() {
    this.#fireBaseService.start();
    const style = userSettingsStyle;
    this.#fireBaseService.profile$.subscribe((user) => {
      const img = require("../../assets/images/pokemon-trainer-pokemon.svg");
      const profilePicture = user.photoURL ?? img;
      const template = UtilsService.bindModelToView({ profilePicture }, userSettingsTemplate);
      this.innerHTML = template;
      const $avatar = this.querySelector(".avatar");
      const $imageInput = this.querySelector("#imageInput");
      const $p = this.querySelector(".image-input p");
      const reader = new FileReader();
      const submit = this.querySelector(".button-submit");

      $imageInput.addEventListener("change", async () => {
        if ($imageInput.files[0].size > 2097152) {
          UtilsService.notificationAlert("error", "File is too big!");
          $imageInput.value = "";
        }
        $p.innerText = $imageInput.files[0].name;
        reader.readAsDataURL($imageInput.files[0]);
        reader.onload = () => $avatar.setAttribute("src", reader.result);
        submit.addEventListener("click", async () => {
          this.#fireBaseService.uploadFile($imageInput.files[0]);
        });
      });
    });
  }
}
customElements.define("user-settings", UserSettingsComponent);
