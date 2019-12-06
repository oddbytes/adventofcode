// What is the first frequency your device reaches twice?
import { frecuencyChanges } from "./freqchanges";
//const frecuencyChanges = [-6, +3, +8, +5, -6];
let repeated = false;
let frecuencyChangeIndex = 0;
let frecuencyIndex = 1;
const frequencies: number[] = [0];

while (!repeated) {
  const newFrecuency =
    frequencies[frecuencyIndex - 1] + frecuencyChanges[frecuencyChangeIndex];

  repeated = frequencies.indexOf(newFrecuency) > -1;

  if (++frecuencyChangeIndex == frecuencyChanges.length)
    frecuencyChangeIndex = 0;

  frequencies[frecuencyIndex++] = newFrecuency;
}
console.log(frequencies[frequencies.length - 1]);
