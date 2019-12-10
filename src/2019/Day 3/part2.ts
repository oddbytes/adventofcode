import { IntersectionCalculator } from "./IntersectionCalculator";
import { SegmentCalculator } from "./SegmentCalculator";
import { StepsCalculator } from "./StepsCalculator";
import { wire1, wire2 } from "./wires";

const segmentCalculator = new SegmentCalculator();
const segments1 = segmentCalculator.getWireSegments(wire1);
const segments2 = segmentCalculator.getWireSegments(wire2);

const intersectionCalculator = new IntersectionCalculator();

const intersectionPoints = intersectionCalculator.getInstersections(
  segments1,
  segments2
);

intersectionPoints.forEach(ip =>
  console.log(`x:${ip.x} y:${ip.y} d:${Math.abs(ip.x) + Math.abs(ip.y)}`)
);

const stepsCalculator = new StepsCalculator();

// Follow first wire
const d1 = stepsCalculator.distanceToFirstIntersection(
  segments1,
  segments2,
  intersectionPoints
);
console.log("Following first wire:", d1);
// Following second wire
const d2 = stepsCalculator.distanceToFirstIntersection(
  segments2,
  segments1,
  intersectionPoints
);
console.log("Following second wire:", d2);
console.log("Min steps:", Math.min(d1, d2));
