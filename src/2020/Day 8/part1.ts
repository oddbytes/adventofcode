import { HandheldComputer } from "./handheldComputer";

console.time("part1");
const computer = new HandheldComputer("./program.txt");
console.log("Answer:", computer.findAccBeforeLoop());
console.timeEnd("part1");
