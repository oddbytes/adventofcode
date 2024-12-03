import * as fs from "fs";
console.time("day");

const memoryInstructions = fs.readFileSync("./input.txt", "utf8");
//All the instructions must be considered as a single block. DO NOT process them line by line, as in part1
//or enabled/disabled state will be incorrect after line 1

console.time("part");

const reInst = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;

const instructions = Array.from(memoryInstructions.matchAll(reInst));
let enabled = true; //muls are enabled in the beginning
let result = 0;
//matches are in order
instructions.forEach((instruction) => {
  if (instruction[0] === "do()") enabled = true;
  else if (instruction[0] === "don't()") enabled = false;
  //Not checking if instruction is "mul", but it's the other only case matched by the regex
  else if (enabled)
    result += parseInt(instruction[1]) * parseInt(instruction[2]);
});

console.log(`Answer: ${result}`);
console.timeEnd("part");
console.timeEnd("day");
