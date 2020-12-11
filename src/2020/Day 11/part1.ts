import { WaitingArea } from "./waitingArea";

console.time("part1");
const waitingArea = new WaitingArea("./seats.txt", 1);

let lastOccupied = -1;
// Mientras haya cambios en el numero de asientos ocupados computamos estados
while (lastOccupied != waitingArea.totalOccupiedSeats) {
  lastOccupied = waitingArea.totalOccupiedSeats;
  waitingArea.seats = waitingArea.computeNextState();
}
console.log("Answer:", lastOccupied);
console.timeEnd("part1");
