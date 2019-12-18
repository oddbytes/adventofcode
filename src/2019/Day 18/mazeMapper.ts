import { TileType } from "../Day 13/tiles";

import { Direction } from "../Day 15/maze";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
import { IMazeTile, MazeTile } from "./mazeTile";

interface IQueueNode {
  point: IPoint;
  dist: number;
}

class QueueNode implements IQueueNode {
  constructor(public point: IPoint, public dist: number) {}
}

export class MazeMapper {
  constructor(public mazeInput: string[]) {}

  private doors: IMazeTile[] = [];
  private keys: IMazeTile[] = [];
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

  public getMap(): IMazeTile[] {
    const tiles: IMazeTile[] = [];

    const getTileType = (char: string) => {
      switch (char) {
        case ".":
          return TileType.empty;
        case "#":
          return TileType.wall;
        case "@":
          return TileType.ball;
      }
      return TileType.block;
    };
    for (let row = this.mazeInput.length - 1; row > -1; row--) {
      Array.from(this.mazeInput[row]).forEach((char, col) => {
        const tile = new MazeTile(new Point(col, row), getTileType(char));
        if (tile.type == TileType.block) {
          if (char.toUpperCase() == char) {
            tile.door = char;
          } else {
            tile.key = char;
          }
        }
        tiles.push(tile);
      });
    }

    return tiles;
  }

  public doorsInRange(maze: IMazeTile[], src: IPoint) {
    if (this.doors.length == 0) {
      this.doors = maze.filter(t => t.door);
    }

    return this.doors.filter(door => this.getMinDistance(maze, src, door) > -1);
  }

  public getMinDistance = (
    maze: IMazeTile[],
    src: IPoint,
    dest: IMazeTile
  ): number => {
    // init tiles
    maze.forEach(t => t.visited == false);
    // mark src tile as visited
    maze.find(
      t => t.position.x == src.x && t.position.y == src.y
    ).visited = true;
    // create queue
    const queue: IQueueNode[] = [];

    // Distance of source cell is 0
    queue.push(new QueueNode(src, 0)); // Enqueue source cell

    while (queue.length > 0) {
      const curr = queue[0];
      const { point: pt } = curr;
      // If we have reached the destination cell,
      // we are done
      if (pt.x == dest.position.x && pt.y == dest.position.y) {
        return curr.dist;
      }

      // Otherwise dequeue the front cell   in the queue and enqueue  its adjacent cells
      queue.splice(0, 1);
      for (let i = 1; i < 5; i++) {
        const adjacent = this.getRequestedPosition(pt, i);

        // if adjacent cell is valid, has path
        // and not visited yet, enqueue it.
        const adjacentTile = maze.find(
          t => t.position.x == adjacent.x && t.position.y == adjacent.y
        );
        if (
          adjacentTile?.type !== TileType.wall &&
          (!adjacentTile?.door || !adjacentTile?.door == dest.door) &&
          adjacentTile?.visited == false
        ) {
          adjacentTile.visited = true;
          queue.push(new QueueNode(adjacentTile.position, curr.dist + 1));
        }
      }
    }
    return -1;
  };
}
