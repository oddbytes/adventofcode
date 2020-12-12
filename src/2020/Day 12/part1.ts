import { Ship } from "./ship";

console.time("part1");
const ship = new Ship("./movements.txt", 1);

ship.executeMovements();

console.log("Answer:", ship.currentManhattanDistanceToStart);
console.timeEnd("part1");
