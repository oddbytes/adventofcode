import * as fs from "fs";
import { re } from "mathjs";

console.time("day8");
const trees = fs
  .readFileSync("./INPUT.txt", "utf8")
  .split("\r\n")
  .map((l) => l.split("").map(Number));

const part1 = () => {
  let visibleTrees = 0;
  for (let x = 1; x < trees[0].length - 1; x++)
    for (let y = 1; y < trees.length - 1; y++) {
      const row = trees[y];
      const column = trees.map((r) => r[x]);
      const tree = trees[y][x];
      //check row to x
      if (
        row.slice(0, x).every((t) => t < tree) ||
        row.slice(x + 1).every((t) => t < tree) ||
        column.slice(0, y).every((t) => t < tree) ||
        column.slice(y + 1).every((t) => t < tree)
      )
        visibleTrees++;
    }

  return visibleTrees + (trees[0].length - 1) * 2 + (trees.length - 1) * 2;
};

const part2 = () => {
  const scenicScores = [];
  //ignore edges
  trees.forEach((row, y) =>
    row.forEach((tree, x) => {
      const column = trees.map((r) => r[x]);

      let leftDistance = row
        .slice(0, x)
        .reverse()
        .findIndex((t) => t >= tree);
      leftDistance = leftDistance > -1 ? leftDistance + 1 : x;
      let scenicScore = leftDistance;

      let rightDistance = row.slice(x + 1).findIndex((t) => t >= tree);
      rightDistance =
        rightDistance > -1 ? rightDistance + 1 : row.length - x - 1;
      scenicScore *= rightDistance;

      let topDistance = column
        .slice(0, y)
        .reverse()
        .findIndex((t) => t >= tree);
      topDistance = topDistance > -1 ? topDistance + 1 : y;
      scenicScore *= topDistance;

      let bottomDistance = column.slice(y + 1).findIndex((t) => t >= tree);
      bottomDistance =
        bottomDistance > -1 ? bottomDistance + 1 : column.length - y - 1;
      scenicScore *= bottomDistance;

      //   console.log(
      //     `${tree}(${x},${y}) = ${scenicScore}`,
      //     topDistance,
      //     leftDistance,
      //     rightDistance,
      //     bottomDistance,
      //     scenicScore
      //   );

      scenicScores.push(scenicScore);
    })
  );

  return Math.max(...scenicScores);
};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day8");
