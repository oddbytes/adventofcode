import { ExpressionEvaluator } from "./expressionEvaluator";
console.time("part1");
const expressionEvaluator = new ExpressionEvaluator("./operations.txt");
console.log(
  "Answer:",
  expressionEvaluator.evaluateAll(false).reduce((a, b) => (a += b))
);
console.timeEnd("part1");
