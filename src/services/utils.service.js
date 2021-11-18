import { $main } from "../app.component.js";
import { CustomAlertComponent } from "../components/custom-alert/custom-alert.component.js";
import { POKE_KEYS } from "../constants/POKE_KEYS.js";
$main;

export class UtilsService {
  static createElementWithClass(selector, ...className) {
    const $element = document.createElement(selector);
    $element.classList.add(...className);
    return $element;
  }

  static getPokemonTypes(pokemon) {
    const types = pokemon.types.map((types) => types.type.name);
    return types;
  }

  static getMaskedID(pokemon) {
    const maskedPokemonID = pokemon.id.toString().padStart(3, "0");
    return maskedPokemonID;
  }
  static getHomeSpritesUrl(pokemon) {
    const spriteVersionUrl = pokemon.id > 721 ? pokemon.sprites.front_default : pokemon.sprites.front_default_generation_vi;
    return spriteVersionUrl;
  }

  static elementClassAdd($element, status) {
    $element.classList.add(status);
  }

  static elementClassRemove($element, status) {
    $element.classList.remove(status);
  }

  static createInputWithTypeAndPlaceholder(type, placeholder) {
    const $input = document.createElement("input");
    $input.type = type;
    $input.placeholder = placeholder;
    return $input;
  }

  static createInputError(errorClass, errorMessage) {
    const $error = UtilsService.createElementWithClass("span", errorClass);
    $error.innerText = errorMessage;
    return $error;
  }

  static fade($element) {
    $element.classList.add("fade");
    setTimeout(() => {
      $element.classList.remove("fade");
    }, 2000);
  }

  static fadeIn($element) {
    $element.classList.add("fade-in");
    setTimeout(() => {
      $element.classList.remove("fade-in");
    }, 500);
  }

  static fadeOut($element, time = 250) {
    $element.classList.add("fade-out");
    setTimeout(() => {
      $element.remove();
    }, time);
  }

  static debounceEvent(callback, timeout) {
    let timer;
    return () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
      }, timeout);
    };
  }
  static throttleEvent(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static findPokemonIDinUrl() {}

  static getPokeImageUrl = (pokeName, isShine) => {
    const pokemonID = POKE_KEYS[pokeName];
    const shineUrl = isShine ? "shiny/" : "";
    const urlVersion =
      pokemonID > 721
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shineUrl}${pokemonID}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/${shineUrl}${pokemonID}.png`;

    return urlVersion;
  };

  static notificationAlert(type, message) {
    const declarations = [CustomAlertComponent];
    const $alert = document.createElement("custom-alert");
    $alert.type = type;
    $alert.message = message;
    $main.appendChild($alert);
  }

  static bindModelToView(object, template) {
    const objectEntries = Object.entries(object);
    const renderedTemplate = objectEntries.reduce((template, [key, value]) => {
      const expression = new RegExp(`{{ *${key}* }}`, "g");
      const replacedTemplate = template.replace(expression, value ?? "");
      return replacedTemplate;
    }, template);

    return renderedTemplate;
  }
}
String.prototype.capitalize = function (string) {
  return `${this[0].toUpperCase()}${this.slice(1)}`;
};
