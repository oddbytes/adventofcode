import { GameMap } from "../Day 13/gameMap";
import { TileType } from "../Day 13/tiles";
import { Direction } from "../Day 15/maze";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
import { IMazeTile20, MazeTile20, PortalLocation } from "./mazeTile";

interface IQueueNode {
  point: IPoint;
  dist: number;
}

class QueueNode implements IQueueNode {
  constructor(public point: IPoint, public dist: number) {}
}

export interface IPortalPassage {
  portal1: string;
  portal2: string;
  distance: number;
}

export class MazeSolver {
  private mazeTiles: IMazeTile20[];
  constructor(public maze: string[]) {
    this.mazeTiles = this.parseMaze();
  }

  get tiles() {
    return this.mazeTiles;
  }
  private parseMaze(): IMazeTile20[] {
    const tiles = this.maze
      .map((row, rowIndex) => {
        const chars = Array.from(row).slice(2, row.length - 2);
        return chars.map((char, colIndex) => {
          return new MazeTile20(
            new Point(colIndex, rowIndex),
            char == "." ? TileType.empty : TileType.wall
          );
        });
      })
      .flat();

    const g = new GameMap();
    console.log(g.render(tiles));

    // Get labels
    const reLabel = new RegExp(/[A-Z][A-Z]/g);
    // Horizontal
    const maxX = Math.max(
      ...tiles.filter(t => t.position.y == 0).map(t => t.position.x)
    );

    this.maze.forEach((row, rowIndex) => {
      let label = reLabel.exec(row);
      while (label != null) {
        label.forEach(match => {
          if (match.length == 2) {
            const adjustedIndex = label.index - 2;
            // check if there is a left or right passage
            const rightTile = tiles.find(
              t =>
                t.position.x == adjustedIndex + 2 &&
                t.position.y == rowIndex &&
                t.type == TileType.empty
            );
            if (rightTile) {
              rightTile.label = match + (rightTile.position.x == 0 ? "O" : "I");
            } else {
              const leftTile = tiles.find(
                t =>
                  t.position.x == adjustedIndex - 1 &&
                  t.position.y == rowIndex &&
                  t.type == TileType.empty
              );
              if (leftTile) {
                leftTile.label =
                  match + (leftTile.position.x == maxX ? "O" : "I");
              } else {
                throw new Error("no passage found!");
              }
            }
          }
        });

        label = reLabel.exec(row);
      }
    });

    // Vertical
    const maxY = Math.max(
      ...tiles.filter(t => t.position.x == 0).map(t => t.position.y)
    );
    for (let colIndex = 0; colIndex < this.maze[0].length; colIndex++) {
      const column = this.maze.map(row => row[colIndex]).join("");
      let label = reLabel.exec(column);
      while (label != null) {
        label.forEach(match => {
          if (match.length == 2) {
            const adjustedIndex = label.index;
            // check if there is a down or up
            const downTile = tiles.find(
              t =>
                t.position.x == colIndex - 2 &&
                t.position.y == adjustedIndex + 2 &&
                t.type == TileType.empty
            );
            if (downTile) {
              downTile.label = match + (downTile.position.y == 2 ? "O" : "I");
            } else {
              const upTile = tiles.find(
                t =>
                  t.position.x == colIndex - 2 &&
                  t.position.y == adjustedIndex - 1 &&
                  t.type == TileType.empty
              );
              if (upTile) {
                upTile.label =
                  match + (upTile.position.y == maxY - 2 ? "O" : "I");
              } else {
                throw new Error("no passage found!");
              }
            }
          }
          label = reLabel.exec(column);
        });
      }
    }

    return tiles;
  }

  private getRequestedPosition = (
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

  public getMinDistance = (
    maze: IMazeTile20[],
    src: IPoint,
    dest: IPoint
  ): number => {
    // init tiles
    maze.forEach(t => (t.visited = false));

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
      if (pt.x == dest.x && pt.y == dest.y) {
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

    return -1;
  };

  public getPortalConections(tiles: IMazeTile20[]) {
    const portals = tiles.filter(t => t.label);

    return portals
      .map(portal1 =>
        portals.map(portal2 => {
          if (portal1.label != portal2.label) {
            return {
              portal1: portal1.label,
              portal2: portal2.label,
              distance:
                this.getMinDistance(tiles, portal1.position, portal2.position) +
                (portal2.label == "ZZO" ? 0 : 1)
            };
          }
          return undefined;
        })
      )
      .flat()
      .filter(p => p?.distance > 0);
  }
}
