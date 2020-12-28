import * as fs from "fs";

const disallowed = /ab|cd|pq|xy/;
const vowels = /([aeiou]([^aeiou])*){3}/;
const letterTwice = /([a-z])\1/;

const words = fs
  .readFileSync("words.txt", "utf8")
  .split("\r\n")
  .filter((w) => !disallowed.test(w) && vowels.test(w) && letterTwice.test(w));

console.log("Answer:", words.length);
