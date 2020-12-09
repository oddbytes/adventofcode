import * as fs from "fs";

const data = Array.from(fs.readFileSync("./directions.txt", "utf8"));

const uniqueHouses = new Set<string>(["0x0"]);
let x = 0,
  y = 0;
data.forEach((direction) => {
  switch (direction) {
    case "^":
      y++;
      break;
    case ">":
      x++;
      break;
    case "<":
      x--;
      break;
    case "v":
      y--;
      break;
  }
  uniqueHouses.add(`${x}x${y}`);
});

console.log("Answer:", uniqueHouses.size);
