import * as fs from "fs";
import { Point } from "../../common/point";
let mD = 0;
console.time("day14");
const parseRocks = () => {
  const map: Set<number> = new Set();

  fs.readFileSync("./input.txt", "utf8")
    .split("\r\n")
    .forEach((line) =>
      line.split(" -> ").forEach((coordinates, index, pairs) => {
        if (index < pairs.length - 1) {
          const [x1, y1] = coordinates.split(",").map(Number);
          const [x2, y2] = pairs[index + 1].split(",").map(Number);
          if (y1 > mD) mD = y1;
          if (y2 > mD) mD = y2;
          if (x1 == x2) {
            const length = Math.abs(y1 - y2);
            const min = Math.min(y1, y2);
            for (let y = min; y < min + length + 1; y++) map.add(x1 * 1000 + y);
          } else if (y1 == y2) {
            const length = Math.abs(x1 - x2);
            const min = Math.min(x1, x2);
            for (let x = min; x < min + length + 1; x++) map.add(x * 1000 + y1);
          }
        }
      })
    );

  return map;
};
let map = parseRocks();
console.log(mD);
const maxDepth = Math.max(...[...map.keys()]);

enum MoveResult {
  moved,
  atRest,
  lostIntoAbbys,
}

const moveSand = (origin: Point, map: Set<number>, setFloor = false) => {
  //try to move sand down. Check if there is a rock or more sand
  const isDownPositionOccupied = map.has(origin.x * 1000 + (origin.y + 1));
  let moveResult = MoveResult.moved;
  if (!isDownPositionOccupied) {
    origin.y++;
  } else {
    //if there is a rock, try to move sand to the left
    const isLeftDownPositionOccupied = map.has(
      (origin.x - 1) * 1000 + (origin.y + 1)
    );
    if (!isLeftDownPositionOccupied) {
      origin.y++;
      origin.x--;
    } else {
      //if there is a rock, try to move sand to the right
      const isRightDownPositionOccupied = map.has(
        (origin.x + 1) * 1000 + (origin.y + 1)
      );
      if (!isRightDownPositionOccupied) {
        origin.y++;
        origin.x++;
      } else moveResult = MoveResult.atRest;
    }
  }

  if (origin.y > mD) {
    if (setFloor) moveResult = MoveResult.atRest;
    else moveResult = MoveResult.lostIntoAbbys;
  }
  return moveResult;
};
const setKey = (x: number, y: number) => x * 1000 + y;

const draw = () => {
  for (let y = 0; y < mD + 2; y++) {
    let line = "";
    for (let x = 485; x < 515; x++) {
      line += map.has(setKey(x, y)) ? "#" : ".";
    }
    console.log(line);
  }
};

const pourSand = () => {
  let units = 0;
  let result = MoveResult.moved;
  while (result != MoveResult.lostIntoAbbys) {
    const sand = new Point(500, 0);
    units++;
    while ((result = moveSand(sand, map)) == MoveResult.moved) {
      //console.log(`Moved to ${sand.toString()}\tresult:${result}`);
    }
    map.add(sand.x * 1000 + sand.y);
  }
  //  draw();
  return units - 1;
};

const pourSandWihFloor = () => {
  let units = 0;
  let result = MoveResult.moved;
  let flowBlocked = false;
  while (!flowBlocked) {
    const sand = new Point(500, 0);
    units++;
    while ((result = moveSand(sand, map, true)) == MoveResult.moved) {
      //console.log(`Moved to ${sand.toString()}\tresult:${result}`);
    }
    flowBlocked = sand.y == 0;
    //console.log(sand.y);
    map.add(sand.x * 1000 + sand.y);
  }
  //draw();
  return units;
};

const part1 = () => {
  //console.log(rocks.map((r) => r.toString()));
  //  console.log(map.keys());
  return pourSand();
};

const part2 = () => {
  map = parseRocks();
  return pourSandWihFloor();
};

console.time("part1");
console.log(`Part1 response: ${part1()}`);
console.timeEnd("part1");
console.time("part2");
console.log(`Part2 response: ${part2()}`);
console.timeEnd("part2");

console.timeEnd("day14");
