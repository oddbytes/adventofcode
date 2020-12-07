import { RulesFile } from "./bagNode";

console.time("part2");
const bags = new RulesFile().read("./bagRules.txt");

const origin = bags.find((bag) => bag.color == "shiny gold");

console.log("Answer:", origin.containedBags);

console.timeEnd("part2");
