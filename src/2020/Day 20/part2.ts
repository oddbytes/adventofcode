import { EdgeDetector } from "./edgeDetector";

console.time("part2");
const edgeDetector = new EdgeDetector("src/2020/day 20/tiles.txt");

const outerTiles = edgeDetector.getImage();

// console.log(
//   "Answer:",
//   outerTiles.map((t) => t.id).reduce((a, b) => (a *= b), 1)
// );
console.timeEnd("part2");
