import { BasicStorage } from "./basic-storage.js";
import { FloatingLabelUI } from "./floating-label-ui.js";
import { HomeUI } from "./home-ui.js";
import { Utils } from "./utils.js";

export class MenuUI {
  static $selectBox;
  static $selectItem;
  static $optionsContainer;
  static $menuList;
  static pokemonsArray;

  static menuUI() {
    MenuUI.$selectBox = document.querySelector(".select-box");
    MenuUI.$selectItem = MenuUI.$selectBox.querySelector(".selected h1");
    MenuUI.$menuList = MenuUI.$selectBox.querySelectorAll(".option");
    MenuUI.$optionsContainer = MenuUI.$selectBox.querySelector(".options-container");

    MenuUI.menuContentListener();
    MenuUI.menuAddListener();
  }

  static menuContentListener() {
    MenuUI.$selectBox.addEventListener("click", () => MenuUI.$optionsContainer.classList.toggle("active"));
  }

  static menuAddListener() {
    MenuUI.$menuList.forEach(($itemMenu) => {
      $itemMenu.addEventListener("click", () => {
        const generation = $itemMenu.querySelector("label").innerText;
        const generationRange = `${$itemMenu.querySelector("input").value}`.split(":");
        const generations = { start: parseFloat(generationRange[0]), end: parseFloat(generationRange[1]) };
        HomeUI.maxPokemons = generations.end;
        HomeUI.pokemonArrays = BasicStorage.get("pokemons").slice(generations.start, HomeUI.maxPokemons);
        FloatingLabelUI.updatePokemon();
        HomeUI.searchIsEmpty = false;
        MenuUI.$selectItem.innerText = generation;

        if (generationRange[0] === "") {
          HomeUI.clearPokemons();
          HomeUI.searchIsEmpty = true;
          for (let index = 1; index <= HomeUI.count; index++) {
            HomeUI.createPokemonCard(index).then(($pokemon) => {
              Utils.fadeIn($pokemon);
              HomeUI.$pokemonsContent.append($pokemon);
            });
          }
        }
      });
    });
  }
}
