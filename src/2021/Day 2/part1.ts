import * as fs from "fs";
import { Point } from "../../common/point";

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

const end = commands.reduce<Point>((origin, command) => {
  if (command.movement == "forward") origin.x += command.value;
  else if (command.movement == "down") origin.y -= command.value;
  else origin.y += command.value;
  return origin;
}, new Point());

console.log(end);
console.log("Solution", Math.abs(end.x * end.y));
