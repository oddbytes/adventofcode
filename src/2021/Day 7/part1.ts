import * as fs from "fs";

console.time("part1");

const positions = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split(",")
  .map((x) => parseInt(x));

//Brute force, calc all position costs
const costs = positions.map((_p, toIndex) =>
  positions.reduce((a, b) => (a += Math.abs(b - toIndex)), 0)
);

console.log("Response", Math.min(...costs));
console.timeEnd("part1");

//https://es.wikipedia.org/wiki/N%C3%BAmero_triangular
