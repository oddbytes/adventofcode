import * as fs from "fs";

const banks = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((bank) => bank.split("").map(Number));
let solucion = 0;
console.time("Tiempo de ejecucion partes 1 y 2");
console.time("Tiempo de ejecucion parte 1");
//Para cada banco hallar el numero mayor desde la posicion 0 a la length-1
banks.forEach((bank) => {
  const primer = Math.max(...bank.slice(0, bank.length - 1));
  const pos = bank.indexOf(primer);
  const segundo = Math.max(...bank.slice(pos + 1));
  solucion += primer * 10 + segundo;
});

console.timeEnd("Tiempo de ejecucion parte 1");
console.log("Solucion parte 1: " + solucion);
//Parte 2: hay que contar las veces que el dial pasa por 0, no solo las que es exactamente 0.
console.time("Tiempo de ejecucion parte 2");

console.timeEnd("Tiempo de ejecucion parte 2");
console.log("Solucion parte 2: " + solucion);

console.timeEnd("Tiempo de ejecucion partes 1 y 2");
