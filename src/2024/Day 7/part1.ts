import * as fs from "fs";

console.time("day");

//get a Map <number, number[] form entry
const operations = new Map<number, number[]>();
const obstaclesPositions = new Set<string>();
fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .forEach((row) => {
    const tokens = row.split(": ");
    operations.set(parseInt(tokens[0]), tokens[1].split(" ").map(Number));
  });
console.time("part");

let correctEquationsSum = 0;
operations.forEach((operands, wantedResult) => {
  const numberOfOperators = operands.length - 1;

  //Lets try all combinations of operators using a binary number as pattern
  for (let pattern = 0; pattern < Math.pow(2, numberOfOperators); pattern++) {
    //put pattern in binary notation. 0 means multiply operands, 1 sum operands
    const patternBinary = pattern.toString(2).padStart(numberOfOperators, "0");
    //calculate result of operands ussing this pattern
    let result = operands.reduce((acc, operand, index) => {
      if (index > 0) {
        //There is one operator less than operands
        return patternBinary[index - 1] === "0" ? acc * operand : acc + operand;
      }
      return operands[0]; //Return first operand for the first loop
    }, 0);
    if (result === wantedResult) {
      correctEquationsSum += wantedResult;
      break; //don't mind other possible solutions to this equation
    }
  }
});

console.log(`Answer: ${correctEquationsSum}`);
console.timeEnd("part");
console.timeEnd("day");
