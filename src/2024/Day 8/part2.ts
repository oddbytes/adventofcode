import * as fs from "fs";
import { Point } from "../../common/point";
import { Segment } from "../../common/segment";

console.time("day");

//get a Map <string, Point[]> from entry with the coordinates of each antenna type
const antennas = new Map<string, Point[]>();
let width = 0;
fs.readFileSync("./inputSample2.txt", "utf8")
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
console.log("width", width);
console.time("part");
const antinodes = new Map<string, Point[]>();
//for each antenna type
//get one antenna and repect each other
//  get distance between them
//  calculate distance of each point of the map to the first antenna. If it's multiplus of the distance between antennas
//  and there s LOS bewewwn the two, it's an antinode
antennas.forEach((antennaPoints, antennaType) => {
  for (let antenna1 = 0; antenna1 < antennaPoints.length; antenna1++) {
    for (let antenna2 = 0; antenna1 < antennaPoints.length; antenna1++) {
      if (antenna1 == antenna2) continue;
      const distanceBetweenAntennas = antennaPoints[
        antenna1
      ].manhattanDistanceTo(antennaPoints[antenna2]);
      //const segment = new Segment(antennaPoints[antenna1], antennaPoints[antenna2]);
      for (let row = 0; row < width; row++)
        for (let col = 0; col < width; col++) {
          if (antennaPoints[antenna1].equals(new Point(col, row))) continue; //Don't test first antenna position
          const point = new Point(col, row);
          const distanceToFirstAntenna =
            antennaPoints[antenna1].manhattanDistanceTo(point);
          const distanceToSecondAntenna =
            antennaPoints[antenna2].manhattanDistanceTo(point);

          //check if any of the distances is half of other distance

          if (distanceToFirstAntenna % distanceBetweenAntennas == 0) {
            //Trce a segment from point to furthest antenna and check if closest antena is in line
            const furthestAntenna =
              distanceToFirstAntenna > distanceToSecondAntenna
                ? antennaPoints[antenna1]
                : antennaPoints[antenna2];
            const closestAntenna =
              distanceToFirstAntenna < distanceToSecondAntenna
                ? antennaPoints[antenna1]
                : antennaPoints[antenna2];
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

  // for (let row = 0; row < width; row++)
  //   for (let col = 0; col < width; col++) {
  //     const point = new Point(col, row);
  //     const distances = antennaPoints.map((antennaPoint) =>
  //       antennaPoint.manhattanDistanceTo(point)
  //     );
  //     //check if any of the distances is half of other distance
  //     // for (let i = 0; i < distances.length; i++) {
  //     //   for (let j = i + 1; j < distances.length; j++) {
  //     //     if (
  //     //       distances[i] * 2 == distances[j] ||
  //     //       distances[i] / 2 == distances[j]
  //     //     ) {
  //     //       //Trce a segment from point to furthest antenna and check if closest antena is in line
  //     //       const furthestAntenna =
  //     //         distances[i] > distances[j] ? antennaPoints[i] : antennaPoints[j];
  //     //       const closestAntenna =
  //     //         distances[i] < distances[j] ? antennaPoints[i] : antennaPoints[j];
  //     //       const segment = new Segment(point, furthestAntenna);
  //     //       if (segment.containsPoint(closestAntenna))
  //     //         if (!antinodes.has(antennaType))
  //     //           //set an antinode
  //     //           antinodes.set(antennaType, [point]);
  //     //         else antinodes.get(antennaType).push(point);
  //     //     }
  //     //   }
  //     // }
  //   }
});

antinodes.forEach((antinodePoints, antinodeType) => {
  console.log(
    "Antinode",
    antinodeType,
    antinodePoints.map((p) => p.toString())
  );
});

const antinodeCoordinates = new Set<string>(
  [...antinodes].flatMap((antinode) => antinode[1].map((p) => p.toString()))
);
console.log(antinodeCoordinates);

console.log(`Answer: ${antinodeCoordinates.size}`);
console.timeEnd("part");
console.timeEnd("day");
