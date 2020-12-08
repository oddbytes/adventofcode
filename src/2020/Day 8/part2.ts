import { HandheldComputer } from "./handheldComputer";

console.time("part2");
const computer = new HandheldComputer("./program.txt");
console.log("Answer:", computer.findAccAfterFix());
console.timeEnd("part2");
