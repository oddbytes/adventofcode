import { day2Part1Program, IntcodeComputer } from "./day2Part1";
const expectedOutput = 19690720;
const computer = new IntcodeComputer();

let output = 0;

// Brute force
let noun = 100;
let verb = -1;

while (output !== expectedOutput && noun > -1) {
  while (output !== expectedOutput && verb < 100) {
    day2Part1Program[1] = noun;
    day2Part1Program[2] = verb;
    output = computer.execute(day2Part1Program)[0];
    console.log(`Noun:${noun} Verb:${verb} Output:${output}`);

    if (output == expectedOutput) {
      console.log(computer.execute(day2Part1Program)[0]);
    }
    verb++;
  }
  verb = -1;
  noun--;
}
