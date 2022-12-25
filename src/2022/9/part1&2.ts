import * as fs from "fs";
import { listenerCount } from "process";

import { IPoint, Point } from "../../common/point";
const DirectionMove: Record<string, number[]> = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

console.time("day9");
const moves = fs.readFileSync("./sample2.txt", "utf8").split("\r\n");

const move = (head: Point, tail: Point, move: string) => {
  const tailPositions = [];

  const [direction, times] = move.split(" ");
  for (let time = 0; time < parseInt(times); time++) {
    head.x += DirectionMove[direction][0];
    head.y += DirectionMove[direction][1];

    //tail follows head if not adjacent
    if (
      head.manhattanDistanceTo(tail) > 1 &&
      (tail.x == head.x || tail.y == head.y)
    ) {
      //same column or row. tail folow head
      tail.x += DirectionMove[direction][0];
      tail.y += DirectionMove[direction][1];
    }

    if (
      head.manhattanDistanceTo(tail) > 2 &&
      tail.x != head.x &&
      tail.y != head.y
    ) {
      //diagonal.
      tail.x += DirectionMove[direction][0];
      tail.y += DirectionMove[direction][1];
      //if up or down, find left or right
      if (direction == "U" || direction == "D") {
        if (head.x < tail.x) tail.x--;
        else tail.x++;
      } else {
        if (head.y > tail.y) tail.y++;
        else tail.y--;
      }
    }
    //console.log(direction, head.toString(), tail.toString());
    tailPositions.push(tail.toString());
  }
  return tailPositions;
};

const moveMultiple = (head: IPoint, tails: IPoint[], move: string) => {
  const tailPositions = [];

  const [direction, times] = move.split(" ");
  console.log(`== ${direction} ${times} ==`);
  for (let time = 0; time < parseInt(times); time++) {
    head.x += DirectionMove[direction][0];
    head.y += DirectionMove[direction][1];
    //Move tails
    let lastDirection = direction;
    tails.forEach((tail, i) => {
      //tail follows prev tail if not adjacent
      const newHead = i == 0 ? head : tails[i - 1];

      if (
        newHead.manhattanDistanceTo(tail) > 1 &&
        (tail.x == newHead.x || tail.y == newHead.y)
      ) {
        //same column or row. tail folow head
        tail.x += DirectionMove[lastDirection][0];
        tail.y += DirectionMove[lastDirection][1];
      }

      if (
        newHead.manhattanDistanceTo(tail) > 2 &&
        tail.x != newHead.x &&
        tail.y != newHead.y
      ) {
        //diagonal.
        tail.x += DirectionMove[lastDirection][0];
        tail.y += DirectionMove[lastDirection][1];
        //if up or down, find left or right
        if (lastDirection == "U" || lastDirection == "D") {
          if (newHead.x < tail.x) {
            tail.x--;
            lastDirection = "L";
          } else {
            tail.x++;
            lastDirection = "R";
          }
        } else {
          if (newHead.y > tail.y) {
            tail.y++;
            lastDirection = "U";
          } else {
            tail.y--;
            lastDirection = "D";
          }
        }
      }
    });
    printSnake(head, tails);
    tailPositions.push(tails[tails.length - 1].toString());
  }

  return tailPositions;
};

const printSnake = (head: IPoint, tails: IPoint[]) => {
  const maxX = Math.max(...[head.x, ...tails.map((t) => t.x)]) + 2;
  const maxY = Math.max(...[head.y, ...tails.map((t) => t.y)]) + 2;

  const minX = Math.min(...[head.x, ...tails.map((t) => t.x)]) - 1;
  const minY = Math.min(...[head.y, ...tails.map((t) => t.y)]) - 1;

  let grid = "";
  for (let y = maxY; y >= minY; y--) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      if (head.x == x && head.y == y) line += "H";
      else if (tails.some((t) => t.x == x && t.y == y)) {
        const tailNumber = tails.findIndex((t) => t.x == x && t.y == y) + 1;
        line += tailNumber;
      } else line += ".";
    }
    grid += line + "\r\n";
  }
  console.log(grid);
};
const part1 = () => {
  const head = new Point();
  const tail = new Point();
  const tailPositions = [];
  moves.forEach((mov) => {
    tailPositions.push(...move(head, tail, mov));
  });

  return [...new Set(tailPositions)].length;
};

const part2 = () => {
  const head = new Point();
  const tailPositions = [];

  const tails: IPoint[] = new Array(9);
  for (let i = 0; i < 9; i++) tails[i] = new Point();
  moves.forEach((mov) => {
    tailPositions.push(...moveMultiple(head, tails, mov));
  });
  return [...new Set(tailPositions)].length;
};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day9");
