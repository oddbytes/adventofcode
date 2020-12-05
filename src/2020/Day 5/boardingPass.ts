export class BoardingPass {
  constructor(public seat: string) {}

  public get row(): number {
    return new Number(
      "0b" + this.seat.substr(0, 7).replace(/F/g, "0").replace(/B/g, "1")
    ).valueOf();
  }

  public get col(): number {
    return new Number(
      "0b" + this.seat.substr(7, 3).replace(/L/g, "0").replace(/R/g, "1")
    ).valueOf();
  }

  public get id(): number {
    return this.row * 8 + this.col;
  }
}
