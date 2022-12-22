import * as fs from "fs";

console.time("day4");
const sections = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((l) => l.split(","))
  .map(([f, s]) => [f.split("-").map(Number), s.split("-").map(Number)]);

console.time("part1");
const contains = sections.filter(([firstSection, secondSection]) => {
  let largestSection, smallestSection;
  if (firstSection[1] - firstSection[0] > secondSection[1] - secondSection[0]) {
    largestSection = firstSection;
    smallestSection = secondSection;
  } else {
    largestSection = secondSection;
    smallestSection = firstSection;
  }

  //console.log(largestSection, smallestSection);
  return (
    largestSection[0] <= smallestSection[0] &&
    largestSection[1] >= smallestSection[1]
  );
});

//console.log(contains);
console.log(`Part1 response: ${contains.length}`);

console.timeEnd("part1");
console.time("part2");

console.log(`Part2 response: `);

console.timeEnd("part2");

console.timeEnd("day4");
