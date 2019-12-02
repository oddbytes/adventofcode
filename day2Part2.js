"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var day2Part1_1 = require("./day2Part1");
var expectedOutput = 19690720;
var computer = new day2Part1_1.IntcodeComputer();
var output = 0;
var noun = 100;
var verb = -1;
while (output !== expectedOutput && noun > -1) {
    while (output !== expectedOutput && verb < 100) {
        day2Part1_1.day2Part1Program[1] = noun;
        day2Part1_1.day2Part1Program[2] = verb;
        output = computer.execute(day2Part1_1.day2Part1Program)[0];
        console.log("Noun:" + noun + " Verb:" + verb + " Output:" + output);
        if (output == expectedOutput) {
            console.log(computer.execute(day2Part1_1.day2Part1Program)[0]);
        }
        verb++;
    }
    verb = -1;
    noun--;
}
//# sourceMappingURL=day2Part2.js.map