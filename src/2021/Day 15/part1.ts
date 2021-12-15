import * as fs from "fs";
import { AStar, Graph } from "../../common/algorithms/astar";

console.time("day15");

const risks = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .map((l) => l.split("").map((x) => parseInt(x)));

const graph = new Graph(risks);
console.log(graph.toString());
const astar = new AStar();
const route = astar.search(
  graph,
  graph.nodes.find((n) => n.point.x == 0 && n.point.y == 0),
  graph.nodes.find(
    (n) => n.point.x == risks[0].length - 1 && n.point.y == risks.length - 1
  )
);

console.log("Answer 1:", route[route.length - 1].f);

console.timeEnd("day15");
