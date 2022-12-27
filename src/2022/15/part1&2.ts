import * as fs from "fs";
import { re } from "mathjs";
import { Point } from "../../common/point";
let mD = 0;
console.time("day15");
class SensorPair {
  get distance() {
    return this.sensor.manhattanDistanceTo(this.beacon);
  }
  constructor(public sensor: Point, public beacon: Point) {}
}
const parseSensors = () => {
  const reNumber = /-?\d+/g;
  const l = fs.readFileSync("./input.txt", "utf8").split("\r\n");

  return l.map((line) => {
    const coordinates = line.matchAll(reNumber);
    const sensor: Point = new Point(
      parseInt(coordinates.next().value[0]),
      parseInt(coordinates.next().value[0])
    );
    const beacon: Point = new Point(
      parseInt(coordinates.next().value[0]),
      parseInt(coordinates.next().value[0])
    );

    return new SensorPair(sensor, beacon);
  });
};

const coverage = (sensorMap: SensorPair[], y) => {
  //get all sensons with coverage in this line
  const sensorsWithCoverageOnLine = sensorMap.filter(
    (sensor) =>
      sensor.sensor.y + sensor.distance >= y &&
      sensor.sensor.y - sensor.distance <= y
  );

  // sensorsWithCoverageOnLine.forEach((sensor) =>
  //   console.log(
  //     sensor.sensor.toString(),
  //     sensor.beacon.toString(),
  //     sensor.distance,
  //     sensor.sensor.y + sensor.distance,
  //     sensor.sensor.y - sensor.distance
  //   )
  // );

  //Only works if all coverages are overlaping. But that will do for part1
  const coverageLimitsPerSensor = sensorsWithCoverageOnLine.map((sensor) => {
    const coverageX =
      2 * sensor.distance + 1 - 2 * Math.abs(sensor.sensor.y - y);
    //console.log(sensor.sensor.toString(), coverageX);
    return [
      sensor.sensor.x - (coverageX - 1) / 2,
      sensor.sensor.x + (coverageX - 1) / 2,
    ];
  });
  //console.log(coverageLimitsPerSensor);
  const beacons = new Set(
    sensorMap.filter((s) => s.beacon.y == y).map((s) => s.beacon.toString())
  );
  const coveredPoints =
    Math.max(...coverageLimitsPerSensor.map((c) => c[1])) -
    Math.min(...coverageLimitsPerSensor.map((c) => c[0])) +
    1 -
    beacons.size;

  return coveredPoints;
};

const isPointCovered = (sensorMap: SensorPair[], point: Point) =>
  sensorMap.some(
    (sensor) => sensor.sensor.manhattanDistanceTo(point) <= sensor.distance
  );

const getPointsOutOfRangeForSensor = (
  sensor: SensorPair,
  maxCoordinate: number
) => {
  console.time("getPointsOutOfRangeForSensor");
  const points: Set<string> = new Set();
  let xOffset = 0;
  let y = sensor.sensor.y - sensor.distance - 1;
  if (y < 0) y = 0;
  for (
    ;
    y <= sensor.sensor.y + sensor.distance + 1 && y <= maxCoordinate;
    y++
  ) {
    if (sensor.sensor.x + xOffset <= maxCoordinate)
      points.add(`${sensor.sensor.x + xOffset},${y}`);

    if (xOffset > 0 && sensor.sensor.x - xOffset > 0)
      points.add(`${sensor.sensor.x - xOffset},${y}`);

    if (y < sensor.sensor.y) xOffset++;
    else xOffset--;
  }
  console.timeEnd("getPointsOutOfRangeForSensor");
  return points;
};

const part1 = () => {
  const sensors = parseSensors();
  //return coverage(sensors, 10);

  return coverage(sensors, 2000000);
};

const part2 = () => {
  const sensors = parseSensors();
  let distressBeacon: Point;
  for (let i = 0; i < sensors.length; i++) {
    console.log(sensors[i].sensor.toString(), sensors[i].distance);
    const pointsToCheck = getPointsOutOfRangeForSensor(sensors[i], 4000000);
    //getPointsOutOfRangeForSensor(sensors[i], 20)
    for (const coord of pointsToCheck) {
      const [x, y] = coord.split(",").map(Number);
      // const point = new Point(
      //   parseInt(coord.split(",")[0]),
      //   parseInt(coord.split(",")[1])
      // );

      if (
        !sensors.some(
          (sensor) =>
            sensor.sensor.manhattanDistanceToCoordinates(x, y) <=
            sensor.distance
        )
      ) {
        distressBeacon = new Point(x, y);
        break;
      }
    }
    // pointsToCheck.
    // distressBeacon =    pointsToCheck.find((p) => !isPointCovered(sensors, p));
    if (distressBeacon) break;
  }
  return distressBeacon.x * 4000000 + distressBeacon.y;
};

console.time("part1");
console.log(`Part1 response: ${part1()}`);
console.timeEnd("part1");
console.time("part2");
console.log(`Part2 response: ${part2()}`);
console.timeEnd("part2");

console.timeEnd("day15");
