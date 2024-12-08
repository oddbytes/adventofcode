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
//same as part 1 with a new operaor. Le's use base 3 to calculate operator patterns
let correctEquationsSum = 0;
operations.forEach((operands, wantedResult) => {
  const numberOfOperators = operands.length - 1;

  //Lets try all combinations of operators using a binary number as pattern
  for (let pattern = 0; pattern < Math.pow(3, numberOfOperators); pattern++) {
    //put pattern in base 3 notation. 0 means multiply operands, 1 sum operands, 2 concatenate operands
    const patternBinary = pattern.toString(3).padStart(numberOfOperators, "0");
    //calculate result of operands ussing this pattern
    let result = operands.reduce((acc, operand, index) => {
      if (index > 0) {
        //There is one operator less than operands
        if (patternBinary[index - 1] === "0") return acc * operand;
        if (patternBinary[index - 1] === "1") return acc + operand;
        if (patternBinary[index - 1] === "2")
          return parseInt(acc.toString() + operand);
      }
      return operands[0]; //Return first operand for the first loop
    }, 0);
    if (result === wantedResult) {
      correctEquationsSum += wantedResult;
      break; //don't mind other possible solutions to this equation
    }
  }
});

/*More efficient solution seen on  reddit https://www.reddit.com/r/adventofcode/comments/1h8rg8w/comment/m0vo3li/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
 So if problem is 11: 3 3 2 then:

2 isn’t a factor of 11 so won’t try multiplication. 11 doesn’t end with 2 so won’t try concatenation. Only option is addition so (as we are going backwards) subtract it off.

Now problem is 9: 3 3

3 is a factor of 9 so try recursing 9/3 (=3): 3. This is correct so a solution has been found.

Reconstructing forwards, 3*3 = 9, 9+2 = 11. */

console.log(`Answer: ${correctEquationsSum}`);
console.timeEnd("part");
console.timeEnd("day");
