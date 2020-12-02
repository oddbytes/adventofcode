export class SignalCleaner2 {
  private basePattern = [0, 1, 0, -1];

  //private patterns: number[][] = [];

  constructor(public signal: number[]) {}

  // private generatePatterns(): void {
  //   const pattern = Object.assign([], this.basePattern);
  //   for (let i = 1; i <= this.signal.length; i++) {
  //     this.updatePattern(pattern, i);
  //     const newPattern = Object.assign([], pattern);
  //     this.patterns[i] = newPattern;
  //   }
  // }

  private updatePattern(basePattern: number[], reps: number): void {
    if (reps > 1) {
      for (let p = 0; p < 4; p++) {
        basePattern.splice(p * reps, 0, basePattern[p * reps]);
      }
    }
  }

  /* 
This is SLOWER than generating an array ¿? like in v1
private getMultiplier(blockLength: number, pos: number) {
    const patternLength = 4 * blockLength;
    // Corect position so it is within the four blocks
    pos = pos % patternLength;
    // Get base patter block index
    const baseIndex = Math.floor(pos / blockLength);
    return this.basePattern[baseIndex];
  }
*/

  private getFinalPattern(pattern: number[]): number[] {
    let p = Object.assign([], pattern);
    while (p.length < this.signal.length + 1) {
      p = p.concat(pattern);
    }
    return p;
  }

  /**
   * Cleans the signal applying x phases of the cleaning algorith
   * @param signal
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
        const finalPattern = this.getFinalPattern(this.basePattern);

        // console.time("calcDigit");

        // const r = math.multiply(this.signal, finalPattern);
        const result = this.signal
          .reduce((acum, digit, i) => {
            acum += digit * finalPattern[i + 1];

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
