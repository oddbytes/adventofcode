import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { Point } from "../Day 3/SegmentCalculator";
import { ITile, Tile } from "./tiles";

export class GameMap {
  private computer = new IntcodeComputer();
  private options: IProgramOptions = {
    suspendOnOutput: true,
    input: []
  };

  public getTiles(gameProgram: number[]): ITile[] {
    let program = this.computer.execute(gameProgram, this.options);
    const tiles: ITile[] = [];
    while (program.exitCode != 99) {
      program = this.computer.resume();
      program = this.computer.resume();
      tiles.push(
        new Tile(
          new Point(
            program.output[program.output.length - 3],
            program.output[program.output.length - 2]
          ),
          program.output[program.output.length - 1]
        )
      );
      if (program.exitCode != 99) {
        program = this.computer.resume();
      }
    }
    return tiles;
  }

  public render(tiles: ITile[]): string {
    const maxY = Math.max(...tiles.map(t => t.position.y));
    let screen = "";
    for (let row = 0; row < maxY + 1; row++) {
      const columns = tiles
        .filter(t => t.position.y == row)
        .sort((a, b) => a.position.x - b.position.x);

      columns.forEach(t => (screen += t.symbol));
      screen += "\n";
    }
    return screen;
  }
}
