import * as fs from "fs";

console.time("day4");
const [stacksConfig, instructions] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n\r\n")
  .map((p) => p.split("\r\n"));

const stackNumbers = stacksConfig[stacksConfig.length - 1]
  .trimEnd()
  .split(" ")
  .map(Number);

const numberOfStacks = stackNumbers[stackNumbers.length - 1];

const stacks: string[][] = new Array(numberOfStacks - 1);
for (let i = 0; i < numberOfStacks; i++) stacks[i] = [];

console.log(numberOfStacks, stacks, instructions);

for (let i = 0; i < stacksConfig.length - 1; i++)
  for (let s = 0; s < numberOfStacks; s++)
    if (stacksConfig[i][1 + s * 4] != " ")
      stacks[s].push(stacksConfig[i][1 + s * 4]);

for (let i = 0; i < numberOfStacks; i++) stacks[i] = stacks[i].reverse();

const re = /move (\d+) from (\d+) to (\d+)/;
instructions.forEach((instruction) => {
  const [_match, quantity, from, to] = re.exec(instruction);

  for (let step = 0; step < parseInt(quantity); step++) {
    const crate = stacks[parseInt(from) - 1].pop();
    stacks[parseInt(to) - 1].push(crate);
  }
});

console.log(numberOfStacks, stacks);

console.time("part1");

console.log(`Part1 response: ${stacks.map((s) => s[s.length - 1]).join("")}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: `);

console.timeEnd("part2");

console.timeEnd("day4");
