import { ROUTES } from "../constants/ROUTES.js";
import { $main } from "../script.js";

export class SinglePageApplication {
  static addHashListener() {
    window.addEventListener("hashchange", SinglePageApplication.renderPage);
  }
}
