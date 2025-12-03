import * as fs from "fs";

const rotations = fs
  .readFileSync("./input.txt", "utf8")
  .replace(/L/g, "-")
  .replace(/R/g, "")
  .split("\r\n")
  .map(Number);

console.time("Tiempo de ejecucion partes 1 y 2");
console.time("Tiempo de ejecucion parte 1");
//Insertar la posicion incial del dial, 50, en la posicion 0 del array
rotations.unshift(50);
var pasosPorCero = 0;
//Simular las rotaciones del dial, teniendo en cuenta que este va de la posicion 0 a la 99, y contar las veces que marca exactamente 0
var solucion = rotations.reduce((acc, curr, index, arr) => {
  if (index === 0) return acc;
  const actual = arr[index - 1];
  const next = arr[index - 1] + curr;
  let pasosPorCeroLocal = 0;
  if (actual != 0 && (next < 1 || next > 99)) {
    pasosPorCeroLocal = Math.ceil(Math.abs(next) / 100);
    pasosPorCero = pasosPorCero + pasosPorCeroLocal;
  }
  console.log(
    `Rotacion ${index}: ${curr}, Posicion anterior: ${arr[index - 1]}, Nueva posicion: ${next},Pasos por cero:${pasosPorCeroLocal}, Pasos por cero totales: ${pasosPorCero}`
  );
  arr[index] = (next + 100) % 100;
  if (arr[index] === 0) acc++;
  return acc;
}, 0);
console.timeEnd("Tiempo de ejecucion parte 1");
console.log("Solucion partes 1: " + solucion);
//Parte 2: hay que contar las veces que el dial pasa por 0, no solo las que es exactamente 0.
console.time("Tiempo de ejecucion parte 2");
console.log("Solucion parte 2: " + pasosPorCero);
console.timeEnd("Tiempo de ejecucion parte 2");
console.timeEnd("Tiempo de ejecucion partes 1 y 2");
