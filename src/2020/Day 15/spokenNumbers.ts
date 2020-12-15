import * as fs from "fs";

/**
 * representa un numero nombrado en el juego.
 */
interface ISpokenNumber {
  /** Última vez dicho */
  lastTurn: number;
  /**Penúltima vez dicho */
  previousTurn?: number;
}

export class SpokenNumbers {
  /**Utilizamos un mapa para guardar los numeros que ya hemos nombrado
   * https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Map
   */
  private spokenNumbers: Map<number, ISpokenNumber> = new Map<
    number,
    ISpokenNumber
  >();

  /** Turno actual */
  public turn = 0;
  /** Último número dicho */
  private lastSpokenNumber = -1;
  constructor(startnumbersFile: string) {
    //Lee el fichero de entrada y genera las entradas en el mapa de numeros nombrados
    // correspondientes a los numeros iniciales de la lista
    fs.readFileSync(startnumbersFile, "utf8")
      .split(",")
      .forEach((n) => this.setSpokenNumber(parseInt(n)));
  }

  /**
   * Crea o actualiza una entrada en el mapa de numeros nombrados
   * Avanza el contador de turnos
   * @param number Numero
   */
  private setSpokenNumber(number: number) {
    let spokenNumber = this.spokenNumbers.get(number);

    // Si el numero no ha aparecido hasta el momento en la lista, crear una nueva instancia para él
    if (!spokenNumber) {
      this.spokenNumbers.set(number, { lastTurn: this.turn });
    } else {
      //Si ha sido dicho, actualizar sus sus turnos de aparición
      spokenNumber.previousTurn = spokenNumber.lastTurn;
      spokenNumber.lastTurn = this.turn;
    }

    this.turn++;
  }

  /**
   * Devuelve el siguiente número de la lista. Si el anterior no ha sido nombrado nunca
   * añade 0 a la lista, si no la diferencia entre las dos ultimas veces que se ha nombrado
   * dicho numero
   */
  public spokeNext = (): number => {
    const prevSpoken = this.spokenNumbers.get(this.lastSpokenNumber);

    const newNumber =
      prevSpoken?.previousTurn != undefined
        ? prevSpoken.lastTurn - prevSpoken.previousTurn
        : 0;
    this.setSpokenNumber(newNumber);

    this.lastSpokenNumber = newNumber;

    return newNumber;
  };
}
