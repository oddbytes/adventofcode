import { Point } from "../../common/point";

export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT
}
const direction: Record<Direction, number[]> = {
  2: [0, 1],
  1: [1, 0],
  0: [0, -1],
  3: [-1, 0]
};

export class Guard {
  constructor(
    public position: Point,
    public direction: Direction
  ) {}
}

export class MapRouting {
  /**
   * Return the collection of points and headings of the exit route, or null if theres is a loop
   * @param guard Guard position and heading
   * @param obstaclesPositions coordinares of obstacles
   * @param dimensions map dimensions x,y
   * @returns codfied path (x,y*heading)
   */
  public getExitRoute = (
    guard: Guard,
    obstaclesPositions: Set<string>,
    dimensions: number[]
  ) => {
    let positions = new Set<string>(); //Use a set to count only different poistions
    positions.add(guard.position.toString() + "*" + guard.direction);
    while (true) {
      const nextPosition = new Point(
        guard.position.x + direction[guard.direction][0],
        guard.position.y + direction[guard.direction][1]
      );
      if (
        nextPosition.x < 0 ||
        nextPosition.x >= dimensions[0] ||
        nextPosition.y < 0 ||
        nextPosition.y >= dimensions[1]
      )
        return positions; //out of the map

      if (positions.has(nextPosition.toString() + "*" + guard.direction)) {
        return null; //loop detected
      }

      if (obstaclesPositions.has(nextPosition.toString())) {
        guard.direction = (guard.direction + 1) % 4; //turn, restart enum if direction>3
      } else {
        guard.position = nextPosition;
        positions.add(guard.position.toString() + "*" + guard.direction);
      }
    }
  };
}
