"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IntcodeComputer = (function () {
    function IntcodeComputer() {
    }
    IntcodeComputer.prototype.executeInstruction = function (program, step) {
        var instruction = program.slice(step * 4, step * 4 + 4);
        if (instruction[0] === 99) {
            return 99;
        }
        if (instruction[0] !== 1 && instruction[0] !== 2) {
            return -1;
        }
        if (instruction[0] === 1) {
            program[instruction[3]] =
                program[instruction[2]] + program[instruction[1]];
        }
        if (instruction[0] === 2) {
            program[instruction[3]] =
                program[instruction[2]] * program[instruction[1]];
        }
        return 0;
    };
    IntcodeComputer.prototype.execute = function (program) {
        var executableProgram = Object.assign([], program);
        var maxSteps = Math.ceil(executableProgram.length / 4);
        var exitCode = 0;
        var step = 0;
        while (exitCode === 0 && step <= maxSteps) {
            exitCode = this.executeInstruction(executableProgram, step++);
        }
        return executableProgram;
    };
    return IntcodeComputer;
}());
exports.IntcodeComputer = IntcodeComputer;
exports.day2Part1Program = [
    1,
    0,
    0,
    3,
    1,
    1,
    2,
    3,
    1,
    3,
    4,
    3,
    1,
    5,
    0,
    3,
    2,
    6,
    1,
    19,
    1,
    19,
    5,
    23,
    2,
    9,
    23,
    27,
    1,
    5,
    27,
    31,
    1,
    5,
    31,
    35,
    1,
    35,
    13,
    39,
    1,
    39,
    9,
    43,
    1,
    5,
    43,
    47,
    1,
    47,
    6,
    51,
    1,
    51,
    13,
    55,
    1,
    55,
    9,
    59,
    1,
    59,
    13,
    63,
    2,
    63,
    13,
    67,
    1,
    67,
    10,
    71,
    1,
    71,
    6,
    75,
    2,
    10,
    75,
    79,
    2,
    10,
    79,
    83,
    1,
    5,
    83,
    87,
    2,
    6,
    87,
    91,
    1,
    91,
    6,
    95,
    1,
    95,
    13,
    99,
    2,
    99,
    13,
    103,
    1,
    103,
    9,
    107,
    1,
    10,
    107,
    111,
    2,
    111,
    13,
    115,
    1,
    10,
    115,
    119,
    1,
    10,
    119,
    123,
    2,
    13,
    123,
    127,
    2,
    6,
    127,
    131,
    1,
    13,
    131,
    135,
    1,
    135,
    2,
    139,
    1,
    139,
    6,
    0,
    99,
    2,
    0,
    14,
    0
];
var computer = new IntcodeComputer();
exports.day2Part1Program[1] = 12;
exports.day2Part1Program[2] = 2;
console.log(computer.execute(exports.day2Part1Program)[0]);
//# sourceMappingURL=day2Part1.js.map