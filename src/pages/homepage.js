import { Utils } from "../classes/utils.js";

export async function HomePage() {
  const $pokemonsContent = Utils.createElementWithClass("div", "pokemons-content");
  return $pokemonsContent;
}
