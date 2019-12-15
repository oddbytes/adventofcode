import { ITile, TileType, Tile } from "../Day 13/tiles";

export interface IMazeTile extends ITile {
  visited: boolean;
}

export class MazeTile extends Tile implements IMazeTile {
  public visited: boolean = false;
}
