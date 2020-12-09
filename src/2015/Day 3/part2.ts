import * as fs from "fs";

const data = Array.from(fs.readFileSync("./directions.txt", "utf8"));

const uniqueHouses = new Set<string>(["0x0"]);
const agent = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

data.forEach((direction, index) => {
  switch (direction) {
    case "^":
      agent[index % 2].y++;
      break;
    case ">":
      agent[index % 2].x++;
      break;
    case "<":
      agent[index % 2].x--;
      break;
    case "v":
      agent[index % 2].y--;
      break;
  }
  uniqueHouses.add(`${agent[index % 2].x}x${agent[index % 2].y}`);
});

console.log("Answer:", uniqueHouses.size);
