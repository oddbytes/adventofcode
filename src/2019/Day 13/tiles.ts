import { IPoint, Point } from "../Day 3/SegmentCalculator";

export enum TileType {
  unknown = -1,
  empty = 0,
  wall = 1,
  block = 2,
  paddle = 3,
  ball = 4
}
export interface ITile {
  position: IPoint;
  type: TileType;
  symbol: string;
}

export class Tile implements ITile {
  public position: IPoint;
  public type: TileType;
  constructor(position?: IPoint, type?: TileType) {
    this.position = position ?? new Point(0, 0);
    this.type = type ?? TileType.unknown;
  }

  get symbol(): string {
    switch (this.type) {
      case TileType.wall:
        return "█";
      case TileType.ball:
        return "o";
      case TileType.block:
        return "▒";
      case TileType.paddle:
        return "-";
    }
    return " ";
  }
}
