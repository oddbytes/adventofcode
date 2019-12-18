import { GameMap } from "../Day 13/gameMap";
import { TileType } from "../Day 13/tiles";
import { Point } from "../Day 3/SegmentCalculator";
import { maze } from "./maze";
import { MazeMapper } from "./mazeMapper";

const mazeMapper = new MazeMapper(maze);
const tiles = mazeMapper.getMap();

const gameMap = new GameMap();
console.log(gameMap.render(tiles));

const lastKey = tiles
  .filter(t => t.key)
  .map(t => t.key)
  .sort()
  .reverse()[0]
  .charCodeAt(0);
let currentKey = 0;
let currentPos = tiles.find(t => t.type == TileType.ball).position;
let steps = 0;

const reachableDoors = mazeMapper.doorsInRange(tiles, currentPos);

return;
while (currentKey < lastKey - 97) {
  const keyPos = tiles.find(t => t.key == String.fromCharCode(currentKey + 97))
    .position;
  steps += mazeMapper.getMinDistance(tiles, currentPos, keyPos);
  const doorPos = tiles.find(
    t => t.door == String.fromCharCode(currentKey + 65)
  ).position;
  currentPos = keyPos;
  steps += mazeMapper.getMinDistance(tiles, currentPos, doorPos);
  currentPos = doorPos;
  currentKey++;
}

console.log(`Min steps: ${steps}`);
