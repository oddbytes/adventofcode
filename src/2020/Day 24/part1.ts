import { HexaTile } from "./hexaTile";
console.time("part1");
const hexaTile = new HexaTile("./movements.txt");
// Contar las baldosas negras tras la inicializacion
console.log("Answer:", hexaTile.flipTiles().size);
console.timeEnd("part1");
