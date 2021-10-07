import { PokeAPI } from "./poke-api.js";
import { Utils } from "./utils.js";

export class PokemonDetails {
  static async createContent(name) {
    const pokemonID = POKE_KEYS[name];

    const pokemon = await PokeAPI.getPokemon(pokemonID);
    const details = await PokeAPI.getPokemonsByName(name);

    const pokemonDetails = { ...details, ...pokemon };

    const $pokemonContent = Utils.createElementWithClass("div", "pokemon-content");

    $pokemonContent.innerHTML = `
      <a href="/#"<button class="back">
      <img alt="&larr;" class="arrow"/> 
      Back
      </button>
      </a>
     `;

    const $pokemonCard = await PokemonDetails.createPokemonCard(pokemonDetails);

    $pokemonContent.append($pokemonCard);

    return $pokemonContent;
  }
}
