import * as fs from "fs";

console.time("part1");

const adapters = fs
  .readFileSync("./adapters.txt", "utf8")
  .split("\r\n")
  .map((n) => parseInt(n))
  .sort((a, b) => a - b);

/**
 * Devuelve el numero de diferencias de voltaje de la magnitud indicada
 * @param gapSize diferencia de joltage
 */
const getNumberOfGaps = (gapSize) =>
  adapters.reduce(
    (count, adapter, index, adapters) =>
      (count +=
        (index > 0 && adapter - adapters[index - 1]) == gapSize
          ? 1
          : index == 0
          ? adapter == gapSize
            ? 1
            : 0
          : 0),
    0
  );

console.log("Answer:", getNumberOfGaps(1) * (getNumberOfGaps(3) + 1));

console.timeEnd("part1");
