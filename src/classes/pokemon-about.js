import { Utils } from "./utils.js";

export class PokemonAbout {
  static createAboutTab(data) {
    const pokemon = data;
    const { name, height, weight, abilities } = pokemon;

    const maskedHeight = `${height}`.padStart(2, "0").split("").join(",");

    const maskWeight = ($element) => {
      const arr = `${$element}`.split("");
      const index = arr.length - 1;
      const maskedWeight = `${arr.slice(0, -1).join("")},${arr[index]}`;
      return index === 0 ? arr : maskedWeight;
    };

    const $tab = Utils.createElementWithClass("div", "tab", "active");

    const abilitiesMap = abilities.map((abilities) => {
      return abilities.ability.name.capitalize();
    });

    $tab.innerHTML = `         
                <div class="about">
                <ul>
                  <li>Species:<span>${name.capitalize()}</span></li>
                  <li>Height:<span>${maskedHeight}m</span></li>
                  <li>Weight:<span>${maskWeight(weight)}Kg</span></li>
                  <li>Abilities:<span>${abilitiesMap.join(" | ")}</span></li>
                </ul>
              </div>   
      `;
    return $tab;
  }
}
