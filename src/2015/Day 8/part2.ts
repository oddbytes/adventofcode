import * as fs from "fs";

let codeLength = 0,
  encodedLength = 0;
fs.readFileSync("words.txt", "utf8")
  .split("\r\n")
  .forEach((w) => {
    codeLength += w.length;
    w = w.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    //sumar comillas iniciales y finales
    encodedLength += w.length + 2;
  });

console.log("Aswer:", encodedLength - codeLength);
