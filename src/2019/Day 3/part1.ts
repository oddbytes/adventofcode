import { IntersectionCalculator } from "./IntersectionCalculator";
import { SegmentCalculator } from "./SegmentCalculator";
import { wire1, wire2 } from "./wires";

const segmentCalculator = new SegmentCalculator();
const segments1 = segmentCalculator.getSegments(wire1);
const segments2 = segmentCalculator.getSegments(wire2);

const intersectionCalculator = new IntersectionCalculator();
const intersectionPoints = intersectionCalculator.getInstersections(
  segments1,
  segments2
);

intersectionPoints.forEach(ip =>
  console.log(`x:${ip.x} y:${ip.y} d:${Math.abs(ip.x) + Math.abs(ip.y)}`)
);

const distances = intersectionPoints
  .map(ip => Math.abs(ip.x) + Math.abs(ip.y))
  .sort((a, b) => a - b);

console.log("Distances:", ...distances);

console.log(
  "Min distance:",
  Math.min(...intersectionPoints.map(ip => Math.abs(ip.x) + Math.abs(ip.y)))
);
