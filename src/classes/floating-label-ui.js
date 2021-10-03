import { HomeUI } from "./home-ui.js";
import { Utils } from "./utils.js";

export class FloatingLabelUI {
  static $homePage;
  static $searchInput;
  static $searchLabel;
  static searchPokemonArray;

  static FloatingLabelUI() {
    FloatingLabelUI.$homePage = document.querySelector(".homepage");
    FloatingLabelUI.$searchInput = document.querySelector(".search-bar-input");
    FloatingLabelUI.$searchLabel = document.querySelector(".search-bar-label");
    FloatingLabelUI.inputEventListener();
  }

  static inputEventListener() {
    FloatingLabelUI.$searchInput.addEventListener("change", FloatingLabelUI.hasValue);
    FloatingLabelUI.$searchInput.addEventListener("input", FloatingLabelUI.debounceEvent(FloatingLabelUI.updatePokemon, 800));
  }

  static async updatePokemon() {
    const userText = FloatingLabelUI.$searchInput.value.toLowerCase();
    const searchPokemon = (pokemon) => pokemon.indexOf(userText) > -1;
    FloatingLabelUI.searchPokemonArray = HomeUI.pokemonArrays.filter((pokemon) => searchPokemon(pokemon.name));
    const clearFn = FloatingLabelUI.searchPokemonArray.length === 0 ? HomeUI.noPokemonsFound : HomeUI.clearPokemons;

    clearFn();

    HomeUI.createPokemons(FloatingLabelUI.searchPokemonArray);

    if (userText === "") HomeUI.searchIsEmpty = true;
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

  static hasValue() {
    const inputValue = FloatingLabelUI.$searchInput.value;
    const hasValueInput = inputValue !== "";
    const classFn = hasValueInput ? Utils.elementClassAdd : Utils.elementClassRemove;
    classFn(FloatingLabelUI.$searchLabel, "active");
  }
}
