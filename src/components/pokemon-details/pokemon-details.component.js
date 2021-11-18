import { Observable } from "../../classes/observable";
import { IndexDBService } from "../../services/indexdb.service";
import { UtilsService } from "../../services/utils.service";
import { BackArrowComponent } from "../back-arrow/back-arrow.component";
import { TabsComponent } from "../tabs/tabs.component";
import pokemonDetailsTemplate from "./pokemon-details.component.html";
import pokemonDetailsStyle from "./pokemon-details.component.scss";

export class PokemonDetailsComponent extends HTMLElement {
  #indexdb;
  constructor() {
    super();
    this.#indexdb = new IndexDBService();
    this.declarations = [BackArrowComponent, TabsComponent];
  }
  connectedCallback() {
    const style = pokemonDetailsStyle;
    const data = this.getAttribute("data");
    const pokemon = JSON.parse(data);
    this.removeAttribute("data");
    const { name } = pokemon;
    const [type1, type2] = UtilsService.getPokemonTypes(pokemon);
    const id = UtilsService.getMaskedID(pokemon);
    const sprite = UtilsService.getHomeSpritesUrl(pokemon);
    const bindObject = { name, type1, type2, id, sprite };
    const template = UtilsService.bindModelToView(bindObject, pokemonDetailsTemplate);
    this.innerHTML = template;
    const $pokemonCard = this.querySelector(".pokemon-card");
    this.$tabs = document.createElement("tabs-component");
    this.$tabs.data = pokemon;
    this.$tabs.observable$ = new Observable();
    $pokemonCard.append(this.$tabs);
    this.shinyEventListener(pokemon);
  }
  shinyEventListener(pokemon) {
    const $shinyContent = document.querySelector(".shiny-content");
    const $pokeImage = document.querySelector(".pokemon-image");

    $shinyContent.addEventListener("click", () => {
      const boolean = $pokeImage.classList.toggle("shinyForm");
      const imagePath = UtilsService.getPokeImageUrl(pokemon.name, boolean);
      $pokeImage.setAttribute("src", imagePath);
      this.$tabs.observable$.publish([imagePath, pokemon.id]);
    });
  }
}
customElements.define("pokemon-details", PokemonDetailsComponent);
