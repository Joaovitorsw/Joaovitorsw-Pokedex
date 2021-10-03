import { BasicStorage } from "./basic-storage.js";
import { HomeUI } from "./home-ui.js";
import { Utils } from "./utils.js";

export class FloatingLabelUI {
  static $homePage;
  static $searchInput;
  static $searchLabel;

  static FloatingLabelUI() {
    FloatingLabelUI.$homePage = document.querySelector(".homepage");
    FloatingLabelUI.$searchInput = document.querySelector(".search-bar-input");
    FloatingLabelUI.$searchLabel = document.querySelector(".search-bar-label");
    FloatingLabelUI.inputEventListener();
  }

  static inputEventListener() {
    FloatingLabelUI.$searchInput.addEventListener("change", () => FloatingLabelUI.hasValue());
    FloatingLabelUI.$searchInput.addEventListener(
      "input",
      FloatingLabelUI.debounceEvent(async () => {
        const pokemonsArray = BasicStorage.get("pokemons");
        const userText = FloatingLabelUI.$searchInput.value.toLowerCase();
        const hasValue = (obj) => obj.indexOf(userText) > -1;
        const searchArray = pokemonsArray.filter((obj) => hasValue(obj.name));

        HomeUI.clearPokemons();

        if (userText !== "") {
          searchArray.forEach(async (pokemon) => {
            const $pokeCard = await HomeUI.createPokemonCard(pokemon.pokemonID);
            HomeUI.$pokemonsContent.append($pokeCard);
          });
        } else {
          for (let id = 1; id <= HomeUI.count; id++) {
            HomeUI.searchIsEmpty = true;
            const $pokeCard = await HomeUI.createPokemonCard(id);
            HomeUI.$pokemonsContent.append($pokeCard);
          }
        }
      }, 800)
    );
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
    classFn(this.$searchLabel, "active");
  }
}
