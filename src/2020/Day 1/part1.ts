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
}

const costs = new ExpenseReport(expenses).findCosts();
console.log(costs);
console.log("Answer:", costs[0] * costs[1]);
