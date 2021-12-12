import * as fs from "fs";

console.time("part1");

interface INode {
  name: string;
  visited: number;
  adjacentNodes: INode[];
}

const graph: INode[] = [];
fs.readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .forEach((line) => {
    const [origin, destiny] = line.split("-");
    const dest = graph.find((n) => n.name == destiny) ?? {
      name: destiny,
      visited: 0,
      adjacentNodes: [],
    };

    const or = graph.find((n) => n.name == origin) ?? {
      name: origin,
      visited: 0,
      adjacentNodes: [],
    };
    if (or.adjacentNodes.length == 0) graph.push(or);
    if (dest.adjacentNodes.length == 0) graph.push(dest);

    or.adjacentNodes.push(dest);
    dest.adjacentNodes.push(or);
  });

const getAllPaths = (start: INode, destiny: INode): string[] => {
  const currentPath: INode[] = [];
  start.visited = 100; //start is a special case, doesn't compute as a visitable node
  currentPath.push(start);
  return dfs(start, destiny, currentPath);
};

const dfs = (
  origin: INode,
  destiny: INode,
  currentPath: INode[],
  smallCaveVisitedTwoTimes = false
): string[] => {
  const foundPaths: string[] = [];

  if (origin.name.toLocaleLowerCase() == origin.name && origin.name != "end")
    //small cave
    origin.visited++;

  if (origin.name == destiny.name) {
    //path found
    return [currentPath.map((n) => n.name).join(",")];
  }

  if (!smallCaveVisitedTwoTimes)
    //Once a small cave is visited twice in this path, don't allow it any more
    smallCaveVisitedTwoTimes = origin.visited == 2;

  for (const node of origin.adjacentNodes) {
    if (node.visited == 0 || (node.visited == 1 && !smallCaveVisitedTwoTimes)) {
      currentPath.push(node);
      foundPaths.push(
        ...dfs(node, destiny, currentPath, smallCaveVisitedTwoTimes)
      );
      currentPath.pop();
    }
  }
  //unmark visited after recursion
  if (origin.visited > 0) origin.visited--;

  return foundPaths;
};

const paths = getAllPaths(
  graph.find((n) => n.name == "start"),
  graph.find((n) => n.name == "end")
);

console.log(paths.length);

console.timeEnd("part1");
