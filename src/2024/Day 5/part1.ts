import * as fs from "fs";
import { Updates } from "./updates";
console.time("day");

const blocks = fs.readFileSync("./input.txt", "utf8").split("\r\n\r\n");

const precedences: Map<number, number[]> = new Map();

blocks[0].split("\r\n").forEach((line) => {
  const numbers = line.split("|");
  if (precedences.has(parseInt(numbers[0]))) {
    precedences.get(parseInt(numbers[0])).push(parseInt(numbers[1]));
  } else precedences.set(parseInt(numbers[0]), [parseInt(numbers[1])]);
});

const updates = blocks[1]
  .split("\r\n")
  .map((line) => line.split(",").map((u1) => parseInt(u1)));
console.time("part");

const updateChecker = new Updates();
let result = 0;
for (let i = 0; i < updates.length; i++) {
  const update = updates[i];
  //Get the number in the middle of the secuence for correct updates
  if (updateChecker.isCorrect(update, precedences))
    result += update[Math.floor(update.length / 2)];
}

console.log(`Answer: ${result}`);
console.timeEnd("part");
console.timeEnd("day");
