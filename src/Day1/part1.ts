import {modules} from "./modules"

class FuelCalculator {
  /**
   * Calculates the fuel needed for a given mass
   * @param modules list of modules' masses
   */
  public fuelForMass(modules: number[]) {
    return modules
      .map(m => Math.floor(m / 3) - 2)
      .reduce((acc, val) => acc + val);
  }
}

const fuelCalculator = new FuelCalculator();
console.log("Needed fuel:", fuelCalculator.fuelForMass(modules));
