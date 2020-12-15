import { SpokenNumbers } from "./spokenNumbers";

console.time("part1");
let spokenNumbers = new SpokenNumbers("./startNumbers.txt");
let spokenNumber: number;
while (spokenNumbers.turn < 2020) spokenNumber = spokenNumbers.spokeNext();
console.log(spokenNumber);
console.timeEnd("part1");

console.time("part2");
spokenNumbers = new SpokenNumbers("./startNumbers.txt");
while (spokenNumbers.turn < 30000000) spokenNumber = spokenNumbers.spokeNext();
console.log(spokenNumber);
console.timeEnd("part2");
