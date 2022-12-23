import * as fs from "fs";

console.time("day8");
const terminalOutput = fs.readFileSync("./input.txt", "utf8").split("\n");

const part1 = () => {};

const part2 = () => {};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day8");
