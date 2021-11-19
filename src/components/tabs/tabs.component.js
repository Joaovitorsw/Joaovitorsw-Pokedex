import { POKE_KEYS } from "../../constants/POKE_KEYS.js";
import { PokeAPIService } from "../../services/poke-api.service";
import { UtilsService } from "../../services/utils.service";
import tabsTemplate from "./tabs.component.html";
import tabsStyle from "./tabs.component.scss";

export class TabsComponent extends HTMLElement {
  #pokeAPIService;
  #moveDetails;
  constructor() {
    super();
    this.#pokeAPIService = new PokeAPIService();
  }
  connectedCallback() {
    const style = tabsStyle;
    const pokemon = this.data;
    delete this.data;
    const aboutTab = this.aboutTab(pokemon);
    const baseStats = this.baseStatsTab(pokemon);
    const template = UtilsService.bindModelToView({ ...aboutTab, ...baseStats }, tabsTemplate);
    this.innerHTML = template;
    const $evolutionTab = this.querySelector(".evolution");
    this.$movesTab = this.querySelector("tbody");
    this.createEvolutionTab(pokemon).then((evolutionTab) => {
      $evolutionTab.innerHTML = evolutionTab;
    });
    const $tabs = this.querySelectorAll(".tab");
    const $options = this.querySelectorAll(".tab-option");
    const $th = this.querySelectorAll("th");
    this.tabsAddEventListener($tabs, $options);
    this.createMovesTab(pokemon);
    this.moveListSort($th);
    this.observable$.subscribe(async ([imagePath, id]) => {
      const $firstForm = this.querySelectorAll(".first-form img");
      const $secondForm = this.querySelectorAll(".second-form img");
      const { chain } = await this.#pokeAPIService.getEvolutionChain(pokemon.id);
      const firstForm = chain.species.name;
      const firstImage = imagePath.replace(id, POKE_KEYS[firstForm]);
      const secondForm = chain.evolves_to[0]?.species.name;
      const secondImage = imagePath.replace(id, POKE_KEYS[secondForm]);
      const thirdForm = chain.evolves_to[0]?.evolves_to[0]?.species.name;
      const thirdImage = imagePath.replace(id, POKE_KEYS[thirdForm]);

      $firstForm[0]?.setAttribute("src", firstImage);
      $firstForm[1]?.setAttribute("src", secondImage);
      $secondForm[0]?.setAttribute("src", secondImage);
      $secondForm[1]?.setAttribute("src", thirdImage);
    });
  }

