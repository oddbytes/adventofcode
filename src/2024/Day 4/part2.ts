import * as fs from "fs";
import { IPoint, Point } from "../../common/point";
console.time("day");

const line = fs.readFileSync("./input.txt", "utf8").replace(/\r\n/g, "");

console.time("part");

const toPoint = (index: number) =>
  new Point(index % width, Math.floor(index / width));

const toIndex = (point: IPoint) => point.y * width + point.x;

const re = /M.M|S.M|M.S|S.S/g;
let found = 0;
const width = Math.sqrt(line.length);
//Lets find the As
const matches = Array.from(line.matchAll(/A/g)).map((m) => toPoint(m.index));
matches
  .filter((m) => m.x > 0 && m.x < width - 1 && m.y > 0 && m.y < width - 1) //ignore A on the edges
  .forEach((point) => {
    const index = toIndex(point);

    //Check if there is any valid combination at index-width-1, up line

    const upMatch = line
      .substring(index - width - 1, index - width + 2)
      .match(re);

    if (upMatch) {
      //what should be in the down line
      let opposingRe: RegExp;
      if (upMatch[0][0] == "M" && upMatch[0][2] == "M") opposingRe = /S.S/;
      else if (upMatch[0][0] == "S" && upMatch[0][2] == "S") opposingRe = /M.M/;
      else opposingRe = new RegExp(upMatch[0][0] + "." + upMatch[0][2]);
      //if the combination is found, whe have a X-MAS
      if (opposingRe.test(line.substring(index + width - 1, index + width + 2)))
        found++;
    }
  });

console.log(`Answer: ${found}`);
console.timeEnd("part");
console.timeEnd("day");
