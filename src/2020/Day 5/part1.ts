import { boardingPassesList } from "./boardingPasses";
import { BoardingPass } from "./boardingPass";

console.time("part1");

const boardingPasses = boardingPassesList.map((seat) => new BoardingPass(seat));
console.log("Answer:", Math.max(...boardingPasses.map((b) => b.id)));
console.timeEnd("part1");
