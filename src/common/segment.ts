import { IPoint, Point } from "./point";

/**
 * A segment of a line
 */
export interface ISegment {
  start: IPoint;
  end: IPoint;
  manhattanLength: number;
  isHorizontal: boolean;
  isVertical: boolean;
  containsPoint(point: IPoint);
  /**
   * Return the angle of this segment relative to the horizontal axis
   */
  diamondAngle: number;
}

export class Segment implements ISegment {
  public start: IPoint = new Point(0, 0);
  public end: IPoint = new Point(0, 0);

  constructor(start: IPoint, end: IPoint) {
    this.start = start;
    this.end = end;
  }

  /**
   * Devuelve la longitud Manhattan del segmento
   */
  get manhattanLength(): number {
    return (
      Math.abs(this.start.x - this.end.x) + Math.abs(this.start.y - this.end.y)
    );
  }

  get diamondAngle(): number {
    const x = this.end.x - this.start.x;
    const y = this.end.y - this.start.y;
    const dia =
      y >= 0
        ? x >= 0
          ? y / (x + y)
          : 1 - x / (-x + y)
        : x < 0
        ? 2 - y / (-x - y)
        : 3 + x / (x - y);
    return dia;
  }

  get isHorizontal(): boolean {
    return this.start.y === this.end.y;
  }

  get isVertical(): boolean {
    return this.start.x === this.end.x;
  }

  public containsPoint(point: IPoint): boolean {
    // "cross-product" of vectors start -> pount and start -> end.
    const dxc = point.x - this.start.x;
    const dyc = point.y - this.start.y;

    const dxl = this.end.x - this.start.x;
    const dyl = this.end.y - this.start.y;

    const cross = dxc * dyl - dyc * dxl;

    // Point lies on the line if and only if cross is equal to zero.
    if (cross != 0) {
      return false;
    }

    // lies between the original points?
    // This can be easily done by comparing the x coordinates, if the line is "more horizontal than vertical", or y coordinates otherwise
    if (Math.abs(dxl) >= Math.abs(dyl)) {
      return dxl > 0
        ? this.start.x <= point.x && point.x <= this.end.x
        : this.end.x <= point.x && point.x <= this.start.x;
    } else {
      return dyl > 0
        ? this.start.y <= point.y && point.y <= this.end.y
        : this.end.y <= point.y && point.y <= this.start.y;
    }
  }
}
