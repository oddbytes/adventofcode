import { ConwayCubesSpace4D } from "./conwayCubesSpace4D";
console.time("part2");
const space = new ConwayCubesSpace4D("./initialState.txt");

for (let cycle = 0; cycle < 6; cycle++) {
  space.runCycle();
  //  console.log(space.renderSpace());
}

console.log(
  "Answer:",
  Array.from(space.cubes.values()).filter((state) => state).length
);

console.timeEnd("part2");
