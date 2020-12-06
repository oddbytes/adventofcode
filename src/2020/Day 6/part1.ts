import { AnswersDatabase } from "./groupAnswers";

console.time("part1");
const groups = new AnswersDatabase().read("./answers.txt");
console.log(
  "Answer:",
  groups.reduce((a, b) => a + b.uniqueAnswers.length, 0)
);
console.timeEnd("part1");
