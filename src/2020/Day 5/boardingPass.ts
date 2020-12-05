export class BoardingPass {
  private static rows = 128;
  private static columns = 8;
  constructor(public seat: string) {}

  public get row(): number {
    let start = 0,
      end = BoardingPass.rows - 1;
    for (let index = 0; index < 7; index++) {
      const half = (end + 1 - start) / 2;
      this.seat[index] === "B" ? (start += half) : (end -= half);
    }
    return start;
  }

  public get col(): number {
    let start = 0,
      end = BoardingPass.columns - 1;
    for (let index = 7; index < 10; index++) {
      const half = (end + 1 - start) / 2;
      this.seat[index] === "R" ? (start += half) : (end -= half);
    }
    return start;
  }

  public get id(): number {
    return this.row * 8 + this.col;
  }
}
