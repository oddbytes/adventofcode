import { IPoint, ISegment } from "./SegmentCalculator";

export class IntersectionCalculator {
  public getInstersections(
    segments1: ISegment[],
    segments2: ISegment[]
  ): IPoint[] {
    const intersectionPoints = segments1.map(s1 => {
      return segments2.map(s2 => this.calculate(s1, s2));
    });
    return intersectionPoints.reduce((a, b) => a.concat(b)).filter(ip => ip);
    // .filter(ip => ip.x != 0 && ip.y != 0);
  }

  /**
   * Devuelve el punto de interseccion de dos vectores definidas por los punto (x,y),(x,y)
   *
   * @param line1
   * @param line2
   */
  public calculate(line1: ISegment, line2: ISegment): IPoint {
    const [{ start: start1, end: end1 }, { start: start2, end: end2 }] = [
      line1,
      line2
    ];
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = [start1, end1];
    const [{ x: x3, y: y3 }, { x: x4, y: y4 }] = [start2, end2];

    // console.log(`x1:${x1} y1:${y1} x2:${x2} y2:${y2}`);
    // console.log(`x3:${x3} y3:${y3} x4:${x4} y4:${y4}`);

    const intersectionX =
      ((x2 * y1 - x1 * y2) * (x4 - x3) - (x4 * y3 - x3 * y4) * (x2 - x1)) /
      ((x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1));

    const intersectionY =
      ((x2 * y1 - x1 * y2) * (y4 - y3) - (x4 * y3 - x3 * y4) * (y2 - y1)) /
      ((x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1));

    if (!Number.isNaN(intersectionX) && !Number.isNaN(intersectionY)) {
      const intersectionPoint: IPoint = {
        x: intersectionX,
        y: intersectionY
      };

      if (
        this.isPointInSegment(intersectionPoint, line1) &&
        this.isPointInSegment(intersectionPoint, line2)
      ) {
        return intersectionPoint;
      }
    }

    return undefined;
  }

  /**
   * return true if the point is withing the segment of the line. Only valid for horizontal or vertical segments
   * @param point
   * @param segment
   */
  public isPointInSegment(point: IPoint, segment: ISegment): boolean {
    if (this.isHorizontal(segment)) {
      const start =
        segment.start.x < segment.end.x ? segment.start.x : segment.end.x;
      const end =
        segment.start.x < segment.end.x ? segment.end.x : segment.start.x;
      return point.x >= start && point.x <= end && point.y == segment.start.y;
    }

    if (this.isVertical(segment)) {
      const start =
        segment.start.y < segment.end.y ? segment.start.y : segment.end.y;
      const end =
        segment.start.y < segment.end.y ? segment.end.y : segment.start.y;
      return point.y >= start && point.y <= end && point.x == segment.start.x;
    }

    throw new Error("Invalid Segment, not horizontal or vertical");
  }

  private isHorizontal(segment: ISegment): boolean {
    return segment.start.y == segment.end.y;
  }
  private isVertical(segment: ISegment): boolean {
    return segment.start.x == segment.end.x;
  }
}
