import * as fs from "fs";
import { IPoint, Point } from "../../common/point";

export class WaitingArea {
  public seats: string[][];
  private rows: number;
  private cols: number;
  /**
   *
   * @param seatsFile fichero con la definicion de asientos de la sala
   * @param part parte del problema a resolver (1 o 2)
   */
  constructor(seatsFile: string, private part: number) {
    this.seats = fs
      .readFileSync(seatsFile, "utf8")
      .split("\r\n")
      .map((row) => Array.from(row));
    this.rows = this.seats.length;
    this.cols = this.seats[0].length;
  }

  /**
   * Calcula el numero de asientos ocupados adyacentes a uno dado
   * @param seat posicion del asiento
   */
  private occupiedAround = (seat: IPoint) => {
    if (this.seats[seat.y][seat.x] == ".") return 0;
    let occupied = 0;
    for (let y = -1; y < 2; y++)
      for (let x = -1; x < 2; x++) {
        if (x != 0 || y != 0) {
          const check =
            this.part == 1
              ? new Point(seat.x + x, seat.y + y)
              : this.nextSeatInLOS(seat, new Point(x, y));
          if (
            check.x > -1 &&
            check.y > -1 &&
            check.x < this.cols &&
            check.y < this.rows &&
            this.seats[check.y][check.x] == "#"
          )
            occupied++;
        }
      }
    return occupied;
  };

  /**
   * Calcula el siguiente estado de los asientos dependiendo de las reglas
   */
  public computeNextState = (): string[][] =>
    this.seats.map((row, y) =>
      row.map((seat, x) => {
        const occupiedAround = this.occupiedAround(new Point(x, y));
        return seat == "L" && occupiedAround == 0
          ? "#"
          : seat == "#" && occupiedAround > 2 + this.part //4 asientos en la parte 1 y 5 en la parte 2
          ? "L"
          : seat;
      })
    );

  /**
   * Devuelve el numero de asientos ocupados en la sala
   */
  public get totalOccupiedSeats(): number {
    return this.seats.reduce(
      (a, row) =>
        (a += row.reduce((as, seat) => (as += seat == "#" ? 1 : 0), 0)),
      0
    );
  }

  /**
   * Devuelve el siguiente asiento en la linea de vision desde el asiento seat siguiendo el la direccion (vector) dir
   */
  private nextSeatInLOS = (seat: IPoint, dir: IPoint): IPoint => {
    const check = new Point(seat.x + dir.x, seat.y + dir.y);
    while (
      check.x > -1 &&
      check.y > -1 &&
      check.x < this.cols &&
      check.y < this.rows &&
      this.seats[check.y][check.x] == "."
    ) {
      check.x += dir.x;
      check.y += dir.y;
    }

    return check;
  };
}
