import { SatelliteLink } from "./satelliteLink";

console.time("part2");
const satelliteLink = new SatelliteLink("src/2020/day 20/messagesDemo.txt");

console.log("Answer:", satelliteLink.getValidMessages(2).length);
console.timeEnd("part2");
