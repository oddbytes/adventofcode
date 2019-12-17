import { GameMap } from "../Day 13/gameMap";
import { TileType } from "../Day 13/tiles";
import { Direction } from "../Day 15/maze";
import { IMazeTile, MazeTile } from "../Day 15/mazeTile";
import { SignalCleaner } from "../Day 16/signalCleaner";
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

const movements: number[] = [];

const robotPos = tiles.find(t => t.type == TileType.ball);
robotPos.visited = true;
let { position: currentPos } = robotPos;
let currentDir = Direction.west;

let newPos = getRequestedPosition(currentPos, currentDir);
let turns = 0;
let move = 0;
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
  move++;
  if (turns > 0) {
    console.log(`\tnew heading:${currentDir}`);
    movements.push(move);
    move = 0;
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
movements[0] -= 1;
let sMovements = movements.join(",");
console.log(`movements:${sMovements}`);

// Identify patterns in movements

const patterns: number[][] = [];

for (let i = 0; i < 3; i++) {
  let currLength = 2;
  // slice the movements in currLength pieces and compare them to the first one
  let parts: number[][] = [];

  let equalParts = 1;
  while (equalParts > 0) {
    parts = [];
    let currIndex = currLength;
    while (currIndex < movements.length) {
      parts.push(movements.slice(currIndex, currIndex + currLength));
      currIndex++;
    }
    equalParts = parts.reduce(
      (acum, part, currentIndex) =>
        currentIndex > 0 &&
        part.length == currLength &&
        part.every((p, i) => p == movements[i])
          ? (acum += 1)
          : acum,
      0
    );
    currLength++;
  }
  patterns.push(movements.slice(0, currLength - 2));
  console.log(patterns[patterns.length - 1].join(","));
  movements.splice(0, currLength - 2);
}

return;

for (let i = 0; i < 3; i++) {
  let currLength = 2; // at least twop steps

  let groups: string[] = ["1", "2"];
  let lastGroup: string;
  while (groups.length > 0) {
    const groupRegex = new RegExp(sMovements.substr(0, currLength), "g");
    groups = [];

    let match = groupRegex.exec(sMovements);
    while (match != null) {
      if (match.index > currLength) {
        groups.push(match.toString());
        lastGroup = groups[groups.length - 1];
      }
      match = groupRegex.exec(sMovements);
    }
    currLength++;
  }
  let pattern = lastGroup;
  pattern = pattern.substr(0, pattern.lastIndexOf(","));
  patterns.push(pattern);
  let re = new RegExp(pattern, "g");
  sMovements = sMovements.replace(re, "");
  re = new RegExp("^,|,$", "g");
  while (sMovements[0] == "," || sMovements[sMovements.length - 1] == ",") {
    sMovements = sMovements.replace(re, "");
  }
}
