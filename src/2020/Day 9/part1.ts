import { XMAS } from "./XMAS";

console.time("part1");
const xmasProtocol = new XMAS("./serial.txt", 25);
console.log("Answer:", xmasProtocol.findChecksumError());
console.timeEnd("part1");
