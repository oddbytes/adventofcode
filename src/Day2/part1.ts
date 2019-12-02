import { program } from "./program";
import { IntcodeComputer } from "./intcodeComputer";

const computer = new IntcodeComputer();
// Prepare main program
program[1] = 12;
program[2] = 2;

console.log(computer.execute(program)[0]);
