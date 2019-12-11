export interface IPoint {
  x: number;
  y: number;
}

export class Point implements IPoint {
  public x: number = 0;
  public y: number = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * A segment of a line
 */
export interface ISegment {
  start: IPoint;
  end: IPoint;
  length: number;
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

  get length(): number {
    // Manhattah distance
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

export class SegmentCalculator {
  public getWireSegments(wire: string[]): ISegment[] {
    let currX = 0;
    let currY = 0;
    return wire.map(s => {
      const dir = s[0];
      const length = parseInt(s.substr(1));
      let finalX = currX;
      let finalY = currY;

      if (dir === "U") {
        finalY += length;
      }
      if (dir === "D") {
        finalY -= length;
      }
      if (dir === "L") {
        finalX -= length;
      }
      if (dir === "R") {
        finalX += length;
      }

      const segment = new Segment(
        new Point(currX, currY),
        new Point(finalX, finalY)
      );

      currX = finalX;
      currY = finalY;

      return segment;
    });
  }
}
