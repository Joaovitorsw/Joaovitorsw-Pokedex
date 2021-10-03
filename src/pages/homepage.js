import { Utils } from "../classes/utils.js";

export async function HomePage() {
  const $homepage = Utils.createElementWithClass("div", "homepage");
  $homepage.innerHTML = `  <div class="navigation-content">
          <div class="search-bar">
            <img class="search-bar-icon" alt="search-bar-icon" />
            <input class="search-bar-input" type="text" />
            <label class="search-bar-label">Search for pokemon...</label>
          </div>`;
  const $pokemonsContent = Utils.createElementWithClass("div", "pokemons-content");
  $homepage.append($pokemonsContent);
  return $homepage;
}
