import { Board } from "./board";
import * as fs from "fs";
console.time("part2");
const data = fs.readFileSync("./puzzle.txt", "utf8").split("\r\n");
const drawnNumbers = data
  .splice(0, 1)[0]
  .split(",")
  .map((n) => parseInt(n));

// create boards
const boards: Board[] = [];
while (data.length > 0) boards.push(new Board(data.splice(0, 6)));

// draw numbers till we have only a board left a winner
let drawnNumber: number;
let loserBoard: Board = null;
while (boards.length > 0 && drawnNumbers.length > 0) {
  drawnNumber = drawnNumbers.splice(0, 1)[0];
  //check all boards, not just till one is winner (filter instead of find).
  const winnerBoards = boards.filter((b) => b.mark(drawnNumber));
  //there could be more than a winner per turn
  for (const winnerBoard of winnerBoards) {
    if (boards.length == 1) loserBoard = winnerBoard; //loser board found
    const index = boards.findIndex((b) => b.numbers == winnerBoard.numbers);
    boards.splice(index, 1);
  }
}

// get unmarked numbers sum in loser  board
const unmarkedNumbersSum = loserBoard
  .unmarkedNumbers()
  .reduce((a, b) => (a += b), 0);

console.log("Response", unmarkedNumbersSum * drawnNumber);
console.timeEnd("part2");
