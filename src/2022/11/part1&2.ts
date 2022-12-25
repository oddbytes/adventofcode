import * as fs from "fs";

class Monkey {
  public startingItems: number[] = [];
  public operator: string;
  public operand: string;
  public testFactor: number;
  public nextMonkeyTrue: number;
  public nextMonkeyFalse: number;
  public inspections = 0;
}

console.time("day11");
const readMonkeys = () => {
  return fs
    .readFileSync("./sample.txt", "utf8")
    .split("\r\n\r\n")
    .map((monkeyNotes) => {
      const monkey = new Monkey();
      const lines = monkeyNotes.split("\r\n");
      monkey.startingItems = lines[1].split(":")[1].split(",").map(Number);
      [monkey.operator, monkey.operand] = lines[2]
        .split("new = old ")[1]
        .split(" ");
      monkey.testFactor = parseInt(lines[3].split("by ")[1]);
      monkey.nextMonkeyTrue = parseInt(lines[4].split("monkey ")[1]);
      monkey.nextMonkeyFalse = parseInt(lines[5].split("monkey ")[1]);

      return monkey;
    });
};

//console.log(monkeys);

let monkeys = readMonkeys();

const playRound = (ruleSet = 1) => {
  monkeys.forEach((monkey) => {
    const numItems = monkey.startingItems.length;
    for (let i = 0; i < numItems; i++) {
      const worryLevel = monkey.startingItems.shift();
      const operand = isNaN(parseInt(monkey.operand))
        ? worryLevel
        : parseInt(monkey.operand);

      let newWorryLevel =
        monkey.operator == "*" ? worryLevel * operand : worryLevel + operand;

      if (ruleSet == 1) newWorryLevel = Math.floor(newWorryLevel / 3);
      const nextMonkey =
        newWorryLevel % monkey.testFactor == 0
          ? monkey.nextMonkeyTrue
          : monkey.nextMonkeyFalse;

      monkey.inspections++;
      // console.log(
      //   `Monkey ${monkeyIndex}:\n\tworryLevel:${worryLevel} new WorryLevel:${newWorryLevel}\t nextMonkey:${nextMonkey}`
      // );
      monkeys[nextMonkey].startingItems.push(newWorryLevel);
    }
  });
};

const part1 = () => {
  for (let i = 0; i < 20; i++) {
    //console.log(`============ROUND ${i + 1}============`);
    playRound();
    // monkeys.forEach((monkey, index) => {
    //   console.log(`Monkey ${index}: ${monkey.startingItems.join(",")}`);
    // });
  }
  const inspections = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  console.log(inspections);
  // monkeys.forEach((monkey, index) => {
  //   console.log(`Monkey ${index} inspected items  ${monkey.inspections} times`);
  // });

  return inspections[0] * inspections[1];
};

const part2 = () => {
  monkeys = readMonkeys();
  for (let i = 0; i < 10000; i++) {
    playRound(2);
    if ((i + 1) % 1000 == 0 || i < 20) {
      console.log(`============ROUND ${i + 1}============`);
      monkeys.forEach((monkey, index) => {
        console.log(`Monkey ${index}: ${monkey.startingItems.join(",")}`);
      });
      monkeys.forEach((monkey, index) => {
        console.log(
          `Monkey ${index} inspected items  ${monkey.inspections} times`
        );
      });
    }
  }
  const inspections = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  console.log(inspections);

  return inspections[0] * inspections[1];
};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day11");
