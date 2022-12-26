import * as fs from "fs";
import { start } from "repl";
import { IPoint, Point } from "../../common/point";

interface IQueueNode {
  tile: Tile;
  totalDistance: number;
}

class QueueNode implements IQueueNode {
  constructor(public tile: Tile, public totalDistance: number) {}
}

class Tile {
  public visited = false;
  constructor(public position: IPoint, public elevation: number) {}
}

console.time("day12");
const parseMap = () => {
  console.time("parseMap");
  const map = fs
    .readFileSync("./input.txt", "utf8")
    .split("\r\n")
    .map((line, y) =>
      line
        .split("")
        .map((letter, x) => new Tile(new Point(x, y), letter.charCodeAt(0)))
    )
    .flatMap((x) => x);
  console.timeEnd("parseMap");
  return map;
};

//console.log(monkeys);
const direction: Record<number, number[]> = {
  0: [0, 1],
  1: [1, 0],
  2: [0, -1],
  3: [-1, 0],
};

//Return tiles with a max 1 difference in height
const getAdjacenTiles = (maze: Tile[], fromTile: Tile): Tile[] => {
  const possibleTiles: Tile[] = [];
  for (let i = 0; i < 4; i++) {
    const tile = maze.find(
      (tile) =>
        tile.position.x === fromTile.position.x + direction[i][0] &&
        tile.position.y === fromTile.position.y + direction[i][1] &&
        tile.elevation - fromTile.elevation <= 1 //can walk down more than 1, but up at most 1
    );
    if (tile) possibleTiles.push(tile);
  }

  return possibleTiles;
};

//BFS with multiple source nodes
const BFS = (maze: Tile[], src: Tile[], dest: Tile): number => {
  // create queue
  const queue: IQueueNode[] = [];
  src.forEach((tile) => {
    tile.visited = true;

    // Distance of source cell is 0
    queue.push(new QueueNode(tile, 0)); // Enqueue source cell
  });
  // mark src tile as visited

  while (queue.length > 0) {
    const currentNode = queue.shift();
    const { tile: currentTile } = currentNode;
    // If we have reached the destination cell,we are done
    if (
      currentTile.position.x == dest.position.x &&
      currentTile.position.y == dest.position.y
    )
      return currentNode.totalDistance;

    // dequeue the front cell   in the queue and enqueue  its adjacent cells

    const adjacentTiles = getAdjacenTiles(maze, currentTile);

    adjacentTiles.forEach((adjTile) => {
      if (adjTile.visited == false) {
        adjTile.visited = true;
        queue.push(new QueueNode(adjTile, currentNode.totalDistance + 1));
      }
    });
  }

  return -1;
};

const part1 = () => {
  const map = parseMap();
  const start = map.find((t) => t.elevation == "S".charCodeAt(0));
  const exit = map.find((t) => t.elevation == "E".charCodeAt(0));

  start.elevation = "a".charCodeAt(0);
  exit.elevation = "z".charCodeAt(0);

  return BFS(map, [start], exit);
};

const part2 = () => {
  const map = parseMap();

  const starts = map.filter(
    (t) => t.elevation == "S".charCodeAt(0) || t.elevation == "a".charCodeAt(0)
  );
  const exit = map.find((t) => t.elevation == "E".charCodeAt(0));
  exit.elevation = "z".charCodeAt(0);
  starts.forEach((start) => (start.elevation = "a".charCodeAt(0)));
  return BFS(map, starts, exit);
};

const p1 = () => {
  console.time("part1");

  const d = part1();
  console.log(`Part1 response: ${d}`);

  console.timeEnd("part1");
};

const p2 = () => {
  console.time("part2");

  const d = part2();

  console.log(`Part2 response: ${d}`);

  console.timeEnd("part2");
};

p1();
p2();

console.timeEnd("day12");
