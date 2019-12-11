import { PaintingRobot } from "./paintingRobot";
import { robotProgram } from "./program";

const panels = new PaintingRobot(robotProgram).paint(0);

console.log(`Number of painted panels ${panels.length}`);
