import { PokemonDetailsComponent } from "../components/pokemon-details/pokemon-details.component";
import { POKE_KEYS } from "../constants/POKE_KEYS";
import { PokeAPIService } from "../services/poke-api.service";

export class DetailsPage {
  #pokeAPIService;
  constructor(name) {
    this.pokeName = name;
    this.declarations = [PokemonDetailsComponent];
    this.#pokeAPIService = new PokeAPIService();
  }

  async getTemplate() {
    const id = POKE_KEYS[this.pokeName];

    const pokemon = await this.#pokeAPIService.getPokemon(id);
    const details = await this.#pokeAPIService.getPokemonByName(this.pokeName);

    const pokemonDetails = { ...details, ...pokemon };

    const $pokemonDetails = document.createElement("pokemon-details");
    $pokemonDetails.setAttribute("data", JSON.stringify(pokemonDetails));

    return $pokemonDetails;
  }
}
