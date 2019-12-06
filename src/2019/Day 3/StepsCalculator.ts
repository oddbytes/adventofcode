import { IPoint, ISegment } from "./SegmentCalculator";

export class StepsCalculator {
  /**
   * Returns the distance to the first intersection point in a wire
   * @param segments segments of the wire
   * @param intersections intersection points
   */
  public distanceToFirstIntersection(
    wire1: ISegment[],
    wire2: ISegment[],

    intersections: IPoint[]
  ): number {
    const firstIntersectedSegment = wire1.find(segment =>
      intersections.some(intersectionPoint =>
        segment.containsPoint(intersectionPoint)
      )
    );
    const intersectionPoint = intersections.find(intersectionPoint =>
      firstIntersectedSegment.containsPoint(intersectionPoint)
    );

    const distance1 = this.distanceToPoint(
      wire1,
      firstIntersectedSegment,
      intersectionPoint
    );

    //Find intersected segment in second wire
    const intersectedSegment2 = wire2.find(segment =>
      segment.containsPoint(intersectionPoint)
    );

    const distance2 = this.distanceToPoint(
      wire2,
      intersectedSegment2,
      intersectionPoint
    );

    return distance1 + distance2;
  }

  /**
   * Return the distance from (0,0) to interception point (crossing interceptedSegment in segments)
   * @param segments
   * @param interceptedSegment
   * @param intersectionPoint
   */
  private distanceToPoint(
    segments: ISegment[],
    interceptedSegment: ISegment,
    intersectionPoint: IPoint
  ) {
    const segmentIndex = segments.indexOf(interceptedSegment);

    //distance in intercepted segment to interception point
    let distance = interceptedSegment.isHorizontal
      ? intersectionPoint.x - interceptedSegment.start.x
      : intersectionPoint.y - interceptedSegment.start.y;

    //Length of full segments
    if (segmentIndex > 0)
      distance += segments
        .slice(0, segmentIndex)
        .reduce((prev, curr) => (prev += curr.length), 0);

    return distance;
  }
}
