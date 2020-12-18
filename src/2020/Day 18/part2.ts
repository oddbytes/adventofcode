import { ExpressionEvaluator } from "./expressionEvaluator";
console.time("part2");
const expressionEvaluator = new ExpressionEvaluator("./operations.txt");
console.log(
  "Answer:",
  expressionEvaluator.evaluateAll(true).reduce((a, b) => (a += b))
);
console.timeEnd("part2");
