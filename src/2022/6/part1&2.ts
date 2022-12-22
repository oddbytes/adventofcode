import * as fs from "fs";

console.time("day6");
const stream = fs.readFileSync("./input.txt", "utf8");

const part1 = (stream: string) => {
  console.log(stream);
  let position = 3;
  //advance till last four chars are all dferent
  let markerFound = false;
  while (!markerFound && position < stream.length) {
    position++;
    console.log(position, stream.slice(position - 4, position));
    markerFound = stream
      .slice(position - 4, position)
      .split("")
      .every((c, i, segment) => segment.lastIndexOf(c) == i);
  }
  return position;
};

console.time("part1");

console.log(`Part1 response: ${part1(stream)}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: `);

console.timeEnd("part2");

console.timeEnd("day6");
