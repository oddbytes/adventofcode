import { IntcodeComputer } from "../Day 2/intcodeComputer";

export interface AmplifiersResult {
  settings: number[];
  result: number;
}
export class Amplifiers {
  constructor(public program: number[]) {}

  private computeAmplifier(phaseSettings: number, input: number) {
    const computer = new IntcodeComputer();
    const result = computer.execute(this.program, {
      input: [phaseSettings, input]
    }).output;
    // console.log(
    //   `Computing ps:${phaseSettings},input:${input} -> result:${result}`
    // );
    return result[0];
  }
  private computeSettings(phaseSettings: number[]): number {
    // settings must be unique for each mplifier
    if (
      phaseSettings.some(
        ps1 => phaseSettings.filter(ps => ps === ps1).length > 1
      )
    )
      return 0;
    return phaseSettings.reduce(
      (result, phaseSetting) => this.computeAmplifier(phaseSetting, result),
      0
    );
  }
  public tryAllSettings(): AmplifiersResult[] {
    const result: AmplifiersResult[] = [];
    for (let amp1 = 0; amp1 < 5; amp1++)
      for (let amp2 = 0; amp2 < 5; amp2++)
        for (let amp3 = 0; amp3 < 5; amp3++)
          for (let amp4 = 0; amp4 < 5; amp4++)
            for (let amp5 = 0; amp5 < 5; amp5++)
              result.push({
                settings: [amp1, amp2, amp3, amp4, amp5],
                result: this.computeSettings([amp1, amp2, amp3, amp4, amp5])
              });
    return result;
  }
}
