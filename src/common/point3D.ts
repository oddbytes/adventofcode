import { IPoint, Point } from "./point";

export interface IPoint3D extends IPoint {
  z: number;
}

export class Point3D extends Point implements IPoint3D {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
    super(x, y);
  }

  public toString = (): string => `x:${this.x},y:${this.y},z:${this.z}`;
}
