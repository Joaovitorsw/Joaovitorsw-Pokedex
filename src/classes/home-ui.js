import { LoadingScreen } from "./loading-screen.js";
import { PokeAPI } from "./poke-api.js";
import { Utils } from "./utils.js";

import { BasicStorage } from "./basic-storage.js";
import { FloatingLabelUI } from "./floating-label-ui.js";

export class HomeUI {
  static count = 1;
  static maxPokemons = 898;
  static $pokemonsContent;
  static searchIsEmpty = true;
  static pokemonArrays;

  static async fetchPokemons(value) {
    if (HomeUI.count >= HomeUI.maxPokemons) return;

    HomeUI.$pokemonsContent = document.querySelector(".pokemons-content");
    HomeUI.pokemonArrays = BasicStorage.get("pokemons");
    FloatingLabelUI.searchPokemonArray = HomeUI.pokemonArrays;
    await HomeUI.createPokemonsFor(value);
  }

  static async createPokemonsFor(value) {
    for (HomeUI.count; HomeUI.count <= value; HomeUI.count++) {
      const $pokeCard = await HomeUI.createPokemonCard(HomeUI.count);
      Utils.fadeIn($pokeCard);
      HomeUI.$pokemonsContent.append($pokeCard);
    }
  }

  static createPokemonsForEach(array) {
    array.forEach(async (pokemon) => {
      const $pokeCard = await HomeUI.createPokemonCard(pokemon.pokemonID);
      Utils.fadeIn($pokeCard);
      HomeUI.$pokemonsContent.append($pokeCard);
    });
  }

  static noPokemonsFound() {
    HomeUI.clearPokemons();
    HomeUI.$pokemonsContent.classList.add("error");
    const $errorCard = Utils.createElementWithClass("div", "error");
    $errorCard.innerHTML = `   
            <h1>sorry</h1>
            <img>
            <p>Pokemon not found</p>
            `;
    Utils.fadeIn($errorCard);
    HomeUI.$pokemonsContent.append($errorCard);
  }

  static clearPokemons() {
    HomeUI.$pokemonsContent.classList.remove("error");
    HomeUI.searchIsEmpty = false;
    HomeUI.$pokemonsContent.innerHTML = "";
  }

  static async createPokemonCard(id) {
    const pokemon = await PokeAPI.getPokemon(id);

    const { name: pokemonName } = pokemon;

    const maskedPokemonID = Utils.getMaskedID(pokemon);
    const firstTypeName = Utils.getFirstType(pokemon);

    const spriteVersionUrl = Utils.getHomeSpritesUrl(pokemon);

    const types = Utils.getPokemonTypes(pokemon);

    const $routerLink = document.createElement("a");

    const $pokeTypes = Utils.createElementWithClass("div", "poke-types");
    const $pokeCard = Utils.createElementWithClass("div", firstTypeName);
    const $pokeInfo = Utils.createElementWithClass("div", "poke-info");

    $pokeTypes.innerText = "Types:";

    types.forEach((pokeTypes) => Utils.appendPokemonType(pokeTypes, $pokeTypes));

    $routerLink.href = `#details/${pokemonName}`;
    $pokeInfo.innerHTML = `  
        <img src="${spriteVersionUrl}" alt="${pokemonName}" crossorigin="anonymous"/>
        <h1 class="poke-number">#${maskedPokemonID}</h1>
        <h2 class="poke-name">${pokemonName}</h2>  
  `;

    $pokeCard.appendChild($pokeInfo);
    $pokeCard.appendChild($pokeTypes);
    $routerLink.append($pokeCard);

    return $routerLink;
  }

  static async createCache() {
    await LoadingScreen.loadingScreen(PokeAPI.apiRequest, false);
  }
}
