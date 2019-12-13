import { GameMap } from "./gameMap";
import { gameProgram } from "./gameProgram";
import { TileType } from "./tiles";

const gameMap = new GameMap();
const tiles = gameMap.getTiles(gameProgram);

console.log(
  `Block tiles: ${tiles.filter(t => t.type == TileType.block).length}`
);

// lets paint it
console.log(gameMap.render(tiles));
