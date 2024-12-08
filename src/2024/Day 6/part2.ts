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

//Check all positions of the exit route for a new obtacle, except guard initial position and current obstacles positions

let potentialLoopPositions = 0;
// [...exitRoutePositions].forEach((exitRoutePosition, index) => {
//   if (index > 0) {
//     //Ignore initial guard pos
//     obstaclesPositions.add(exitRoutePosition.split("*")[0]);
//     const positions = map.getExitRoute(guard, obstaclesPositions, dimensions);
//     // console.log(
//     //   "Adding obstacle at ",
//     //   exitRoutePosition.split("*")[0],
//     //   positions?.size
//     // );
//     // if (positions) [...positions].forEach((p) => console.log(p));
//     if (positions === null) potentialLoopPositions++;
//     // else console.log(positions.size);
//     obstaclesPositions.delete(exitRoutePosition.split("*")[0]);
//     //reset guard to next position of the original exit route
//     let tokens = exitRoutePosition.split("*");
//     guard.direction = parseInt(tokens[1]);
//     tokens = tokens[0].split(",");
//     guard.position.x = parseInt(tokens[0]);
//     guard.position.y = parseInt(tokens[1]);
//   }
// });

//Brute force> check  ALL positions in the map putting an obstacle
for (let row = 0; row < dimensions[0]; row++) {
  for (let col = 0; col < dimensions[1]; col++) {
    const currentPosition = new Point(row, col);
    if (
      !obstaclesPositions.has(currentPosition.toString()) &&
      currentPosition.toString() !== initialGuardPosition.toString()
    ) {
      obstaclesPositions.add(currentPosition.toString());

      const positions = map.getDifferentVisitedPositions(
        guard,
        obstaclesPositions,
        dimensions
      );
      //console.log("Adding obstacle at ", currentPosition.toString(), positions);

      if (positions === -1) potentialLoopPositions++;
      obstaclesPositions.delete(currentPosition.toString());
      //reset guard
      guard.direction = Direction.UP;
      guard.position = initialGuardPosition;
    }
  }
}

console.log(`Answer: ${potentialLoopPositions}`); //last position is not valid
console.timeEnd("part");
console.timeEnd("day");
