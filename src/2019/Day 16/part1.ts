import { signal } from "./signal";
import { SignalCleaner } from "./signalCleaner";
import { SignalCleaner2 } from "./signalCleaner2";
import { SignalCleaner3 } from "./signalCleaner3";

const signalCleaner = new SignalCleaner3(signal);
console.log(
  "First 8 simbols: " +
    signalCleaner
      .cleanSignal(100)
      .slice(0, 8)
      .join("")
);
