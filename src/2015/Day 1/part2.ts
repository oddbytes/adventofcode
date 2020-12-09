import * as fs from "fs";

const data = Array.from(fs.readFileSync("./input.txt", "utf8"));
let pos = 0,
  floor = 0;
while (floor > -1) floor += data[pos++] == ")" ? -1 : 1;

console.log("Answer:", pos);
