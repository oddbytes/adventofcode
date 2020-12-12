import { Ship } from "./ship";

console.time("part2");
const ship = new Ship("./movements.txt", 2);

ship.executeMovements();

console.log("Answer:", Math.round(ship.currentManhattanDistanceToStart));
console.timeEnd("part2");
