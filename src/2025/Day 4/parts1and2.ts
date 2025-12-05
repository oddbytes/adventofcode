import * as fs from "fs";

let rolls = fs
  .readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((bank) => bank.split(""));
let solucion = 0;
console.time("Tiempo de ejecucion partes 1 y 2");
console.time("Tiempo de ejecucion parte 1");

const removeRolls = (
  rolls: string[][]
): { rolls: string[][]; removed: number } => {
  //Recorremos el array de rolls. Para cada posicion, calculamos las 8 posiciones adyacentes y contamos cuantas son '@'
  const newRolls = JSON.parse(JSON.stringify(rolls));
  //newRolls.forEach((row) => console.log(row.join("")));

  const width = rolls[0].length;
  const height = rolls.length;
  let solucion = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rolls[y][x] !== "@") continue; //No comprobar posiciones vacias
      let adjacents = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (rolls[ny][nx] === "@") adjacents++;
          }
        }
      }
      // console.log(`Posicion (${x},${y}) tiene ${adjacents} adyacentes '@'`);
      if (adjacents < 4) {
        solucion++;
        newRolls[y][x] = ".";
      }
    }
  }
  return { rolls: newRolls, removed: solucion };
};

solucion = removeRolls(rolls).removed;

console.timeEnd("Tiempo de ejecucion parte 1");
console.log("Solucion parte 1: " + solucion);
//Parte 2: hay que ejecutar la rutina hasta que no se pueda eliminar ningun rollo mas
solucion = 0;
let removedRolls = 1;
let paso = 0;
while (removedRolls > 0) {
  const newState = removeRolls(rolls);
  rolls = newState.rolls;
  removedRolls = newState.removed;
  solucion += removedRolls;

  // console.log(`Paso ${paso} - Rollos eliminados: ${removedRolls}`);
  paso++;
}
console.time("Tiempo de ejecucion parte 2");

//Para cada banco hallar el numero mayor desde la posicion actual hasta la lenght-paso-1

console.timeEnd("Tiempo de ejecucion parte 2");
console.log("Solucion parte 2: " + solucion);

console.timeEnd("Tiempo de ejecucion partes 1 y 2");
