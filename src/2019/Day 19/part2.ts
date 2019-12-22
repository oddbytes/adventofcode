import { BeamInspector } from "./beamInspector";
import { Point } from "../Day 3/SegmentCalculator";

const beam = new BeamInspector();

beam.render(beam.getBeam(100));

const eobLines: number[] = [];
const sobLines: number[] = [];

const endOfBeamAtLine = (y: number): number => {
  let x = eobLines[y - 1] ?? 0;

  //find beam
  while (!beam.isInBeam(new Point(x, y))) {
    x++;
  }

  //find end of beam
  while (beam.isInBeam(new Point(x, y))) {
    x++;
  }
  eobLines[y] = x - 1;
  return eobLines[y];
};

const startOfBeamAtLine = (y: number): number => {
  let x = sobLines[y - 1] ?? 0;

  //find beam
  while (!beam.isInBeam(new Point(x, y))) {
    x++;
  }

  sobLines[y] = x;
  return sobLines[y];
};
//get upper Y line
let y = 25;
let x = endOfBeamAtLine(y);
const shipSize = 10;

let topRight = new Point(x, y);
let bottomLeft = new Point(x - shipSize + 1, y + shipSize - 1);

while (startOfBeamAtLine(y + shipSize - 1) > bottomLeft.x) {
  y += 1;
  x = endOfBeamAtLine(y);
  topRight = new Point(x, y);
  bottomLeft = new Point(x - shipSize + 1, y + shipSize - 1);
}
console.log(y);
console.log(topRight, bottomLeft);
console.log(bottomLeft.x * 10000 + topRight.y);
