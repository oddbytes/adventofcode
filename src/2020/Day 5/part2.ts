import { boardingPassesList } from "./boardingPasses";
import { BoardingPass } from "./boardingPass";

/**Devuelve la suma de los primeros n numeros naturales segun la formula de Gauss */
const gauss = (n: number) => ((1 + n) / 2) * n;

console.time("part2");
const boardingPasses = boardingPassesList.map((seat) => new BoardingPass(seat));
const ids = boardingPasses.map((b) => b.id);

ids.sort((a, b) => a - b);
const min = ids[0],
  max = ids[ids.length - 1];

const actualSum = ids.reduce((a, b) => a + b, 0);

console.log("Answer:", gauss(max) - gauss(min) - actualSum + min);

console.timeEnd("part2");