  moveListSort($th) {
    let lastIndex;
    let boolean = false;
    $th.forEach(($element, index) => {
      $element.addEventListener("click", () => {
        if (lastIndex === index) boolean = !boolean;
        lastIndex = index;
        const movesProperty = {
          0: "id",
          1: "name",
          2: "type",
          3: "contest_type",
          4: "damage_class",
          5: "pp",
          6: "power",
          7: "accuracy",
        };

        this.#moveDetails.sort((previousMove, actuallyMove) => {
          const hasSecondLevelProperty =
            movesProperty[index] === movesProperty[2] ||
            movesProperty[index] === movesProperty[3] ||
            movesProperty[index] === movesProperty[4];
          const hasUndefinedProperty =
            movesProperty[index] === movesProperty[5] ||
            movesProperty[index] === movesProperty[6] ||
            movesProperty[index] === movesProperty[7] ||
            movesProperty[index] === movesProperty[0];

          const previous = hasSecondLevelProperty ? previousMove[movesProperty[index]]["name"] : previousMove[movesProperty[index]];

          const actually = hasSecondLevelProperty ? actuallyMove[movesProperty[index]]["name"] : actuallyMove[movesProperty[index]];

          let returnResult = actually < previous ? 1 : -1;
          if (hasUndefinedProperty) returnResult = actually < previous ? -1 : 1;
          if (boolean) returnResult *= -1;

          return returnResult;
        });
        this.updateMoveList();
      });
    });
  }

  async createMovesTab(pokemon) {
    const moves = pokemon.moves.map((moves) => moves.move);
    const moveList = Array.from({ length: moves.length });

    moves.forEach(({ url } = moves, index) => {
      const moveNumber = url.slice(31, 34).replace(/[^a-z0-9-]/g, "");
      moveList.fill(moveNumber, index);
    });

    this.#moveDetails = await this.#pokeAPIService.getMove(moveList);
    this.updateMoveList();
  }
  updateMoveList() {
    this.$movesTab.innerHTML = "";
    this.#moveDetails.forEach((moves) => {
      const { name: moveName, type, contest_type, damage_class, power, accuracy, pp, id } = moves;
      const { name: typeName } = type;
      const { name: moveContestName } = contest_type ?? "—";
      const { name: moveCategoryName } = damage_class;

      this.$movesTab.innerHTML += `
          <tr>
          <td data-column="Number">${id}</td>
          <td data-column="Name">${moveName}</td>
          <td class="${typeName}" data-column="Type">${typeName}</td>
          <td data-column="Category">${moveCategoryName}</td>
          <td data-column="Contest">${moveContestName ?? "Special"}</td>
          <td data-column="PP">${pp}</td>
          <td data-column="Power">${power ?? "—"}</td>
          <td data-column="Accuracy">${accuracy ?? "—"}</td>
        </tr>
        `;
    });
    const $moveList = document.querySelector(".tab.move-list");
    $moveList.scrollTo(0, 0);
    UtilsService.fadeIn(this.$movesTab);
  }

  async createEvolutionTab(data) {
    const $slide = UtilsService.createElementWithClass("div", "tab", "evolution");
    const pokemon = data;
    const evolutionMap = await this.#pokeAPIService.getEvolutionChain(pokemon.id);
    const { chain } = evolutionMap;
    const EeveeID = evolutionMap.id === 67;

    const firstForm = chain.species.name;
    const secondForm = chain.evolves_to[0]?.species.name;
    const thirdForm = chain.evolves_to[0]?.evolves_to[0]?.species.name;

    if (!!secondForm) {
      $slide.innerHTML = `
            <h1 class="evolution-title">Evolution Chain</h1>
            <div class="first-form">
             <a href="#details/${firstForm}">
            <img src="${UtilsService.getPokeImageUrl(firstForm)}"
            alt="${firstForm}-image" data-name="${firstForm}"
            crossorigin="anonymous">
            </a>
             <span>Evolves to </span>
            <a href="#details/${secondForm}">
             <img src="${UtilsService.getPokeImageUrl(secondForm)}"
             alt="${secondForm}" 
             data-name="${secondForm}"
             crossorigin="anonymous">
             </a>          
  `;
    }

    if (!!thirdForm) {
      $slide.innerHTML += `
             <div class="second-form">
             <a href="#details/${secondForm}">
             <img src="${UtilsService.getPokeImageUrl(secondForm)}"
             alt="${secondForm}" 
             data-name="${secondForm}"
             crossorigin="anonymous">
             </a>        
             <span>Evolves to</span>
             <a href="#details/${thirdForm}">
             <img src="${UtilsService.getPokeImageUrl(thirdForm)}" 
             alt="${thirdForm}"
             data-name="${thirdForm}"
             crossorigin="anonymous">
             </a>
             </div>`;
    }

    if (EeveeID) {
      $slide.innerHTML = `<h1 class="evolution-title">Evolution Chain</h1>`;
      chain.evolves_to.forEach(({ species } = evolution) => {
        const { name } = species;
        $slide.innerHTML += `
            <div class="first-form">
             <a href="#details/${firstForm}">
            <img src="${UtilsService.getPokeImageUrl(firstForm)}" alt="${firstForm}-image" data-name="${firstForm}" crossorigin="anonymous">
            </a>
             <span>Evolves to </span>
             <a href="#details/${name}">
            <img src="${UtilsService.getPokeImageUrl(name)}"
             alt="${name}" 
             data-name="${name}"
             crossorigin="anonymous">
            </a>
            `;
      });
    }

    return $slide.innerHTML;
  }

  tabsAddEventListener($tabs, $options) {
    $options.forEach(($option, index) => {
      $option.addEventListener("click", () => currentSlide(index));
    });

    function currentSlide(index) {
      showSlides(index);
    }

    function showSlides(index) {
      hideSlides();
      removeActiveClass();
      $tabs[index].classList.add("active");
      $options[index].classList.add("active");
    }

    function removeActiveClass() {
      $options.forEach(($option) => {
        $option.classList.remove("active");
      });
    }

    function hideSlides() {
      $tabs.forEach(($tab) => {
        $tab.classList.remove("active");
      });
    }
  }

  aboutTab({ name, height, weight, abilities }) {
    const maskWeight = ($element) => {
      const arr = `${$element}`.split("");
      const index = arr.length - 1;
      const maskedWeight = `${arr.slice(0, -1).join("")},${arr[index]}`;
      return index === 0 ? arr : maskedWeight;
    };

    const abilitiesMap = abilities.map((abilities) => {
      return abilities.ability.name.capitalize();
    });

    const aboutName = name.capitalize();
    const aboutHeight = `${height}`.padStart(2, "0").split("").join(",");
    const aboutWeight = maskWeight(weight);
    const aboutAbilities = abilitiesMap.join(" | ");
    const aboutObject = { aboutName, aboutHeight, aboutWeight, aboutAbilities };

    return aboutObject;
  }

  baseStatsTab(pokemon) {
    const maxStat = 255;
    const minStat = 0;
    const maxStats = 754;

    const stats = pokemon.stats.map((status) => status.base_stat);
    const [hp, attack, defense, spAtk, spDef, speed] = stats;
    const totalStats = stats.reduce((a, b) => a + b);
    const statsPercentageFn = (stats) => stats / 2;
    const totalPercentageFn = (total) => total / 10 + 24.6;

    const hpPercentage = statsPercentageFn(hp);
    const hpColor = this.percentageToHexColor(hp, maxStat, minStat);
    const attackPercentage = statsPercentageFn(attack);
    const attackColor = this.percentageToHexColor(attack, maxStat, minStat);
    const defensePercentage = statsPercentageFn(defense);
    const defenseColor = this.percentageToHexColor(defense, maxStat, minStat);
    const spAtkPercentage = statsPercentageFn(spAtk);
    const spAtkColor = this.percentageToHexColor(spAtk, maxStat, minStat);
    const spDefPercentage = statsPercentageFn(spDef);
    const spDefColor = this.percentageToHexColor(spAtk, maxStat, minStat);
    const speedPercentage = statsPercentageFn(speed);
    const speedColor = this.percentageToHexColor(speed, maxStat, minStat);
    const totalPercentage = totalPercentageFn(totalStats);
    const totalColor = this.percentageToHexColor(totalStats, maxStats, minStat);

    const style = `   
     <style>
      .hp {
        background-color: ${hpColor};
        width: ${hpPercentage}%;
      }
      .attack {
        background-color: ${attackColor};
        width: ${attackPercentage}%;
      }
      .defense {
        background-color: ${defenseColor};
        width: ${defensePercentage}%;
      }
      .spAtk {
        background-color: ${spAtkColor};
        width: ${spAtkPercentage}%;
      }
      .spDef {
        background-color: ${spDefColor};
        width: ${spDefPercentage}%;
      }
      .speed {
        background-color: ${speedColor};
        width: ${speedPercentage}%;
      }
      .total {
        background-color: ${totalColor};
        width: ${totalPercentage}%;
      }
    </style>
    `;

    const baseStatsObject = {
      hp,
      attack,
      defense,
      spAtk,
      spDef,
      speed,
      totalStats,
      style,
    };

    return baseStatsObject;
  }
  percentageToHexColor(percentage, max, min) {
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
  }
}
customElements.define("tabs-component", TabsComponent);
