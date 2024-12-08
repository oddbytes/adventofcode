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

//for each antenna type
//for each antena pair
//  get distance between them
//  calculate distance of each point of the map to the first antenna. If it's multiplus of the distance between antennas
//  and there's LOS between the two, it's an antinode
antennas.forEach((antennaPoints, antennaType) => {
  for (let antenna1 = 0; antenna1 < antennaPoints.length; antenna1++) {
    for (let antenna2 = 0; antenna2 < antennaPoints.length; antenna2++) {
      if (antenna1 == antenna2) continue;
      const distanceBetweenAntennas = antennaPoints[
        antenna1
      ].manhattanDistanceTo(antennaPoints[antenna2]);
      for (let row = 0; row < width; row++)
        for (let col = 0; col < width; col++) {
          const testPoint = new Point(col, row);
          if (antennaPoints[antenna1].equals(testPoint)) continue; //Don't test first antenna position
          const distanceToFirstAntenna =
            antennaPoints[antenna1].manhattanDistanceTo(testPoint);
          const distanceToSecondAntenna =
            antennaPoints[antenna2].manhattanDistanceTo(testPoint);

          const furthestAntenna =
            distanceToFirstAntenna > distanceToSecondAntenna
              ? antennaPoints[antenna1]
              : antennaPoints[antenna2];
          const closestAntenna = antennaPoints[antenna1].equals(furthestAntenna)
            ? antennaPoints[antenna2]
            : antennaPoints[antenna1];

          if (distanceToFirstAntenna % distanceBetweenAntennas == 0) {
            //Trce a segment from point to furthest antenna and check if closest antena is in line to check Line Of Sight

            const segment = new Segment(testPoint, furthestAntenna);
            if (segment.containsPoint(closestAntenna)) {
              if (!antinodes.has(antennaType))
                //set an antinode
                antinodes.set(antennaType, [testPoint]);
              else antinodes.get(antennaType).push(testPoint);
            }
          }
        }
    }
  }
});

//get different antinodes
const antinodeCoordinates = new Set<string>(
  [...antinodes].flatMap((antinode) => antinode[1].map((p) => p.toString()))
);
console.timeEnd("part");

//Get a visualizartion of the resulting grid of width*width, showing antinode's positions as # and the rest as .
for (let row = 0; row < width; row++) {
  let line = "";
  for (let col = 0; col < width; col++) {
    //if (antennas.get("T").find((a) => a.equals(point))) line += "T";
    if (antinodeCoordinates.has(new Point(col, row).toString())) line += "#";
    else line += ".";
  }
  console.log(line);
}

console.log(`Answer: ${antinodeCoordinates.size}`);
console.timeEnd("day");
