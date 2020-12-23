export class CrabCups {
  public circle: Map<number, number> = new Map<number, number>();
  private currentCup: number;

  constructor(part: number) {
    const seed = "364289715";
    Array.from(seed).forEach((n, i, a) =>
      this.circle.set(parseInt(n), i < a.length - 1 ? parseInt(a[i + 1]) : 10)
    );
    if (part == 1) {
      this.circle.set(parseInt(seed[seed.length - 1]), parseInt(seed[0]));
    } else {
      for (let i = 10; i < 1000001; i++) this.circle.set(i, i + 1);

      this.circle.set(1000000, parseInt(seed[0]));
    }
    this.currentCup = parseInt(seed[0]);
  }

  public move = (): void => {
    const firstPick = this.circle.get(this.currentCup);
    const secondPick = this.circle.get(firstPick);
    const thirdPick = this.circle.get(secondPick);

    const pickedUpsCups = [firstPick, secondPick, thirdPick];

    let destinationLabel = this.currentCup - 1;

    const minPickLabel = Math.min(...pickedUpsCups);
    const minLabel =
      minPickLabel > 1
        ? 1
        : pickedUpsCups.includes(2)
        ? pickedUpsCups.includes(3)
          ? 4
          : 3
        : 2;

    while (
      destinationLabel > minLabel &&
      pickedUpsCups.includes(destinationLabel)
    ) {
      destinationLabel--;
    }

    if (destinationLabel < minLabel) {
      const maxPickLabel = Math.max(...pickedUpsCups);
      destinationLabel =
        maxPickLabel < this.circle.size
          ? this.circle.size
          : pickedUpsCups.includes(this.circle.size - 1)
          ? pickedUpsCups.includes(this.circle.size - 2)
            ? this.circle.size - 3
            : this.circle.size - 2
          : this.circle.size - 1;
    }

    this.circle.set(this.currentCup, this.circle.get(thirdPick));

    this.currentCup = this.circle.get(thirdPick);

    this.circle.set(thirdPick, this.circle.get(destinationLabel));

    this.circle.set(destinationLabel, firstPick);
  };
}
