import * as fs from "fs";
import { IPoint, Point } from "../../common/point";
enum edge {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3,
}

type Tile = {
  id: number;
  edges: number[];
  content: string[];
  position: IPoint;
};

export class PuzzleSolver {
  public tiles: Tile[];
  private puzzleSide: number;

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
    this.puzzleSide = Math.sqrt(this.tiles.length);
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

  getOuterEdges = (): number[] => {
    const allEdges = this.allEdges();

    //Los outer son lo que no estan repetidos
    return allEdges.filter((e) => {
      return allEdges.filter((ed) => ed == e).length == 1;
    });
  };

  /**
   * Obtiene  las piezas de las esquinas, aquellas con dos bordes que no cuadran con ningun otro
   */
  getCornerTiles = (): Tile[] => {
    //Los outer son lo que no estan repetidos
    const outerEdges = this.getOuterEdges();

    //localizar las piezas que tiene al menos dos bordes en la coleccion de outer
    return this.tiles.filter(
      (t) => t.edges.filter((e) => outerEdges.includes(e)).length == 2
    );
  };

  private allEdges = () => this.tiles.flatMap((t) => t.edges);

  private flipHorizontally = (tile: Tile): Tile => {
    tile = this.tiles.find((t) => t.id == tile.id);

    tile.content = tile.content.map((l) => Array.from(l).reverse().join(""));
    const edgeId = tile.edges[edge.left];
    tile.edges[edge.left] = tile.edges[edge.right];
    tile.edges[edge.right] = edgeId;
    return tile;
  };

  private flipVertically = (tile: Tile): Tile => {
    tile = this.tiles.find((t) => t.id == tile.id);
    tile.content = tile.content.reverse();
    const edgeId = tile.edges[edge.top];
    tile.edges[edge.top] = tile.edges[edge.bottom];
    tile.edges[edge.bottom] = edgeId;
    return tile;
  };

  /**
   * Rota 90 grados en el sentido horario
   * @param tile
   */
  private rotate = (tile: Tile): Tile => {
    tile = this.tiles.find((t) => t.id == tile.id);
    const rotatedContent: string[] = [];
    for (let column = 0; column < tile.content[0].length; column++) {
      rotatedContent.push(
        tile.content
          .map((l) => l[column])
          .reverse()
          .join("")
      );
    }
    tile.content = rotatedContent;
    for (let index = 4; index > 0; index--)
      tile.edges[index] = tile.edges[index - 1];
    tile.edges[0] = tile.edges[4];
    tile.edges.pop();
    return tile;
  };

  /**
   *
   * @param tile pieza a la que hay que encontrar una pareja
   */
  private findMatch = (x: number, y: number): Tile => {
    //para cada pieza en la buscada deben cuadrar dos lados:
    //i estamos en la fila 0, el lado izquierdo  con el derecho de la recibida y no debe haber coincidencia arriba
    //si estamos en la ultima fila, coincidencia derecho-izquierdo y no abajo
    //en la primera columna, fila >0, nada a la izquierda y match arriba
    //en la ultima columna, fila>0 , nada a la derecha y match arriba

    const matchingEdges: number[] = [];
    let nonMatchingEdge = -1;
    const matchingEdgesIds: number[] = [];
    const leftTile: Tile = this.tiles.find(
      (t) => t.position.x == x - 1 && t.position.y == y
    );
    const upTile = this.tiles.find(
      (t) => t.position.x == x && t.position.y == y - 1
    );

    if (y == 0) {
      matchingEdges.push(edge.left);
      nonMatchingEdge = edge.top;
      matchingEdgesIds.push(leftTile.edges[edge.right]);
    } else if (y == this.puzzleSide - 1) {
      matchingEdges.push(edge.top);
      matchingEdgesIds.push(upTile.edges[edge.bottom]);
      nonMatchingEdge = edge.bottom;
    } else {
      //Lineas intremedias
      if (x == 0) {
        matchingEdges.push(edge.top);
        matchingEdgesIds.push(upTile.edges[edge.bottom]);
        nonMatchingEdge = edge.left;
      } else if (x == this.puzzleSide - 1) {
        matchingEdges.push(edge.top);
        matchingEdges.push(edge.left);
        //El ede btoom es el de la pieza de encima
        matchingEdgesIds.push(upTile.edges[edge.bottom]);
        matchingEdgesIds.push(leftTile.edges[edge.right]);

        nonMatchingEdge = edge.right;
      } else {
        //piexas centrales
        matchingEdges.push(edge.top);
        matchingEdges.push(edge.left);
        matchingEdgesIds.push(upTile.edges[edge.bottom]);
        matchingEdgesIds.push(leftTile.edges[edge.right]);
      }
    }

    // const lookForId = tile.edges[(lookForEdge + 2) % 4];

    let foundTile = this.tiles
      .filter((t) => t.position.x == -1) //no buscar en las ya encontradas
      .find((t) => matchingEdgesIds.every((id) => t.edges.includes(id)));

    if (foundTile) {
      if (nonMatchingEdge > -1) {
        //Comporbar que el lado que debe ser unico lo es
        while (!this.getOuterEdges().includes(foundTile.edges[nonMatchingEdge]))
          foundTile = this.rotate(foundTile);
      }

      //Si hay mas de un lado, comprobar que la ficha esta orientada correctamente
      matchingEdges.forEach((matchingEdge, index) => {
        while (foundTile.edges[matchingEdge] != matchingEdgesIds[index])
          foundTile = this.rotate(foundTile);
      });

      console.log(`y:${y},x:${x},id:${foundTile.id}`);
    }
    return foundTile;
  };

