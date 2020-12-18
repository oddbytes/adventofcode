import { ConwayCubesSpace4D } from "./conwayCubesSpace4D";
console.time("part2");
const space = new ConwayCubesSpace4D("./initialState.txt");

for (let cycle = 0; cycle < 6; cycle++) {
  space.runCycle();
}

console.log("Answer:", space.cubes.size);

console.timeEnd("part2");
