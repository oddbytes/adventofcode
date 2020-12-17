import * as fs from "fs";
import { IPoint3D, Point3D } from "../../common/point3D";

/**
 * Representa el espacio tridimensional conocido en el que existen los cubos
 */
export class ConwayCubesSpace3D {
  public cubes: Set<string> = new Set<string>();
  //Almacena las coordenadas de inicio del espacio actual
  private startDimensions: IPoint3D = new Point3D(0, 0, 0);
  //Almacena las coordenadas finales del espacio actual
  private endDimensions: IPoint3D;

  constructor(initialStateFile: string) {
    const lines = fs.readFileSync(initialStateFile, "utf8").split("\r\n");
    this.endDimensions = new Point3D(lines[0].length - 1, lines.length - 1, 0);
    lines.forEach((line, y) =>
      Array.from(line).forEach((cube, x) => {
        if (cube == "#") this.cubes.add(new Point3D(x, y, 0).toString());
      })
    );
  }

  /**
   * Calcula el numero de cubos encendidos adyacentes a uno dado
   * @param seat posicion del cubo
   */
  private onAround = (cube: IPoint3D) => {
    let on = 0;
    for (let z = -1; z < 2; z++)
      for (let y = -1; y < 2; y++)
        for (let x = -1; x < 2; x++) {
          if (x != 0 || y != 0 || z != 0) {
            const adjacentCube = new Point3D(
              cube.x + x,
              cube.y + y,
              cube.z + z
            );
            if (
              this.cubes.has(adjacentCube.toString()) && //si no existe, está fuera del mapa o apagado
              adjacentCube.x >= this.startDimensions.x &&
              adjacentCube.y >= this.startDimensions.y &&
              adjacentCube.z >= this.startDimensions.z &&
              adjacentCube.x <= this.endDimensions.x &&
              adjacentCube.y <= this.endDimensions.y &&
              adjacentCube.z <= this.endDimensions.z
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

    const cycleCubes: Set<string> = new Set<string>();

    for (let z = this.startDimensions.z; z <= this.endDimensions.z; z++)
      for (let y = this.startDimensions.y; y <= this.endDimensions.y; y++)
        for (let x = this.startDimensions.x; x <= this.endDimensions.x; x++) {
          const currentCube = new Point3D(x, y, z);

          const onAround = this.onAround(currentCube);
          if (this.cubes.has(currentCube.toString())) {
            if (onAround > 1 && onAround < 4)
              cycleCubes.add(currentCube.toString());
          } else if (onAround == 3) cycleCubes.add(currentCube.toString());
        }

    this.cubes = cycleCubes;
  };

  public renderSpace = (): string => {
    let space = "";

    for (let z = this.startDimensions.z; z <= this.endDimensions.z; z++) {
      space += "z:" + z;

      for (let y = this.startDimensions.y; y <= this.endDimensions.y; y++) {
        space += "\r\n";
        for (let x = this.startDimensions.x; x <= this.endDimensions.x; x++) {
          space += this.cubes.has(new Point3D(x, y, z).toString()) ? "#" : ".";
        }
      }
      space += "\r\n\r\n";
    }
    return space;
  };
}
