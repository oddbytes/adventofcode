import * as fs from "fs";

const onLights = new Map<number, number>();
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
        let brightness = onLights.get(lightKey) ?? 0;
        if (match.groups["action"] == "turn off") brightness--;
        else if (match.groups["action"] == "turn on") brightness++;
        else brightness += 2;
        if (brightness < 0) brightness = 0;
        onLights.set(lightKey, brightness);
      }
  });

console.log(
  "Aswer:",
  Array.from(onLights.values()).reduce((a, b) => (a += b), 0)
);
