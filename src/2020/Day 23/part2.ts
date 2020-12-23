import { CrabCups } from "./crabCups";
console.time("part2");
const crabCups = new CrabCups(2);
let i = 0;
while (i++ < 10000000) crabCups.move();

const firstCup = crabCups.circle.get(1);
const nextCup = crabCups.circle.get(firstCup);

console.log("Answer", firstCup, "*", nextCup, "=", firstCup * nextCup);
console.log(crabCups.dec);
console.timeEnd("part2");
