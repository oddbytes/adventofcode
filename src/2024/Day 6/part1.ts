import * as fs from "fs";
import { Point } from "../../common/point";
import { Direction, Guard, MapRouting } from "./mapRouting";

console.time("day");

const guard = new Guard(new Point(0, 0), Direction.UP);
let dimensions = [];
const obstaclesPositions = new Set<string>();
fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .forEach((row, rowIndex, rows) => {
    row.split("").forEach((cell, colIndex) => {
      if (cell != ".") {
        const point = new Point(colIndex, rowIndex);
        if (cell === "^") {
          guard.position = point;
          dimensions = [row.length, rows.length]; //Get the dimensions of the maze one time
        } else if (cell === "#") {
          obstaclesPositions.add(point.toString());
        }
      }
    });
  });
//blocks contains the coordinates of the obstacles
//dimensions the size x,y of the maze
console.time("part");
const map = new MapRouting();
const exitRoutePositions = map.getExitRoute(
  guard,
  obstaclesPositions,
  dimensions
);
//remove the heading part to get the different visited positions
const differentPositions = new Set<string>();
[...exitRoutePositions].forEach((position) => {
  differentPositions.add(position.split("*")[0]);
});
console.log(`Answer: ${differentPositions.size}`);
console.timeEnd("part");
console.timeEnd("day");
