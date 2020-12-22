import { Combat } from "./combat";

console.time("part2");
const combat = new Combat("./cards.txt");
const winner = combat.playRecursive(combat.player1Cards, combat.player2Cards);

let cards = winner == 1 ? combat.player1Cards.items : combat.player2Cards.items;
cards = cards.reverse();

console.log(
  "Answer:",
  cards.reduce((a, b, i) => (a += b * (i + 1)), 0)
);
console.timeEnd("part2");
