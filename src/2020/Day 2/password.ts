export class Password {
  private value: string;
  private minOcurrences: number;
  private maxOcurrences: number;
  private character: string;

  constructor(definition: string) {
    const dimensions = definition.match(/(\d+)-(\d+)\s([a-zA-Z]):\s(.*)/);

    this.character = dimensions[3];
    this.minOcurrences = parseInt(dimensions[1]);
    this.maxOcurrences = parseInt(dimensions[2]);
    this.value = dimensions[4];
  }
  get isValidFirstPolicy(): boolean {
    const policy = new RegExp(this.character, "g");
    const ocurrences = this.value.match(policy)?.length ?? 0;
    return ocurrences >= this.minOcurrences && ocurrences <= this.maxOcurrences;
  }

  private xor = (a: boolean, b: boolean) => (a ? !b : b);

  get isValidSecondPolicy(): boolean {
    return this.xor(
      this.value[this.minOcurrences - 1] == this.character,
      this.value[this.maxOcurrences - 1] == this.character
    );
  }
}
