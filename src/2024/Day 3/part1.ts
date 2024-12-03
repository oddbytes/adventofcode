import * as fs from "fs";
console.time("day");

const instructions = fs.readFileSync("./input.txt", "utf8").split("\r\n");

console.time("part");
const reMul = /mul\((\d{1,3}),(\d{1,3})\)/g;
//match all the ocurrences in each line , multiply the operands and sum the result
const result = instructions
  .flatMap((instruction) =>
    Array.from(instruction.matchAll(reMul)).map(
      (match) => parseInt(match[1]) * parseInt(match[2])
    )
  )
  .reduce((a, b) => a + b);

console.log(`Answer: ${result}`);
console.timeEnd("part");
console.timeEnd("day");
