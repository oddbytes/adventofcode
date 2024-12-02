import * as fs from "fs";
import { Reports } from "./reports";
console.time("day2");
// Reports isn a number[][] containing report data
const reports = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((report) => report.split(" ").map((l) => parseInt(l)));
console.time("part1");
const reportsManager = new Reports();

const safeReports = reportsManager.getSafeReports(reports).length;

console.log(`Answer: ${safeReports}`);
console.timeEnd("part1");
console.timeEnd("day2");
