import * as fs from "fs";
import { SevenSegments } from "./sevenSegments";

console.time("part2");

const sevenSegments = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .map((line) => new SevenSegments(line));

sevenSegments.forEach((s) => s.decodeSignals());
const numbers = sevenSegments.map((s) => s.decodeDigits());

console.log(
  "Response",
  numbers.reduce((a, b) => (a += b), 0)
);

console.timeEnd("part2");
