import { MazeMapper } from "./maze";
import { program } from "./program";
import { TileType } from "../Day 13/tiles";
import { IMazeTile } from "./mazeTile";
import { GameMap } from "../Day 13/gameMap";

const mazeMapper = new MazeMapper();
const maze = mazeMapper.getMap(program);
const oxygenStart = maze.find(mt => mt.type == TileType.ball);
let lastFilledPositions: IMazeTile[] = [oxygenStart];
let minute = 0;

console.log(new GameMap().renderUncomplete(maze));

let newFilledPositions: IMazeTile[] = lastFilledPositions;

while (newFilledPositions.length > 0) {
  //get adjacent positions to lastFilled
  newFilledPositions = [];
  while (lastFilledPositions.length > 0) {
    const { position: currentPosition } = lastFilledPositions.pop();
    //Get ad
    for (let i = 1; i < 5; i++) {
      let adjacent = mazeMapper.getRequestedPosition(currentPosition, i);

      // if adjacent cell is empty, fill it with oxygen
      let adjacentTile = maze.find(
        t => t.position.x == adjacent.x && t.position.y == adjacent.y
      );
      if (adjacentTile?.type == TileType.empty) {
        adjacentTile.type = TileType.ball;
        newFilledPositions.push(adjacentTile);
      }
    }
  }
  minute++;
  lastFilledPositions = newFilledPositions;
}
console.log(`Minute ${--minute}`);

console.log(new GameMap().renderUncomplete(maze));
