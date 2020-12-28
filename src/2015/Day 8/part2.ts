import * as fs from "fs";

let codeLength = 0,
  encodedLength = 0;
fs.readFileSync("words.txt", "utf8")
  .split("\r\n")
  .forEach((w) => {
    codeLength += w.length;
    w = '"' + w.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    encodedLength += w.length;
  });

console.log("Aswer:", encodedLength - codeLength);
