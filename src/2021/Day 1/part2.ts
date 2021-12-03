import * as fs from "fs";

const depths = fs
  .readFileSync("./slidingWindowsDepths.txt", "utf8")
  .split("\r\n")
  .map((line) => parseInt(line));

// Calcular las ventanas de 3 elementos
const slidingWindowsDepth = depths.map((value, index) =>
  index < depths.length - 2 ? value + depths[index + 1] + depths[index + 2] : 0
);

//Aplicar misma funcion que en parte 1 para calcular los incrementos
const increments = slidingWindowsDepth.reduce(
  (inc, depth, index, depths) =>
    (inc += index > 0 ? (depth > depths[index - 1] ? 1 : 0) : 0),
  0
);

console.log("Increments:", increments);
