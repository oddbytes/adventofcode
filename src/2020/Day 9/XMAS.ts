import * as fs from "fs";
export class XMAS {
  private data: number[];
  constructor(serialDataFile: string, private preambleLength = 25) {
    this.data = fs
      .readFileSync(serialDataFile, "utf8")
      .split("\r\n")
      .map((n) => parseInt(n));
  }

  /**
   * Devuelve los dos numeros del intervalo indicado que sumados den el numero buscado
   * @param interval Intervalo de numeros en los que buscar
   * @param sum Suma a encontrar
   */
  private findSumNumbers = (interval: number[], sum: number): number[] => {
    // Ordenamos los numeros
    interval = interval.sort((a, b) => a - b); //ojo
    let start = 0,
      end = interval.length - 1;
    // Ajustar los indices teniendo en cuenta la ordenacion
    while (interval[start] + interval[end] !== sum && start < end)
      if (interval[start] + interval[end] > sum) end--;
      else start++;
    return [interval[start], interval[end]];
  };

  /**
   * Busca el numero erroneo en la secuencia XMAS
   */
  public findChecksumError = (): number => {
    for (let index = this.preambleLength; index < this.data.length; index++) {
      const ops = this.findSumNumbers(
        this.data.slice(index - this.preambleLength, index),
        this.data[index]
      );
      if (ops[0] + ops[1] != this.data[index]) return this.data[index];
    }
    return -1;
  };

  /**
   * Encuentra una intervalo de numeros en la secuencia de datos que den como suma el parámetro indicado
   * @param number Numero a buscar
   */
  public findRange = (number: number): number[] => {
    // Calcular un intervalo incial
    let sum = this.data[0],
      start = 0,
      end = 0;
    const maxIndex = this.data.findIndex((n) => n == number);
    while (end < maxIndex && sum <= number) sum += this.data[++end];

    //Si no hemos encontrado el rango partiendo de 0, mover los limites inferior y superior
    while (sum != number && end < maxIndex) {
      //Eliminar numeros por la parte inferior del rango hasta que la suma sea inferior al número buscado
      sum -= this.data[start++];

      // Añadir numeros por la parte superior del rango hasta que la suma sea igual o superior al número buscado
      while (sum < number && end < maxIndex) {
        sum += this.data[++end];
      }
    }

    return this.data.slice(start, end + 1);
  };
}
