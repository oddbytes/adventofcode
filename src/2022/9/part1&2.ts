import * as fs from "fs";

import { Point } from "../../common/point";
const DirectionMove: Record<string, number[]> = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

console.time("day9");
const moves = fs.readFileSync("./sample.txt", "utf8").split("\r\n");

const isAdjacent = (head: Point, tail: Point): boolean =>
  head.manhattanDistanceTo(tail) === 1;

const move = (head: Point, tail: Point, move: string) => {
  const [direction, times] = move.split(" ");
  for (let time = 0; time < parseInt(times); time++) {
    head.x += DirectionMove[direction][0];
    head.y += DirectionMove[direction][1];
    //tail follows head if not adjacent
    if (!isAdjacent(head, tail)) {
      //in same row
      if (tail.y == head.y)
        if (head.x > tail.x) tail.x++;
        else tail.x--;
      else if (tail.x == head.x)
        if (head.y > tail.y) tail.y++;
        else tail.y--;
      else {
        //diagonal
        let i = 0;
      }
    }
  }
};
const part1 = () => {
  const head = new Point();
  const tail = new Point();
  moves.forEach((mov) => {
    move(head, tail, mov);
  });
  return 0;
};

const part2 = () => {
  return 0;
};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day9");
