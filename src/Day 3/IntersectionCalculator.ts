import { IPoint, ISegment, Point } from "./SegmentCalculator";

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
   * @param segment1
   * @param segment2
   */
  public calculate(segment1: ISegment, segment2: ISegment): IPoint {
    const [{ start: start1, end: end1 }, { start: start2, end: end2 }] = [
      segment1,
      segment2
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
      const intersectionPoint = new Point(intersectionX, intersectionY);

      if (
        segment1.containsPoint(intersectionPoint) &&
        segment2.containsPoint(intersectionPoint)
      ) {
        return intersectionPoint;
      }
    }

    return undefined;
  }
}
