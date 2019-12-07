/**
 * Defines an executable program
 */
interface IProgramState {
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
  options?: IProgramOptions;
  /**
   * current input value
   */
  inputPointer: number;
  /**
   * current output
   */
  output: number[];
}

export interface IProgramResults {
  /**
   * Resulting program code
   */
  program: number[];
  /**
   * Outputs
   */
  output: number[];

  exitCode: number;
}

export interface IProgramOptions {
  input?: number[];
  suspendOnOutput?: boolean;
}

enum ParameterMode {
  position = 0,
  inmediate = 1
}

export enum ComputerStatus {
  idle = 0,
  suspended = -2
}

/**
 * Implements an Intcode computer as detailed in https://adventofcode.com/2019/day/2 and day/5
 */
export class IntcodeComputer {
  private executableProgram: IProgramState = null;
  public status: ComputerStatus = 0;
  // Why doesn't the computer work if the executable program is initialized in constructor?
  //constructor(program: number[], options?: IProgramOptions) {
  //   this.executableProgram = {
  //     program: Object.assign([], program),
  //     instructionPointer: 0,
  //     options: options ?? { input: [], suspendOnOutput: false },
  //     inputPointer: 0
  //   };
  // }

  /**
   * Executes one step of the program. Exit code: 0=OK, -1=ERROR, -2=SUSPENDED, 99=END;
   * @param executableProgram
   * @param output current program output Step number
   */
  private executeInstruction(): number {
    const executableProgram = this.executableProgram;
    const { program, instructionPointer } = executableProgram;

    let instructionCode = program[instructionPointer];

    let parameter1Mode: ParameterMode;
    let parameter2Mode: ParameterMode;
    let parameter3Mode: ParameterMode;

    if (instructionCode == 99) {
      this.status = 99;
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
          executableProgram.options.input[executableProgram.inputPointer++];
        executableProgram.instructionPointer += 2;

        break;
      }
      case 4: {
        //console.log(`Diag output:${program[parameter1]}  (0=correct)`);
        executableProgram.output.push(program[parameter1]);
        executableProgram.instructionPointer += 2;
        this.status = -2;
        if (executableProgram.options?.suspendOnOutput) return -2;
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
   * Executes the program (doesn't mutate original). Returns modified program
   * @param program program to execute
   */
  public execute(program, options?: IProgramOptions): IProgramResults {
    //Initialize state
    this.executableProgram = {
      program: Object.assign([], program),
      instructionPointer: 0,
      options: options ?? { input: [], suspendOnOutput: false },
      inputPointer: 0,
      output: []
    };
    return this.run();
  }

  /**
   * Executes instructions till halt (99) or output (4) and suspendOnOutput flag is set
   */

  private run() {
    let exitCode = 0;
    while (
      exitCode === 0 &&
      this.executableProgram.instructionPointer <
        this.executableProgram.program.length
    ) {
      exitCode = this.executeInstruction();
    }
    return {
      program: this.executableProgram.program,
      output: this.executableProgram.output,
      exitCode
    };
  }
  /**
   * Resumes execution of a suspended program ( with programOptions.suspendOnOutput=true)
   * @param input Aditional input to add to existing one before resuming execution
   */
  public resume(input?: number[]) {
    if (input) this.executableProgram.options.input.push(...input);
    return this.run();
  }
}
