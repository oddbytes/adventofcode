//https://www.reddit.com/r/adventofcode/comments/e7aqcb/2019_day_7_part_2_confused_with_the_question/

import { LoopAmplifiers } from "./loopAmplifiers";
import { program } from "./program";

const amplifiers = new LoopAmplifiers(program);

const result = amplifiers.tryAllSettings();

console.log(Math.max(...result.map(r => r.result)));
