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
  /**
   *  current relative base for parameters using relative mode
   */
  relativeBase: number;
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
  inmediate = 1,
  /**
   * relative mode behave very similarly to parameters in position mode: the parameter is interpreted as a position but from a given base
   */
  relative = 2
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
  // constructor(program: number[], options?: IProgramOptions) {
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
        : parameter1Mode == ParameterMode.inmediate
        ? instructionPointer + 1
        : executableProgram.relativeBase + program[instructionPointer + 1];

    const parameter2 =
      parameter2Mode == ParameterMode.position
        ? program[instructionPointer + 2]
        : parameter2Mode == ParameterMode.inmediate
        ? instructionPointer + 2
        : executableProgram.relativeBase + program[instructionPointer + 2];

    const parameter3 =
      parameter3Mode == ParameterMode.position
        ? program[instructionPointer + 3]
        : parameter3Mode == ParameterMode.inmediate
        ? instructionPointer + 3
        : executableProgram.relativeBase + program[instructionPointer + 3];

    switch (instructionCode) {
      case 1: {
        this.checkMemoryAccess(program, [parameter1, parameter2, parameter3]);
        program[parameter3] = program[parameter2] + program[parameter1];
        executableProgram.instructionPointer += 4;
        break;
      }
      case 2: {
        this.checkMemoryAccess(program, [parameter1, parameter2, parameter3]);
        program[parameter3] = program[parameter2] * program[parameter1];
        executableProgram.instructionPointer += 4;
        break;
      }
      case 3: {
        // read an input
        if (executableProgram.inputPointer>executableProgram.options.input.length)
        throw "Input read error: no input available at pos" + executableProgram.inputPointer

        program[parameter1] =
          executableProgram.options.input[executableProgram.inputPointer++];
        executableProgram.instructionPointer += 2;

        break;
      }
      case 4: {
        // writes an output
        this.checkMemoryAccess(program, [parameter1]);
        executableProgram.output.push(program[parameter1]);
        executableProgram.instructionPointer += 2;
        this.status = -2;
        if (executableProgram.options?.suspendOnOutput) {
          return -2;
        }
        break;
      }
      case 5: {
        // jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter.
        this.checkMemoryAccess(program, [parameter1, parameter2]);
        if (program[parameter1] !== 0) {
          executableProgram.instructionPointer = program[parameter2];
        } else {
          executableProgram.instructionPointer += 3;
        }
        break;
      }
      case 6: {
        // jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter.
        this.checkMemoryAccess(program, [parameter1, parameter2]);
        if (program[parameter1] === 0) {
          executableProgram.instructionPointer = program[parameter2];
        } else {
          executableProgram.instructionPointer += 3;
        }
        break;
      }

      case 7: {
        // if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
        this.checkMemoryAccess(program, [parameter1, parameter2, parameter3]);
        program[parameter3] = program[parameter1] < program[parameter2] ? 1 : 0;
        executableProgram.instructionPointer += 4;

        break;
      }

      case 8: {
        // if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
        this.checkMemoryAccess(program, [parameter1, parameter2, parameter3]);
        program[parameter3] =
          program[parameter1] === program[parameter2] ? 1 : 0;
        executableProgram.instructionPointer += 4;

        break;
      }

      case 9: {
        // adjusts the relative base by the value of its only parameter.
        this.checkMemoryAccess(program, [parameter1]);
        executableProgram.relativeBase += program[parameter1];
        executableProgram.instructionPointer += 2;
      }
    }

    return 0;
  }

  private checkMemoryAccess(program: number[], addresses: number[]) {
    addresses.forEach(address => {
      if (address < 0) {
        throw new Error("Invalid memory access, negative address");
      }
      if (program[address] == undefined) {
        program[address] = 0;
      }
    });
  }

  /**
   * Executes the program (doesn't mutate original). Returns modified program
   * @param program program to execute
   */
  public execute(program, options?: IProgramOptions): IProgramResults {
    // Initialize state
    this.executableProgram = {
      program: Object.assign([], program),
      instructionPointer: 0,
      options: options ?? { input: [], suspendOnOutput: false },
      inputPointer: 0,
      output: [],
      relativeBase: 0
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
    if (input) {
      this.executableProgram.options.input.push(...input);
    }
    return this.run();
  }
}
