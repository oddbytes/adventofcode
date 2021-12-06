import * as fs from "fs";

console.time("totalTime");

// array cotaining number of fishes per age (index)
const ages = new Array(9).fill(0);

fs.readFileSync("./puzzle.txt", "utf8")
  .split(",")
  .forEach((elem) => ages[elem]++);

const cycle = (ages: number[]): void => {
  const newBorns = ages.shift(); //fishes to born in this cycle
  ages[8] = newBorns;
  ages[6] += newBorns; //timer resets
};

for (let day = 0; day < 80; day++) cycle(ages);

console.log(
  "Response part 1:",
  ages.reduce((a, b) => (a += b)) //sum of fishes of all ages
);

for (let day = 0; day < 256 - 80; day++) cycle(ages);

console.log(
  "Response part 2:",
  ages.reduce((a, b) => (a += b)) //sum of fishes of all ages
);

console.timeEnd("totalTime");
