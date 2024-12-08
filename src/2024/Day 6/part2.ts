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

//get the exit route for the initial map
const initialGuardPosition = new Point(guard.position.x, guard.position.y);
const initialGuardHeading = guard.direction;
const exitRoutePositions = map.getExitRoute(
  guard,
  obstaclesPositions,
  dimensions
);
//reset guard
guard.position = initialGuardPosition;
guard.direction = initialGuardHeading;

//Check all DIFFERENT positions of the exit route for a new obtacle, except guard initial position and current obstacles positions
//This is 10x faster than checkimg ALL maps positions
let potentialLoopPositions = 0;
const testedPositions = new Set<string>();
[...exitRoutePositions].forEach((exitRoutePosition, index) => {
  const position = exitRoutePosition.split("*")[0];
  if (index > 0) {
    //Ignore initial guard pos
    if (!testedPositions.has(position)) {
      //do not retry the same position with different guard headings
      obstaclesPositions.add(position);
      const positions = map.getExitRoute(guard, obstaclesPositions, dimensions);
      if (positions === null) potentialLoopPositions++;
      obstaclesPositions.delete(position);
      testedPositions.add(position);
    }
    //set guard to next position of the original exit route
    let tokens = exitRoutePosition.split("*");
    guard.direction = parseInt(tokens[1]);
    tokens = tokens[0].split(",");
    guard.position.x = parseInt(tokens[0]);
    guard.position.y = parseInt(tokens[1]);
  }
});

console.log(`Answer: ${potentialLoopPositions}`);
console.timeEnd("part");
console.timeEnd("day");
