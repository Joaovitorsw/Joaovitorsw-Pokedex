import { FireBase } from "./classes/fire-base.js";
import { SinglePageApplication } from "./classes/single-page-application.js";

export const $main = document.querySelector("#root");
SinglePageApplication.addHashListener();
SinglePageApplication.addWindowLoadListener();
FireBase.start();
const emptyHash = window.location.hash === "";
const defaultRoute = () => (window.location.href = "?#");

if (emptyHash) defaultRoute();
