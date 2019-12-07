import { IntcodeComputer } from "./intcodeComputer";
import { program } from "./program";

const computer = new IntcodeComputer();
// Prepare main program
program[1] = 12;
program[2] = 2;
const result = computer.execute(program);
console.log(result.program[0]);
console.log(`èxitcode:${result.exitCode}`);
