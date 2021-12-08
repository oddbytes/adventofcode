import * as fs from "fs";

console.time("part1");

const digits = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .flatMap((line) => line.split("|")[1].split(" "));

const uniqueSegments = digits.filter(
  (d) => (d.length > 1 && d.length < 5) || d.length == 7
);

console.log("Response", uniqueSegments.length);
console.timeEnd("part1");
