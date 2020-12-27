import * as fs from "fs";
import { IPoint, Point } from "../../common/point";
/**
 * Representa la orientacion de cada lado de una pieza
 */
enum edge {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3,
}

/**
 * Representa una piexa de puzzle
 */
type Tile = {
  id: number;
  edges: number[];
  content: string[];
  position: IPoint;
};

export class PuzzleSolver {
  public tiles: Tile[];
  /** Indica la longitud del lado del puzzle en piezas (cuadrad) */
  private puzzleSide: number;
  private monsterPattern = [
    /..................#./,
    /#....##....##....###/,
    /.#..#..#..#..#..#.../,
  ];

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

  /**
   * Obtiene todos los identificadores de lados que corresponden a un borde (no tiene pareja)
   */
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

  /**
   *
   * @param tile Da la vuelta a la pieza en horizontal
   */
  private flipHorizontally = (tile: Tile): Tile => {
    if (tile.id > 0) tile = this.tiles.find((t) => t.id == tile.id);

    tile.content = tile.content.map((l) => Array.from(l).reverse().join(""));
    const edgeId = tile.edges[edge.left];
    tile.edges[edge.left] = tile.edges[edge.right];
    tile.edges[edge.right] = edgeId;
    return tile;
  };

  /**
   * Da la vuelta a la pieza en vertical
   * @param tile
   */
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
    if (tile.id > 0) tile = this.tiles.find((t) => t.id == tile.id);
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
   * Encuentra una pieza que cuadre en la posicion indicada teniendo en cuenta sus adyacente y/o bordes
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
      // } else if (y == this.puzzleSide - 1) {
      //   matchingEdges.push(edge.top);
      //   matchingEdgesIds.push(upTile.edges[edge.bottom]);
      //   nonMatchingEdge = edge.bottom;
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

    let foundTile = this.tiles
      .filter((t) => t.position.x == -1) //no buscar en las ya encontradas
      .find((t) => matchingEdgesIds.every((id) => t.edges.includes(id)));

    if (foundTile) {
      //Si hay mas de un lado, comprobar que la ficha cuadra con los lados correctos
      while (foundTile.edges[matchingEdges[0]] != matchingEdgesIds[0])
        foundTile = this.rotate(foundTile);
      if (
        matchingEdges.length > 1 &&
        foundTile.edges[matchingEdges[1]] != matchingEdgesIds[1]
      ) {
        if (matchingEdges[1] == edge.top || matchingEdges[1] == edge.bottom)
          foundTile = this.flipVertically(foundTile);
        else foundTile = this.flipHorizontally(foundTile);
      }

      if (nonMatchingEdge > -1) {
        //Comporbar que el lado que debe ser unico lo es
        while (!this.getOuterEdges().includes(foundTile.edges[nonMatchingEdge]))
          if (nonMatchingEdge == edge.top || nonMatchingEdge == edge.bottom)
            foundTile = this.flipVertically(foundTile);
          else foundTile = this.flipHorizontally(foundTile);
      }
    }
    return foundTile;
  };

  /**
   * Devuelve el puzzle completo y orientado correctamente
   */
  public solvePuzzle = (): Tile => {
    //ordenar las piezas
    this.orderTiles();

    //eliminar los bordes de cada pieza
    this.cropTiles();

    //generar la imagen completa
    let puzzle = this.generateFinalTile();
    puzzle = this.flipHorizontally(puzzle);
    //encontrar monstruos, girar y dar la vuelta al puzzle final hasta
    //que aparezcan
    let rotation = 0;
    while (this.findMonsters(puzzle) == 0 && rotation < 9) {
      puzzle = this.rotate(puzzle);
      if (rotation++ == 4) puzzle = this.flipHorizontally(puzzle);
    }

    return puzzle;
  };

  /**
   * Cuenta las casillas qe sn mar y no parte de un monstruo
   * @param puzzle puzzle montado
   */
  public getSeaRoughness = (puzzle: Tile): number => {
    const monsterTiles = 15 * this.findMonsters(puzzle);
    const seaTiles = Array.from(puzzle.content.join()).reduce(
      (a, b) => (a += b == "#" ? 1 : 0),
      0
    );
    return seaTiles - monsterTiles;
  };

  /**
   * genera una pieza unica con la combinacion de todas
   */
  private generateFinalTile = (): Tile => {
    // por cada fila de piezas
    const rowsPerTile = this.tiles[0].content.length;
    const content: string[] = [];
    for (let row = 0; row < this.puzzleSide; row++) {
      const tilesRow = this.tiles
        .filter((t) => t.position.y == row)
        .sort((a, b) => a.position.x - b.position.x);

      for (let rowTile = 0; rowTile < rowsPerTile; rowTile++)
        content.push(tilesRow.map((t) => t.content[rowTile]).join(""));
    }
    return { id: 0, edges: [0, 0, 0, 0], position: null, content };
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

  /**
   * Ordena las piezas para formar el puzzle final
   * No garantiza que el obtenido este en posicion correcta (puede ser necesario girarlo y/o rotarlo)
   */
  private orderTiles = () => {
    let x = 1,
      y = 0;
    let currentTile = this.findSeed();
    currentTile.position.x = currentTile.position.y = 0;
    while (y * this.puzzleSide + x < this.tiles.length) {
      currentTile = this.findMatch(x, y);

      //Colocamos de izquierda a derecha y arriba abajo
      currentTile.position.x = x++;
      currentTile.position.y = y;
      if (x > this.puzzleSide - 1) {
        y++;
        x = 0;
      }
    }
    currentTile.position.x = this.puzzleSide - 1;
    currentTile.position.y = this.puzzleSide - 1;
  };

  /**
   * Orienta una de las piezas de las equinas de tal forma que sus lados
   * sin coincidencia estén arriba y a la izquierda
   * Esto no garantiza que el puzzle final sea corecto (puede haber que girarlo y rotarlo)
   * pero sí que tenemos una pieza en la que podemos empezar a juntar por la derecha
   */
  private findSeed = () => {
    let cornerTile = this.getCornerTiles()[0];
    //Buscar los dos lados que no tiene coincidencia
    const cornerOuterEdges = this.getOuterEdges().filter((o) =>
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

    return cornerTile;
  };

  /**
   * Buscar el patron del mostruo en filas contiguas.
   * Da por hecho que no hay cuerpos centrales en la primera ni la ultima fila
   * @param puzzle pieza unica con el contenido final
   */
  private findMonsters = (puzzle: Tile): number => {
    return puzzle.content.reduce((monsters, line, index, content) => {
      if (
        this.monsterPattern[1].test(line) &&
        this.monsterPattern[0].test(content[index - 1]) &&
        this.monsterPattern[2].test(content[index + 1])
      )
        monsters += 1;
      return monsters;
    }, 0);
  };
}
