import * as fs from "fs";

console.time("day13");
const parsePairs = () => {
  return fs
    .readFileSync("./input.txt", "utf8")
    .split("\r\n\r\n")
    .map((pair) => pair.split("\r\n").map((lines) => JSON.parse(lines)))
    .flatMap((x) => x);
};

enum ComparisonResult {
  rightOrder = -1,
  wrongOrder = 1,
  indeterminate = 0,
}

const compareIntegers = (a: number, b: number): ComparisonResult => {
  //console.log(`Compare ${a} vs ${b}`);
  if (a < b) return ComparisonResult.rightOrder;
  if (a > b) return ComparisonResult.wrongOrder;
  return ComparisonResult.indeterminate;
};

const comparePair = (packet1: any[], packet2: any[]): ComparisonResult => {
  let position = 0;
  let result: ComparisonResult = ComparisonResult.indeterminate;
  while (result === ComparisonResult.indeterminate) {
    if (position + 1 > packet1.length && position + 1 > packet2.length)
      return ComparisonResult.indeterminate;
    else if (position + 1 > packet2.length)
      //if right list side runs out of items

      result = ComparisonResult.wrongOrder;
    else if (position + 1 > packet1.length)
      //if right list side runs out of items

      result = ComparisonResult.rightOrder;
    else if (
      typeof packet1[position] === "number" &&
      typeof packet2[position] === "number"
    )
      //Integers
      result = compareIntegers(packet1[position], packet2[position]);
    else if (
      Array.isArray(packet1[position]) &&
      Array.isArray(packet2[position])
    ) {
      //Arrays
      result = comparePair(packet1[position], packet2[position]);
      // console.log(
      //   `Compare ${packet1[position]} vs ${packet2[position]}`,
      //   result
      // );
    }
    //one integer and one array
    else {
      let firstList, secondList;
      if (typeof packet1[position] === "number") {
        firstList = [packet1[position]];
        secondList = packet2[position];
      } else {
        firstList = packet1[position];
        secondList = [packet2[position]];
      }
      result = comparePair(firstList, secondList);
    }
    position++;
  }
  return result;
};
const part1 = () => {
  const pairs = parsePairs();
  const rightIndexes = [];
  for (let index = 0; index < pairs.length; index += 2) {
    //console.log(`===Pair ${index / 2 + 1}===`);

    if (
      comparePair(pairs[index], pairs[index + 1]) ===
      ComparisonResult.rightOrder
    ) {
      rightIndexes.push(index / 2 + 1);
      //console.log(pairs[index], pairs[index + 1], index / 2 + 1);
    }
  }

  return rightIndexes.reduce((a, b) => a + b, 0);
};

const part2 = () => {
  const pairs = parsePairs()
    .concat([[2]], [[6]])
    .sort((a, b) => comparePair(a, b));
  const twoIndex = pairs.findIndex((x) => x.length === 1 && x[0] == 2) + 1;
  const sixIndex = pairs.findIndex((x) => x.length == 1 && x[0] == 6) + 1;

  console.log(twoIndex, sixIndex);
  return twoIndex * sixIndex;
};

console.time("part1");
console.log(`Part1 response: ${part1()}`);
console.timeEnd("part1");
console.time("part2");
console.log(`Part2 response: ${part2()}`);
console.timeEnd("part2");

console.timeEnd("day13");
