import { PokeAPI } from "./poke-api.js";
import { Utils } from "./utils.js";

export class PokemonEvolution {
  static async createEvolutionTab(data) {
    const $slide = Utils.createElementWithClass("div", "tab");
    const $evolution = Utils.createElementWithClass("div", "evolution");
    const pokemon = data;
    const pokemonEvolutionMap = await PokeAPI.getEvolutionChain(pokemon.pokemonID);
    const EeveeEvolutions = pokemonEvolutionMap.id === 67;

    const firstForm = pokemonEvolutionMap.chain.species.name;
    const secondForm = pokemonEvolutionMap.chain.evolves_to[0]?.species.name;
    const thirdForm = pokemonEvolutionMap.chain.evolves_to[0]?.evolves_to[0]?.species.name;

    if (!!secondForm) {
      $evolution.innerHTML = `
            <h1 class="evolution-title">Evolution Chain</h1>
            <div class="first-form">
             <a href="#details/${firstForm}">
            <img src="${Utils.getPokeImageUrl(firstForm)}"
            alt="${firstForm}-image" data-name="${firstForm}"
            crossorigin="anonymous">
            </a>
             <span>Evolves to </span>
            <a href="#details/${secondForm}">
             <img src="${Utils.getPokeImageUrl(secondForm)}"
             alt="${secondForm}" 
             data-name="${secondForm}"
             crossorigin="anonymous">
             </a>          
  `;
    }

    if (!!thirdForm) {
      $evolution.innerHTML += `
             <div class="second-form">
             <a href="#details/${secondForm}">
             <img src="${Utils.getPokeImageUrl(secondForm)}"
             alt="${secondForm}" 
             data-name="${secondForm}"
             crossorigin="anonymous">
             </a>        
             <span>Evolves to</span>
             <a href="#details/${thirdForm}">
             <img src="${Utils.getPokeImageUrl(thirdForm)}" 
             alt="${thirdForm}"
             data-name="${thirdForm}"
             crossorigin="anonymous">
             </a>
             </div>`;
    }

    if (EeveeEvolutions) {
      $evolution.innerHTML = `<h1 class="evolution-title">Evolution Chain</h1>`;
      pokemonEvolutionMap.chain.evolves_to.forEach((evolution) => {
        $evolution.innerHTML += `
            <div class="first-form">
             <a href="#details/${firstForm}">
            <img src="${Utils.getPokeImageUrl(firstForm)}" alt="${firstForm}-image" data-name="${firstForm}" crossorigin="anonymous">
            </a>
             <span>Evolves to </span>
             <a href="#details/${evolution.species.name}">
            <img src="${Utils.getPokeImageUrl(evolution.species.name)}"
             alt="${evolution.species.name}" 
             data-name="${evolution.species.name}"
             crossorigin="anonymous">
            </a>
            `;
      });
    }
    $slide.append($evolution);

    return $slide;
  }
}
