import * as Graph from "node-dijkstra";

import { maze } from "./maze";
import { IPortalPassage, MazeSolver } from "./mazeSolver";

const mazeSolver = new MazeSolver(maze);
const passages: IPortalPassage[] = mazeSolver.getPortalConections(
  mazeSolver.tiles
);

interface IConnection {
  node: IGraphNode;
  distance: number;
}

interface IGraphNode {
  label: string;
  minDistance: number;
  connections: IConnection[];
  visited: boolean;
}

class GraphNode implements IGraphNode {
  public visited = false;
  public minDistance = Number.MAX_VALUE;
  public connections: IConnection[] = [];
  constructor(public label: string) {}
}

// Create graph
const nodes: IGraphNode[] = [];
passages.forEach(passage => {
  let originPortal = nodes.find(n => n.label == passage.portal1);

  if (!originPortal) {
    originPortal = new GraphNode(passage.portal1);
    nodes.push(originPortal);
  }

  let destPortal = nodes.find(n => n.label == passage.portal2);
  if (!destPortal) {
    destPortal = new GraphNode(passage.portal2);
    nodes.push(destPortal);
  }

  const originConnections = originPortal.connections.map(c => c.node.label);
  // if (!originConnections.includes(destPortal.label)) {
  originPortal.connections.push({
    node: destPortal,
    distance: passage.distance
  });
  // }

  const destConnections = destPortal.connections.map(c => c.node.label);
  // if (!destConnections.includes(originPortal.label)) {
  destPortal.connections.push({
    node: originPortal,
    distance: passage.distance
  });
  // }
});
const route = new Graph();

nodes.forEach(node => {
  const m = new Map();
  node.connections.forEach(c => m.set(c.node.label, c.distance));
  route.addNode(node.label, m);
});

console.log(route.path("AA", "ZZ", { cost: true }));
console.log("End");
