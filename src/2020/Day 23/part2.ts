import { CrabCups } from "./crabCups";
console.time("part2");
const crabCups = new CrabCups(2);
// Ejecutar 10 millones de movimientos
let i = 0;
while (i++ < 10000000) crabCups.move();

//Obtener las dos copas siguientes a la 1
const firstCup = crabCups.circle.get(1);
const nextCup = crabCups.circle.get(firstCup);

//Devolver la multiplicacion
console.log("Answer", firstCup, "*", nextCup, "=", firstCup * nextCup);
console.timeEnd("part2");
