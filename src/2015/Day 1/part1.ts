import * as fs from "fs";

const data = Array.from(fs.readFileSync("./input.txt", "utf8"));
console.log(
  "Answer:",
  data.reduce((a, b) => (a += b == ")" ? -1 : 1), 0)
);
