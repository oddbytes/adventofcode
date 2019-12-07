import {
  IntcodeComputer,
  IProgramResults,
  ComputerStatus
} from "../Day 2/intcodeComputer";
import { AmplifiersResult } from "./amplifiers";

export class LoopAmplifiers {
  private amplifiers: IntcodeComputer[] = [];
  constructor(public program: number[]) {}

  private computeAmplifier(
    amplifierIndex: number,
    phaseSetting: number,
    input: number[]
  ): IProgramResults {
    const computer = this.amplifiers[amplifierIndex];
    if (computer.status == ComputerStatus.suspended)
      return computer.resume([input[input.length - 1]]);
    else
      return computer.execute(this.program, {
        input: [phaseSetting, ...input],
        suspendOnOutput: true
      });
  }

  private computeSettings(phaseSettings: number[]): number {
    // settings must be unique for each mplifier
    if (
      phaseSettings.some(
        ps1 => phaseSettings.filter(ps => ps === ps1).length > 1
      )
    )
      return -1;

    console.log(`Computing settings ${phaseSettings}
    ------------------------------------------`);
    this.amplifiers = [
      new IntcodeComputer(),
      new IntcodeComputer(),
      new IntcodeComputer(),
      new IntcodeComputer(),
      new IntcodeComputer()
    ];
    let halted = false;

    let currAmp = 0;
    let input = [0];
    let eAmpLastOutput = 0;

    let loop = 0;
    console.log(`loop ${loop}`);

    while (!halted) {
      const result = this.computeAmplifier(
        currAmp,
        phaseSettings[currAmp],
        input
      );

      input = result.output;
      console.log(`Amp ${currAmp} output ${input}`);

      halted = result.exitCode == 99 && currAmp == 4;

      if (++currAmp > 4) {
        currAmp = 0;
        eAmpLastOutput = result.output[result.output.length - 1];
        console.log(`loop ${++loop}`);
      }
    }
    return eAmpLastOutput;
    // return phaseSettings.reduce(
    //   (result, phaseSetting) => this.computeAmplifier(phaseSetting, result),
    //   0
    // );
  }
  public tryAllSettings(): AmplifiersResult[] {
    const result: AmplifiersResult[] = [];
    for (let amp1 = 5; amp1 < 10; amp1++)
      for (let amp2 = 5; amp2 < 10; amp2++)
        for (let amp3 = 5; amp3 < 10; amp3++)
          for (let amp4 = 5; amp4 < 10; amp4++)
            for (let amp5 = 5; amp5 < 10; amp5++)
              result.push({
                settings: [amp1, amp2, amp3, amp4, amp5],
                result: this.computeSettings([amp1, amp2, amp3, amp4, amp5])
              });
    return result;
  }
}
