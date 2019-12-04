import { IntcodeComputer } from "./intcodeComputer";
import { program } from "./program";

const computer = new IntcodeComputer();
// Prepare main program
program[1] = 12;
program[2] = 2;

console.log(computer.execute(program)[0]);
