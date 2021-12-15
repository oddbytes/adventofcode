import * as fs from "fs";
import { AStar, Graph } from "../../common/algorithms/astar";

console.time("part2");

const risks = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .map((l) => l.split("").map((x) => parseInt(x)));

const increaseRisks = (risks: number[][], increase: number): number[][] =>
  risks.map((row) =>
    row.map((n) => (n + increase > 9 ? n + increase - 9 : n + increase))
  );

//Create full map
//Cache increased risks map
const increasedRisks = [...Array(8)].map((_i, index) =>
  increaseRisks(risks, index + 1)
);

const originalHeigth = risks.length;
for (let row = 0; row < 5; row++) {
  if (row > 0) {
    //add first col array
    for (let r = 0; r < originalHeigth; r++)
      risks.push(increasedRisks[row - 1][r]);
  }
  for (let col = 1; col < 5; col++) {
    for (let r = 0; r < originalHeigth; r++)
      risks[row * originalHeigth + r].push(...increasedRisks[row + col - 1][r]);
  }
}

const graph = new Graph(risks);

const astar = new AStar();
console.time("a*");
const route = astar.search(
  graph,
  graph.nodes.find((n) => n.point.x == 0 && n.point.y == 0),
  graph.nodes.find(
    (n) => n.point.x == risks[0].length - 1 && n.point.y == risks.length - 1
  )
);
console.timeEnd("a*");

console.log("Answer:", route[route.length - 1].f);

console.timeEnd("part2");
