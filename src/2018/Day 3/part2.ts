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

const findNonOverlappingClaim = () => {
  const tiles: number[] = [];
  const overlapping: boolean[] = new Array(rectangles.length);
  for (let c = 0; c < rectangles.length; c++) overlapping[c] = false;

  const maxWidth = Math.max(...rectangles.map((r) => r.end.x)) + 1;
  rectangles.forEach((rect, claimId) => {
    for (let x = rect.start.x; x < rect.end.x; x++)
      for (let y = rect.start.y; y < rect.end.y; y++) {
        if (tiles[y * maxWidth + x] != undefined) {
          //Aqui ya hay alguien
          overlapping[claimId] = true;
          overlapping[tiles[y * maxWidth + x]] = true;
        } else tiles[y * maxWidth + x] = claimId; //Marcar esa celda como propiedad del claim actual
      }
  });
  console.log(overlapping.filter((o) => o == false).length);
  return overlapping.findIndex((t) => t == false) + 1;
};
console.time("part1");
console.log("Answer:", findNonOverlappingClaim());
console.timeEnd("part1");
