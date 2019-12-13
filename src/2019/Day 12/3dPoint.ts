import { IPoint } from "../Day 3/SegmentCalculator";

export interface IPoint3D extends IPoint {
  z: number;
}

export class Point3D implements IPoint3D {
  constructor(public x: number, public y: number, public z: number) {}
}
