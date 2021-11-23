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
    this.infinityScrollFn = this.#infinityScroll.bind(this);
    window.addEventListener("scroll", this.infinityScrollFn);
    this.previous = 0;
    this.next = 21;
  }

  showNotFoundMessage(event) {
    const index = event.length - 1;
    const hasItem = event[index].target.children.length > 0;
    const hasPokemon = event[index].addedNodes[0]?.tagName === "POKEMON-CARD";
    const hasError = event[index].addedNodes[0]?.classList.contains("search-error");
    const shouldAdd = hasError && !hasPokemon;
    const methodKeyName = shouldAdd ? "add" : "remove";
    this.$pokemonsContent.classList[methodKeyName]("search-error");

    if (hasItem) return;

    const $errorCard = UtilsService.createElementWithClass("div", "search-error");
    $errorCard.innerHTML = `
            <h1>sorry</h1>
            <img>
            <p>Pokemon not found</p>
            `;
    UtilsService.fade($errorCard);
    this.$pokemonsContent.append($errorCard);
  }

  async changePokemonRange({ start = 0, end = 898, searchTerm = "" }) {
    const cachedArray = await this.#indexDB.get("pokemons");
    const generationSelected = cachedArray.slice(start, end);

    if (generationSelected.length === 0) await this.favoriteRange(generationSelected);

    const searchPokemon = (pokemon) => pokemon.indexOf(searchTerm) > -1;
    const pokemons = generationSelected.filter((pokemon) => {
      const lowerCasePokemonName = pokemon.name.toLowerCase();
      return searchPokemon(lowerCasePokemonName);
    });
    const sortedPokemons = pokemons.sort((a, b) => a.id - b.id);
    this.pokemons = sortedPokemons;
    this.previous = 0;
    this.next = 21;
    this.updateScreen();
  }

  async favoriteRange(array) {
    const hasLogin = this.#fireBaseService.getUser();
    if (hasLogin !== null) {
      const favPokemons = await this.#fireBaseService.getFavoritesPokemons();
      favPokemons.forEach((pokemon) => {
        array.push(pokemon.data());
      });
      return;
    }
    const $menu = document.querySelector("menu-gen");
    const $selected = document.querySelector(".selected h1");
    $menu.selectOption$.publish();
    $selected.innerHTML = "Filter by Generation";
    return UtilsService.notificationAlert("error", "You must be logged");
  }
  #infinityScroll() {
    const endScroll = window.scrollY + window.innerHeight >= document.body.scrollHeight;
    if (endScroll) {
      this.previous = this.next;
      this.next += 21;
      this.createAndAppendPokemons(this.previous, this.next);
    }
  }

  resetFilter() {
    const stars = document.querySelectorAll(".fav-content");
    stars.forEach((star) => star.classList.remove("active"));
    const menu = document.querySelector("menu-gen");
    const selected = document.querySelector(".selected h1");
    menu.selectOption$.publish({ start: 0, end: 898 });
    selected.innerHTML = "Filter by Generation";
  }

  updateScreen() {
    this.$pokemonsContent.innerHTML = "";
    this.createAndAppendPokemons();
  }

  async getPokemonsFromCache() {
    this.pokemons = await this.#indexDB.get("pokemons");
  }

  createAndAppendPokemons() {
    const maxNext = this.next === this.pokemons.length;
    const newNext = this.next > this.pokemons.length;

    if (maxNext) return;

    if (newNext) this.next = this.pokemons.length;

    const slicedPokemons = this.pokemons.slice(this.previous, this.next);
    slicedPokemons.forEach((pokemon) => {
      const $pokeCard = this.createPokemonCard(pokemon);
      UtilsService.fade($pokeCard);
      this.$pokemonsContent.append($pokeCard);
    });
    this.#fireBaseService.start();

    this.#fireBaseService.profile$.subscribe(() => {
      const activeStar = ($card) => {
        const $favPokemons = $card.querySelector("fav-star .fav-content");
        $favPokemons.classList.add("active");
      };
      this.#fireBaseService.getFavoritesPokemons().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const pokemon = doc.data();
          const $allCards = document.querySelectorAll("pokemon-card");
          $allCards.forEach(($card) => {
            if ($card.pokemonID === pokemon.id) activeStar($card);
          });
        });
      });
    });
  }

  removeStars() {
    const $profileCard = document.querySelector("profile-card");
    $profileCard?.updated$.subscribe(() => {
      this.resetFilter();
    });
  }

  removePokemonsFav() {
    const favPage = document.querySelector(".selected h1")?.innerText === "Favorite Pokemons";
    if (favPage) {
      const $favStars = document.querySelectorAll("fav-star");
      $favStars.forEach(($star) => {
        $star.observable$.subscribe((boolean) => {
          const $pokemonCard = $star.parentElement.parentElement;
          if (!boolean) $pokemonCard.remove();
        });
      });
    }
  }

  createPokemonCard(pokemon) {
    const pokemonCard = document.createElement("pokemon-card");
    const pokemonJson = JSON.stringify(pokemon);
    pokemonCard.setAttribute("pokemon", pokemonJson);
    return pokemonCard;
  }

  changeEvent($element, callback) {
    const observer = new MutationObserver((mutations) => {
      callback(mutations);
    });
    observer.observe($element, { childList: true });
  }
  async getTemplate() {
    const $homepage = UtilsService.createElementWithClass("div", "homepage");

    const $pokemonsContent = UtilsService.createElementWithClass("div", "pokemons-content");
    this.$pokemonsContent = $pokemonsContent;
    await this.getPokemonsFromCache();
    this.createAndAppendPokemons(this.previous, this.next);

    const $navigationContent = document.createElement("div");
    $navigationContent.classList.add("navigation-content");
    const $searchBar = document.createElement("search-bar");
    const $menu = document.createElement("menu-gen");
    const $profileCard = document.createElement("profile-card");
    this.changeEvent(this.$pokemonsContent, this.showNotFoundMessage.bind(this));
    this.changeEvent(this.$pokemonsContent, this.removePokemonsFav.bind(this));
    this.changeEvent($profileCard, this.removeStars.bind(this));

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
