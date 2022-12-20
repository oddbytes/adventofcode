import * as fs from "fs";

console.time("day3");
const loads = fs.readFileSync("./input.txt", "utf8").split("\r\n");
const halfLoads = loads.map((l) => [
  l.slice(0, l.length / 2),
  l.slice(l.length / 2, l.length),
]);

const repeatedPerLoad = halfLoads.map(
  ([firstCompartment, secondCompartment]) => {
    const repeated = [
      ...new Set(
        firstCompartment
          .split("")
          .filter((item) => secondCompartment.includes(item))
      ),
    ][0].charCodeAt(0);
    return repeated > 96 ? repeated - 96 : repeated - 64 + 26;
  }
);

console.time("part1");

console.log(`Part1 response: ${repeatedPerLoad.reduce((a, b) => a + b)}`);

console.timeEnd("part1");
console.time("part2");

const repeatedPerThree = loads.map((load, index) => {
  if (index % 3 == 0) {
    const repeated = load
      .split("")
      .filter((item) => loads[index + 1].includes(item))
      .join("");

    const repeatedThree = [
      ...new Set(
        repeated.split("").filter((item) => loads[index + 2].includes(item))
      ),
    ][0].charCodeAt(0);

    return repeatedThree > 96 ? repeatedThree - 96 : repeatedThree - 64 + 26;
  }
  return 0;
});

console.log(`Part2 response: ${repeatedPerThree.reduce((a, b) => a + b)} `);

console.timeEnd("part2");

console.timeEnd("day3");
