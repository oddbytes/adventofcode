import { IMazeTile, MazeTile } from "../Day 15/mazeTile";

export enum PortalLocation {
  inner,
  outer
}

export interface IMazeTile20 extends IMazeTile {
  label: string;
  location: PortalLocation;
}

export class MazeTile20 extends MazeTile implements IMazeTile20 {
  public label: string = "";
  public location: PortalLocation = PortalLocation.inner;
}
