import * as deepcopy from "deepcopy";
import * as Graph from "node-dijkstra";
import { TileType } from "../Day 13/tiles";
import { IPortalPassage, MazeSolver } from "./mazeSolver";
import { IMazeTile20, PortalLocation } from "./mazeTile";
import { maze } from "./recursiveMaze";

const mazeSolver = new MazeSolver(maze);

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
const createGraph = (passages: IPortalPassage[]): Graph => {
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

  // graph level 0
  // al outer portals except for ZZ and AA are closed

  const route = new Graph();

  nodes.forEach(node => {
    const m = new Map();
    node.connections.forEach(c => m.set(c.node.label, c.distance));
    route.addNode(node.label, m);
  });

  return route;
};

const tilesLevel0: IMazeTile20[] = deepcopy(mazeSolver.tiles);
const tilesLevelN: IMazeTile20[] = deepcopy(mazeSolver.tiles);

// close all outer tiles in level 0
tilesLevel0
  .filter(
    t =>
      t.location == PortalLocation.outer && t.label != "AA" && t.label != "ZZ"
  )
  .forEach(t => {
    t.type = TileType.wall;
    t.label = "";
  });

// close tiles AA and ZZ in other levels

tilesLevelN
  .filter(t => t.label == "AA" || t.label == "ZZ")
  .forEach(t => {
    t.type = TileType.wall;
    t.label = "";
  });

const passagesLevel0: IPortalPassage[] = mazeSolver.getPortalConections(
  tilesLevel0
);
const passagesLevelN: IPortalPassage[] = mazeSolver.getPortalConections(
  tilesLevelN
);

const allPassages = mazeSolver.getPortalConections(mazeSolver.tiles);

const fullGraph = createGraph(allPassages);
const graph0 = createGraph(passagesLevel0);
const graphN = createGraph(passagesLevelN);

const plainPath = fullGraph.path("AA", "ZZ");

const level = 0;

// First step
const firstNodes = passagesLevel0
  .filter(n => n.portal1 == "AA")
  .map(n => n.portal2);

const lastNodes = passagesLevel0
  .filter(n => n.portal2 == "ZZ")
  .map(n => n.portal1);

console.log(graphN.path(firstNodes[0], lastNodes[0], { cost: true }));

console.log("End");
