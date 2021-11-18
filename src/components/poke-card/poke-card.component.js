import { FireBaseService } from "../../services/fire-base.service.js";
import { UtilsService } from "../../services/utils.service.js";
import { FavStarComponent } from "../fav-star/fav-star.component.js";
import pokemonCardTemplate from "./poke-card.component.html";
import pokemonCardStyle from "./poke-card.component.scss";

export class PokemonCardComponent extends HTMLElement {
  #fireBaseService;
  constructor() {
    super();
    this.#fireBaseService = new FireBaseService();
    this.declarations = [FavStarComponent];
  }
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
    this.pokemonID = pokemon.id;
    this.innerHTML = template;
    const favStar = this.querySelector("fav-star");
    favStar.observable$.subscribe(async (boolean) => {
      if (boolean) await this.#fireBaseService.addFavoritePokemon(pokemon);
      else await this.#fireBaseService.removeFavoritePokemon(pokemon);
    });
  }
}

customElements.define("pokemon-card", PokemonCardComponent);
