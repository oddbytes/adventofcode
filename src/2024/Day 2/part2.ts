import * as fs from "fs";
import { Reports } from "./reports";
console.time("day2");
// Reports isn a number[][] containing report data
const reports = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((report) => report.split(" ").map((l) => parseInt(l)));
console.time("part");
const reportsManager = new Reports();

const safeReports = reportsManager.getSafeReports(reports);
const unsafeReports = reports.filter((r) => !safeReports.includes(r));

//Foreach unsafe report,try to make it safe by tolerating a bad level. Ie: test if it's safe by removing one level at a time
const safeReports2 = unsafeReports.filter((report) => {
  for (let i = 0; i < report.length; i++) {
    const newReport = [...report]; //copy the report
    newReport.splice(i, 1); //remove one level
    if (reportsManager.getSafeReports([newReport]).length > 0) {
      //Is the report without that level safe?
      return true;
    }
  }
  //No combination of removed levels makes the report safe
  return false;
});

console.log(`Answer: ${safeReports.length + safeReports2.length}`);
console.timeEnd("part");
console.timeEnd("day2");
