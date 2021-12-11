import * as fs from "fs";
const reHappiness = /(?<person>.+) would (?<op>(lose|gain)) (?<quantity>\d+) happiness units by sitting next to (?<person2>.+)\./g;

const file = fs.readFileSync("./puzzleDemo.txt", "utf8");
const persons = [];
let matches;
while ((matches = reHappiness.exec(file)) != null) {
  if (!persons[matches.groups["person"]])
    persons[matches.groups["person"]] = [];
  persons[matches.groups["person"]].push({
    happiness:
      (matches.groups["op"] == "gain" ? 1 : -1) *
      parseInt(matches.groups["quantity"]),
    person: matches.groups["person2"],
  });
}

//empezando por una persona, poner a su lado el que maximice su felicidad y continuar con ese hasta que no quede nadie
let totalHappiness = 0;
let currPerson = persons[0];
while (currPerson) {
  const maxH = currPerson.find();
}
console.log(persons);

console.log("Answer", 0);
