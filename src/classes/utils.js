export class Utils {
  static createElementWithClass(selector, ...className) {
    const $element = document.createElement(selector);
    $element.classList.add(...className);
    return $element;
  }

  static appendPokemonType(pokeType, $element) {
    const $type = Utils.createElementWithClass("span", pokeType);
    $type.innerText = pokeType.capitalize();
    $element.append($type);
  }

  static getPokemonTypes(pokemon) {
    const types = pokemon.types.map((types) => types.type.name);
    return types;
  }

  static getMaskedID(pokemon) {
    const maskedPokemonID = pokemon.pokemonID.toString().padStart(3, "0");
    return maskedPokemonID;
  }
  static getHomeSpritesUrl(pokemon) {
    const spriteVersionUrl = pokemon.pokemonID > 721 ? pokemon.sprites.front_default : pokemon.sprites.frontDefaultGenerationVI;
    return spriteVersionUrl;
  }
  static getFirstType(pokemon) {
    const [firstType] = pokemon.types;
    const firstTypeName = firstType.type.name;
    return firstTypeName;
  }
}
