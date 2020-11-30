import { signal } from "./signal";
import { SignalCleaner3 } from "./signalCleaner3";

const signalCleaner = new SignalCleaner3(signal);
console.log("First 8 simbols: " + signalCleaner.cleanSignal(100).slice(0, 8).join(""));
