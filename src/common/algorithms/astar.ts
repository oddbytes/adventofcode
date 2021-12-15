//Adapted from https://github.com/bgrins/javascript-astar/


import { IPoint, Point } from "../point";

export class GridNode {
  public f = 0;
  public g = 0;
  public h = 0;
  public visited = false;
  public closed = false;
  public parent = null;

  constructor(public point: IPoint, public weight: number) {}

  public toString = (): string => this.point.toString();

  //No tiene en cuenta diagonales. Si no habria que multiplicar el coste por raiz de 2
  public getCost = (fromNeighbor?: GridNode) =>
    fromNeighbor &&
    fromNeighbor.point.x != this.point.x &&
    fromNeighbor.point.y != this.point.y
      ? this.weight * 1.41421
      : this.weight;
}

export interface IGraphOptions {
  /**aloww diagonal moves */
  diagonal: boolean;

  closest: boolean;
}
/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
export class Graph {
  private grid: GridNode[][] = [];
  public nodes: GridNode[] = [];
  private diagonal = false;
  private dirtyNodes: GridNode[] = [];
  constructor(gridIn: number[][], public options?: IGraphOptions) {
    options = options || { diagonal: this.diagonal, closest: false };
    this.diagonal = !!options.diagonal;

    for (let x = 0; x < gridIn.length; x++) {
      this.grid[x] = [];

      for (let y = 0, row = gridIn[x]; y < row.length; y++) {
        const node = new GridNode(new Point(x, y), row[y]);
        this.grid[x][y] = node;
        this.nodes.push(node);
      }
    }
  }

  public markDirty = (node: GridNode): void => {
    this.dirtyNodes.push(node);
  };

  public neighbors = (node: GridNode): GridNode[] => {
    const ret: GridNode[] = [];
    const x = node.point.x;
    const y = node.point.y;
    const grid = this.grid;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }

    if (this.diagonal) {
      // Southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1]);
      }

      // Southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1]);
      }

      // Northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1]);
      }

      // Northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1]);
      }
    }

    return ret;
  };

  public toString = () => {
    const graphString = [];
    const nodes = this.grid;
    for (let x = 0; x < nodes.length; x++) {
      const rowDebug = [];
      const row = nodes[x];
      for (let y = 0; y < row.length; y++) {
        rowDebug.push(row[y].weight);
      }
      graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
  };
}

class BinaryHeap {
  private content: GridNode[] = [];

  constructor(private scoreFunction: (n: GridNode) => number) {}

  public push = (element: GridNode) => {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  };

  public pop = () => {
    // Store the first element so we can return it later.
    const result = this.content[0];
    // Get the element at the end of the array.
    const end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  };
  public remove = (node: GridNode) => {
    const i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    const end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  };
  public size = () => {
    return this.content.length;
  };
  public rescoreElement = (node: GridNode) => {
    this.sinkDown(this.content.indexOf(node));
  };
  public sinkDown = (n: number) => {
    // Fetch the element that has to be sunk.
    const element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  };

  public bubbleUp = (n) => {
    // Look up the target element and its score.
    const length = this.content.length;
    const element = this.content[n];
    const elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      let swap = null;
      let child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        const child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  };
}

export class AStar {
  public pathTo = (node: GridNode): GridNode[] => {
    let curr = node;
    const path: GridNode[] = [];
    while (curr.parent) {
      path.unshift(curr);
      curr = curr.parent;
    }
    return path;
  };
  /**
        * Perform an A* Search on a graph given a start and end node.
        * @param {Graph} graph
        * @param {GridNode} start
        * @param {GridNode} end
        * @param {Object} [options]
        * @param {bool} [options.closest] Specifies whether to return the
                   path to the closest node if the target is unreachable.
        * @param {Function} [options.heuristic] Heuristic function (see
        *          astar.heuristics).
        */
  public search = (
    graph: Graph,
    start: GridNode,
    end: GridNode
  ): GridNode[] => {
    const closest = graph.options?.closest || false;
    const openHeap = new BinaryHeap((node: GridNode) => node.f);
    let closestNode = start; // set the start node to be the closest if required

    start.h = start.point.manhattanDistanceTo(end.point);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {
      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      const currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        return this.pathTo(currentNode);
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node.
      const neighbors = graph.neighbors(currentNode);

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        const neighbor = neighbors[i];

        if (neighbor.closed || neighbor.weight == 0) {
          //0=wall
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        const gScore = currentNode.g + neighbor.getCost(currentNode);
        const beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h =
            neighbor.h || neighbor.point.manhattanDistanceTo(end.point);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (
              neighbor.h < closestNode.h ||
              (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
            ) {
              closestNode = neighbor;
            }
          }

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    if (closest) {
      return this.pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  };
}
