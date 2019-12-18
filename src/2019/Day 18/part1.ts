import { GameMap } from "../Day 13/gameMap";
import { TileType, ITile } from "../Day 13/tiles";
import { maze } from "./maze";
import { MazeMapper } from "./mazeMapper";
import { IMazeTile } from "./mazeTile";
import * as deepcopy from "deepcopy";
import { IPoint } from "../Day 3/SegmentCalculator";

const mazeMapper = new MazeMapper(maze);
const tiles = mazeMapper.getMap();

const gameMap = new GameMap();
console.log(gameMap.render(tiles));

interface ISequence {
  keys: string[];
  steps: number;
}

const sequences: ISequence[] = [];

const getKey = (
  tiles: IMazeTile[],
  keyTile: IMazeTile,
  sequence: ISequence,
  currentPos: IPoint
): ISequence => {
  sequence.steps += mazeMapper.getMinDistance(tiles, currentPos, keyTile);
  currentPos.x = keyTile.position.x;
  currentPos.y = keyTile.position.y;
  sequences.keys.push(keyTilekey.key);
  const doorPos = tiles.find(t => t.door == keyTile.key.toUpperCase());
  if (doorPos) {
    //open the door
    doorPos.door = undefined;
    doorPos.type = TileType.empty;
  }
  keyTile.key = undefined;
};

const trySecuence = (tiles: IMazeTile[], sequences: ISequence[]): ISequence => {
  let currentPos = tiles.find(t => t.type == TileType.ball).position;
  let steps = 0;
  let key = 0;
  const keys: string[] = [];
  while (tiles.filter(t => t.key).length > 0) {
    //While ther are keys
    const keysInRange = mazeMapper.keysInRange(tiles, currentPos);
    const possibleKeys = keysInRange.sort((k1, k2) =>
      k1.key > k2.key ? 1 : k1.key < k2.key ? -1 : 0
    );
    let keyIndex = 0;
    while (
      sequences
        .map(s => s.keys.slice(0, key + 1).join(""))
        .includes(keys.join("") + possibleKeys[keyIndex].key) &&
      keyIndex < possibleKeys.length - 1
    )
      keyIndex++;

    //¿condicion de fin aqui?
    if (keyIndex > possibleKeys.length - 1) return undefined;

    key++;
  }
  console.log(`Sequence: ${keys.join(",")} steps:${steps}`);

  return { keys, steps };
};

let tilesCopy = deepcopy(tiles);

let sequence = trySecuence(tilesCopy, sequences);
while (sequence) {
  sequences.push(sequence);
  tilesCopy = deepcopy(tiles);
  sequence = trySecuence(tilesCopy, sequences);
}
