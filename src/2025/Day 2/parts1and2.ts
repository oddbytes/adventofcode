import * as fs from "fs";

const ranges = fs
  .readFileSync("./input.txt", "utf8")
  .split(",")
  .map((range) => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  });

console.time("Tiempo de ejecucion partes 1 y 2");
console.time("Tiempo de ejecucion parte 1");
//Para cada rango, calcular los numeros posibles que hay entre start y end
let solucion = 0;
ranges.forEach(({ start, end }) => {
  for (let currentId = start; currentId <= end; currentId++) {
    //Si la cifra tiene longitud par, comporbar si la primera parte d ela misma es igual a la misma
    const idStr = currentId.toString();
    if (idStr.length % 2 === 0) {
      const firstHalf = idStr.slice(0, idStr.length / 2);
      const secondHalf = idStr.slice(idStr.length / 2);
      if (firstHalf === secondHalf) {
        solucion += currentId;
      }
    }
  }
});

console.timeEnd("Tiempo de ejecucion parte 1");
console.log("Solucion parte 1: " + solucion);
//Parte 2: hay que contar las veces que el dial pasa por 0, no solo las que es exactamente 0.
console.time("Tiempo de ejecucion parte 2");
solucion = 0;

//Fuerza bruta
ranges.forEach(({ start, end }) => {
  for (let currentId = start; currentId <= end; currentId++) {
    //La secuencia que se puede repetir va desde el primer digito hasta la mitad del numero
    const idStr = currentId.toString();
    for (let len = 1; len <= Math.floor(idStr.length / 2); len++) {
      const sequence = idStr.slice(0, len);
      //optimizaciones. Son solo parciales
      //si la longitud de la cifra no es divisible entre la longitud de la secuencia no continuar.
      //si la cifra final de la secuencia no es igua a a la cifra final del numero no continuar
      if (
        sequence[sequence.length - 1] !== idStr[idStr.length - 1] ||
        sequence[0] !== idStr[sequence.length] ||
        idStr.length % len !== 0
      )
        continue;
      //Construir el numero repitiendo la secuencia las veces necesarias
      const repeatedSequence = sequence.repeat(idStr.length / len);
      if (repeatedSequence === idStr) {
        solucion += currentId;
        break;
      }
    }
  }
});
console.timeEnd("Tiempo de ejecucion parte 2");
console.log("Solucion parte 2: " + solucion);

console.timeEnd("Tiempo de ejecucion partes 1 y 2");
