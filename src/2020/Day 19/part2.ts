import { SatelliteLink } from "./satelliteLink";

console.time("part2");
const satelliteLink = new SatelliteLink("./messages.txt");

console.log("Answer:", satelliteLink.getValidMessages(2).length);
console.timeEnd("part2");
