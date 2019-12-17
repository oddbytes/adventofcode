export class SignalCleaner3 {
  private basePattern = [0, 1, 0, -1];

  constructor(public signal: number[]) {
    // Construir array signals de leng*lengt
    //    this.makeSignal(signal);
    /*this.patterns = new Array(signal.length);
    const pattern = Object.assign([], this.basePattern);
    for (let i = 0; i < signal.length; i++) {
      {
        this.updatePattern(pattern, i + 1);
        let pat = Object.assign([], pattern);
        while (pat.length < signal.length + 1) {
          pat = pat.concat(pat);
        }
        pat.splice(0, 1);
        pat.splice(signal.length);
        this.patterns[i] = pat;
      }
    }*/
  }

  private updatePattern(basePattern: number[], reps: number): void {
    if (reps == 1) {
      return;
    }
    for (let p = 0; p < 4; p++) {
      basePattern.splice(p * reps, 0, basePattern[p * reps]);
    }
  }

  /**
   * Cleans the signal applying x phases of the cleaning algorith
   * @param phases
   */
  public cleanSignal(phases: number): number[] {
    let phase = 0;

    while (phase < phases) {
      console.time("phase" + phase);
      // const r = math.multiply(this.signals, this.patterns);

      const pattern = Object.assign([], this.basePattern);

      for (let row = 0; row < this.signal.length; row++) {
        this.updatePattern(pattern, row + 1);
        let patternIndex = row + 1;
        // las primeras row positions are 0
        let signalIndex = row;

        let res = 0;
        // let col = signalIndex;
        // while (signalIndex < this.signal.length) {
        for (let col = signalIndex; col < this.signal.length; col++) {
          /*if (pattern[patternIndex] == 0) {
            //Jump the zeros block
            signalIndex += row + 1;
            patternIndex += row + 1;
          } else */

          // {
          res = res + this.signal[signalIndex++] * pattern[patternIndex++];
          // }
          if (patternIndex > pattern.length - 1) {
            patternIndex = 0;
          }
        }

        // for (let col = signalIndex; col < this.signal.length; col++) {

        // }

        const s = res.toString();
        this.signal[row] = parseInt(s[s.length - 1]);
      }

      console.timeEnd("phase" + phase);
      phase++;
    }
    return this.signal;
  }
}
