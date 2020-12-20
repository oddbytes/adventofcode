import { timeStamp } from "console";
import * as fs from "fs";
import { IPoint, Point } from "../../common/point";

type Tile = {
  id: number;
  edges: number[];
  content: string[];
  position: IPoint;
};

export class EdgeDetector {
  public tiles: Tile[];

  private edge: Record<string, number> = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3,
  };

  constructor(tilesFile: string) {
    this.tiles = fs
      .readFileSync(tilesFile, "utf8")
      .split("\r\n\r\n")
      .map((tileDef) => {
        const lines = tileDef.split("\r\n");
        const tile: Tile = {
          id: parseInt(lines[0].substr(5, lines[0].length - 6)),
          edges: [],
          content: lines.slice(1),
          position: new Point(-1, -1),
        };

        tile.edges.push(this.getEdgeId(lines[1]));

        tile.edges.push(
          this.getEdgeId(
            lines
              .slice(1)
              .map((l) => l[l.length - 1])
              .join("")
          )
        );
        tile.edges.push(this.getEdgeId(lines[lines.length - 1]));

        tile.edges.push(
          this.getEdgeId(
            lines
              .slice(1)
              .map((l) => l[0])
              .join("")
          )
        );

        return tile;
      });
  }

  /**
   * Dado un borde obtiene un identificador numerico unico para el borde
   * @param edge Cadena que representa el borde
   */
  getEdgeId = (edge: string): number => {
    const straight = edge.replace(/#/g, "1").replace(/\./g, "0");
    const reverse = Array.from(straight).reverse().join("");
    return Math.min(
      new Number("0b" + straight) as number,
      new Number("0b" + reverse) as number
    );
  };

  /**
   * Obtiene  las piezas de las esquinas, aquellas con dos bordes que no cuadran con ningun otro
   */
  getCornerTiles = (): Tile[] => {
    const allEdges = this.allEdges();

    //Los outer son lo que no estan repetidos
    const outerEdges = allEdges.filter((e) => {
      return allEdges.filter((ed) => ed == e).length == 1;
    });

    //localizar las piezas que tiene al menos dos bordes en la coleccion de outer
    return this.tiles.filter(
      (t) => t.edges.filter((e) => outerEdges.includes(e)).length == 2
    );
  };

  private allEdges = () => this.tiles.flatMap((t) => t.edges);

  private rotate = (tile: Tile): Tile => {
    tile.content = tile.content.map((l) => Array.from(l).reverse().join(""));
    const edgeId = tile.edges[this.edge.left];
    tile.edges[this.edge.left] = tile.edges[this.edge.right];
    tile.edges[this.edge.right] = edgeId;
    return tile;
  };

  private flip = (tile: Tile): Tile => {
    tile.content = tile.content.reverse();
    const edgeId = tile.edges[this.edge.top];
    tile.edges[this.edge.top] = tile.edges[this.edge.bottom];
    tile.edges[this.edge.bottom] = edgeId;
    return tile;
  };

  /**
   *
   * @param tile pieza a la que hay que encontrar una pareja
   * @param leftRight busca match en vertical u horizontal
   */
  private findMatch = (tile: Tile, leftRight: boolean): Tile => {
    const lookForEdge = leftRight ? this.edge.left : this.edge.top;
    const lookForId = tile.edges[(lookForEdge + 2) % 4];
    console.log("Buscando id:", lookForId);
    //buscar tile con ese id de lado

    const foundTile = this.tiles
      .filter((t) => t.position.x == -1) //no buscar en las ya encontradas
      .find((t) => t.edges.includes(lookForId) && t.id != tile.id);

    //Comprobar que esta ne el lado correcto. sino rotar
    if (foundTile.edges[lookForEdge] != lookForId)
      return leftRight ? this.rotate(foundTile) : this.flip(foundTile);
    return foundTile;
  };

  public getImage = (): string[] => {
    //Montar el puzle empezando desde la esquina superior izquierda
    const cornerTiles = this.getCornerTiles();
    //Buscamos la que tenga llos lados no comunes arriba y al izquierda
    const puzzleSize = Math.sqrt(this.tiles.length);
    const allEdges = this.allEdges();

    const commonEdges = allEdges.filter((e) => {
      return allEdges.filter((ed) => ed == e).length == 2;
    });

    const firstTile: Tile = cornerTiles.find(
      (_tile, index) =>
        !commonEdges.includes(cornerTiles[index].edges[this.edge.top]) &&
        !commonEdges.includes(cornerTiles[index].edges[this.edge.left])
    );

    if (!firstTile)
      //La primera pieza esta girada , hay que buscar entre las cuatro de las  esquinas rotandolas
      throw new Error("Primera pieza no encontrada"); //no es el caso de mi juego de datos.

    //A partir del primera pieza montar las restantes
    let x = 0,
      y = 0;
    let image: Tiles[] = [];
    let currentTile = firstTile;
    while (y * puzzleSize + x < this.tiles.length) {
      currentTile.position.x = x;
      currentTile.position.y = y;
      if (++x > puzzleSize - 1) {
        y++;
        x = 0;
        currentTile = this.tiles.find(
          (t) => t.position.x == 0 && t.position.y == y - 1
        );
      }
      //Colocamos de izquierda a derecha y arriba abajo
      currentTile = this.findMatch(currentTile, x > 0);

      console.log(
        "Encontradas:",
        this.tiles.filter((t) => t.position.x > -1).length,
        "de",
        this.tiles.length
      );
    }
  };
}
