import { SatelliteLink } from "./satelliteLink";

console.time("part1");
const satelliteLink = new SatelliteLink("./messages.txt");

//console.log(satelliteLink.getValidMessages());
console.log("Answer:", satelliteLink.getValidMessages().length);
console.timeEnd("part1");
