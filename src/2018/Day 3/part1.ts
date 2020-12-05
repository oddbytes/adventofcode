import { Rectangle } from "./rectangle";
import { claims } from "./claims";

const rectangles = claims.map((claim) => {
  //"#1 @ 469,741: 22x26",
  const dimensions = claim.match(/(\d+),(\d+):\s(\d+)x(\d+)/);

  return new Rectangle(
    parseInt(dimensions[1]),
    parseInt(dimensions[2]),
    parseInt(dimensions[3]),
    parseInt(dimensions[4])
  );
});

// Dos o mas rectangulos pueden superponerse en la misma zona, por lo que guardamos en un array las posiciones ocupadas por cada rectangulo
// Si un rectangulo ocupa la posicion de otro, se suma 1 a esa poicion
// Las areas de souperposicion on las que tiene  mas de un rectangulo en ese punto
const totalOverlappingArea = () => {
  const tiles: number[] = [];
  const maxWidth = Math.max(...rectangles.map((r) => r.end.x)) + 1;
  rectangles.forEach((rect) => {
    for (let x = rect.start.x; x < rect.end.x; x++)
      for (let y = rect.start.y; y < rect.end.y; y++)
        tiles[y * maxWidth + x] = (tiles[y * maxWidth + x] ?? 0) + 1;
  });
  return tiles.filter((t) => t > 1).length;
};
console.time("part1");
console.log("Answer:", totalOverlappingArea());
console.timeEnd("part1");
