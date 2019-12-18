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
      return char.toUpperCase() == char ? TileType.wall : TileType.empty;
    };

    for (let row = this.mazeInput.length - 1; row > -1; row--) {
      Array.from(this.mazeInput[row]).forEach((char, col) => {
        const tile = new MazeTile(new Point(col, row), getTileType(char));
        if (char.charCodeAt(0) > 64) {
          if (char.charCodeAt(0) < 97) {
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
    const doors = maze.filter(t => t.door);

    return doors.filter(door => {
      door.distance = this.getMinDistance(maze, src, door);
      return door.distance > -1;
    });
  }

  public keysInRange(maze: IMazeTile[], src: IPoint) {
    const keys = maze.filter(t => t.key);

    return keys.filter(key => {
      key.distance = this.getMinDistance(maze, src, key);
      return key.distance > -1;
    });
  }

  public getMinDistance = (
    maze: IMazeTile[],
    src: IPoint,
    dest: IMazeTile
  ): number => {
    const isDoor = dest.door != undefined;
    // init tiles
    maze.forEach(t => (t.visited = false));

    //make dest tile "walkable" if it's a door
    if (isDoor) dest.type = TileType.empty;

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
        if (isDoor) dest.type = TileType.wall;
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
          adjacentTile?.visited == false
        ) {
          adjacentTile.visited = true;
          queue.push(new QueueNode(adjacentTile.position, curr.dist + 1));
        }
      }
    }
    if (isDoor) dest.type = TileType.wall;

    return -1;
  };
}
