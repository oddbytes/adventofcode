import { PaintingRobot } from "./paintingRobot";
import { robotProgram } from "./program";

const panels = new PaintingRobot(robotProgram).paint(1);
console.log(`Number of painted panels ${panels.length}`);

// Decode panels as characters (1=white, 0=black)

const minX = Math.min(...panels.map(p => p.coordinates.x));
const maxX = Math.max(...panels.map(p => p.coordinates.x));

const minY = Math.min(...panels.map(p => p.coordinates.y));
const maxY = Math.max(...panels.map(p => p.coordinates.y));

for (let row = maxY; row >= minY; row--) {
  let decode = "";
  for (let col = minX; col <= maxX; col++) {
    const panel = panels.find(
      p => p.coordinates.x == col && p.coordinates.y == row
    );
    decode += panel && panel.color == 1 ? "#" : " ";
  }
  console.log(decode);
}
