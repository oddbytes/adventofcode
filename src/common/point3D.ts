import { IPoint } from "./point";

export interface IPoint3D extends IPoint {
  z: number;
}

export class Point3D implements IPoint3D {
  constructor(public x: number, public y: number, public z: number) {}

  public toString = (): string => `x:${this.x},y:${this.y},z:${this.z}`;
}
