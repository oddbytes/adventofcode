import * as fs from "fs";
import { Point } from "../../common/point";

//What is the size of the region containing all locations which have a total distance to all given coordinates of less than 10000?
console.time("part2");

const locations = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((l) => {
    const parts = l.split(", ");
    return new Point(parseInt(parts[0]), parseInt(parts[1]));
  });
console.time("part1");
//Get  min and max x and y values. The safe region kmust be a inner one
const minX = Math.min(...locations.map((l) => l.x)) + 1;
const maxX = Math.max(...locations.map((l) => l.x)) - 1;
const minY = Math.min(...locations.map((l) => l.y)) + 1;
const maxY = Math.max(...locations.map((l) => l.y)) - 1;
//This map will hold the sum of the manhatan distances to the locations

let safeRegionSize = 0;
//For each point of the map, calculate the manhattan distance to each location
for (let x = minX; x <= maxX; x++) {
  for (let y = minY; y <= maxY; y++) {
    //Calculate the manhattan distance to each location
    let sumOfDistances = 0;
    for (let i = 0; i < locations.length; i++) {
      sumOfDistances += locations[i].manhattanDistanceToCoordinates(x, y);
      if (sumOfDistances > 9999) break; //Break the loop early to save time if sum of distances exceedes maximum
    }
    // This is the same calculation with map/reduce, but takes 2x the time as doesn't break early:
    // const sumOfDistances = locations
    //   .map((l) => l.manhattanDistanceToCoordinates(x, y))
    //   .reduce((a, b) => a + b);
    //If sum of distancex <10000 increment safe region area
    if (sumOfDistances < 10000) {
      safeRegionSize++;
    }
  }
}

console.log(`Answer: ${safeRegionSize}`);

console.timeEnd("part2");
