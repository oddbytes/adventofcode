import * as fs from "fs";

/**
 * Representa la relacion entre una maleta y las que contiene, indicando la cantidad (arista)
 */
export interface IContainedBag {
  quantity: number;
  bag: IBagNode;
}

export class ContainedBag implements IContainedBag {
  constructor(public quantity: number, public bag: BagNode) {}
}

/**
 * Representa un nodo del grafo de maletas. Almacena su color, las maletas que contiene y
 * adicionalmente, para poder recorrerlo, en las que está contenida
 */
export interface IBagNode {
  color: string;
  contains: IContainedBag[];
  containedIn: IBagNode[];
  containers: IBagNode[];
  containedBags: number;
}

export class BagNode implements IBagNode {
  constructor(
    public color: string,
    public containedIn: IBagNode[],
    public contains: IContainedBag[]
  ) {}

  /**
   * Devuelve un array con todos los contenedores de esta maleta
   */
  public get containers(): IBagNode[] {
    return this.containedIn.flatMap((bag) => [bag].concat(bag.containers));
  }

  /**
   * Devuelve el numero de maletas contenidas
   */
  public get containedBags(): number {
    return this.contains.reduce((acum, containedBag) => {
      acum +=
        containedBag.quantity +
        containedBag.quantity * containedBag.bag.containedBags;
      return acum;
    }, 0);
  }
}

export class RulesFile {
  private reContainedBags = /(?:(?<quantity>\d+) (?<color>\w+ \w+)) bags?/;
  public read = (file: string): IBagNode[] => {
    const rules = fs.readFileSync(file, "utf8").split("\r\n");
    const bags: IBagNode[] = [];

    for (const rule of rules) {
      const parts = rule.split(" bags contain ");
      const contained = parts[1].split(", ");

      //si ya existe la maleta no creamos un nuevo nodo
      const currentBag =
        bags.find((bag) => bag.color == parts[0]) ??
        new BagNode(parts[0], [], []);

      if (contained[0] != "no other bags.") {
        // puesto que la maleta cntenedora solo aparece una vez en la parte derecha de las definiciones
        // podemos asignar directamente sus hijos
        currentBag.contains = contained.map((containedBagDefinition) => {
          const containedBagMatch = this.reContainedBags.exec(
            containedBagDefinition
          );

          let containedBag = bags.find(
            (b) => b.color == containedBagMatch.groups["color"]
          );

          if (containedBag) {
            //Si esta maleta ya existe no creamos un nodo nuevo
            containedBag.containedIn.push(currentBag);
          } else {
            containedBag = new BagNode(
              containedBagMatch.groups["color"],
              [currentBag],
              []
            );
            bags.push(containedBag);
          }

          return new ContainedBag(
            parseInt(containedBagMatch.groups["quantity"]),
            containedBag
          );
        });

        bags.push(currentBag);
      }
    }
    return bags;
  };
}
