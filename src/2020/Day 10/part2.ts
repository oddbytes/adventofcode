import * as fs from "fs";

console.time("part2");

const adapters = fs
  .readFileSync("./adapters.txt", "utf8")
  .split("\r\n")
  .map((n) => parseInt(n))
  .sort((a, b) => a - b);

// Obtener los saltos de joltaje entre adaptadores
const gaps = adapters.map((adapter, index) =>
  index > 0 ? adapter - adapters[index - 1] : adapter
);

//Obtener el numero de adaptadores contiguos que tienen un salto de 1 jolt
const oneJoltAdapterGroups = gaps
  .join("")
  .split("3")
  .filter((group) => group.length > 0)
  .map((group) => group.length);

/**
 * Devuelve el numero de combinaciones que pueden hacerse con n adpatadores consecutivos que tengan un salto de 1 jolt
 * Se trata realmente de la secuencia tribonacci, pero con la entrada del problema solo tenemos longitudes máximas de 4 funciona igual
 * @param groupSize numero de adaptadores consecutivos con un salto de 1 jolt
 */
const adapterCombinations = (groupSize: number) => {
  if (groupSize == 1) return 1;
  return groupSize - 1 + adapterCombinations(groupSize - 1);
};

//Multiplicamos las combinaciones que produce cada grupo de adaptadores consecutivos
console.log(
  "Answer:",
  oneJoltAdapterGroups.reduce((a, b) => (a *= adapterCombinations(b)), 1)
);

console.timeEnd("part2");
