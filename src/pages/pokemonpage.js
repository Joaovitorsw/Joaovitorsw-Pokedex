import { LoadingScreen } from "../classes/loading-screen.js";
import { PokemonDetails } from "../classes/pokemon-details.js";

export async function PokemonPage(name) {
  return await LoadingScreen.loadingScreen(PokemonDetails.createContent, true, name);
}
