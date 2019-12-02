/**
 * Implements an Intcode computer as detailed in https://adventofcode.com/2019/day/2
 */

export class IntcodeComputer {
  /**
   * Executes one step of the program. Exit code: 0=OK, -1=ERROR, 99=END;
   * @param program Full program
   * @param step Step number
   */
  private executeInstruction(program: number[], step: number) {
    const instruction = program.slice(step * 4, step * 4 + 4);
    // console.log(`Step ${step} Instruction ${instruction}`);
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
  }

  /**
   * Executes the program (doesn't mutate original). Return new matrix
   * @param program program to execute
   */
  public execute(program: number[]): number[] {
    const executableProgram = Object.assign([], program);
    const maxSteps = Math.ceil(executableProgram.length / 4);
    let exitCode = 0;
    let step = 0;
    while (exitCode === 0 && step <= maxSteps) {
      exitCode = this.executeInstruction(executableProgram, step++);
    }
    return executableProgram;
  }
}
