import { ITile, Tile } from "../Day 13/tiles";

export interface IMazeTile extends ITile {
  key?: string;
  door?: string;
  visited: boolean;
  distance: number;
}

export class MazeTile extends Tile implements IMazeTile {
  public key?: string;
  public door?: string;
  public visited = false;
  public distance = 0;
}
