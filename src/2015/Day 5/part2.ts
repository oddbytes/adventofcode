import * as fs from "fs";

const repeated = /(.)(.)\1/;
const pair = /(..).*\1/;

const words = fs
  .readFileSync("words.txt", "utf8")
  .split("\r\n")
  .filter((w) => repeated.test(w) && pair.test(w));

console.log("Answer:", words.length);
