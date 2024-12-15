import * as fs from "fs";
import { IPoint, Point } from "../../common/point";

console.time("day");
class Tile {
  public visited = false;
  constructor(
    public position: IPoint,
    public elevation: number
  ) {}
}
const map = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .flatMap((row, rowIndex) =>
    row
      .split("")
      .map(
        (cell, colIndex) =>
          new Tile(new Point(colIndex, rowIndex), parseInt(cell))
      )
  );

// console.log(map);
console.time("part");

interface IQueueNode {
  tile: Tile;
}

class QueueNode implements IQueueNode {
  constructor(public tile: Tile) {}
}

const direction: Record<number, number[]> = {
  0: [0, 1],
  1: [1, 0],
  2: [0, -1],
  3: [-1, 0]
};

//Return tiles with just 1 difference in height
const getAdjacenTiles = (maze: Tile[], fromTile: Tile): Tile[] => {
  const possibleTiles: Tile[] = [];
  for (let i = 0; i < 4; i++) {
    const tile = maze.find(
      (tile) =>
        tile.elevation - fromTile.elevation == 1 && //can walk up just one
        tile.position.x === fromTile.position.x + direction[i][0] &&
        tile.position.y === fromTile.position.y + direction[i][1]
    );
    if (tile) possibleTiles.push(tile);
  }

  return possibleTiles;
};
//BFS with multiple source nodes and multiple destinations, allowing to pass through visited tiles
const BFS = (
  maze: Tile[],
  src: Tile[],
  dests: Tile[],
  checkVisited = true
): number => {
  // create queue
  const queue: IQueueNode[] = [];
  src.forEach((tile) => {
    tile.visited = true; //unnecesary if checkVisited is false
    queue.push(new QueueNode(tile)); // Enqueue source cell
  });
  // mark src tile as visited
  let trails = 0;
  while (queue.length > 0) {
    const currentNode = queue.shift();
    const { tile: currentTile } = currentNode;
    // If we have reached the destination cell,we are done
    if (
      dests.some(
        (dest) =>
          currentTile.position.x == dest.position.x &&
          currentTile.position.y == dest.position.y
      )
    )
      trails++;

    // dequeue the front cell   in the queue and enqueue  its adjacent cells

    const adjacentTiles = getAdjacenTiles(maze, currentTile);

    adjacentTiles.forEach((adjTile) => {
      if (checkVisited) {
        if (adjTile.visited == false) {
          adjTile.visited = true;
          queue.push(new QueueNode(adjTile));
        }
      } else {
        queue.push(new QueueNode(adjTile));
      }
    });
  }

  return trails;
};

const srcs = map.filter((tile) => tile.elevation === 0);
const dests = map.filter((tile) => tile.elevation === 9);

const part1 = () => {
  let answer = 0;
  srcs.forEach((src) => {
    answer += BFS(map, [src], dests);
    //Reset map tiles' state
    map.forEach((tile) => (tile.visited = false));
  });
  return answer;
};

const part2 = () => {
  const srcs = map.filter((tile) => tile.elevation === 0);
  const dests = map.filter((tile) => tile.elevation === 9);
  //In this case we don't minfd if a tie has been visited previously, so we can check all sources and destinations at the same time
  return BFS(map, srcs, dests, false);
};

console.log("Part 1 Answer:", part1());
console.log("Part 2 Answer:", part2());

console.timeEnd("part");
console.timeEnd("day");
