import { IntcodeComputer } from "../Day 2/intcodeComputer";
import { program } from "./program";

const computer = new IntcodeComputer();
const input = [1];

//what diagnostic code does the program produce?
const output = computer.execute(program, { input }).output;
output.forEach(o => console.log(o));
