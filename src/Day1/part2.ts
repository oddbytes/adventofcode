import { modules } from "./modules";

class BetterFuelCalculator {
  private totalFuelForMass(mass: number) {
    let neededFuel = Math.floor(mass / 3) - 2;

    if (neededFuel > 0) neededFuel += this.totalFuelForMass(neededFuel);
    else neededFuel = 0;

    return neededFuel;
  }

  public fuelForMass(modules: number[]) {
    let fuelByModule = modules.map(m => this.totalFuelForMass(m));
    return fuelByModule.reduce((acc, fuel) => acc + fuel);
  }
}

const betterFuelCalculator = new BetterFuelCalculator();
console.log(betterFuelCalculator.fuelForMass(modules));
