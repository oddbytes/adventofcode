import { XMAS } from "./XMAS";

console.time("part2");
const xmasProtocol = new XMAS("./serial.txt", 25);
const range = xmasProtocol.findRange(xmasProtocol.findChecksumError());
console.log("Answer:", Math.min(...range) + Math.max(...range));
console.timeEnd("part2");
