import { GameMap } from "../Day 13/gameMap";
import { TileType } from "../Day 13/tiles";
import { Direction } from "../Day 15/maze";
import { IMazeTile, MazeTile } from "../Day 15/mazeTile";
import { IntcodeComputer } from "../Day 2/intcodeComputer";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
import { program } from "./program";

const computer = new IntcodeComputer();

let mapX = 0;
let mapY = 0;
const tiles: IMazeTile[] = computer
  .execute(program)
  .output.map(char => {
    if (char == 10) {
      mapY += 1; // new line
      mapX = 0;
      return undefined;
    } else {
      return new MazeTile(
        new Point(mapX++, mapY),
        char === 35
          ? TileType.block
          : char === 46
          ? TileType.empty
          : TileType.ball
      );
    }
  })
  .filter(t => t !== undefined);

// draw map
const gameMap = new GameMap();
console.log(gameMap.render(tiles));

// lets go through the scaffold

// reuse some of the code of maze mapper (day 15)

const turnRight = (lastDirection: Direction): Direction => {
  if (lastDirection == Direction.north) {
    return Direction.east;
  }
  if (lastDirection == Direction.east) {
    return Direction.south;
  }
  if (lastDirection == Direction.south) {
    return Direction.west;
  }

  return Direction.north;
};

const getRequestedPosition = (
  position: IPoint,
  direction: Direction
): IPoint => {
  const { x, y } = position;
  switch (direction) {
    case Direction.north:
      return new Point(x, y - 1);
    case Direction.south:
      return new Point(x, y + 1);
    case Direction.east:
      return new Point(x + 1, y);
    case Direction.west:
      return new Point(x - 1, y);
  }
};

const isReverse = (direction1: Direction, direction2: Direction): boolean => {
  return direction1 + direction2 == 3 || direction1 + direction2 == 7;
};
const getTileAtPost = (pos: IPoint): IMazeTile =>
  tiles.find(t => t.position.x == pos.x && t.position.y == pos.y);

const robotPos = tiles.find(t => t.type == TileType.ball);
robotPos.visited = true;
let { position: currentPos } = robotPos;
let currentDir = Direction.west;

let newPos = getRequestedPosition(currentPos, currentDir);
let turns = 0;
let tileNewPos = getTileAtPost(newPos);
while (!(tileNewPos?.type == TileType.empty && turns > 2)) {
  turns = 0;
  console.log(
    `Pos:${currentPos.x},${currentPos.y} heading:${currentDir}   try newPos: ${newPos.x},${newPos.y}, type: ${tileNewPos?.symbol}(${tileNewPos?.type})`
  );

  const lastDir = currentDir;
  while (
    (tileNewPos?.type == TileType.empty && turns < 3) ||
    tileNewPos == undefined
  ) {
    currentDir = turnRight(currentDir);
    if (!isReverse(currentDir, lastDir)) {
      // dont go back!
      newPos = getRequestedPosition(currentPos, currentDir);
      turns++;
      tileNewPos = getTileAtPost(newPos);
    }
  }
  if (turns > 0) {
    console.log(`\tnew heading:${currentDir}`);
  }
  currentPos = new Point(newPos.x, newPos.y);
  newPos = getRequestedPosition(currentPos, currentDir);

  if (tileNewPos) {
    if (tileNewPos?.visited == true) {
      tileNewPos.type = TileType.wall;
    } else {
      tileNewPos.visited = true;
    }
  }
  tileNewPos = getTileAtPost(newPos);
}
console.log(`End at ${currentPos.x},${currentPos.y}`);

const intersections = tiles
  .filter(t => t.type == TileType.wall)
  .map(t => t.position);

const totalDistances = intersections.reduce((acum, pos) => {
  return acum + pos.x * pos.y;
}, 0);
console.log(gameMap.render(tiles));
console.log(`sum of the alignment parameters: ${totalDistances}`);
