import * as fs from "fs";
console.time("day1");
const calories = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n")
  .map((l) => l.split("\r\n").map((x) => parseInt(x)));

console.time("part1");
//Reduce each array to a single number (sum))
let totalCaloriesByElf = calories.map((elfcalories) =>
  elfcalories.reduce((a, b) => a + b)
);
// And return the max number
console.log(`Part1 response: ${Math.max(...totalCaloriesByElf)}`);

console.timeEnd("part1");
console.time("part2");
//Order and sum the top 3
totalCaloriesByElf = totalCaloriesByElf.sort((a, b) => b - a);

//Sum the top 3

console.log(
  `Part2 response: ${totalCaloriesByElf.slice(0, 3).reduce((a, b) => a + b)}`
);

console.timeEnd("part2");

console.timeEnd("day1");
