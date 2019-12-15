import { Point, IPoint } from "../Day 3/SegmentCalculator";
import { program } from "./program";
import { TileType } from "../Day 13/tiles";
import { GameMap } from "../Day 13/gameMap";
import { IMazeTile } from "./mazeTile";
import { MazeMapper } from "./maze";

const mazeMapper = new MazeMapper();
const map = mazeMapper.getMap(program);

const targetPosition = map.find(mt => mt.type == TileType.ball).position;

console.log(new GameMap().renderUncomplete(map));
console.log(`Oxigen at ${targetPosition.x},${targetPosition.y}`);

//USE BFS to get shortest path between start and oxigen coordinates

interface IQueueNode {
  point: IPoint;
  dist: number;
}

class QueueNode implements IQueueNode {
  constructor(public point: IPoint, public dist: number) {}
}

const BFS = (mat: IMazeTile[], src: IPoint, dest: IPoint): number => {
  //mark src tile as visited
  map.find(t => t.position.x == src.x && t.position.y == src.y).visited = true;
  //create queue
  let queue: IQueueNode[] = [];

  // Distance of source cell is 0
  queue.push(new QueueNode(src, 0)); // Enqueue source cell

  while (queue.length > 0) {
    let curr = queue[0];
    let { point: pt } = curr;
    // If we have reached the destination cell,
    // we are done
    if (pt.x == dest.x && pt.y == dest.y) return curr.dist;

    // Otherwise dequeue the front cell   in the queue and enqueue  its adjacent cells
    queue.splice(0, 1);
    for (let i = 1; i < 5; i++) {
      let adjacent = mazeMapper.getRequestedPosition(pt, i);

      // if adjacent cell is valid, has path
      // and not visited yet, enqueue it.
      let adjacentTile = map.find(
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
const dist = BFS(map, new Point(0, 0), targetPosition);
console.log(`Min steps to reach oxygen: ${dist}`);
