import { program } from "./program";
import { Amplifiers } from "./amplifiers";

const amplifiers = new Amplifiers(program);

const result = amplifiers.tryAllSettings();

console.log(Math.max(...result.map(r => r.result)));
