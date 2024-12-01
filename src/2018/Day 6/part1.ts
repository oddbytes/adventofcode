import * as fs from "fs";
import { Point } from "../../common/point";
console.time("day6");
const locations = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((l) => {
    const parts = l.split(", ");
    return new Point(parseInt(parts[0]), parseInt(parts[1]));
  });
console.time("part1");
//Get  min and max x and y values. As location in the edges extend to infinite, we ignore them and reduce the grid by one
const minX = Math.min(...locations.map((l) => l.x)) + 1;
const maxX = Math.max(...locations.map((l) => l.x)) - 1;
const minY = Math.min(...locations.map((l) => l.y)) + 1;
const maxY = Math.max(...locations.map((l) => l.y)) - 1;
//This map will hold the number of tiles that are closest to each location (point)
const closestMap = new Map<Point, number>();
locations.forEach((l) => closestMap.set(l, 0));
//For each point of the map, calculate the manhattan distance to each location
for (let x = minX; x <= maxX; x++) {
  for (let y = minY; y <= maxY; y++) {
    //Calculate the manhattan distance to each location
    const distances = locations.map((l) =>
      l.manhattanDistanceToCoordinates(x, y),
    );

    //Find the minimum distance
    const minDistance = Math.min(...distances);
    //If there are multiple locations with the same minimum distance, skip this point
    if (distances.filter((d) => d == minDistance).length > 1) continue;
    //Find the location with the minimum distance
    const closestLocation = locations[distances.indexOf(minDistance)];
    //Increment the number of tiles that are closest to this location
    closestMap.set(closestLocation, closestMap.get(closestLocation) + 1);
  }
}

console.log(`Answer: ${Math.max(...closestMap.values())}`);
console.timeEnd("part1");
