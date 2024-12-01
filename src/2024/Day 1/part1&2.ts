import * as fs from "fs";
console.time("day1");
const ids: number[][] = [[], []];

//Read input into two arrays of arrays of numbers
fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((l) =>
    l.split("   ").forEach((x, index) => ids[index].push(parseInt(x)))
  );

console.time("part1");

//Sort arrays
ids.forEach((x) => x.sort());
//Get distance for each pair and sum distances
const distance = ids[0]
  .map((id1, index) => Math.abs(id1 - ids[1][index]))
  .reduce((a, b) => a + b);

console.log(`Part1 response: ${distance}`);
console.timeEnd("part1");

console.time("part2");

// Calculate a total similarity score by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.
// I'm leaving some solutions based on speed:

//10 ms solution
// const similarityScore = ids[0]
//   .map((id1) => ids[1].filter((id2) => id2 === id1).length * id1)
//   .reduce((a, b) => a + b);

//1.2 ms solution. As both arrays are ordered, do not go through the full second array each time. Find the firt position the number appears in the second array
//and count how many times it appears.
// const similarityScore = ids[0]
//   .map((id1) => {
//     const start = ids[1].indexOf(id1);
//     if (start < 0) return 0;
//     let end = start + 1;
//     while (ids[1][end] === id1) end++;
//     return id1 * (end - start);
//   })
//   .reduce((a, b) => a + b);

// 0.812 ms solution. Same as previous but deleting numbers of second array
// const similarityScore = ids[0]
//   .map((id1) => {
//     const start = ids[1].indexOf(id1);
//     if (start < 0) return 0; //Number not found
//     let end = start + 1;
//     while (ids[1][end] === id1) end++;
//     //Delete all positions of ids[1] to end, as next number in first array is greater than them
//     ids[1].splice(0, end);
//     return id1 * (end - start);
//   })
//   .reduce((a, b) => a + b);

//0.562 ms solution using a map to count the number of ocurrences of each number in the second array
//20x faster than the first one
const countByNumber = new Map<number, number>();
ids[1].forEach((id2) =>
  countByNumber.set(id2, (countByNumber.get(id2) || 0) + 1)
);
const similarityScore = ids[0]
  .map((id1) => id1 * countByNumber.get(id1) || 0)
  .reduce((a, b) => a + b);

console.log(`Part2 response: ${similarityScore}`);

console.timeEnd("part2");

console.timeEnd("day1");
