import { PokeAPI } from "./poke-api.js";
import { Utils } from "./utils.js";

export class HomeUI {
  static count = 1;

  static async fetchPokemons(value) {
    const $pokemonsContent = document.querySelector(".pokemons-content");

    for (HomeUI.count; HomeUI.count <= value; HomeUI.count++) {
      const $pokeCard = await HomeUI.createPokemonCard(HomeUI.count);
      $pokemonsContent.append($pokeCard);
    }
  }
}
