import { IPoint3D, Point3D } from "./3dPoint";

export interface IMoon {
  position: IPoint3D;
  velocity: IPoint3D;
  energy: number;
}

export class Moon implements IMoon {
  public velocity = new Point3D(0, 0, 0);
  constructor(public position: IPoint3D) {}

  get energy() {
    const potentialEnergy =
      Math.abs(this.position.x) +
      Math.abs(this.position.y) +
      Math.abs(this.position.z);

    const kineticEnergy =
      Math.abs(this.velocity.x) +
      Math.abs(this.velocity.y) +
      Math.abs(this.velocity.z);

    return potentialEnergy * kineticEnergy;
  }
}
