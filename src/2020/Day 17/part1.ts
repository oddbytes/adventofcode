import { ConwayCubesSpace3D } from "./conwayCubesSpace3D";
console.time("part1");

const space = new ConwayCubesSpace3D("./initialState.txt");

for (let cycle = 0; cycle < 6; cycle++) {
  space.runCycle();
}

console.log("Answer:", space.cubes.size);

console.timeEnd("part1");
