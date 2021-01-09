console.time("part1");

let sequence = "1321131112";

//Expresion regular con back-reference para capturar numeros repetidos o no (\1+)?
const repeatingNumber = /(\d)(\1+)?/g;

const executeStep = (sequence: string): string =>
  Array.from(sequence.matchAll(repeatingNumber)).reduce<string>(
    (newSequence: string, match: RegExpMatchArray) =>
      (newSequence += match[0].length.toString() + match[1]),
    ""
  );

for (let step = 0; step < 40; step++) {
  sequence = executeStep(sequence);
}

console.log("Answer 1:", sequence.length);
console.timeEnd("part1");

console.time("part2");
for (let step = 0; step < 10; step++) {
  sequence = executeStep(sequence);
}
console.log("Answer 2:", sequence.length);
console.timeEnd("part2");
