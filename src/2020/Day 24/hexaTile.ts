import * as fs from "fs";
import { IPoint, Point } from "../../common/point";

type Movements = {
  steps: string[];
};
export class HexaTile {
  public blackTiles: Set<string> = new Set<string>();
  private movements: Movements[];

  //Dimensión más baja del espacio de suelo conocido
  private startDimensions: Point = new Point(0, 0);
  //Dimensión más alta del espacio de suelo conocido
  private endDimensions: Point = new Point(0, 0);

  /**
   * Offset de coordenadas de cada direccion
   */
  private offsets: Record<string, number[]> = {
    ne: [1, -1],
    e: [2, 0],
    se: [1, 1],
    sw: [-1, 1],
    w: [-2, 0],
    nw: [-1, -1],
  };

  constructor(movementsFile: string) {
    const reDir = /s(?:e|w)|e|w|n(?:e|w)/g;

    this.movements = fs
      .readFileSync(movementsFile, "utf8")
      .split("\r\n")
      .map((line) => ({
        steps: Array.from(line.matchAll(reDir)).map((m) => m[0]),
      }));
  }

  /**
   * Genera el estado inicial girando las baldosas identificadas por los diferentes movimientos a partir de la baldosa (0,0)
   */
  public flipTiles = (): Set<string> => {
    this.movements.forEach((movement) => {
      const tile = movement.steps.reduce((position, step) => {
        position.x += this.offsets[step][0];
        position.y += this.offsets[step][1];
        return position;
      }, new Point(0, 0));

      if (tile.x < this.startDimensions.x) this.startDimensions.x = tile.x;
      if (tile.x > this.endDimensions.x) this.endDimensions.x = tile.x;

      if (tile.y < this.startDimensions.y) this.startDimensions.y = tile.y;
      if (tile.y > this.endDimensions.y) this.endDimensions.y = tile.y;

      const tileKey = tile.toString();
      if (this.blackTiles.has(tileKey)) this.blackTiles.delete(tileKey);
      else this.blackTiles.add(tileKey);
    });
    return this.blackTiles;
  };

  /**
   * Ejecuta el numero de ciclos especificado
   * @param days Numero de ciclos (días ) a simular
   */
  public makeArt = (days: number): Set<string> => {
    while (days-- > 0) {
      this.runCycle();
    }

    return this.blackTiles;
  };

  /**
   * Calcula el numero de baldosas negras adyacentes a una dado
   * @param tile posicion de la baldosa
   */
  private blackAround = (tile: IPoint) => {
    let black = 0;
    for (let y = -1; y < 2; y++)
      for (
        let x = y % 2 == 0 ? -2 : -1; //la coordenada x es par en filas pares e impar en impares
        x < (y % 2 == 0 ? 4 : 2);
        x += 2
      ) {
        if (
          (x != 0 || y != 0) &&
          this.blackTiles.has(new Point(tile.x + x, tile.y + y).toString())
        )
          black++;
      }
    return black;
  };

  /**
   * Ejecuta un ciclo sobre las baldosas, generando un nuevo estado segun las reglas de la parte 2
   */
  public runCycle = (): void => {
    this.startDimensions.x -= 2;
    this.startDimensions.y--;
    this.endDimensions.x += 2;
    this.endDimensions.y++;

    const dayTiles: Set<string> = new Set<string>();

    for (let y = this.startDimensions.y; y <= this.endDimensions.y; y++)
      for (
        let x = this.startDimensions.x + (y % 2 == 0 ? 0 : -1); //la coordenada x es par en las filas pares e impar en las impares
        x <= this.endDimensions.x;
        x += 2
      ) {
        const currentTile = new Point(x, y);

        const blackAround = this.blackAround(currentTile);
        if (this.blackTiles.has(currentTile.toString())) {
          if (blackAround == 2 || blackAround == 1)
            dayTiles.add(currentTile.toString());
        } else if (blackAround == 2) dayTiles.add(currentTile.toString());
      }

    this.blackTiles = dayTiles;
  };
}
