import { IPoint3D } from "../2019/Day 12/3dPoint";

export interface IPoint4D extends IPoint3D {
  w: number;
}

export class Point4D implements IPoint4D {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {}

  public toString = (): string =>
    `x:${this.x},y:${this.y},z:${this.z},w:${this.w}`;
}
