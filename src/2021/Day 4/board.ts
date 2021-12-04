export class Board {
  //Numeros del carton
  public numbers: number[] = [];
  //Almacena el estado de cada numero
  public checked: number[];
  //Recibe las lineas con los numeros del carton separados por espacios (numeros con padding)
  private size: number;

  constructor(contents: string[]) {
    contents.forEach((line) =>
      line.split(" ").forEach((number) => {
        if (!isNaN(parseInt(number))) this.numbers.push(parseInt(number));
      })
    );

    this.checked = new Array(this.numbers.length).fill(0);
    this.size = Math.sqrt(this.numbers.length);
  }

  /**
   * Marks a number in this board
   * @param number number to check in
   * @returns this board if it wins when this number is checked
   */
  public mark = (number: number): Board => {
    const index = this.numbers.indexOf(number);
    if (index > -1) {
      this.checked[index] = 1;
      return this.checkRowColumn(index);
    }
    return null; //El cartón no contiene ese numero
  };

  //Comprueba si una linea o una columna del indice indicado tiene todos los numeros marcados
  public checkRowColumn = (index: number): Board => {
    const column = index % this.size;
    //comprobar la columna
    const columnIndexes = [...Array(this.size)].map(
      (_x, i) => column + this.size * i
    );
    const wonRow = columnIndexes.every((index) => this.checked[index] == 1);
    if (wonRow) return this;

    const row = Math.floor(index / this.size);
    const rowIndexes = [...Array(this.size)].map(
      (_x, i) => this.size * row + i
    );
    if (rowIndexes.every((index) => this.checked[index] == 1)) return this;
    return null;
  };

  public unmarkedNumbers = (): number[] =>
    this.numbers.filter((_n, i) => this.checked[i] == 0);
}
