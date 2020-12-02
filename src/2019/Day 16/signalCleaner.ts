export class SignalCleaner {
  private basePattern = [0, 1, 0, -1];

  //private patterns: number[][] = [];

  constructor(public signal: number[]) {}

  private updatePattern(basePattern: number[], reps: number): void {
    if (reps == 1) {
      return;
    }

    // if (!this.patterns[reps - 2]) {
    for (let p = 0; p < 4; p++) {
      basePattern.splice(p * reps, 0, basePattern[p * reps]);
    }

    /*this.patterns.push([...basePattern]);
    }
    return this.patterns[reps - 2];*/
  }

  /**
   * Cleans the signal applying x phases of the cleaning algorith
   * @param phases
   */
  public cleanSignal(phases: number): number[] {
    let phase = 0;

    while (phase < phases) {
      console.time("phase" + phase);
      const pattern = Object.assign([], this.basePattern);
      this.signal = this.signal.map((_d, digitIndex) => {
        // console.time("updatePattern");
        this.updatePattern(pattern, digitIndex + 1);
        // console.timeEnd("updatePattern");
        let patternIndex = 1;
        // console.time("calcDigit");
        const result = this.signal
          .reduce((acum, digit) => {
            acum += digit * pattern[patternIndex++];
            if (patternIndex > pattern.length - 1) {
              patternIndex = 0;
            }
            return acum;
          }, 0)
          .toString();
        // console.timeEnd("calcDigit");
        return parseInt(result[result.length - 1]);
      });
      console.timeEnd("phase" + phase);
      phase++;
    }
    return this.signal;
  }
}
