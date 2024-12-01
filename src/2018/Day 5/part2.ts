import * as fs from "fs";
import { Reactor } from "./reactor";
console.time("day5");
let polymer = fs.readFileSync("./input.txt", "utf8");
console.time("part2");

const reactor = new Reactor();
console.log(Array(26));
//Initialize an array with all the letters of the alphabet
const letters = Array.from(Array(26))
  .map((_e, i) => i + 65)
  .map((x) => String.fromCharCode(x));
const lengths = letters.map((particle) => {
  let destroyedPolymer = reactor.destroyParticles(polymer, particle);

  while (true) {
    //fire reactions till all opposite particles are destroyed
    const initialLength = destroyedPolymer.length;
    destroyedPolymer = reactor.fireReactions(destroyedPolymer);
    console.log(initialLength, destroyedPolymer.length);
    if (initialLength == destroyedPolymer.length) break;
  }

  return destroyedPolymer.length;
});
console.log(lengths);

console.log(`Answer: ${Math.min(...lengths)}`);
console.timeEnd("part2");
