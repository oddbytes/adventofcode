import { IPoint } from "../Day 3/SegmentCalculator";
import { startingPositions } from "./datapart2";

interface IPoint3D extends IPoint {
  z: number;
}

class Point3D implements IPoint3D {
  constructor(public x: number, public y: number, public z: number) {}
}

interface IMoon {
  position: IPoint3D;
  velocity: IPoint3D;
  step: number;
  cycleSteps: number;
  velocities: {};
}

interface IAbsVelocity {
  values: number[];
  stepsToAbs0: number;
  position: number;
}

class Moon implements IMoon {
  public velocity: IPoint3D = new Point3D(0, 0, 0);
  public cycleSteps: number = -1;
  public velocities;
  constructor(public position: IPoint3D, public step: number) {
    this.velocities = {
      x: { stepsToAbs0: 0, values: [], position: -1 },
      y: { stepsToAbs0: 0, values: [], position: -1 },
      z: { stepsToAbs0: 0, values: [], position: -1 }
    };
  }
}

const moons = startingPositions.map(
  pos => new Moon(new Point3D(pos.x, pos.y, pos.z), 0)
);

let step = 0;
//while (moons.some(moon => moon.cycleSteps < 0)) {
while (
  step == 0 ||
  moons.some(
    moon =>
      moon.velocities.x.stepsToAbs0 == 0 ||
      moon.velocities.y.stepsToAbs0 == 0 ||
      moon.velocities.z.stepsToAbs0 == 0
  )
  //     ||
  //   moons.some(moon => moon.cycleSteps < 1)
) {
  //   console.log(`\n Step ${step}`);
  //   moons.forEach(moon =>
  //     console.log(
  //       ` ${moon.position.x},${moon.position.y},${moon.position.z} ${moon.velocity.x},${moon.velocity.y},${moon.velocity.z}`
  //     )
  //   );

  //apply gravity
  moons.forEach((moon1, indexMoon1) =>
    moons.forEach((moon2, indexMoon2) => {
      if (indexMoon2 > indexMoon1)
        Object.keys(moon1.position).forEach(axis => {
          if (moon1.position[axis] > moon2.position[axis]) {
            moon1.velocity[axis] -= 1;
            moon2.velocity[axis] += 1;
          } else if (moon1.position[axis] < moon2.position[axis]) {
            moon1.velocity[axis] += 1;
            moon2.velocity[axis] -= 1;
          }
        });
    })
  );

  //apply velocity
  moons.forEach((moon, index) => {
    Object.keys(moon.velocity).forEach(axis => {
      moon.position[axis] += moon.velocity[axis];
      if (moon.velocities[axis].stepsToAbs0 == 0)
        moon.velocities[axis].values.push(moon.velocity[axis]);

      if (moon.velocities[axis].values.length > 1)
        if (
          //moon.velocities[axis].values.reduce((a, b) => a + b, 0) == 0 &&
          moon.velocity[axis] == 0 &&
          startingPositions[index][axis] == moon.position[axis] &&
          moon.velocities[axis].stepsToAbs0 == 0
        ) {
          moon.velocities[axis].stepsToAbs0 =
            moon.velocities[axis].values.length;
          moon.velocities[axis].position = moon.position[axis];
        }
    });

    // if (
    //   moon.velocity.x == 0 &&
    //   moon.velocity.y == 0 &&
    //   moon.velocity.z == 0 &&
    //   moon.cycleSteps < 0
    // ) {
    //   moon.cycleSteps = step;
    //   console.log(`Moon ${index} cycle completed in step ${step}`);
    // }
  });

  step++;
}

const lcm = (x: number, y: number): number =>
  !x || !y ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));

const gcd_two_numbers = (x: number, y: number): number => {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
};
const moonSteps = moons.map(moon =>
  lcm(
    lcm(moon.velocities.x.stepsToAbs0, moon.velocities.y.stepsToAbs0),
    moon.velocities.z.stepsToAbs0
  )
);
moons.forEach((moon, index) => {
  console.log(
    `Moon ${index}:\n ${step} ${moon.cycleSteps} ${moon.position.x},${moon.position.y},${moon.position.z} ${moon.velocity.x},${moon.velocity.y},${moon.velocity.z}  `
  );

  console.log(
    ` ${moon.velocities.x.values.length}  SP:${startingPositions[index].x} P:${moon.velocities.x.position}`
  );

  console.log(
    ` ${moon.velocities.y.values.length}  SP:${startingPositions[index].y} P:${moon.velocities.y.position}`
  );
  console.log(
    ` ${moon.velocities.z.values.length}  SP:${startingPositions[index].z} P:${moon.velocities.z.position} `
  );

  console.log(
    ` ${moon.velocities.x.stepsToAbs0} ${moon.velocities.y.stepsToAbs0} ${moon.velocities.z.stepsToAbs0} `
  );
  console.log(` LCM: ${moonSteps[index]} `);
});

console.log(
  "Response",
  lcm(
    lcm(moonSteps[0], moonSteps[1]),
    lcm(moonSteps[2], moonSteps[3])
  ).toLocaleString("es")
);
