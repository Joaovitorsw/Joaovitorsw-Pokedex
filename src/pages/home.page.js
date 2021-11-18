import { MenuComponent } from "../components/menu-gen/menu-gen.component";
import { PokemonCardComponent } from "../components/poke-card/poke-card.component";
import { ProfileCardComponent } from "../components/profile-card/profile-card.component.js";
import { SearchBarComponent } from "../components/search-bar/search-bar.component.js";
import { FireBaseService } from "../services/fire-base.service";
import { IndexDBService } from "../services/indexdb.service.js";
import { UtilsService } from "../services/utils.service.js";

export class HomePage {
  #selectedGenerationOption;
  #searchFilterTerm;
  #fireBaseService;
  #indexDB;

  constructor() {
    this.declarations = [PokemonCardComponent, SearchBarComponent, MenuComponent, ProfileCardComponent];
    this.#indexDB = new IndexDBService();
    this.#fireBaseService = new FireBaseService();
    this.pokemons = [];
  }

  noPokemonsFound() {
    this.clearPokemons();
    this.$pokemonsContent.classList.add("search-error");
    const $errorCard = UtilsService.createElementWithClass("div", "search-error");
    $errorCard.innerHTML = `   
            <h1>sorry</h1>
            <img>
            <p>Pokemon not found</p>
            `;
    UtilsService.fade($errorCard);
    this.$pokemonsContent.append($errorCard);
  }
  clearPokemons() {
    this.$pokemonsContent.classList.remove("search-error");
    this.$pokemonsContent.innerHTML = "";
  }

  async changePokemonRange({ start, end, searchTerm = "" }) {
    const cachedArray = await this.#indexDB.get("pokemons");
    let generationSelected = cachedArray.slice(start, end);
    if (isNaN(start, end)) {
      const hasLogin = this.#fireBaseService.getUser();

      if (hasLogin !== null) {
        const favPokemons = await this.#fireBaseService.getFavoritesPokemons();
        generationSelected = [];
        favPokemons.forEach((pokemon) => {
          generationSelected.push(pokemon.data());
        });
      } else {
        return UtilsService.notificationAlert("error", "You must be logged");
      }
    }

    const searchPokemon = (pokemon) => pokemon.indexOf(searchTerm) > -1;
    const pokemons = generationSelected.filter((pokemon) => {
      const lowerCasePokemonName = pokemon.name.toLowerCase();
      return searchPokemon(lowerCasePokemonName);
    });
    const sortedPokemons = pokemons.sort((a, b) => a.id - b.id);
    this.pokemons = sortedPokemons;
    const updateFn = (this.pokemons.length === 0 ? this.noPokemonsFound : this.updateScreen).bind(this);
    updateFn();
  }

  updateScreen() {
    this.clearPokemons();
    this.createAndAppendPokemons();
  }

  async getPokemonsFromCache() {
    this.pokemons = await this.#indexDB.get("pokemons");
  }

  createAndAppendPokemons() {
    this.pokemons.forEach((pokemon) => {
      const $pokeCard = this.createPokemonCard(pokemon);
      UtilsService.fade($pokeCard);
      this.$pokemonsContent.append($pokeCard);
    });
    this.#fireBaseService.start();
  }

  createPokemonCard(pokemon) {
    const pokemonCard = document.createElement("pokemon-card");
    const pokemonJson = JSON.stringify(pokemon);
    pokemonCard.setAttribute("pokemon", pokemonJson);
    return pokemonCard;
  }
  async getTemplate() {
    const $homepage = UtilsService.createElementWithClass("div", "homepage");

    const $pokemonsContent = UtilsService.createElementWithClass("div", "pokemons-content");
    this.$pokemonsContent = $pokemonsContent;

    await this.getPokemonsFromCache();
    this.createAndAppendPokemons();

    const $navigationContent = document.createElement("div");
    $navigationContent.classList.add("navigation-content");
    const $searchBar = document.createElement("search-bar");
    const $menu = document.createElement("menu-gen");
    const $profileCard = document.createElement("profile-card");

    $menu.selectOption$.subscribe((selectedOption) => {
      this.#selectedGenerationOption = selectedOption;
      const searchTerm = this.#searchFilterTerm;
      this.changePokemonRange({ ...selectedOption, searchTerm });
    });

    $searchBar.searchTerm$.subscribe((searchTerm) => {
      this.#searchFilterTerm = searchTerm;
      const selectedOption = this.#selectedGenerationOption;
      this.changePokemonRange({ ...selectedOption, searchTerm });
    });
    $navigationContent.append($searchBar);
    $navigationContent.append($profileCard);
    $navigationContent.append($menu);

    $homepage.append($navigationContent);
    $homepage.appendChild($pokemonsContent);

    return $homepage;
  }
}
