import * as fs from "fs";
const reDistances = /^(?<from>.*) to (?<to>.*) = (?<distance>\d+)$/;
const distances = {};

type Route = { city: string; distance: number };

fs.readFileSync("./distances.txt", "utf8")
  .split("\r\n")
  .map((line) => {
    const match = line.match(reDistances);
    const distance = parseInt(match.groups["distance"]);
    const from = match.groups["from"];
    const to = match.groups["to"];
    if (!distances[from]) distances[from] = [] as Route[];
    distances[from].push({ city: to, distance });
    if (!distances[to]) distances[to] = [] as Route[];
    distances[to].push({ city: from, distance });
  });

const minDistance = [];

//Empezando desde cada una d elas ciudades, calcular la distancia recorrida si vamos desde una ciudad
// hasta la mas cercana a esa que no haya sido visitada aun
for (const startCity of Object.keys(distances)) {
  minDistance.push(0);

  const unvisited = new Set(Object.keys(distances));
  let nextCity = startCity;

  while (unvisited.size > 0) {
    unvisited.delete(nextCity);
    const nextCities = (distances[nextCity] as Route[])
      .filter((c) => unvisited.has(c.city))
      .sort((a, b) => a.distance - b.distance);
    if (nextCities.length > 0) {
      nextCity = nextCities[0].city;
      minDistance[minDistance.length - 1] += nextCities[0].distance;
    }
  }
  console.log(startCity, minDistance[minDistance.length - 1]);
}

console.log("Answer:", Math.min(...minDistance));
