import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { IPoint } from "../Day 3/SegmentCalculator";
import { program } from "./program";

export class BeamInspector {
  private computer = new IntcodeComputer();
  private programOptions: IProgramOptions = {
    suspendOnOutput: false,
    input: [],
  };

  public getBeam(area: number): number[][] {
    const grid: number[][] = [];
    for (let row = 0; row < area; row++) {
      grid[row] = [];

      for (let col = 0; col < area; col++) {
        this.programOptions.input = [row, col];
        const exec = this.computer.execute(program, this.programOptions);

        grid[row][col] = exec.output[exec.output.length - 1];
      }
    }

    return grid;
  }

  public isInBeam(pos: IPoint): boolean {
    this.programOptions.input = [pos.x, pos.y];
    const exec = this.computer.execute(program, this.programOptions);
    return exec.output[exec.output.length - 1] == 1;
  }

  public render(grid: number[][]) {
    console.log(grid.map((row, i) => row.join("") + " " + i).join("\n"));
  }
}
