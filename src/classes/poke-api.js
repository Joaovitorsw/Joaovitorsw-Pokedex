import { BasicStorage } from "./basic-storage.js";

export class PokeAPI {
  static async getPokemon(id) {
    const cachedPokemons = BasicStorage.get("pokemons");
    const cachedPokemon = cachedPokemons.find((obj) => obj.pokemonID === id);
    return cachedPokemon;
  }

  static async apiRequest() {
    const responsePokemon = (id) => `https://pokeapi.co/api/v2/pokemon/${id}/`;

    const generatePokemonPromises = () =>
      Array(898)
        .fill()
        .map((_, index) => fetch(responsePokemon(index + 1)).then((response) => response.json()));

    const pokemonPromises = generatePokemonPromises();
    const cachedPokemons = BasicStorage.get("pokemons");

    await Promise.all(pokemonPromises).then((pokemons) => {
      pokemons.forEach((actuallyPokemon) => {
        const { types, id: pokemonID, name, sprites } = actuallyPokemon;
        const { front_default, versions } = sprites;
        const frontDefaultGenerationVI = versions["generation-vi"]["omegaruby-alphasapphire"].front_default;

        const pokemon = { types, pokemonID, name, sprites: { front_default, frontDefaultGenerationVI } };

        cachedPokemons.push(pokemon);

        BasicStorage.set("pokemons", cachedPokemons);
      });
    });
  }

  static async getPokemonDetailsByID(id) {
    const cacheKey = `pokemon-${id}`;

    const cachedPokemon = BasicStorage.getById(cacheKey);

    if (cachedPokemon) return cachedPokemon;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

    const pokemon = await response.json();

    const { abilities, stats, moves, height, weight } = pokemon;

    const pokemonDetails = { abilities, stats, moves, height, weight };

    BasicStorage.set(cacheKey, pokemonDetails);

    return pokemonDetails;
  }
  static async getEvolutionChain(id) {
    const requestPokemonSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);

    const pokemonSpecies = await requestPokemonSpecies.json();

    const requestEvolutionChain = await fetch(`${pokemonSpecies.evolution_chain.url}`);

    return requestEvolutionChain.json();
  }

  static async getMove(id) {
    const requestMove = await fetch(`https://pokeapi.co/api/v2/move/${id}/`);

    return requestMove.json();
  }
}
