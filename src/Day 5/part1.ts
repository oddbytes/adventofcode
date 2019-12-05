import { IntcodeComputer } from "../Day 2/intcodeComputer";
import { program } from "./program";

const computer = new IntcodeComputer();
const input = [1];
computer.execute(program, input);
