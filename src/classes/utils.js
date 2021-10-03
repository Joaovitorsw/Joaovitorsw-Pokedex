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

  static elementClassAdd($element, status) {
    $element.classList.add(status);
  }

  static elementClassRemove($element, status) {
    $element.classList.remove(status);
  }

  static fadeIn($element) {
    $element.classList.add("fade");
    setTimeout(() => {
      $element.classList.remove("fade");
    }, 2000);
  }
}
String.prototype.capitalize = function (string) {
  return `${this[0].toUpperCase()}${this.slice(1)}`;
};
