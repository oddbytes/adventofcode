import { TicketsChecker } from "./ticketsChecker";
console.time("part2");
const ticketsChecker = new TicketsChecker("./tickets.txt");
const values = ticketsChecker.getDeparture();

console.log(
  "Answer:",
  values.reduce((a, b) => (a *= b), 1)
);
console.timeEnd("part2");
