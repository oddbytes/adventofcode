import { expenses } from "./expenses";

class ExpenseReport {
  constructor(private expenses: number[]) {}

  public findCosts = (): number[] => {
    console.time("findCost");

    // Ordenamos los numeros
    this.expenses = this.expenses.sort((a, b) => a - b);

    const costs: number[] = [];
    for (let index1 = 0; index1 < this.expenses.length && costs.length == 0; index1++)
      for (
        let index2 = index1 + 1;
        index2 < this.expenses.length &&
        costs.length == 0 && //no continuar iterando si hemos hallado la respuesta
        this.expenses[index1] + this.expenses[index2] < 2021; // no continuar iterando si las suma supera los 2020
        index2++
      )
        if (this.expenses[index1] + this.expenses[index2] === 2020)
          costs.push(this.expenses[index1], this.expenses[index2]);

    console.timeEnd("findCost");

    return costs;
  };

  public findCostsN = (): number[] => {
    console.time("findCostN");

    // Ordenamos los numeros
    this.expenses = this.expenses.sort();
    let start = 0,
      end = this.expenses.length - 1;
    // Ajustar los indices teniendo en cuenta la ordenacion

    while (this.expenses[start] + this.expenses[end] !== 2020)
      if (this.expenses[start] + this.expenses[end] > 2020) end--;
      else start++;

    console.timeEnd("findCostN");
    return [this.expenses[start], this.expenses[end]];
  };
}

const costs = new ExpenseReport(expenses).findCosts();
console.log(costs);
console.log("Answer:", costs[0] * costs[1]);

const costs2 = new ExpenseReport(expenses).findCostsN();
console.log(costs2);
console.log("Answer:", costs2[0] * costs2[1]);
