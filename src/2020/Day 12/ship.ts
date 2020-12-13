import * as fs from "fs";
import { IPoint, Point } from "../../common/point";
import { Segment } from "../../common/segment";

export class Ship {
  public movements: string[];
  private heading = 90;
  private position: IPoint = new Point(0, 0);
  private waypoint: IPoint = new Point(10, -1);
  private angles: Record<number, string> = {
    0: "N",
    90: "E",
    180: "S",
    270: "W",
  };

  constructor(movementsFile: string, private part: number) {
    this.movements = fs.readFileSync(movementsFile, "utf8").split("\r\n");
  }

  /**
   * Ejecuta una instruccion sobre el barco segun las reglas de la parte 1
   * @param direction Nombre del movimiento a ejecutar
   * @param amount Cantidad
   */
  private move1 = (direction: string, amount: number) => {
    if (direction == "F") direction = this.angles[this.heading];

    switch (direction) {
      case "L":
        this.heading -= amount;
        if (this.heading < 0) this.heading = 360 + this.heading;
        break;
      case "R":
        this.heading += amount;
        if (this.heading >= 360) this.heading = this.heading - 360;
        break;
      case "N":
        this.position.y -= amount;
        break;
      case "E":
        this.position.x += amount;
        break;
      case "S":
        this.position.y += amount;
        break;
      case "W":
        this.position.x -= amount;
        break;
    }
  };

  /**
   * Ejecuta una instruccion sobre el barco segun las reglas de la segunda parte
   * @param direction Nombre del movimiento a ejecutar
   * @param amount Cantidad
   */
  private move2 = (direction: string, amount: number) => {
    switch (direction) {
      case "F":
        //Mover el barco de acuerdo a la posicion del waypoint
        this.position.x += this.waypoint.x * amount;
        this.position.y += this.waypoint.y * amount;
        break;
      case "L":
        this.waypoint.rotate(-amount);
        break;
      case "R":
        this.waypoint.rotate(amount);
        break;
      case "N":
        this.waypoint.y -= amount;
        break;
      case "E":
        this.waypoint.x += amount;
        break;
      case "S":
        this.waypoint.y += amount;
        break;
      case "W":
        this.waypoint.x -= amount;
        break;
    }
  };

  /**
   * Ejecuta la lista de movimientos
   */
  public executeMovements = (): void =>
    this.movements.forEach((movement) =>
      this.part == 1
        ? this.move1(movement[0], parseInt(movement.substr(1)))
        : this.move2(movement[0], parseInt(movement.substr(1)))
    );

  /**
   * Devuelve la distancia Manhattan de la posicion actual a 0,0
   */
  public get currentManhattanDistanceToStart(): number {
    return new Segment(new Point(0, 0), this.position).manhattanLength;
  }
}
