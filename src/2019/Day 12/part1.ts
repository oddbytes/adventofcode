import { Point3D } from "./3dPoint";
import { Moon } from "./moon";
import { startingPositions } from "./scanData";

// Generate points from starting positions
const moons: Moon[] = startingPositions.map(
  position => new Moon(new Point3D(position.x, position.y, position.z))
);

// run 1000 steps
let step = 0;
while (step < 10000000) {
  // apply gravity to each pair of moon
  moons.forEach((moon1, indexMoon1) =>
    moons.forEach((moon2, indexMoon2) => {
      if (indexMoon2 > indexMoon1) {
        // pair moons only once
        Object.keys(moon1.position).forEach(axis => {
          if (moon1.position[axis] > moon2.position[axis]) {
            moon2.velocity[axis] += 1;
            moon1.velocity[axis] -= 1;
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
    Object.keys(moon.position).forEach(
      axis => (moon.position[axis] += moon.velocity[axis])
    );
  });

  step++;

  if (step % 100000 == 0) {
    console.log(`\nAfter ${step} steps:`);
    moons.forEach(moon =>
      console.log(
        `pos=<x=${moon.position.x}, y=${moon.position.y}, z=${moon.position.z}>, vel=<x=${moon.velocity.x}, y=${moon.velocity.y}, z=${moon.velocity.z}>`
      )
    );
  }
}

console.log(`Energy after ${step} steps: `);
moons.forEach(moon => console.log(`energy=${moon.energy}`));
console.log(`Total energy ${moons.reduce((a, b) => a + b.energy, 0)} `);
