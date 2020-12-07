import { IBagNode, RulesFile } from "./bagNode";

console.time("part1");
const bags = new RulesFile().read("./bagRules.txt");
const origin = bags.find((bag) => bag.color == "shiny gold");
console.log("Answer:", new Set<IBagNode>(...[origin.containers]).size);
console.timeEnd("part1");
