import { Console } from "console";
import { CrabCups } from "./crabCups";
console.time("part1");
const crabCups = new CrabCups(1);

//Ejecutar 100 movimientos
let i = 0;
while (i++ < 100) crabCups.move();

const finalCircle = crabCups.circle;
//Obtener la siguiente copa a la 1
let currentCup = finalCircle.get(1);

//Recorrer el circulo hasta volver a la primera posicion
// apuntando el valor de cada copa
let answer = "";

while (currentCup != 1) {
  answer += currentCup;
  currentCup = finalCircle.get(currentCup);
}
console.log("Answer", answer);
console.timeEnd("part1");
