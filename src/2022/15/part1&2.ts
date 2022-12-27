import * as fs from "fs";
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

const part1 = () => {
  const sensors = parseSensors();

  return coverage(sensors, 2000000);
};

const part2 = () => {
  return 0;
};

console.time("part1");
console.log(`Part1 response: ${part1()}`);
console.timeEnd("part1");
console.time("part2");
console.log(`Part2 response: ${part2()}`);
console.timeEnd("part2");

console.timeEnd("day15");
