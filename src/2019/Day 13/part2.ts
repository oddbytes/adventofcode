import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { Point } from "../Day 3/SegmentCalculator";
import { GameMap } from "./gameMap";
import { gameProgram } from "./gameProgram";
import { ITile, Tile, TileType } from "./tiles";

const gameMap = new GameMap();

const computer = new IntcodeComputer();
const options: IProgramOptions = {
  suspendOnOutput: true,
  input: []
};

gameProgram[0] = 2;
const step = 0;
let program = computer.execute(gameProgram, options);
let score = 0;
const tiles: ITile[] = [];
while (program.exitCode != 99) {
  program = computer.resume();
  program = computer.resume();
  if (program.output[program.output.length - 3] == -1) {
    score = program.output[program.output.length - 1];
  } else {
    tiles.push(
      new Tile(
        new Point(
          program.output[program.output.length - 3],
          program.output[program.output.length - 2]
        ),
        program.output[program.output.length - 1]
      )
    );
  }
  if (program.exitCode != 99) {
    program = computer.resume();
  }
}

console.log(gameMap.render(tiles));
