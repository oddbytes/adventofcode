import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { program } from "./program";

const computer = new IntcodeComputer();
const options: IProgramOptions = {
  input: [2]
};
const result = computer.execute(program, options);
console.log(result.output.join(","));
