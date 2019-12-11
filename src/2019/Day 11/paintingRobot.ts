import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { IPoint, Point } from "../Day 3/SegmentCalculator";
// import { robotProgram } from "./program";

interface IPanel {
  coordinates: IPoint;
  color: number;
}

export class PaintingRobot {
  private computer = new IntcodeComputer();

  constructor(public program: number[]) {}

  /**
   * Paints the panels according to program, returns array of painted panels
   * @param startColor starting color
   */
  public paint(startColor: number): IPanel[] {
    const programOptions: IProgramOptions = {
      input: [startColor],
      suspendOnOutput: true
    };
    // Get first instruction
    let execution = this.computer.execute(this.program, programOptions);

    const robotPosition: IPoint = new Point(0, 0);

    const panels: IPanel[] = [];

    let currentAngle = 90;

    while (execution.exitCode != 99) {
      const colorCode = execution.output[execution.output.length - 1];
      let panel = panels.find(
        p =>
          p.coordinates.x == robotPosition.x &&
          p.coordinates.y == robotPosition.y
      );
      // paint the panel
      if (panel) {
        panel.color = colorCode;
      } else {
        panels.push({
          coordinates: new Point(robotPosition.x, robotPosition.y),
          color: colorCode
        });
      }

      // get turn
      execution = this.computer.resume();

      currentAngle +=
        execution.output[execution.output.length - 1] == 0 ? 90 : -90;

      if (currentAngle == 360) {
        currentAngle = 0;
      }
      if (currentAngle == -90) {
        currentAngle = 270;
      }
      // Move robot
      robotPosition.x += currentAngle == 0 ? 1 : currentAngle == 180 ? -1 : 0;
      robotPosition.y += currentAngle == 90 ? 1 : currentAngle == 270 ? -1 : 0;

      // Next panel
      // Is panel painted?
      panel = panels.find(
        p =>
          p.coordinates.x == robotPosition.x &&
          p.coordinates.y == robotPosition.y
      );
      execution = this.computer.resume(panel ? [panel.color] : [0]);
    }

    return panels;
  }
}
