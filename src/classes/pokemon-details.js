import { POKE_KEYS } from "../constants/POKE_KEYS.js";
import { PokeAPI } from "./poke-api.js";
import { PokemonAbout } from "./pokemon-about.js";
import { PokemonBaseStats } from "./pokemon-base-stats.js";
import { PokemonEvolution } from "./pokemon-evolution.js";
import { PokemonMoves } from "./pokemon-moves.js";
import { Utils } from "./utils.js";

export class PokemonDetails {
  static async createContent(name) {
    const pokemonID = POKE_KEYS[name];

    const pokemon = await PokeAPI.getPokemon(pokemonID);
    const details = await PokeAPI.getPokemonsByName(name);

    const pokemonDetails = { ...details, ...pokemon };

    const $pokemonContent = Utils.createElementWithClass("div", "pokemon-content");

    $pokemonContent.innerHTML = `
      <a href="/?#"<button class="back">
      <img alt="&larr;" class="arrow" crossorigin="anonymous"/> 
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

    const $InfoContent = await PokemonDetails.createTabsContent(data);

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
    $pokemonImage.setAttribute("crossorigin", `anonymous`);
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

  static async createTabsContent(data) {
    const $tabsContent = Utils.createElementWithClass("div", "tabs-content");
    const $tabs = await PokemonDetails.createTabs(data);

    $tabsContent.innerHTML = `
           <ul class="tabs-navigation">
            <li class="tab-option active" data-value="0">About</li>
            <li class="tab-option" data-value="1">Base Stats</li>
            <li class="tab-option" data-value="2">Evolution</li>
            <li class="tab-option" data-value="3">Moves</li>
          </ul>
        `;

    $tabsContent.append($tabs);

    return $tabsContent;
  }
  static async createTabs(data) {
    const $tabs = Utils.createElementWithClass("div", "tabs-card");
    const $aboutTab = PokemonAbout.createAboutTab(data);
    const $baseStatsTab = PokemonBaseStats.createBaseStatsTab(data);
    const $evolutionTab = await PokemonEvolution.createEvolutionTab(data);
    const $movesTab = await PokemonMoves.createMovesTab(data);

    $tabs.append($aboutTab);
    $tabs.append($baseStatsTab);
    $tabs.append($evolutionTab);
    $tabs.append($movesTab);

    return $tabs;
  }
}
