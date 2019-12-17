import { GameMap } from "../Day 13/gameMap";
import { TileType } from "../Day 13/tiles";
import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
import { IMazeTile, MazeTile } from "./mazeTile";

export enum Direction {
  north = 1,
  south = 2,
  west = 3,
  east = 4
}
export class MazeMapper {
  private computer = new IntcodeComputer();
  private options: IProgramOptions = {
    suspendOnOutput: true,
    input: [Direction.north]
  };

  public getRequestedPosition = (
    position: IPoint,
    direction: Direction
  ): IPoint => {
    const { x, y } = position;
    switch (direction) {
      case Direction.north:
        return new Point(x, y + 1);
      case Direction.south:
        return new Point(x, y - 1);
      case Direction.east:
        return new Point(x + 1, y);
      case Direction.west:
        return new Point(x - 1, y);
    }
  };

  private turnRight = (lastDirection: Direction): Direction => {
    if (lastDirection == Direction.north) {
      return Direction.east;
    }
    if (lastDirection == Direction.east) {
      return Direction.south;
    }
    if (lastDirection == Direction.south) {
      return Direction.west;
    }

    return Direction.north;
  };

  private turnLeft = (lastDirection: Direction): Direction => {
    if (lastDirection == Direction.north) {
      return Direction.west;
    }
    if (lastDirection == Direction.east) {
      return Direction.north;
    }
    if (lastDirection == Direction.south) {
      return Direction.east;
    }
    return Direction.south;
  };

  public getMap(program: number[]): IMazeTile[] {
    const gameMap = new GameMap();
    let execResult = this.computer.execute(program, this.options);
    let robotPosition = new Point(0, 0);
    const map: IMazeTile[] = [];

    while (
      execResult.output[execResult.output.length - 1] != 2 ||
      gameMap.renderUncomplete(map, false).match(/U/g).length > 10 // random guess
    ) {
      //   console.log(
      //     `\nRobot at ${robotPosition.x},${robotPosition.y}, moving ${
      //       options.input[options.input.length - 1]
      //     }`
      //   );

      const requestedPosition = this.getRequestedPosition(
        robotPosition,
        this.options.input[this.options.input.length - 1]
      );
      //   console.log(
      //     `\tRequested position at ${requestedPosition.x},${
      //       requestedPosition.y
      //     }, is ${
      //       execResult.output[execResult.output.length - 1] == 0
      //         ? "wall"
      //         : "empty or target"
      //     }`
      //   );

      let nextDirection;
      if (execResult.output[execResult.output.length - 1] == 0) {
        // wall
        map.push(new MazeTile(requestedPosition, TileType.wall));
        nextDirection = this.turnLeft(
          this.options.input[this.options.input.length - 1]
        );
      }
      if (execResult.output[execResult.output.length - 1] > 0) {
        map.push(
          new MazeTile(
            requestedPosition,
            execResult.output[execResult.output.length - 1] == 1
              ? TileType.empty
              : TileType.ball
          )
        );
        robotPosition = requestedPosition;
        nextDirection = this.turnRight(
          this.options.input[this.options.input.length - 1]
        );
      }
      execResult = this.computer.resume([nextDirection]);
    }
    return map;
  }
}
