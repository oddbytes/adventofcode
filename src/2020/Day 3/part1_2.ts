import { map } from "./trees";

class SlopeCalculator {
  private rows = 0;
  private cols = 0;
  constructor(private map: string[]) {
    //Guardar dimensiones del mapa
    this.rows = map.length;
    this.cols = map[0].length;
  }

  public treesInSlope = (right: number, down: number): number => {
    let x = right,
      y = down,
      treesCount = 0;
    // Hasta que lleguemos abajo
    while (y < this.rows) {
      if (this.map[y][x] == "#") treesCount++;
      x += right;
      y += down;
      if (x > this.cols - 1) x -= this.cols; // Si salimos del mapa por la derecha, lo repetimos
    }
    return treesCount;
  };
}

console.time("part1");
const slopeCalculator = new SlopeCalculator(map);
console.log("Answer:", slopeCalculator.treesInSlope(3, 1));
console.timeEnd("part1");

console.time("part2");
console.log(
  "Answer:",
  slopeCalculator.treesInSlope(1, 1) *
    slopeCalculator.treesInSlope(3, 1) *
    slopeCalculator.treesInSlope(5, 1) *
    slopeCalculator.treesInSlope(7, 1) *
    slopeCalculator.treesInSlope(1, 2)
);
console.timeEnd("part2");