  public getImage = (): string[] => {
    //ordenar las piezas
    this.solvePuzzle();

    //eliminar los bordes de cada pieza
    this.cropTiles();

    //generar la imagen comleta
    let puzzle = this.generateFinalTile();

    puzzle.content.forEach((l) => console.log(l));
  };

  /**
   * genera una pieza unica con la combinacion de todas
   */
  private generateFinalTile = (): Tile => {
    // por cada fila de piezas
    const rows = Math.sqrt(this.tiles.length);
    const rowsPerTile = this.tiles[0].content.length;
    const content: string[] = [];
    for (let row = 0; row < rows; row++) {
      const tilesRow = this.tiles
        .filter((t) => t.position.y == row)
        .sort((a, b) => a.position.x - b.position.x);
      const r = tilesRow.map((t) => t.id).join("\t");
      console.log(r);
      for (let rowTile = 0; rowTile < rowsPerTile; rowTile++)
        content.push(tilesRow.map((t) => t.content[rowTile]).join(""));
    }
    return { id: 0, edges: [], position: null, content };
  };

  /**
   * Elimina los bordes de las piezas
   */
  private cropTiles = () => {
    this.tiles.forEach((t) => {
      //Vertical
      t.content.shift();
      t.content.pop();
      //Horizontal
      t.content = t.content.map((line) => line.substr(1, line.length - 2));
    });
  };

  private solvePuzzle = () => {
    //this.findSeed();
    //return;
    let startTry = 0;

    let x = 1,
      y = 0;
    let currentTile = this.findSeed();
    currentTile.position.x = currentTile.position.y = 0;
    while (y * this.puzzleSide + x < this.tiles.length - 1) {
      if (!currentTile) {
        //No hay pieza para seguir montando, probar otro inicio
        throw new Error("KK");
      }
      currentTile = this.findMatch(x, y);

      //Colocamos de izquierda a derecha y arriba abajo
      currentTile.position.x = x++;
      currentTile.position.y = y;
      if (x > this.puzzleSide - 1) {
        y++;
        x = 0;
      }

      console.log(
        "Encontradas:",
        this.tiles.filter((t) => t.position.x > -1).length + 1,
        "de",
        this.tiles.length
      );
    }
    currentTile.position.x = this.puzzleSide - 1;
    currentTile.position.y = this.puzzleSide - 1;
  };

  /**
   * Devuelve una de las cuatro piezas
   * @param startTry Intento
   */
  private getFirstTile = (startTry: number): Tile => {
    //Devolvemos las piezad de las esquinas
    // try: 0 coo esta, 1 rotada, 2 rotada vertica

    let cornerTile = this.getCornerTiles()[Math.floor(startTry / 4)];
    //rotada o rotada + flipped
    if (startTry % 4 > 0) cornerTile = this.rotate(cornerTile);

    console.log("Probando primera pieza:", cornerTile.id, cornerTile.edges);
    return cornerTile;
  };

  private findSeed = () => {
    let found = false;
    let corner = 0;

    let cornerTile = this.getCornerTiles()[corner];
    //Buscar los dos lados que no tiene coincidencia
    let cornerOuterEdges = this.getOuterEdges().filter((o) =>
      cornerTile.edges.includes(o)
    );
    //Colocarlos los lados sin coincidencia arriba(0) y a la izauierda(1)
    while (
      !(
        (cornerTile.edges[edge.top] == cornerOuterEdges[0] ||
          cornerTile.edges[edge.left] == cornerOuterEdges[0]) &&
        (cornerTile.edges[edge.top] == cornerOuterEdges[1] ||
          cornerTile.edges[edge.left] == cornerOuterEdges[1])
      )
    )
      cornerTile = this.rotate(cornerTile);

    // //Buscar las dos piezas que coinciden con esta
    // let matchingTiles = this.tiles.filter((t) =>
    //   cornerTile.edges.includes(t.edges)
    // );

    return cornerTile;
  };
}
