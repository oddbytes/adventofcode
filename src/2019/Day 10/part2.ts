import { IPoint, Point, Segment } from "../Day 3/SegmentCalculator";
import { map } from "./map";

enum FireSector {
  up = 0,
  right = 1,
  down = 2,
  left = 3
}

const multiplicator = 10;

// const stationCoordinates: IPoint = new Point(31, 20);
const stationCoordinates: IPoint = new Point(
  8 * multiplicator,
  3 * multiplicator
);
// const stationCoordinates: IPoint = new Point(
//   11 * multiplicator,
//   13 * multiplicator
// );
const asteroidCoordinates = map
  .map((line, row) => {
    return Array.from(line).map((char, col) =>
      char === "#" ? new Point(col * multiplicator, row * multiplicator) : null
    );
  })
  .reduce((a, b) => a.concat(b)) // flat
  .filter(p => p != null);

// get map dimensions

const mapWidth = map[0].length * multiplicator * 5;
const mapHeight = map.length * multiplicator * 5;

// Let put the station in the center
// mapWidth += stationCoordinates.x - (mapWidth - stationCoordinates.x);

let fireSector: FireSector = FireSector.up;

// start rotating and firing!

let destroyedAsteroids = 0;
let asteroidtoDestroy = null;

const angle = 90;

const pointInCircle = (
  center: IPoint,
  radius: number,
  angleInDegrees: number
): IPoint =>
  new Point(
    center.x +
      Math.trunc(radius * Math.cos((angleInDegrees * Math.PI) / 180.0)),
    center.y - Math.trunc(radius * Math.sin((angleInDegrees * Math.PI) / 180.0))
  );
const laserTarget = new Point(stationCoordinates.x, 0);
console.log(
  `Station @ ${stationCoordinates.x},${stationCoordinates.y}  Map width:${mapWidth}  Height:${mapHeight}`
);
while (destroyedAsteroids < 200 && asteroidCoordinates.length > 1) {
  // Segment from station to laser
  // const laserTarget = pointInCircle(stationCoordinates, mapHeight, angle);

  const laserSegment = new Segment(stationCoordinates, laserTarget);
  // Find asteroid in laserSegment
  const asteroidsInFireLine = asteroidCoordinates.filter(asteroidCoord =>
    laserSegment.containsPoint(asteroidCoord)
  );

  asteroidtoDestroy = null;
  if (asteroidsInFireLine.length > 1) {
    // Find closest asteroid
    const closestAsteroid = asteroidsInFireLine
      .map(coordinates => ({
        coordinates,
        distance:
          Math.abs(stationCoordinates.x - coordinates.x) +
          Math.abs(stationCoordinates.y - coordinates.y)
      }))
      .filter(asteroid => asteroid.distance > 0) // dont destroy the base!!
      .sort((a, b) => a.distance - b.distance)[0];

    // Destroy!

    asteroidtoDestroy = asteroidCoordinates.find(
      a => closestAsteroid.coordinates == a
    );

    asteroidCoordinates.splice(
      asteroidCoordinates.indexOf(asteroidtoDestroy),
      1
    );

    destroyedAsteroids += 1;
  }
  if (asteroidtoDestroy) {
    console.log(
      // `Target: ${laserTarget.x} ${laserTarget.y} Destroy ${asteroidtoDestroy.x},${asteroidtoDestroy.y} Destroyed:${destroyedAsteroids}`
      `${destroyedAsteroids} @${asteroidtoDestroy.x /
        multiplicator},${asteroidtoDestroy.y / multiplicator} Target: ${
        laserTarget.x
      },${laserTarget.y}  Firesector:${fireSector} Left asteroids:${
        asteroidCoordinates.length
      }`
    );
  }
  // rotate gun
  //   if (++angle > 360) {
  //     angle = 0;
  //   }
  switch (fireSector) {
    case FireSector.up: {
      if (++laserTarget.x > mapWidth) {
        fireSector = FireSector.right;
        laserTarget.x = mapWidth + 1;
        laserTarget.y = 1;
        console.log("Firesector change:" + fireSector);
      }

      break;
    }
    case FireSector.right: {
      if (++laserTarget.y > mapHeight) {
        fireSector = FireSector.down;
        laserTarget.y = mapHeight + 1;
        laserTarget.x = mapWidth - 1;
        console.log("Firesector change:" + fireSector);
      }

      break;
    }
    case FireSector.down: {
      if (--laserTarget.x < 0) {
        fireSector = FireSector.left;
        laserTarget.x = 0;
        laserTarget.y = mapHeight - 1;
        console.log("Firesector change:" + fireSector);
      }

      break;
    }
    case FireSector.left: {
      if (--laserTarget.y < 0) {
        fireSector = FireSector.up;
        laserTarget.y = 0;
        laserTarget.x = 1;
        console.log("Firesector change:" + fireSector);
      }

      break;
    }
  }
}

console.log(
  `200th destroyed asteroid:${asteroidtoDestroy.x} ${asteroidtoDestroy.y}`
);
