import { GameMap } from "../Day 13/gameMap";
import { Direction } from "../Day 15/maze";
import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { program } from "./program";
import { ScaffoldMapper, IMovement } from "./scaffoldMapper";

const scaffoldMapper = new ScaffoldMapper(program);
const tiles = scaffoldMapper.getScaffoldTiles();
// draw map
const gameMap = new GameMap();
console.log(gameMap.render(tiles));

// lets go through the scaffold

const movements = scaffoldMapper.getScaffoldMovemetns(tiles);
console.log(`movements:${movements.join(",")}`);

/**
 * Returns the longest pattern found
 * @param movements
 * @param maxLength
 */
const getPattern = (movements: IMovement[], maxLength?: number): IMovement[] => {
  let currLength = 2;
  // slice the movements in currLength pieces and compare them to the first one
  let parts: IMovement[][] = [];
  if (!maxLength) maxLength = Number.MAX_VALUE;
  let equalParts = 1;
  while (equalParts > 0 && currLength <= maxLength) {
    parts = [];
    let currIndex = currLength;
    while (currIndex < movements.length) {
      parts.push(movements.slice(currIndex, currIndex + currLength));
      currIndex++;
    }
    equalParts = parts.reduce(
      (acum, part, currentIndex) =>
        currentIndex > 0 &&
        part.length == currLength &&
        part.map((p) => p.steps).every((p, i) => p == movements[i].steps)
          ? (acum += 1)
          : acum,
      0
    );
    currLength++;
  }
  return currLength > maxLength + 1
    ? []
    : movements.slice(0, maxLength == Number.MAX_VALUE ? currLength - 2 : maxLength);
};

/**
 * Return a new array with the specified pattern deleted
 */
const deletePattern = (movements: IMovement[], pattern: IMovement[]): IMovement[] => {
  const moves = Object.assign([], movements);

  let currIndex = moves.length - pattern.length;
  while (currIndex > -1) {
    const chunk = movements.slice(currIndex, currIndex + pattern.length);
    if (chunk.map((m) => m.steps).every((d, i) => d == pattern[i].steps)) {
      moves.splice(currIndex, pattern.length);
      currIndex -= pattern.length - 1;
    }
    currIndex--;
  }

  return moves;
};

/**
 * Finds a number of repetitive patterns in the given movements
 * @param movements
 * @param maxPattens
 */
const findPatterns = (movements: IMovement[], maxPattens: number): IMovement[][] => {
  // Identify patterns in movements
  const patterns: IMovement[][] = [];
  let patternsToFind = 0;
  let moves = Object.assign([], movements);
  let currentMaxLength = Number.MAX_VALUE;
  while (patternsToFind < maxPattens) {
    const pattern = getPattern(moves, currentMaxLength);
    const nextPattern = deletePattern(moves, pattern);
    //try next step, if it is posible to find a pattern
    if (getPattern(nextPattern).length > 1 || nextPattern.length == 0) {
      patterns.push(pattern);
      moves = nextPattern;
      currentMaxLength = Number.MAX_VALUE;
      patternsToFind++;
    } else {
      currentMaxLength = pattern.length - 1;
    }
  }
  return patterns;
};

/**
 * Identifies the passed patterns as A,B or C in the sequence
 * @param movements
 * @param patterns
 */
const mapPatterns = (movements: IMovement[], patterns: IMovement[][]) => {
  const moves = Object.assign([], movements);
  let patternIndex = 0;
  const patternOrder: number[] = [];

  while (moves.length > 0 && patternIndex < patterns.length) {
    if (patterns[patternIndex].map((p) => p.steps).every((d, i) => d == moves[i].steps)) {
      patternOrder.push(patternIndex);
      moves.splice(0, patterns[patternIndex].length);
      patternIndex = -1;
    }
    patternIndex++;
  }

  return patternOrder.map((p) => 65 + p);
};

const getTurn = (move: IMovement, lastMove: IMovement): number => {
  //R 82 L 76
  const newDir = move.direction;
  let lastdir = lastMove?.direction;
  if (!lastdir) {
    lastdir = Direction.north;
  }
  return (lastdir == Direction.north && newDir == Direction.east) ||
    (lastdir == Direction.east && newDir == Direction.south) ||
    (lastdir == Direction.south && newDir == Direction.west) ||
    (lastdir == Direction.west && newDir == Direction.north)
    ? 82
    : 76;
};

const getMoves = (num: number): number[] => {
  return Array.from(num.toString()).map((c) => 48 + parseInt(c));
};
const programRobot = (patterns: IMovement[][], mappedPatterns: number[]) => {
  const computer = new IntcodeComputer();
  //start program
  program[0] = 2;

  //1 main movement routin

  const programOptions: IProgramOptions = {
    suspendOnOutput: true,
    input: [],
  };
  const main = mappedPatterns.map((m) => [m, 44]).flat();
  main[main.length - 1] = 10;

  const functions = [];
  // functions
  for (let p = 0; p < patterns.length; p++) {
    functions.push(
      patterns[p]
        .map((movement, index, moves) => [
          getTurn(movement, moves[index - 1]),
          44,
          movement.steps < 10 ? 48 + movement.steps : getMoves(movement.steps),
          44,
        ])
        .flat()
        .flat()
    );
    const f = functions[functions.length - 1];
    f[f.length - 1] = 10;
  }

  let execResult = computer.execute(program, programOptions);
  while (execResult.exitCode != 99) {
    const output = execResult.output.map((c) => String.fromCharCode(c)).join("");
    let input;
    if (output.endsWith("Main:")) {
      input = main;
    }
    if (output.endsWith("A:")) input = functions[0];
    if (output.endsWith("B:")) input = functions[1];
    if (output.endsWith("C:")) input = functions[2];
    if (output.endsWith("feed?")) input = [110, 10];

    console.log(output);

    execResult = computer.resume(input);
  }

  console.log("Dust collected:" + execResult.output[execResult.output.length - 1]);
};

const patterns = findPatterns(movements, 3);
//ABBCBCBCAA
const mappedPatterns = mapPatterns(movements, patterns);

programRobot(movements, patterns, mappedPatterns);
