import { HexaTile } from "./hexaTile";
console.time("part2");
const hexaTile = new HexaTile("./movements.txt");
// configurar la posicion de inicio
hexaTile.flipTiles();
// ejecutar 100 ciclos
console.log("Answer:", hexaTile.makeArt(100).size);
console.timeEnd("part2");
