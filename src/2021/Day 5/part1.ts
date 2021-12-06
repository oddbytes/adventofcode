import { Segment } from "../../common/segment";
import * as fs from "fs";
import { Point } from "../../common/point";
console.time("part1");
//Get horizontal / vertical segments
const segments = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const coords = line.split(" -> ");
    const points = coords.flatMap((end) =>
      end.split(",").map((x) => parseInt(x))
    );

    return new Segment(
      new Point(points[0], points[1]),
      new Point(points[2], points[3])
    );
  })
  .filter((segment) => segment.isHorizontal || segment.isVertical);

//Get the points of the segments
const hotPoints = segments.flatMap((segment) => segment.points);

//create a map getting how many times each point appears
console.time("map");
const mapPoints = new Map<string, number>();
hotPoints.forEach((point) => {
  const value = mapPoints.has(point.toString())
    ? mapPoints.get(point.toString()) + 1
    : 1;
  mapPoints.set(point.toString(), value);
});
//get points appearing more than once
const duplicatePoints = [...mapPoints.values()].filter((p) => p > 1);
console.timeEnd("map");

console.log("Response", duplicatePoints.length);
console.timeEnd("part1");
