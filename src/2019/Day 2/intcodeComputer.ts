/**
 * Defines an executable program
 */
interface IExecutableProgram {
  /**
   * instruction codes
   */
  program: number[];
  /**
   * current instruction
   */
  instructionPointer: number;
  /**
   * input values for code 3
   */
  input?: number[];
  /**
   * current input value
   */
  inputPointer: number;
}

enum ParameterMode {
  position = 0,
  inmediate = 1
}

/**
 * Implements an Intcode computer as detailed in https://adventofcode.com/2019/day/2 and day/5
 */
export class IntcodeComputer {
  /**
   * Executes one step of the program. Exit code: 0=OK, -1=ERROR, 99=END;
   * @param program Full program
   * @param instructionPointer Step number
   */
  private executeInstruction(executableProgram: IExecutableProgram) {
    const { program, instructionPointer } = executableProgram;
    let instructionCode = program[instructionPointer];

    let parameter1Mode: ParameterMode;
    let parameter2Mode: ParameterMode;
    let parameter3Mode: ParameterMode;

    if (instructionCode == 99) {
      console.log(`HALT.`);
      return 99;
    }
    // Determine instruction type
    if (instructionCode < 100) {
      // implicit instruction
      parameter1Mode = parameter2Mode = parameter3Mode = ParameterMode.position;
    } else {
      const parameterModes = Array.from(
        Math.trunc(instructionCode / 100).toString()
      ).reverse();
      parameter1Mode = parseInt(parameterModes[0]);
      parameter2Mode = parseInt(parameterModes[1] ?? "0");
      parameter3Mode = parseInt(parameterModes[2] ?? "0");
      instructionCode = instructionCode % 100;
    }

    const parameter1 =
      parameter1Mode == ParameterMode.position
        ? program[instructionPointer + 1]
        : instructionPointer + 1;

    const parameter2 =
      parameter2Mode == ParameterMode.position
        ? program[instructionPointer + 2]
        : instructionPointer + 2;

    const parameter3 =
      parameter3Mode == ParameterMode.position
        ? program[instructionPointer + 3]
        : instructionPointer + 3;

    switch (instructionCode) {
      case 1: {
        program[parameter3] = program[parameter2] + program[parameter1];
        executableProgram.instructionPointer += 4;
        break;
      }
      case 2: {
        program[parameter3] = program[parameter2] * program[parameter1];
        executableProgram.instructionPointer += 4;
        break;
      }
      case 3: {
        program[parameter1] =
          executableProgram.input[executableProgram.inputPointer++];
        executableProgram.instructionPointer += 2;
        break;
      }
      case 4: {
        console.log(`Diag output:${program[parameter1]}  (0=correct)`);
        executableProgram.instructionPointer += 2;
        break;
      }
      case 5: {
        // jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter.
        if (program[parameter1] !== 0) {
          executableProgram.instructionPointer = program[parameter2];
        } else {
          executableProgram.instructionPointer += 3;
        }
        break;
      }
      case 6: {
        // jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter.
        if (program[parameter1] === 0) {
          executableProgram.instructionPointer = program[parameter2];
        } else {
          executableProgram.instructionPointer += 3;
        }
        break;
      }

      case 7: {
        // if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.

        program[parameter3] = program[parameter1] < program[parameter2] ? 1 : 0;
        executableProgram.instructionPointer += 4;

        break;
      }

      case 8: {
        // if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.

        program[parameter3] =
          program[parameter1] === program[parameter2] ? 1 : 0;
        executableProgram.instructionPointer += 4;

        break;
      }
    }

    return 0;
  }

  /**
   * Executes the program (doesn't mutate original). Return new matrix
   * @param program program to execute
   */
  public execute(program: number[], input?: number[]): number[] {
    const executableProgram: IExecutableProgram = {
      program: Object.assign([], program),
      instructionPointer: 0,
      input,
      inputPointer: 0
    };

    let exitCode = 0;
    while (
      exitCode === 0 &&
      executableProgram.instructionPointer < executableProgram.program.length
    ) {
      exitCode = this.executeInstruction(executableProgram);
    }
    return executableProgram.program;
  }
}
