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

  static async createPokemonCard(id) {
    const pokemon = await PokeAPI.getPokemon(id);
    const { name: pokemonName } = pokemon;

    const maskedPokemonID = Utils.getMaskedID(pokemon);
    const firstTypeName = Utils.getFirstType(pokemon);

    const spriteVersionUrl = Utils.getPokemonSpriteUrl(pokemon);

    const types = Utils.getPokemonTypes(pokemon);

    const $routerLink = document.createElement("a");

    const $pokeTypes = Utils.createElementWithClass("div", "poke-types");
    const $pokeCard = Utils.createElementWithClass("div", firstTypeName);
    const $pokeInfo = Utils.createElementWithClass("div", "poke-info");

    $pokeTypes.innerText = "Types:";

    types.forEach((pokeTypes) => Utils.appendPokemonType(pokeTypes, $pokeTypes));

    $routerLink.href = `#details/${pokemonName}`;
    $pokeInfo.innerHTML = `  
        <img src="${spriteVersionUrl}" alt="${pokemonName}" />
        <h1 class="poke-number">#${maskedPokemonID}</h1>
        <h2 class="poke-name">${pokemonName}</h2>  
  `;

    $pokeCard.appendChild($pokeInfo);
    $pokeCard.appendChild($pokeTypes);
    $routerLink.append($pokeCard);

    return $routerLink;
  }
}
