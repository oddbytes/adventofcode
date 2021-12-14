import * as fs from "fs";

console.time("day14");

const file = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .filter((l) => l.length);
let template: string[] = [];
const rules = new Map<string, string>();
file
  .filter((l) => l.length)
  .forEach((line, index) => {
    if (index == 0) template = line.split("");
    else {
      const [pair, insert] = line.split(" -> ");
      rules.set(pair, insert);
    }
  });

const stepMap = (pairs: Map<string, number>, rules: Map<string, string>) => {
  [...pairs]
    .filter((p) => p[1])
    .forEach((keyvalue) => {
      //for each pair with value>0
      const [pair, value] = keyvalue;
      const newPair1 = pair[0] + rules.get(pair); //Add new pairs
      const newPair2 = rules.get(pair) + pair[1];
      pairs.set(newPair1, (pairs.get(newPair1) ?? 0) + value);
      pairs.set(newPair2, (pairs.get(newPair2) ?? 0) + value);
      pairs.set(pair, pairs.get(pair) - value); //Delete current pair
    });
};

const polymerValueMap = (
  pairs: Map<string, number>,
  endingLetter: string
): number => {
  const ocurrences = new Map<string, number>();
  [...pairs].forEach((keyvalue) => {
    //count ocurrences of each first letter in pair
    const [pair, value] = keyvalue;
    ocurrences.set(pair[0], (ocurrences.get(pair[0]) ?? 0) + value);
  });
  ocurrences.set(endingLetter, ocurrences.get(endingLetter) + 1); //last letter of polymer
  return Math.max(...ocurrences.values()) - Math.min(...ocurrences.values());
};

const pairs = new Map<string, number>();
for (let index = 0; index < template.length - 1; index++)
  pairs.set(template.slice(index, index + 2).join(""), 1);

for (let i = 0; i < 10; i++) {
  stepMap(pairs, rules);
  //let l = [...pairs].reduce((a, kv) => (a += kv[1]), 0) + 1; polymer length
}
console.log("Answer 1:", polymerValueMap(pairs, template[template.length - 1]));

for (let i = 0; i < 30; i++) {
  stepMap(pairs, rules);
}
console.log("Answer 2:", polymerValueMap(pairs, template[template.length - 1]));

console.timeEnd("day14");
