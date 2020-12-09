import * as fs from "fs";

const data = fs.readFileSync("./gift.txt", "utf8").split("\r\n");

console.log(
  "Answer:",
  data.reduce((a, b) => {
    const { [0]: l, [1]: w, [2]: h } = b.split("x").map((p) => parseInt(p));
    return (
      a + 2 * l * w + 2 * w * h + 2 * h * l + Math.min(l * w, w * h, h * l)
    );
  }, 0)
);
