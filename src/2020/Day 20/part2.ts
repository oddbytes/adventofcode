import { PuzzleSolver } from "./puzzleSolver";

console.time("part2");

const puzzleSolver = new PuzzleSolver("./tiles.txt");

const puzzle = puzzleSolver.solvePuzzle();
//Ver el puzzle montado
//puzzle.content.forEach((l) => console.log(l));

console.log("Answer:", puzzleSolver.getSeaRoughness(puzzle));
console.timeEnd("part2");
