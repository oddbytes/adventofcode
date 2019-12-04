import { IntcodeComputer } from "./intcodeComputer";
import { program } from "./program";

const expectedOutput = 19690720;
const computer = new IntcodeComputer();

let output = 0;

// Brute force
let noun = 100;
let verb = -1;

while (output !== expectedOutput && noun > -1) {
  while (output !== expectedOutput && verb < 100) {
    program[1] = noun;
    program[2] = verb;
    output = computer.execute(program)[0];

    if (output == expectedOutput) {
      console.log(`Noun:${noun} Verb:${verb} Output:${output}`);
    }
    verb++;
  }
  verb = -1;
  noun--;
}
