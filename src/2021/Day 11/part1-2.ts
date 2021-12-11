import * as fs from "fs";
console.time("day11");

const octopuses: number[] = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .flatMap((line) => line.split("").map((x) => parseInt(x)));

/**
 *
 * @param octopuses
 * @param index
 * @returns
 */
const getAdjacent = (octopuses: number[], index: number): number[] => {
  const adjacent: number[] = [];
  const width = Math.sqrt(octopuses.length);
  const col = index % width;
  for (let c = -1; c < 2; c++) {
    for (let r = -width; r < width + 1; r += width) {
      const adjacentIndex = index + c + r;

      if (adjacentIndex > -1 && adjacentIndex < octopuses.length) {
        //up and down limits
        const adjacentCol = adjacentIndex % width;
        if (
          (c < 0 && adjacentCol < col) || //left and right limits
          (c > 0 && adjacentCol > col) ||
          (col == adjacentCol && index != adjacentIndex)
        )
          adjacent.push(adjacentIndex);
      }
    }
  }
  return adjacent;
};

const flash = (octopuses: number[], index: number) => {
  //The octopus may have already flased
  if (octopuses[index] == 0) return 0;
  //Flash it
  octopuses[index] = 0;
  //Get adjacent octopuses
  const adjacent = getAdjacent(octopuses, index);

  //increase adjacent levels  by 1 if not already flashed
  adjacent
    .filter((index) => octopuses[index] != 0)
    .forEach((index) => octopuses[index]++);
  //get new flashes
  const flashesIndexes = adjacent
    .map((index) => (octopuses[index] > 9 ? index : -1))
    .filter((i) => i > -1);

  //console.log(index, adjacent, flashesIndexes);
  return (
    1 +
    flashesIndexes.reduce(
      (flashes, index) => (flashes += flash(octopuses, index)),
      0
    )
  );
};

const step = (octopuses: number[]): number => {
  //First, increase al levels by 1
  octopuses.forEach((_level, i) => octopuses[i]++);
  //Get octopuses to flash
  const flashesIndexes = octopuses
    .map((level, index) => (level > 9 ? index : -1))
    .filter((i) => i > -1);
  //Flash them and count!
  return flashesIndexes.reduce(
    (flashes, index) => (flashes += flash(octopuses, index)),
    0
  );
};

const print = (octopuses: number[]) => {
  const width = Math.sqrt(octopuses.length);
  for (let r = 0; r < width; r++)
    console.log(octopuses.slice(r * width, r * width + width).join(""));
  console.log("");
};

console.time("part1");
let total = 0;
let firstSync = -1;
let s = 0;
//
for (; s < 100; s++) total += step(octopuses);

console.log("Answer 1:", total);
console.timeEnd("part1");

console.time("part2");

while (firstSync == -1) {
  s++;
  step(octopuses);
  if (octopuses.filter((level) => level == 0).length == octopuses.length)
    firstSync = s;
}
console.log("Answer 2:", firstSync);
console.timeEnd("part2");

console.timeEnd("day11");
