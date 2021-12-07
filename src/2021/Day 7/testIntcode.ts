import { IntcodeComputer } from "../../2019/Day 2/intcodeComputer";
import * as fs from "fs";

//theres an easter egg in puzzle input

const computer = new IntcodeComputer();
const positions = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split(",")
  .map((x) => parseInt(x));

const stringFromArray = (data: number[]) =>
  data.reduce((a, b) => (a += String.fromCharCode(b)), "");

const r = computer.execute(positions);

console.log(r.output, stringFromArray(r.output));
