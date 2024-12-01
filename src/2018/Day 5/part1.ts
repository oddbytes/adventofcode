import * as fs from "fs";
import { Reactor } from "./reactor";
console.time("day5");
let polymer = fs.readFileSync("./input.txt", "utf8");
console.time("part1");

const reactor = new Reactor();
while (true) {
  //fire reactions till all opposite particles are destroyed
  const initialLength = polymer.length;
  polymer = reactor.fireReactions(polymer);
  console.log(initialLength, polymer.length);
  if (initialLength == polymer.length) break;
}
console.log(`Answer: ${polymer.length}`);
console.timeEnd("part1");
