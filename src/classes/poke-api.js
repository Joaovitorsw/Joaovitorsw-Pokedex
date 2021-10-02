import { BasicStorage } from "./basic-storage.js";

export class PokeAPI {
  static async getPokemon(id) {
    const cachedPokemons = BasicStorage.get("pokemons");
    const cachedPokemon = cachedPokemons.find((obj) => obj.pokemonID === id);

    if (cachedPokemon) return cachedPokemon;

    const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

    const data = await responsePokemon.json();

    const { types, id: pokemonID, name, sprites } = data;
    const { front_default, versions } = sprites;
    const frontDefaultGenerationVI = versions["generation-vi"]["omegaruby-alphasapphire"].front_default;

    const pokemon = { types, pokemonID, name, sprites: { front_default, frontDefaultGenerationVI } };

    cachedPokemons.push(pokemon);

    BasicStorage.set("pokemons", cachedPokemons);

    return pokemon;
  }
}
