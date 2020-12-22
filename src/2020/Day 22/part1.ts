import { Combat } from "./combat";

console.time("part1");
const combat = new Combat("./cards.txt");
const winningDeck = combat.play();

const cards = winningDeck.items.reverse();

console.log(
  "Answer:",
  cards.reduce((a, b, i) => (a += b * (i + 1)), 0)
);
console.timeEnd("part1");
