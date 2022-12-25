import * as fs from "fs";

const CylesPerInstruction: Record<string, number> = {
  noop: 1,
  addx: 2,
};

let xRegister = 1;
let cycleCount = 0;
const xRegisterHistory: number[] = [];
const screen: string[] = [];

console.time("day10");
const program = fs.readFileSync("./input.txt", "utf8").split("\r\n");

const drawPixel = () => {
  const screenY = Math.ceil(cycleCount / 40) - 1;
  const screenX = (cycleCount % 40) - 1;
  screen[screenY] +=
    screenX >= xRegister - 1 && screenX <= xRegister + 1 ? "#" : " ";
};

const runInstruction = (instruction: string, drawScreen: boolean) => {
  const [operation, argument] = instruction.split(" ");

  for (let i = 0; i < CylesPerInstruction[operation]; i++) {
    cycleCount++;
    // console.log(
    //   `ciclo:${cycleCount} ${operation}, ${argument} -> ${xRegister}`
    // );
    if (cycleCount % 40 == 20) {
      xRegisterHistory.push(xRegister * cycleCount);
    }
    if (drawScreen) drawPixel();
  }

  if (operation == "addx") xRegister += parseInt(argument);
};

const part1 = () => {
  program.forEach((instruction) => {
    runInstruction(instruction, false);
  });
  console.log(xRegisterHistory);
  return xRegisterHistory.reduce((a, b) => a + b);
};

const part2 = () => {
  xRegister = 1;
  cycleCount = 0;
  for (let i = 0; i < 6; i++) screen[i] = "";
  program.forEach((instruction) => {
    runInstruction(instruction, true);
  });
  for (let i = 0; i < 6; i++) console.log(screen[i]);

  return 0;
};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day10");
