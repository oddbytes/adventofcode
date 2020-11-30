import { TileType } from "../Day 13/tiles";
import { Direction } from "../Day 15/maze";
import { IMazeTile, MazeTile } from "../Day 15/mazeTile";
import { IntcodeComputer } from "../Day 2/intcodeComputer";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
export interface IMovement {
  direction: Direction;
  steps: number;
}
export class ScaffoldMapper {
  private computer = new IntcodeComputer();

  constructor(public program: number[]) {}

  public getScaffoldTiles(output?: number[]): IMazeTile[] {
    let mapX = 0;
    let mapY = 0;

    if (!output) output = this.computer.execute(this.program).output;
    return output
      .map((char) => {
        if (char == 10) {
          mapY += 1; // new line
          mapX = 0;
          return undefined;
        } else {
          return new MazeTile(
            new Point(mapX++, mapY),
            char === 35 ? TileType.block : char === 46 ? TileType.empty : TileType.ball
          );
        }
      })
      .filter((t) => t !== undefined);
  }

  // reuse some of the code of maze mapper (day 15)

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

  private getRequestedPosition = (position: IPoint, direction: Direction): IPoint => {
    const { x, y } = position;
    switch (direction) {
      case Direction.north:
        return new Point(x, y - 1);
      case Direction.south:
        return new Point(x, y + 1);
      case Direction.east:
        return new Point(x + 1, y);
      case Direction.west:
        return new Point(x - 1, y);
    }
  };

  private isReverse = (direction1: Direction, direction2: Direction): boolean => {
    return direction1 + direction2 == 3 || direction1 + direction2 == 7;
  };
  private getTileAtPost = (tiles: IMazeTile[], pos: IPoint): IMazeTile =>
    tiles.find((t) => t.position.x == pos.x && t.position.y == pos.y);

  public getScaffoldMovemetns(tiles: IMazeTile[]): IMovement[] {
    const movements: IMovement[] = [];

    const robotPos = tiles.find((t) => t.type == TileType.ball);
    robotPos.visited = true;
    let { position: currentPos } = robotPos;
    let currentDir = Direction.west;

    let newPos = this.getRequestedPosition(currentPos, currentDir);
    let turns = 0;
    let move = 0;
    let tileNewPos = this.getTileAtPost(tiles, newPos);
    while (!(tileNewPos?.type == TileType.empty && turns > 2)) {
      turns = 0;
      console.log(
        `Pos:${currentPos.x},${currentPos.y} heading:${currentDir}   try newPos: ${newPos.x},${newPos.y}, type: ${tileNewPos?.symbol}(${tileNewPos?.type})`
      );

      const lastDir = currentDir;
      while ((tileNewPos?.type == TileType.empty && turns < 3) || tileNewPos == undefined) {
        currentDir = this.turnRight(currentDir);
        if (!this.isReverse(currentDir, lastDir)) {
          // dont go back!
          newPos = this.getRequestedPosition(currentPos, currentDir);
          turns++;
          tileNewPos = this.getTileAtPost(tiles, newPos);
        }
      }
      move++;
      if (turns > 0) {
        console.log(`\tnew heading:${currentDir}`);
        movements.push({ direction: lastDir, steps: move });
        move = 0;
      }

      currentPos = new Point(newPos.x, newPos.y);
      newPos = this.getRequestedPosition(currentPos, currentDir);

      if (tileNewPos) {
        if (tileNewPos?.visited == true) {
          tileNewPos.type = TileType.wall;
        } else {
          tileNewPos.visited = true;
        }
      }
      tileNewPos = this.getTileAtPost(tiles, newPos);
    }
    movements[0].steps -= 1; //stating pos
    return movements;
  }
}
