import * as fs from "fs";

let codeLength = 0,
  inMemoryLength = 0;
fs.readFileSync("words.txt", "utf8")
  .split("\r\n")
  .forEach((w) => {
    const inMemory = eval(w);
    codeLength += w.length;
    inMemoryLength += inMemory.length;
  });

console.log("Aswer:", codeLength - inMemoryLength);
