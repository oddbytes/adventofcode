import * as deepcopy from "deepcopy";
import { GameMap } from "../Day 13/gameMap";
import { ITile, TileType } from "../Day 13/tiles";
import { IPoint } from "../Day 3/SegmentCalculator";
import { maze } from "./maze";
import { MazeMapper } from "./mazeMapper";
import { IMazeTile } from "./mazeTile";

const mazeMapper = new MazeMapper(maze);
const tiles = mazeMapper.getMap();

const gameMap = new GameMap();
console.log(gameMap.render(tiles));

interface ISequence {
  keys: string[];
  steps: number;
  no: number;
}

/**
 *  Recoge la llave mas cercana desde la posicion actual y continua a por la siguiente
 */

const getKey = (
  currentMap: IMazeTile[],
  keyTile: IMazeTile,
  currentPos: IPoint,
  sequence: ISequence
): ISequence[] => {
  keyTile = currentMap.find(t => t.key == keyTile.key);
  sequence.steps += mazeMapper.getMinDistance(currentMap, currentPos, keyTile);

  sequence.keys.push(keyTile.key);
  // console.log(
  //   `${currentPos.x},${currentPos.y} -> ${keyTile.position.x},${
  //     keyTile.position.y
  //   }  - (${sequence.no}) ${sequence.keys.join(",")}`
  // );
  currentPos.x = keyTile.position.x;
  currentPos.y = keyTile.position.y;
  const doorPos = currentMap.find(t => t.door == keyTile.key.toUpperCase());
  if (doorPos) {
    // open the door
    doorPos.door = undefined;
    doorPos.type = TileType.empty;
  }
  keyTile.key = undefined;

  // A por las siguientes llaves
  const keysInRange = mazeMapper
    .keysInRange(currentMap, currentPos)
    .sort((k1, k2) => (k1.key > k2.key ? 1 : k1.key < k2.key ? -1 : 0));

  const seqs = [].concat(
    keysInRange.map(k => {
      const s = deepcopy(sequence);
      const m: IMazeTile[] = deepcopy(currentMap);
      const nk = m.find(
        m => m.position.x == k.position.x && m.position.y == k.position.y
      );
      return getKey(m, nk, currentPos, s);
    })
  );
  return deepcopy(sequence);
};

const getKeys = (tiles: IMazeTile[]) => {
  let currentPos = tiles.find(t => t.type == TileType.ball).position;
  const keysInRange = mazeMapper
    .keysInRange(tiles, currentPos)
    .sort((k1, k2) => (k1.key > k2.key ? 1 : k1.key < k2.key ? -1 : 0));
  let sequences: ISequence[] = [];
  const t = keysInRange.slice(0, 1).map((k, i) => {
    const tilesCopy = deepcopy(tiles);
    currentPos = tiles.find(t => t.type == TileType.ball).position;
    return sequences.concat(
      getKey(tilesCopy, k, currentPos, { steps: 0, keys: [], no: i })
    );
  });
  sequences = sequences.concat(t.flat());

  console.log(sequences);
};

const tilesCopy = deepcopy(tiles);
/*
let sequence = trySecuence(tilesCopy, sequences);
while (sequence) {
  sequences.push(sequence);
  tilesCopy = deepcopy(tiles);
  sequence = trySecuence(tilesCopy, sequences);
}*/

const r = getKeys(tilesCopy);
