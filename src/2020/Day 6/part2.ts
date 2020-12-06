import { AnswersDatabase } from "./groupAnswers";

console.time("part2");
const groups = new AnswersDatabase().read("./answers.txt");
console.log(
  "Answer:",
  groups.reduce((a, b) => a + b.commonAnswers.length, 0)
);
console.timeEnd("part2");
