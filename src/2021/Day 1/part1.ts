import * as fs from "fs";

const depths = fs
  .readFileSync("./depths.txt", "utf8")
  .split("\r\n")
  .map((line) => parseInt(line));

//contar las veces que un elemento se incrementa resoecto al anterior
const increments = depths.reduce(
  (inc, depth, index) =>
    (inc += index > 0 ? (depth > depths[index - 1] ? 1 : 0) : 0),
  0
);

console.log("Increments:", increments);
