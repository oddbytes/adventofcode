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
let result = 0;
const updateChecker = new Updates();
//get only incorrect updates
const incorrectUpdates = updates.filter((update) => {
  return !updateChecker.isCorrect(update, precedences);
});
//Correct order of every update
incorrectUpdates.forEach((update) => {
  //Check list of precedences of the numbers that follow the current one
  do {
    update.forEach((u1, index) => {
      //Check list of precedences of the numbers that follow the current one
      //If this one is in the list of precedences of any of them, swap them
      for (let j = index + 1; j < update.length; j++) {
        const u2 = update[j];
        if (precedences.has(u2)) {
          if (precedences.get(u2).includes(u1)) {
            //exists in the list of precedences, u2 should be BEFORE u1
            //swap u1 and u2
            const temp = update[index];
            update[index] = update[j];
            update[j] = temp;
          }
        }
      }
    });
  } while (!updateChecker.isCorrect(update, precedences)); //repeat swapping thill the sequence is correct
  result += update[Math.floor(update.length / 2)]; //get the middle value
});

console.log(`Answer: ${result}`);
console.timeEnd("part");
console.timeEnd("day");
