import { LogicGates } from "./logicGates";

console.time("part1");
const logicGates = new LogicGates("wires.txt");

console.log("Aswer:", logicGates.getWireValue(logicGates.findWire("a")));
console.timeEnd("part1");
