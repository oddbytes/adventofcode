import { frecuencyChanges } from "./freqchanges";

console.log(
  frecuencyChanges.reduce((accum, freqchange) => accum + freqchange, 0)
);
