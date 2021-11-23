import { IndexDBService } from "./indexdb.service.js";

export class PokeAPIService {
  #indexDB;
  constructor() {
    this.#indexDB = new IndexDBService();
  }

  createPokemonRequest() {
    const responsePokemon = (id) => `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const indexToId = (index) => index + 1;
    const generatePokemonPromises = Array.from({ length: 898 }, (_, index) =>
      fetch(responsePokemon(indexToId(index))).then((pokemon) => pokemon.json())
    );

    return generatePokemonPromises;
  }

  async getPokemon(id) {
    const pokemons = await this.#indexDB.get("pokemons");
    const objectPokemon = pokemons.find((pokemon) => pokemon.id === id);
    const pokemonDetails = this.#indexDB.getByName(objectPokemon.name);

    return { ...objectPokemon, ...pokemonDetails };
  }

  async requestPokemons() {
    const cachedPokemons = await this.#indexDB.get("pokemons");
    if (cachedPokemons.length === 898) return;

    const pokemonPromises = this.createPokemonRequest();
    await Promise.all(pokemonPromises).then((pokemons) =>
      pokemons.forEach((object) => {
        const pokemon = this.createPokemonObject(object);
        cachedPokemons.push(pokemon);
      })
    );
    this.#indexDB.set("pokemons", cachedPokemons);
  }

  createPokemonObject(object) {
    const { types, id, name, sprites } = object;
    const { front_default, versions } = sprites;
    const front_default_generation_vi = versions["generation-vi"]["omegaruby-alphasapphire"].front_default;
    const pokemon = {
      types,
      id,
      name,
      sprites: { front_default, front_default_generation_vi },
    };
    return pokemon;
  }

  createPokemonDetailsObject({ moves, abilities, stats, height, weight } = object) {
    const pokemonDetails = { moves, abilities, stats, height, weight };
    return pokemonDetails;
  }

  async getPokemonByName(name) {
    const cacheKey = `pokemon-${name}`;
    const cachedPokemon = await this.#indexDB.getByName(cacheKey);

    if (cachedPokemon) return cachedPokemon;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    const pokemon = await response.json();
    const pokemonDetails = this.createPokemonDetailsObject(pokemon);

    this.#indexDB.set(cacheKey, pokemonDetails);

    return pokemonDetails;
  }

  async getEvolutionChain(id) {
    const requestPokemonSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const pokemonSpecies = await requestPokemonSpecies.json();
    const requestEvolutionChain = await fetch(`${pokemonSpecies.evolution_chain.url}`);
    return requestEvolutionChain.json();
  }

  async getMove(array) {
    const urlMovePokemon = (id) => `https://pokeapi.co/api/v2/move/${id}/`;
    const indexToId = (index) => index + 1;
    const generateAllMoves = () => array.map((_, index) => fetch(urlMovePokemon(indexToId(index))).then((move) => move.json()));
    const moves = generateAllMoves();

    return await Promise.all(moves);
  }
}
