import * as fs from "fs";
import { IPoint4D, Point4D } from "../../common/point4D";

export class ConwayCubesSpace4D {
  public cubes: Set<string> = new Set<string>();
  //Almacena las coordenadas de inicio del espacio actual
  private startDimensions: IPoint4D = new Point4D(0, 0, 0, 0);
  //Almacena las coordenadas finales del espacio actual
  private endDimensions: IPoint4D;

  constructor(initialStateFile: string) {
    const lines = fs.readFileSync(initialStateFile, "utf8").split("\r\n");
    this.endDimensions = new Point4D(
      lines[0].length - 1,
      lines.length - 1,
      0,
      0
    );
    lines.forEach((line, y) =>
      Array.from(line).forEach((cube, x) => {
        if (cube == "#") this.cubes.add(new Point4D(x, y, 0, 0).toString());
      })
    );
  }

  /**
   * Calcula el numero de cubos encendidos adyacentes a uno dado
   * @param seat posicion del asiento
   */
  private occupiedAround = (cube: IPoint4D) => {
    let on = 0;
    for (let w = -1; w < 2; w++)
      for (let z = -1; z < 2; z++)
        for (let y = -1; y < 2; y++)
          for (let x = -1; x < 2; x++) {
            if (x != 0 || y != 0 || z != 0 || w != 0) {
              const adjacentCube = new Point4D(
                cube.x + x,
                cube.y + y,
                cube.z + z,
                cube.w + w
              );
              if (
                this.cubes.has(adjacentCube.toString()) && //si no existe esta fuera del mapa o apagado
                adjacentCube.x >= this.startDimensions.x &&
                adjacentCube.y >= this.startDimensions.y &&
                adjacentCube.z >= this.startDimensions.z &&
                adjacentCube.w >= this.startDimensions.w &&
                adjacentCube.x <= this.endDimensions.x &&
                adjacentCube.y <= this.endDimensions.y &&
                adjacentCube.z <= this.endDimensions.z &&
                adjacentCube.w <= this.endDimensions.w //&&
                // this.cubes.get(adjacentCube.toString())
              )
                on++;
            }
          }

    return on;
  };

  /**
   * Ejecuta un ciclo de inicializacion
   * Añade dos posiciones en cada eje a las dimensiones y los recorre estableciendo los estados de cada cubo
   */
  public runCycle = (): void => {
    Object.keys(this.startDimensions).forEach(
      (key) => (this.startDimensions[key] -= 1)
    );

    Object.keys(this.endDimensions).forEach(
      (key) => (this.endDimensions[key] += 1)
    );

    //public cubes:
    const cycleCubes: Set<string> = new Set<string>();
    for (let w = this.startDimensions.w; w <= this.endDimensions.z; w++)
      for (let z = this.startDimensions.z; z <= this.endDimensions.z; z++)
        for (let y = this.startDimensions.y; y <= this.endDimensions.y; y++)
          for (let x = this.startDimensions.x; x <= this.endDimensions.x; x++) {
            const currentCube = new Point4D(x, y, z, w);
            // if (!cycleCubes.has(currentCube.toString()))
            //   cycleCubes.set(currentCube.toString(), false);
            const onAround = this.occupiedAround(currentCube);
            if (this.cubes.has(currentCube.toString())) {
              if (onAround > 1 && onAround < 4)
                cycleCubes.add(currentCube.toString());
            } else if (onAround == 3) cycleCubes.add(currentCube.toString());
          }

    this.cubes = cycleCubes;
  };
}
