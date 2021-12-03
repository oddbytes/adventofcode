import * as fs from "fs";
import { Point3D } from "../../common/point3D";

interface ICommand {
  movement: "forward" | "up" | "down";
  value: number;
}

//parse commands
const commands = fs
  .readFileSync("./commands.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const commandTokens = line.split(" ");
    return {
      movement: commandTokens[0],
      value: parseInt(commandTokens[1]),
    } as ICommand;
  });

const end = commands.reduce<Point3D>((origin, command) => {
  if (command.movement == "forward") {
    origin.x += command.value;
    origin.y += command.value * origin.z;
  } else if (command.movement == "down") origin.z += command.value;
  else origin.z -= command.value;
  //console.log(origin);
  return origin;
}, new Point3D());

console.log(end);
console.log("Solution", Math.abs(end.x * end.y));
