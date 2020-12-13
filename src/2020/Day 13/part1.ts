import * as fs from "fs";

console.time("part1");
const data = fs.readFileSync("./buses.txt", "utf8").split("\r\n");
const minTime = parseInt(data[0]);
const buses = data[1]
  .split(",")
  .filter((id) => id != "x")
  .map((id) => parseInt(id));

const diffs = buses.map((id) => id - (minTime % id));
const minDiff = Math.min(...diffs);

const busIndex = diffs.findIndex((diff) => diff == minDiff);

console.log("Answer:", buses[busIndex] * minDiff);
console.timeEnd("part1");
