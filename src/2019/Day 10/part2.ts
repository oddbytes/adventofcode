import { IPoint, Point, Segment } from "../Day 3/SegmentCalculator";
import { map } from "./map";

// invert y coordinate to match diamon angle calculations (left, bottom)
const stationCoordinates: IPoint = new Point(31, -20);

const asteroidCoordinates = map
  .map((line, row) => {
    return Array.from(line).map((char, col) =>
      char === "#" ? new Point(col, -row) : null
    );
  })
  .reduce((a, b) => a.concat(b)) // flat
  .filter(p => p != null);

const asteroidVectors = asteroidCoordinates
  .map(asteroidCoords => ({
    vector: new Segment(stationCoordinates, asteroidCoords),
    destroyOrder: 0
  }))
  .filter(a => a.vector.length > 0)
  .sort((a, b) => b.vector.diamondAngle - a.vector.diamondAngle);

//sort by diamond angle 4 to 0 (descending)

// Diamond angle
//       1
//       |
//    2--+--0
//       |
//       3
//Find first asteroid in diamon angle 1
let currentIndex = asteroidVectors.findIndex(a => a.vector.diamondAngle == 1);
let destroyedAsteroids = 0;
//Destr0y them ALL!!!
while (asteroidVectors.some(a => a.destroyOrder == 0)) {
  //from all asteroids in that angle,destroy the closest
  const currentAngle = asteroidVectors[currentIndex].vector.diamondAngle;
  const asteroidtoDestroy = asteroidVectors
    .filter(a => a.vector.diamondAngle == currentAngle && a.destroyOrder == 0)
    .sort((a, b) => a.vector.length - b.vector.length)[0];
  asteroidtoDestroy.destroyOrder = ++destroyedAsteroids;
  console.log(
    `${asteroidtoDestroy.destroyOrder}@${
      asteroidtoDestroy.vector.end.x
    },${-asteroidtoDestroy.vector.end.y}`
  );
  currentIndex = asteroidVectors.findIndex(
    a => a.vector.diamondAngle < currentAngle && a.destroyOrder == 0
  );
  if (currentIndex == -1)
    currentIndex = asteroidVectors.findIndex(
      a => a.vector.diamondAngle < 4 && a.destroyOrder == 0
    );
}

const asteroid200 = asteroidVectors.find(a => a.destroyOrder == 200);
console.log(
  `200th destroyed asteroid:${asteroid200.vector.end.x} ${-asteroid200.vector
    .end.y}, response to puzzle ${asteroid200.vector.end.x * 100 +
    -asteroid200.vector.end.y}`
);
