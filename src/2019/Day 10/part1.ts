import { IPoint, Point, Segment } from "../Day 3/SegmentCalculator";
import { map } from "./map";

interface IAsteroid {
  /**
   * Coordinates of the asteroid
   */
  coordinates: IPoint;
  /**
   * Number of other asteroids in line of sight
   */
  inLineOfSight: number;
}

// Map the puzzle entry into points
const coordinates = map
  .map((line, row) => {
    return Array.from(line).map((char, col) =>
      char === "#" ? new Point(col, row) : null
    );
  })

  .reduce((a, b) => a.concat(b)) // flat
  .filter(p => p != null);

// For each asteroid, trace segments to the rest and check if any opther asteroid is contained into the segment
const asteroids: IAsteroid[] = coordinates.map(asteroidCoordinates => {
  const segments = coordinates
    .map(end => new Segment(asteroidCoordinates, end))
    .filter(s => s.length > 0); // Delete the segment where start=end

  // For each segment, check if there is any asteroid contained in t other tahs astar/end

  //   console.log(
  //     `\nAsteroid ${asteroidCoordinates.x},${asteroidCoordinates.y}, segmenst:${segments.length}`
  //   );

  const directSegments = segments.filter(segment => {
    const otherAsteroids = coordinates.filter(
      c =>
        !(
          (c.x == segment.start.x && c.y == segment.start.y) ||
          (c.x == segment.end.x && c.y == segment.end.y)
        )
    );

    const otherAsteroidinLOS = otherAsteroids.some(c =>
      segment.containsPoint(c)
    );
    // console.log(
    //   `Segment ${segment.start.x},${segment.start.y}-${segment.end.x},${segment.end.y} otherAsteroidsCount:${otherAsteroids.length} otherAsteroidsInLOS:${otherAsteroidinLOS}`
    // );
    return !otherAsteroidinLOS;
  });

  return {
    coordinates: asteroidCoordinates,
    inLineOfSight: directSegments.length
  };
});

const bestAsteroid = asteroids.sort(
  (a, b) => b.inLineOfSight - a.inLineOfSight
)[0];

console.log(
  `Best asteroid: ${bestAsteroid.coordinates.x}, ${bestAsteroid.coordinates.y} sees ${bestAsteroid.inLineOfSight} asteroids`
);
