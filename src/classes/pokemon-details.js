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

  static async createPokemonCard(data) {
    const $pokemonCard = Utils.createElementWithClass("div", "pokemon-card");

    const $pokemonDetails = PokemonDetails.createDetails(data);

    const $InfoContent = await PokemonDetails.createMoreInfo(data);

    $pokemonCard.append($pokemonDetails);

    $pokemonCard.append($InfoContent);

    return $pokemonCard;
  }

  static createDetails(data) {
    const pokemon = data;
    const { name } = data;
    const firstTypeName = Utils.getFirstType(pokemon);
    const $pokemonDetails = Utils.createElementWithClass("div", "pokemon-details", firstTypeName);
    $pokemonDetails.id = "pokemon-details";
    const $pokemonIdentifier = Utils.createElementWithClass("div", "pokemon-identifier");
    const $pokemonImage = Utils.createElementWithClass("img", "pokemon-image");
    const maskedPokemonID = Utils.getMaskedID(pokemon);
    const spriteVersionUrl = Utils.getHomeSpritesUrl(pokemon);

    $pokemonImage.setAttribute("src", spriteVersionUrl);
    $pokemonImage.setAttribute("alt", `${name}-image`);
    $pokemonImage.dataset.name = name;

    $pokemonIdentifier.innerHTML = `
    <div class="pokemon-identity">
      <h1>${name}</h1> 
      <div class="shiny-content">
        <div class="shiny"></div>
      </div>
      <h2 class="${firstTypeName}">#${maskedPokemonID}</h2>
    </div>
    `;
    const types = Utils.getPokemonTypes(pokemon);

    types.forEach((pokeTypes) => Utils.appendPokemonType(pokeTypes, $pokemonIdentifier));

    $pokemonDetails.append($pokemonIdentifier);

    $pokemonDetails.append($pokemonImage);

    return $pokemonDetails;
  }
}
