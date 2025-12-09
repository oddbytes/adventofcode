import * as fs from "fs";
const ranges: number[][] = [];
const ids: number[] = [];
fs.readFileSync("./input.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    if (line.includes("-")) {
      const [start, end] = line.split("-").map(Number);
      ranges.push([start, end]);
    } else {
      if (line.trim() === "") return;
      ids.push(Number(line));
    }
  });
let solucion = 0;
console.time("Tiempo de ejecucion partes 1 y 2");
console.time("Tiempo de ejecucion parte 1");

//Ordenar los rangos por start ascendente
ranges.sort((a, b) => a[0] - b[0]);

//Encontrar el numero de ids que estan dentro de al menos un rango, es decir, el id es >= start y <= end
// Si id>=start && id<=end entonces el id esta dentro del rango
//Si id>end no seguir mirando rangos (estan ordenados)
for (const id of ids) {
  //Buscar un rango donde id este entre start y end
  ranges.find(([start, end]) => id >= start && id <= end) ? solucion++ : null;
}

console.timeEnd("Tiempo de ejecucion parte 1");
console.log("Solucion parte 1: " + solucion);
solucion = 0;

//Parte 2: obtener los ids unicos que se consideran dentro de los rangos
//Para ello hay que reorganizar los rangos eliminando los que estan contenidos en otros o ampliando los que se sobreponen
//Paso 1 - los rangos ya estan ordenados
//Paso 2 - recorrer los rangos y unir los que se sobreponen o estan contenidos
for (let i = 0; i < ranges.length - 1; i++) {
  const [start1, end1] = ranges[i];
  const [start2, end2] = ranges[i + 1];
  if (end1 >= start2) {
    //Los rangos se sobreponen o estan contenidos
    const newEnd = Math.max(end1, end2);
    ranges[i] = [start1, newEnd];
    ranges.splice(i + 1, 1); //eliminar l el segundo rango
    i--; //Volver a comprobar el rango modificado por si se sobrepone con el siguiente
  }
}
//Paso 3 - contar los ids unicos dentro de los rangos resultantes contando el tamaño de cada rango
solucion = ranges.reduce((acc, [start, end]) => acc + (end - start + 1), 0);

console.time("Tiempo de ejecucion parte 2");

//Para cada banco hallar el numero mayor desde la posicion actual hasta la lenght-paso-1

console.timeEnd("Tiempo de ejecucion parte 2");
console.log("Solucion parte 2: " + solucion);

console.timeEnd("Tiempo de ejecucion partes 1 y 2");
