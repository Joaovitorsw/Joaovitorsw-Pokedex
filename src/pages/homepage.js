import { Utils } from "../classes/utils.js";

export async function HomePage() {
  const $homepage = Utils.createElementWithClass("div", "homepage");
  $homepage.innerHTML = `  
         <div class="navigation-content">
          <div class="search-bar">
            <img class="search-bar-icon" alt="search-bar-icon" />
            <input class="search-bar-input" type="text" />
            <label class="search-bar-label">Search for pokemon...</label>
          </div>
           <div class="select-box">
            <div class="options-container">
              <div class="option">
                <input type="radio" class="radio" value="" />
                <label for="None">Filter by Generation</label>
              </div>
              <div class="option">
                <input type="radio" class="radio" value="0:151" />
                <label for="Africa">Generation I</label>
              </div>
              <div class="option">
                <input type="radio" class="radio" value="151:251" />
                <label for="Americas">Generation II</label>
              </div>
              <div class="option">
                <input type="radio" class="radio" value="251:386" />
                <label for="Asia">Generation III</label>
              </div>
              <div class="option">
                <input type="radio" class="radio" value="386:494" />
                <label for="Europe">Generation IV</label>
              </div>
              <div class="option">
                <input type="radio" class="radio" value="494:649" />
                <label for="Oceania">Generation V</label>
              </div>
                <div class="option">
                <input type="radio" class="radio" value="649:721" />
                <label for="Oceania">Generation VI</label>
              </div>
                <div class="option">
                <input type="radio" class="radio" value="721:802" />
                <label for="Oceania">Generation VII</label>
              </div>
                <div class="option">
                <input type="radio" class="radio" value="802:898" />
                <label for="Oceania">Generation VIII</label>
              </div>
            </div>
            <div class="selected"><h1>Filter by Generation</div>
           </div>
           </div>
          </div>
        `;
  const $pokemonsContent = Utils.createElementWithClass("div", "pokemons-content");
  $homepage.append($pokemonsContent);
  return $homepage;
}
