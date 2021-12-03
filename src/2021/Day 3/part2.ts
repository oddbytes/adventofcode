import * as fs from "fs";

const diagnostics = fs.readFileSync("./puzzle.txt", "utf8").split("\r\n");

//Cuenta los bit 1 en cada posicion
const getBitCount = (diagnostics: string[]) =>
  diagnostics[0]
    .split("")
    .map((_v, index) =>
      diagnostics.reduce((sum, bits) => (sum += parseInt(bits[index])), 0)
    );

const filter = (diagnostics: string[], position = 0, LSB = false) => {
  const bitCount = getBitCount(diagnostics);
  let mask = bitCount
    .map((b) => (b >= diagnostics.length / 2 ? "1" : "0"))
    .join("");
  if (LSB) {
    mask = mask
      .split("")
      .map((b) => (b == "1" ? "0" : "1"))
      .join("");
  }

  const filtered = diagnostics.filter((d) => d[position] == mask[position]);
  return filtered.length == 1 ? filtered[0] : filter(filtered, ++position, LSB);
};

const oxygen = parseInt(filter(diagnostics), 2);
const co2 = parseInt(filter(diagnostics, 0, true), 2);

console.log("Response:", oxygen * co2);
