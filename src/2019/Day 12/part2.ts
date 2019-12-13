import { lcm } from "mathjs";
import { Point3D } from "./3dPoint";
import { Moon } from "./moon";
import { startingPositions } from "./scanData";

/*
How many steps does it take to reach the first state that exactly matches a previous state?

Axis are independent. You need to calculate how many cycles takes an axis to return to its first state

Then calculate how many cycles would take the three axis to return to its  original state at the same time (least common multiple)

First, non-working attempt: calculate how many cycle takes each moon to return to first state. The lcm the four moons

*/

const moons = startingPositions.map(
  pos => new Moon(new Point3D(pos.x, pos.y, pos.z))
);

const axisCycles = new Point3D(-1, -1, -1);

let step = 0;

while (axisCycles.x < 0 || axisCycles.y < 0 || axisCycles.z < 0) {
  //   console.log(`\n Step ${step}`);
  //   moons.forEach(moon =>
  //     console.log(
  //       ` ${moon.position.x},${moon.position.y},${moon.position.z} ${moon.velocity.x},${moon.velocity.y},${moon.velocity.z}`
  //     )
  //   );

  // apply gravity
  moons.forEach((moon1, indexMoon1) =>
    moons.forEach((moon2, indexMoon2) => {
      if (indexMoon2 > indexMoon1) {
        Object.keys(moon1.position).forEach(axis => {
          if (moon1.position[axis] > moon2.position[axis]) {
            moon1.velocity[axis] -= 1;
            moon2.velocity[axis] += 1;
          } else if (moon1.position[axis] < moon2.position[axis]) {
            moon1.velocity[axis] += 1;
            moon2.velocity[axis] -= 1;
          }
        });
      }
    })
  );

  // apply velocity
  moons.forEach(moon => {
    Object.keys(moon.velocity).forEach(axis => {
      moon.position[axis] += moon.velocity[axis];
    });
  });

  // Calculate axis cycle
  // if all moons are in its starting position and all ts velocities are 0, grab the step
  Object.keys(axisCycles).forEach(axis => {
    if (
      moons.every(
        (moon, moonIndex) =>
          startingPositions[moonIndex][axis] == moon.position[axis] &&
          moon.velocity[axis] == 0 &&
          axisCycles[axis] < 0
      )
    ) {
      axisCycles[axis] = step + 1;
    }
  });

  step++;
}

Object.keys(axisCycles).forEach(axis => {
  console.log(`Axis ${axis}: ${axisCycles[axis]} cycles to starting position `);
});

console.log(
  "\nBy axis Response",
  lcm(axisCycles.x, axisCycles.y, axisCycles.z)
    .toLocaleString("es")
    .replace(/,/g, "")
);
