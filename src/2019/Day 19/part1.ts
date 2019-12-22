import { BeamInspector } from "./beamInspector";

const grid = new BeamInspector().getBeam(50);
const affected = grid.reduce(
  (acum, row) => (acum += row.filter(c => c == 1).length),
  0
);
console.log(`Total: ${affected}`);
