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
  currentPath.push(start);
  return dfs(start, destiny, currentPath);
};

const dfs = (origin: INode, destiny: INode, currentPath: INode[]): string[] => {
  const foundPaths: string[] = [];
  if (origin.name.toLocaleLowerCase() == origin.name && origin.name != "end")
    //small cave
    origin.visited = 1;

  if (origin.name == destiny.name) {
    //path found
    return [currentPath.map((n) => n.name).join(",")];
  }

  for (const node of origin.adjacentNodes) {
    if (node.visited == 0) {
      currentPath.push(node);
      foundPaths.push(...dfs(node, destiny, currentPath));
      currentPath.pop();
    }
  }

  origin.visited = 0;
  return foundPaths;
};

const paths = getAllPaths(
  graph.find((n) => n.name == "start"),
  graph.find((n) => n.name == "end")
);

console.log(paths.length);

console.timeEnd("part1");
