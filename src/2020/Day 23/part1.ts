import { Console } from "console";
import { CrabCups } from "./crabCups";
console.time("part1");
const crabCups = new CrabCups(1);
let i = 0;
while (i++ < 100) crabCups.move();

const finalCircle = crabCups.circle;
let currentCup = finalCircle.get(1);
let answer = "";
while (currentCup != 1) {
  answer += currentCup;
  currentCup = finalCircle.get(currentCup);
}
console.log("Answer", answer);
console.timeEnd("part1");
