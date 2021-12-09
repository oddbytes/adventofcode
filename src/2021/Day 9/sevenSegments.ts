export class SevenSegments {
  private signals: string[];
  private digits: string[];
  private wiring: string[] = new Array(7);
  constructor(signalsAndDigits: string) {
    [this.signals, this.digits] = signalsAndDigits
      .split(" | ")
      .map((tokens) => tokens.split(" "));
  }

  /**
   * Analyzes signals and detremines wiring
   *    
       0000  
      1    2 
      1    2 
       3333  
      4    5 
      4    5 
       6666
   */
  public decodeSignals = (): string[] => {
    //lenght 2 signal = 1. don't know if order is correct, but we'll use to decode segment 0 below
    let segments = this.signals.find((signal) => signal.length == 2).split("");
    this.wiring[2] = segments[0];
    this.wiring[5] = segments[1];
    //length 3 = 7, find segment[0]
    segments = this.signals
      .find((signal) => signal.length == 3)
      .split("")
      .filter((s) => !this.wiring.includes(s));
    this.wiring[0] = segments[0];
    //determine segments 2 && 5 order by checking number 6
    if (
      !this.signals.find(
        (signal) => signal.length == 6 && !signal.includes(this.wiring[2])
      )
    ) {
      segments[0] = this.wiring[2];
      this.wiring[2] = this.wiring[5];
      this.wiring[5] = segments[0];
    }

    //find 5 and 6
    const six = this.signals.find(
      (signal) => signal.length == 6 && !signal.includes(this.wiring[2])
    );
    const five = this.signals.find(
      (signal) => signal.length == 5 && !signal.includes(this.wiring[2])
    );
    //the extra segment in 6 is pos 4

    this.wiring[4] = six.split("").filter((x) => !five.includes(x))[0];

    //find 2
    const two = this.signals.find(
      (signal) => signal.length == 5 && signal.includes(this.wiring[4])
    );
    //the segment in common with 4 different to wiring[2] is wiring[3]
    const four = this.signals.find((signal) => signal.length == 4);
    this.wiring[3] = two
      .split("")
      .filter(
        (x) => x != this.wiring[2] && x != this.wiring[0] && four.includes(x)
      )[0];

    this.wiring[1] = four
      .split("")
      .filter(
        (x) => x != this.wiring[2] && x != this.wiring[3] && x != this.wiring[5]
      )[0];

    const eight = this.signals.find((signal) => signal.length == 7);
    this.wiring[6] = eight.split("").filter((x) => !this.wiring.includes(x))[0];
    return this.wiring;
  };

  /**
   * Decodes each digit by checking what segments are on using a map
   * @returns decoded number
   */
  public decodeDigits = (): number => {
    const dicNumbers = new Map<string, string>([
      ["25", "1"],
      ["012456", "0"],
      ["02346", "2"],
      ["02356", "3"],
      ["1235", "4"],
      ["01356", "5"],
      ["013456", "6"],
      ["025", "7"],
      ["0123456", "8"],
      ["012356", "9"],
    ]);
    return parseInt(
      this.digits.reduce((numbers, digit) => {
        const key = digit
          .split("")
          .map((d) => this.wiring.indexOf(d))
          .sort()
          .join("");
        numbers += dicNumbers.get(key);
        return numbers;
      }, "")
    );
  };
}
