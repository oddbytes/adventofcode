import * as fs from "fs";

console.time("day4");
let [stacks, instructions] = fs
  .readFileSync("./sample.txt", "utf8")
  .split("\r\n\r\n");

  stacks=stacks.split("\r\n").map(l=>)

console.log(stacks, instructions);

console.time("part1");

console.log(`Part1 response: `);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: `);

console.timeEnd("part2");

console.timeEnd("day4");
