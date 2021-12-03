import { IPoint } from "./point";

export interface IPoint3D extends IPoint {
  z: number;
}

export class Point3D implements IPoint3D {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  public toString = (): string => `x:${this.x},y:${this.y},z:${this.z}`;
}
