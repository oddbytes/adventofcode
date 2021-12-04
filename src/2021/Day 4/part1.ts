import { Board } from "./board";
import * as fs from "fs";
console.time("part1");
const data = fs.readFileSync("./puzzle.txt", "utf8").split("\r\n");
const drawnNumbers = data
  .splice(0, 1)[0]
  .split(",")
  .map((n) => parseInt(n));

// create boards
const boards: Board[] = [];
while (data.length > 0) boards.push(new Board(data.splice(0, 6)));

// draw numbers till we get a winner
let winnerBoard: Board = null;
let drawnNumber: number;
while (!winnerBoard && drawnNumbers.length > 0) {
  drawnNumber = drawnNumbers.splice(0, 1)[0];
  winnerBoard = boards.find((b) => b.mark(drawnNumber));
}

// get unmarked numbers in winner board
const unmarkedNumbersSum = winnerBoard
  .unmarkedNumbers()
  .reduce((a, b) => (a += b), 0);

console.log("Response", unmarkedNumbersSum * drawnNumber);
console.timeEnd("part1");
