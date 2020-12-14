import * as fs from "fs";

console.time("part1");
const data = fs.readFileSync("./program.txt", "utf8").split("\r\n");

const mem: number[] = [];

/**
 * Aplica la máscara a un valor para obtener el valor final
 * @param unmaskedValue valor (decimal)
 * @param mask mascara a aplicar
 */
const maskValue = (unmaskedValue: number, mask: string): number =>
  new Number(
    "0b" +
      Array.from(unmaskedValue.toString(2).padStart(36, "0"))
        .map((bit, index) => (mask[index] == "X" ? bit : mask[index]))
        .join("")
  ).valueOf();

const reInstruction = /(?<op>mask|mem)(\[(?<address>\d+)\])? = (?<value>[X\d]+)/;
let mask = "";
// Ejecutar el programa
data.forEach((instruction) => {
  const inst = instruction.match(reInstruction);
  if (inst.groups["op"] == "mask") mask = inst.groups["value"];
  else
    mem[parseInt(inst.groups["address"])] = maskValue(
      parseInt(inst.groups["value"]),
      mask
    );
});

console.log(
  "Answer:",
  mem.reduce((a, b) => (a += b), 0)
);
console.timeEnd("part1");
