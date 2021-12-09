import * as fs from "fs";

console.time("part1");

const rows: number[][] = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split("").map((x) => parseInt(x)));
//number of columns
const columns = rows[0].length;
const heights = rows.flatMap((x) => x);
//filter points -> check up, down, left && right heights
const lowPoints = heights.filter((height, index) => {
  const col = index % columns;
  const left = col == 0 ? -1 : index - 1;
  const right = col == columns - 1 ? -1 : index + 1;
  return (
    height < (heights[left] ?? 10) &&
    height < (heights[right] ?? 10) &&
    height < (heights[index + columns] ?? 10) &&
    height < (heights[index - columns] ?? 10)
  );
});

console.log(
  "Response",
  lowPoints.reduce((a, b) => (a += b + 1), 0)
);
console.timeEnd("part1");
