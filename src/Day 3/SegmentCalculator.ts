export interface IPoint {
  x: number;
  y: number;
}

/**
 * A segment of a line
 */
export interface ISegment {
  start: IPoint;
  end: IPoint;
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

      const segment: ISegment = {
        start: { x: currX, y: currY },
        end: { x: finalX, y: finalY }
      };
      currX = finalX;
      currY = finalY;

      // console.log(segment);
      return segment;
    });
  }
}
