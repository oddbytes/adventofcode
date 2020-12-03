import { IPoint } from "../../2019/Day 3/SegmentCalculator";

/**
 * Defines a rectangle by its top-left and bottom-right coordinates
 */
export interface IRectangle {
  /**
   * Top-left coordinates
   */
  start: IPoint;
  /**
   * Bottom-right coordinates
   */
  end: IPoint;
  /**
   * Returns the overlapping area with a second rectangle
   */
  overlappingArea(rectangle: IRectangle);
}

export class Rectangle implements IRectangle {
  public start: IPoint;
  public end: IPoint;

  constructor(left: number, top: number, width: number, height: number) {
    this.start = { x: left, y: top };
    this.end = { x: left + width, y: top + height };
  }

  private overlaps(rectangle: IRectangle): boolean {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;
    const { x: x3, y: y3 } = rectangle.start;
    const { x: x4, y: y4 } = rectangle.end;

    return x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
  }
  public overlappingArea(rectangle: IRectangle): number {
    //if (!this.overlaps(rectangle)) return 0;

    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;
    const { x: x3, y: y3 } = rectangle.start;
    const { x: x4, y: y4 } = rectangle.end;

    const overlapX = x3 <= x1 ? (x4 <= x2 ? x4 - x1 : x2 - x1) : x4 <= x2 ? x4 - x3 : x2 - x3;
    const overlapY = y3 <= y1 ? (y4 <= y2 ? y4 - y1 : y2 - y1) : y4 <= y2 ? y4 - y3 : y2 - y3;

    return overlapX * overlapY;
  }
}
