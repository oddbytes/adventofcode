import * as fs from "fs";

console.time("part1");

const positions = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split(",")
  .map((x) => parseInt(x));

const movementCostsCache: number[] = []; //cache of costs per distance to speed things up

const movementCost = (distance: number) => {
  //n + (n-1) + (n-2) +.....+ 0
  if (movementCostsCache[distance]) return movementCostsCache[distance];
  if (distance > 0) {
    movementCostsCache[distance] = distance + movementCost(distance - 1);
    return movementCostsCache[distance];
  }
  return 0;
};

//Brute force, calc all position costs
const costs = positions.map((p, toIndex) =>
  positions.reduce((a, b) => (a += movementCost(Math.abs(b - toIndex))), 0)
);

console.log("Response", Math.min(...costs));

console.timeEnd("part1");
