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

  public get area(): number {
    return (this.end.x - this.start.x) * (this.end.y - this.start.y);
  }
  public overlappingArea(rectangle: IRectangle): number {
    const { x: left1, y: top1 } = this.start;
    const { x: right1, y: bottom1 } = this.end;
    const { x: left2, y: top2 } = rectangle.start;
    const { x: right2, y: bottom2 } = rectangle.end;

    if (right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2)
      return 0;

    const width = right1 > right2 ? right2 - left1 : right1 - left2;
    const height = bottom1 > bottom2 ? bottom2 - top1 : bottom1 - top2;
    return width * height;
    return (
      Math.max(0, Math.min(right2, right1) - Math.max(left2, left1)) *
      Math.max(0, Math.min(bottom2, bottom1) - Math.max(top2, top1))
    );
  }
}
