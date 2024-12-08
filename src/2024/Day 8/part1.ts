import * as fs from "fs";
import { Point } from "../../common/point";
import { Segment } from "../../common/segment";

console.time("day");

//get a Map <string, Point[]> from entry with the coordinates of each antenna type
const antennas = new Map<string, Point[]>();
let width = 0;
fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .forEach((row, rowIndex) => {
    width = rowIndex;
    row.split("").forEach((antennaType, colIndex) => {
      if (antennaType != ".") {
        const point = new Point(colIndex, rowIndex);
        if (!antennas.has(antennaType)) antennas.set(antennaType, [point]);
        else antennas.get(antennaType).push(point);
      }
    });
  });
width++;

console.time("part");
const antinodes = new Map<string, Point[]>();
//for each antenna type calculate the distance of each position of the map to the antennas of that type
antennas.forEach((antennaPoints, antennaType) => {
  for (let row = 0; row < width; row++)
    for (let col = 0; col < width; col++) {
      const point = new Point(col, row);
      const distances = antennaPoints.map((antennaPoint) =>
        antennaPoint.manhattanDistanceTo(point)
      );
      //check if any of the distances is half of other distance
      for (let i = 0; i < distances.length; i++) {
        for (let j = i + 1; j < distances.length; j++) {
          if (
            distances[i] * 2 == distances[j] ||
            distances[i] / 2 == distances[j]
          ) {
            //Trce a segment from point to furthest antenna and check if closest antena is in line
            const furthestAntenna =
              distances[i] > distances[j] ? antennaPoints[i] : antennaPoints[j];
            const closestAntenna =
              distances[i] < distances[j] ? antennaPoints[i] : antennaPoints[j];
            const segment = new Segment(point, furthestAntenna);
            if (segment.containsPoint(closestAntenna))
              if (!antinodes.has(antennaType))
                //set an antinode
                antinodes.set(antennaType, [point]);
              else antinodes.get(antennaType).push(point);
          }
        }
      }
    }
});

// antinodes.forEach((_antinodePoints, _antinodeType) => {
//   // console.log(
//   //   "Antinode",
//   //   antinodeType,
//   //   antinodePoints.map((p) => p.toString())
//   // );
// });

const antinodeCoordinates = new Set<string>(
  [...antinodes].flatMap((antinode) => antinode[1].map((p) => p.toString()))
);
// console.log(antinodeCoordinates);

console.log(`Answer: ${antinodeCoordinates.size}`);
console.timeEnd("part");
console.timeEnd("day");
