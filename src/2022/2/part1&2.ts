import * as fs from "fs";
console.time("day1");
const moves = fs

  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((l) => l.split(" "));

console.time("part1");
let points = moves.map((move) => {
  //0 if you lost, 3 if the round was a draw, and 6 if you won).
  const opponentMove = move[0].charCodeAt(0) - 65;
  const myMove = move[1].charCodeAt(0) - 88;

  return (
    myMove +
    1 +
    (opponentMove - myMove == 1 || opponentMove - myMove == -2
      ? 0
      : opponentMove == myMove
      ? 3
      : 6)
  );
});
console.log(`Part1 response: ${points.reduce((a, b) => a + b, 0)}`);

console.timeEnd("part1");
console.time("part2");
// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win.
points = moves.map((move) => {
  //0 if you lost, 3 if the round was a draw, and 6 if you won).

  const opponentMove = move[0].charCodeAt(0) - 65;
  let myMove = opponentMove;
  if (move[1] == "Z") myMove = (opponentMove + 1) % 3;

  if (move[1] == "X") {
    myMove = opponentMove - 1;
    if (myMove < 0) myMove = 2;
  }

  return myMove + 1 + (move[1].charCodeAt(0) - 88) * 3;
});
console.log(points);
console.log(`Part2 response: ${points.reduce((a, b) => a + b, 0)} `);

console.timeEnd("part2");

console.timeEnd("day1");
