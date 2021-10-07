import { PokeAPI } from "./poke-api.js";
import { Utils } from "./utils.js";

export class PokemonMoves {
  static async createMovesTab(data) {
    const pokemon = data;
    const $pokemonMoves = Utils.createElementWithClass("div", "tab");
    const $movesList = Utils.createElementWithClass("table", "move-list");
    const $tbody = document.createElement("tbody");

    $movesList.innerHTML = `   <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Type</th>
      <th>Category</th>
      <th>Contest</th>
      <th>PP</th>
      <th>Power</th>
      <th>Accuracy</th>
    </tr>
    </thead>`;

    $pokemonMoves.append($movesList);
    $movesList.append($tbody);

    const move = pokemon.moves.map((moves) => moves.move);
    const movelist = Array.from({ length: move.length });

    move.forEach(({ url } = moves, index) => {
      const moveNumber = url.slice(31, 34).replace(/[^a-z0-9-]/g, "");
      movelist.fill(moveNumber, index);
    });

    const moveDetails = await PokeAPI.getMove(movelist);

    moveDetails.forEach(async (moves) => {
      const { name: moveName, type, contest_type, damage_class, power, accuracy, pp, id } = moves;
      const { name: typeName } = type;
      const { name: moveContestName } = Utils.nullToEmptyFn(contest_type);
      const { name: moveCategoryName } = damage_class;

      const $move = document.createElement("tr");
      const $moveNumber = document.createElement("td");
      const $moveName = document.createElement("td");
      const $moveType = Utils.createElementWithClass("td", typeName);
      const $moveCategory = document.createElement("td");
      const $moveContest = document.createElement("td");
      const $pp = document.createElement("td");
      const $power = document.createElement("td");
      const $accuracy = document.createElement("td");

      $moveName.dataset.column = "Name";
      $moveNumber.dataset.column = "Number";
      $moveType.dataset.column = "Type";
      $moveCategory.dataset.column = "Category";
      $moveContest.dataset.column = "Contest";
      $pp.dataset.column = "PP";
      $power.dataset.column = "Power";
      $accuracy.dataset.column = "Accuracy";

      $moveNumber.innerText = id;
      $moveName.innerText = moveName;
      $moveType.innerText = typeName;
      $moveContest.innerText = Utils.undefinedToSpecialFn(moveContestName);
      $moveCategory.innerText = moveCategoryName;
      $pp.innerText = pp;
      $power.innerText = Utils.nullToEmptyFn(power);
      $accuracy.innerText = Utils.nullToEmptyFn(accuracy);

      $move.append($moveNumber);
      $move.append($moveName);
      $move.append($moveType);
      $move.append($moveCategory);
      $move.append($moveContest);
      $move.append($pp);
      $move.append($power);
      $move.append($accuracy);
      $tbody.append($move);
    });

    return $pokemonMoves;
  }
}
