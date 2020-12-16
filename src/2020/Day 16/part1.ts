import { TicketsChecker } from "./ticketsChecker";
console.time("part1");

const ticketsChecker = new TicketsChecker("./tickets.txt");
const invalidFields = ticketsChecker.findInvalidFields();
console.log(
  "Answer:",
  invalidFields.reduce((a, b) => (a += b), 0)
);
console.timeEnd("part1");
