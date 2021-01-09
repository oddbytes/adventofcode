import * as fs from "fs";

const file = fs.readFileSync("./input.json", "utf8");
const digits = /-?\d+/g;

const sum = Array.from(file.matchAll(digits)).reduce(
  (a, match) => (a += parseInt(match[0])),
  0
);

console.log("Answer", sum);
