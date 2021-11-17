import { UtilsService } from "../../services/utils.service.js";
import { FavStarComponent } from "../fav-star/fav-star.component.js";
import pokemonCardTemplate from "./poke-card.component.html";
import pokemonCardStyle from "./poke-card.component.scss";

export class PokemonCardComponent extends HTMLElement {
  connectedCallback() {
    const style = pokemonCardStyle;

    const pokemonJSON = this.attributes.pokemon.value;
    this.removeAttribute("pokemon");

    const pokemon = JSON.parse(pokemonJSON);
    const [type1, type2] = UtilsService.getPokemonTypes(pokemon);
    const maskedID = UtilsService.getMaskedID(pokemon);
    const spriteVersionUrl = UtilsService.getHomeSpritesUrl(pokemon);

    const pokemonModel = {
      route: `?#details/${pokemon.name}`,
      id: maskedID,
      name: pokemon.name,
      image: spriteVersionUrl,
      type1,
      type2,
    };

    const template = UtilsService.bindModelToView(pokemonModel, pokemonCardTemplate);
    this.innerHTML = template;
    FavStarComponent;
  }
}

customElements.define("pokemon-card", PokemonCardComponent);
