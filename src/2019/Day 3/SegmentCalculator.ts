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
}

export class Segment implements ISegment {
  public start: IPoint = new Point(0, 0);
  public end: IPoint = new Point(0, 0);

  constructor(start: IPoint, end: IPoint) {
    if (start.y === end.y) {
      //horizontal
      this.start.x = Math.min(start.x, end.x);
      this.end.x = Math.max(start.x, end.x);
      this.start.y = this.end.y = start.y;
    }
    if (start.x === end.x) {
      //horizontal
      this.start.y = Math.min(start.y, end.y);
      this.end.y = Math.max(start.y, end.y);
      this.start.x = this.end.x = start.x;
    }
  }

  get length(): number {
    return this.isHorizontal
      ? this.end.x - this.start.x
      : this.end.y - this.start.y;
  }
  get isHorizontal(): boolean {
    return this.start.y === this.end.y;
  }

  get isVertical(): boolean {
    return this.start.x === this.end.x;
  }

  public containsPoint(point: IPoint): boolean {
    if (this.isHorizontal) {
      return (
        point.x >= this.start.x &&
        point.x <= this.end.x &&
        point.y == this.start.y
      );
    }

    if (this.isVertical) {
      return (
        point.y >= this.start.y &&
        point.y <= this.end.y &&
        point.x == this.start.x
      );
    }

    throw new Error("Invalid Segment, not horizontal or vertical");
  }
}

export class SegmentCalculator {
  public getSegments(wire: string[]): ISegment[] {
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
