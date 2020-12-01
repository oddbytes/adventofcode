import { expenses } from "./expenses";

class ExpenseReport {
  constructor(private expenses: number[]) {}

  public findCosts = (): number[] => {
    console.time("findCost");
    // Ordenamos los numeros
    this.expenses = this.expenses.sort();
    const costs: number[] = [];
    for (let index1 = 0; index1 < this.expenses.length && costs.length == 0; index1++)
      for (
        let index2 = index1 + 1;
        index2 < this.expenses.length &&
        costs.length == 0 &&
        this.expenses[index1] + this.expenses[index2] < 2020; //no iterar en combinaciones de numeros que sumen mas de 2019, no existe un tercer numero enese caso
        index2++
      ) {
        //Buscar el indice del  numero que sumado a los otros 2 nos de 2020
        const index3 = this.expenses.findIndex(
          (n) => n === 2020 - (this.expenses[index1] + this.expenses[index2]) && n != index1 && n != index2
        );
        if (index3 > -1) costs.push(this.expenses[index1], this.expenses[index2], this.expenses[index3]);
      }

    console.timeEnd("findCost");

    return costs;
  };
}

const costs = new ExpenseReport(expenses).findCosts();
console.log(costs);
console.log("Answer:", costs[0] * costs[1] * costs[2]);
