import { signal } from "./signal";
import { SignalCleaner } from "./signalCleaner";
import { SignalCleaner2 } from "./signalCleaner2";
import { SignalCleaner3 } from "./signalCleaner3";

// te output repeats its end. See signalOutputPart 2 txt for samples

const signalLength = signal.length;
console.log(`Signal length: ${signalLength}`);
const offset = parseInt(signal.slice(0, 7).join(""));

const messageBlock = Math.floor(offset / signalLength);

const blockFromFinal = 10000 - messageBlock;

const neededRepetitions = blockFromFinal * 2;

const ungeneratedBytes = (10000 - neededRepetitions) * signalLength;

const newOffset = offset - ungeneratedBytes;
const repetitions = neededRepetitions;

let completeSignal: number[] = [];

for (let i = 0; i < repetitions; i++) {
  completeSignal = completeSignal.concat(signal);
}
const signalCleaner = new SignalCleaner3(completeSignal);
const cleanSignal = signalCleaner.cleanSignal(100);

/*let slice = cleanSignal.splice(0, signalLength);
// console.log(`\nReps: ${i}`);
let res = "";
while (slice.length > 0) {
  res += slice.join("") + "\n";
  slice = cleanSignal.splice(0, signalLength);
}
console.log(res);*/
// repetitions++;

const message = parseInt(cleanSignal.slice(newOffset - 1, 8).join(""));

console.log(`Offset: ${offset}  message: ${message}`);
