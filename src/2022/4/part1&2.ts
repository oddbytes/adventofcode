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

  return (
    largestSection[0] <= smallestSection[0] &&
    largestSection[1] >= smallestSection[1]
  );
});

console.log(`Part1 response: ${contains.length}`);

console.timeEnd("part1");
const range = (start, end) =>
  Array.from(Array(end - start + 1).keys())
    .map((x) => x + start)
    .map(Number);
const overlap = sections.filter(([firstSection, secondSection]) => {
  const firstRange = range(firstSection[0], firstSection[1]);
  const secondRange = range(secondSection[0], secondSection[1]);
  return firstRange.some((s) => secondRange.includes(s));
});
console.time("part2");

console.log(`Part2 response: ${overlap.length}`);

console.timeEnd("part2");

console.timeEnd("day4");
