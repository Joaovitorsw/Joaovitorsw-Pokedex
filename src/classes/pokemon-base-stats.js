import { Utils } from "./utils.js";

export class PokemonBaseStats {
  static createBaseStatsTab(data) {
    const pokemon = data;

    const $tab = Utils.createElementWithClass("div", "tab");

    const stats = pokemon.stats.map((status) => status.base_stat);
    const [hp, attack, defense, spAtk, spDef, speed] = stats;
    const totalStats = stats.reduce((a, b) => a + b);
    const maxStat = 255;
    const minStat = 0;
    const maxStats = 754;
    const statsPercentage = (stats) => stats / 2;
    const totalPercentage = (total) => total / 10 + 24.6;

    const percentageToHexColor = (percentage, max, min) => {
      let red = 0;
      let green = 0;
      let blue = 0;

      const base = max - min;
      base === 0 ? (percentage = 100) : (percentage = ((percentage - min) / base) * 100);

      if (percentage < 50) {
        red = 255;
        green = Math.round(5.1 * percentage);
      } else {
        green = 255;
        red = Math.round(510 - 5.1 * percentage);
      }
      let hexadecimal = red * 0x10000 + green * 0x100 + blue * 0x1;

      return "#" + ("000000" + hexadecimal.toString(16)).slice(-6);
    };

    $tab.innerHTML = `<div class="base-stats">
                <ul>
                  <li>HP:
                  <span>${hp}</span>
                  <div class="stats">
                  <div class="hp"></div>
                  </div>
                  </li>
                  <li>Attack:
                  <span>${attack}</span>
                  <div class="stats">
                  <div class="attack"></div>
                  </div>
                  </li>
                  <li>Defense:
                  <span>${defense}</span>
                  <div class="stats">
                  <div class="defense"></div>
                  </div>
                  </li>
                  <li>Sp Atk:
                  <span>${spAtk}</span>
                  <div class="stats">
                  <div class="spAtk"></div>
                  </div>
                  </li>
                  <li>Sp Def:
                  <span>${spDef}</span>
                  <div class="stats">
                  <div class="spDef"></div>
                  </div>
                  </li>
                  <li>Speed:
                  <span>${speed}</span>
                  <div class="stats">
                  <div class="speed"></div>
                  </div>
                  </li>
                  <li>Total:<span>${totalStats}</span>
                  <div class="stats">
                  <div class="total"></div>
                  </div>
                  </li>
                </ul>
              </div>
              
              
              
              <style>
              .hp {background-color:${percentageToHexColor(hp, maxStat, minStat)}; width:${statsPercentage(hp)}%;}
              .attack {background-color:${percentageToHexColor(attack, maxStat, minStat)}; width:${statsPercentage(attack)}%;}
              .defense {background-color:${percentageToHexColor(defense, maxStat, minStat)}; width:${statsPercentage(defense)}%;}
              .spAtk {background-color:${percentageToHexColor(spAtk, maxStat, minStat)}; width:${statsPercentage(spAtk)}%;}
              .spDef {background-color:${percentageToHexColor(spDef, maxStat, minStat)}; width:${statsPercentage(spDef)}%;}
              .speed {background-color:${percentageToHexColor(speed, maxStat, minStat)}; width:${statsPercentage(speed)}%;}
              .total {background-color:${percentageToHexColor(totalStats, maxStats, minStat)}; width:${totalPercentage(totalStats)}%;}
              </style>
              
              `;

    return $tab;
  }
}
