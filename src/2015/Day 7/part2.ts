import { LogicGates } from "./logicGates";

console.time("part2");
const logicGates = new LogicGates("wires.txt");
logicGates.findWire("b").value = 16076;

console.log("Aswer:", logicGates.getWireValue(logicGates.findWire("a")));
console.timeEnd("part2");
