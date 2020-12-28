import * as fs from "fs";

const onLights = new Set<number>();
const reInstruction = /^(?<action>turn on|turn off|toggle) (?<startX>\d+),(?<startY>\d+) through (?<endX>\d+),(?<endY>\d+)$/;

fs.readFileSync("instructions.txt", "utf8")
  .split("\r\n")
  .forEach((instruction) => {
    const match = instruction.match(reInstruction);
    for (
      let x = parseInt(match.groups["startX"]);
      x <= parseInt(match.groups["endX"]);
      x++
    )
      for (
        let y = parseInt(match.groups["startY"]);
        y <= parseInt(match.groups["endY"]);
        y++
      ) {
        const lightKey = 999 * x + y;
        if (match.groups["action"] == "turn off") onLights.delete(lightKey);
        else if (match.groups["action"] == "turn on") onLights.add(lightKey);
        else {
          if (onLights.has(lightKey)) onLights.delete(lightKey);
          else onLights.add(lightKey);
        }
      }
  });

console.log("Aswer:", onLights.size);
