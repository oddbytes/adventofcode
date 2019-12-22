import * as deepcopy from "deepcopy";
import { GameMap } from "../Day 13/gameMap";
import { ITile, TileType } from "../Day 13/tiles";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
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

interface IGraphNode {
  key: string;
  distance: number;
  pos: IPoint;
  keys: IGraphNode[];
  edgeCost: number;
  visited: boolean;
}

class GraphNode implements IGraphNode {
  public keys: IGraphNode[] = [];
  public visited = false;
  public distance = Number.MAX_VALUE;
  constructor(
    public key: string,
    public pos: IPoint,
    public edgeCost: number
  ) {}
}

/**
 *  Recoge la llave mas cercana desde la posicion actual y continua a por la siguiente
 */
let minStepsByStep: number[] = [];
let minSteps = Number.MAX_VALUE;
let maxKeys = tiles.filter(t => t.key).length;

const getKey = (
  currentMap: IMazeTile[],
  keyTile: IMazeTile,
  currentPos: IPoint,
  sequence: ISequence
): ISequence[] => {
  keyTile = currentMap.find(t => t.key == keyTile.key);
  sequence.steps += mazeMapper.getMinDistance(currentMap, currentPos, keyTile);
  if (sequence.steps > minSteps) {
    //   console.log(`disposing ${sequence.keys.join(",")}`);
    return;
  }

  const curStep = sequence.keys.length - 1;

  if (sequence.steps < minStepsByStep[curStep]) {
    minStepsByStep[curStep] = sequence.steps;
  }

  if (sequence.steps > minStepsByStep[curStep]) {
    return;
  }

  sequence.keys.push(keyTile.key);
  const newpos = new Point(keyTile.position.x, keyTile.position.y);

  const doorPos = currentMap.find(t => t.door == keyTile.key.toUpperCase());
  if (doorPos) {
    // open the door
    doorPos.door = undefined;
    doorPos.type = TileType.empty;
  }
  keyTile.key = undefined;

  // A por las siguientes llaves
  const keysInRange = mazeMapper
    .keysInRange(currentMap, newpos)
    .sort((k1, k2) => (k1.key > k2.key ? 1 : k1.key < k2.key ? -1 : 0));

  const seqs = [].concat(
    keysInRange.map(k => {
      const s = deepcopy(sequence);

      const m: IMazeTile[] = deepcopy(currentMap);
      const nk = m.find(
        m => m.position.x == k.position.x && m.position.y == k.position.y
      );
      return getKey(m, nk, newpos, s);
    })
  );

  if (sequence.keys.length == maxKeys) {
    if (sequence.steps < minSteps) {
      minSteps = sequence.steps;

      console.log(
        `${sequence.steps}\t(${sequence.no}) ${sequence.keys.join(",")}`
      );
    }
  }
  return sequence.keys.length == maxKeys ? sequence : undefined;
};

const processNode = (node: IGraphNode, currentMap: IMazeTile[]) => {
  //Consume key
  const doorPos = currentMap.find(t => t.door == node.key.toUpperCase());
  if (doorPos) {
    // open the door
    doorPos.door = undefined;
    doorPos.type = TileType.empty;
  }
  const keyTile = currentMap.find(t => t.key == node.key);
  if (keyTile) keyTile.key = undefined;
  //Get visible nodes
  node.keys = mazeMapper
    .keysInRange(currentMap, node.pos)
    .map(k => new GraphNode(k.key, k.position, k.distance));

  //Calculate distance
  node.keys
    .filter(a => !a.visited)
    .forEach(adjacentNode => {
      const distance = node.distance + adjacentNode.edgeCost;
      if (distance < adjacentNode.distance) adjacentNode.distance = distance;
    });

  node.visited = true;
  //visit next node (adjacent unvisited with min distance)
  const unvisitedNodes = node.keys.filter(n => !n.visited);
  if (unvisitedNodes.length > 0) {
    const nextNode = unvisitedNodes.sort(
      (n1, n2) => n1.distance - n2.distance
    )[0];
    processNode(nextNode, currentMap);
  }
};

const getKeys = (tiles: IMazeTile[]) => {
  const rootNode = new GraphNode(
    "@",
    tiles.find(t => t.type == TileType.ball).position,
    0
  );
  rootNode.distance = 0;
  processNode(rootNode, tiles);

  console.log("End");
};

const tilesCopy = deepcopy(tiles);

const r = getKeys(tilesCopy);
