import * as fs from "fs";
console.time("day");

const letters = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((lines) => lines.split(""));

//letters is a char[][]

/**Return the number of ocurrences of XMAS and SAMX in an array of lines */
const getXMASCount = (line: string[]) => {
  const reXMAS = /XMAS/g;
  const reSAMX = /SAMX/g;

  return line
    .map(
      (line) =>
        Array.from(line.matchAll(reXMAS)).length +
        Array.from(line.matchAll(reSAMX)).length
    )
    .reduce((a, b) => a + b);
};
/**Given a point, gets the diagonal word up->down and left->right or right->left
 * dir: 1 left->right
 *      -1 right->left*/

const getDiagonalFrom = (
  letters: string[][],
  x: number,
  y: number,
  dir = 1
) => {
  let diagonal = "";
  const width = letters[0].length;
  for (; y < width && x < width && x > -1; y++, x += dir)
    diagonal += letters[y][x];
  return diagonal;
};

console.time("part");
let result = 0;
let lines: string[] = [];
//Find the word XMAS in horizontal lines
lines = lines.concat(...letters.map((l) => l.join("")));

//Create vertical lines
lines = lines.concat(
  ...letters[0].map(
    (
      _,
      colIndex //for each col
    ) => letters.map((row) => row[colIndex]).join("") //join all chars of every line
  )
);
const width = letters[0].length;

//Diagonals from top
for (let col = 0; col < width; col++)
  lines.push(getDiagonalFrom(letters, col, 0));

for (let col = width; col > -1; col--)
  lines.push(getDiagonalFrom(letters, col, 0, -1));

//Diagonals from left

for (let row = 1; row < width; row++) {
  lines.push(getDiagonalFrom(letters, 0, row));
  lines.push(getDiagonalFrom(letters, width - 1, row, -1));
}

result += getXMASCount(lines);

console.log(`Answer: ${result}`);
console.timeEnd("part");
console.timeEnd("day");
