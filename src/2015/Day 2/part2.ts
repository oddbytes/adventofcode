import * as fs from "fs";

const data = fs.readFileSync("./gift.txt", "utf8").split("\r\n");

console.log(
  "Answer:",
  data.reduce((a, b) => {
    const dimensions = b
      .split("x")
      .map((p) => parseInt(p))
      .sort((a, b) => a - b);
    return (
      a +
      2 * dimensions[0] +
      2 * dimensions[1] +
      dimensions[0] * dimensions[1] * dimensions[2]
    );
  }, 0)
);
