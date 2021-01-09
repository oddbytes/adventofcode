import { PasswordCalculator } from "./passwordCalculator";
console.time("part1");
const passwordCalc = new PasswordCalculator("cqjxjnds");

while (!passwordCalc.isValid) {
  passwordCalc.calculateNext();
}

console.log("Answer 1:", passwordCalc.password);
console.timeEnd("part1");

console.time("part2");
passwordCalc.calculateNext();
while (!passwordCalc.isValid) {
  passwordCalc.calculateNext();
}
console.log("Answer 2:", passwordCalc.password);

console.timeEnd("part2");
