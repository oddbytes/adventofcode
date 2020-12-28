import * as fs from "fs";

type Wire = {
  name: string;
  value: number;
  operation?: {
    wire1: string;
    operator: string;
    wire2: string;
  };
};

export class LogicGates {
  private wires: Wire[];
  private reWire = /^(?:(?:(?:(?<wire1>.*) )?(?<operator>[A-Z]+) (?<wire2>.*))|(?<value>.*)) -> (?<wire3>.*)$/;

  constructor(wiresFile: string) {
    this.wires = fs
      .readFileSync(wiresFile, "utf8")
      .split("\r\n")
      .map((wire) => {
        const match = wire.match(this.reWire);
        return {
          name: match.groups["wire3"],
          value: parseInt(match.groups["value"]),
          operation: {
            wire1: match.groups["wire1"] ?? match.groups["value"],
            operator: match.groups["operator"],
            wire2: match.groups["wire2"],
          },
        };
      });
  }

  //Hay operaciones de bit rn las que un operando es directamente un valor constante
  public findWire = (wireName: string): Wire =>
    this.wires.find((w) => w.name == wireName) ?? {
      name: "constant",
      value: parseInt(wireName),
    };

  public getWireValue = (wire: Wire): number => {
    if (!isNaN(wire.value)) return wire.value;

    // Generar valor a partir de la operacion
    switch (wire.operation.operator) {
      case "NOT":
        wire.value = ~this.getWireValue(this.findWire(wire.operation.wire2));
        break;

      case "AND":
        wire.value =
          this.getWireValue(this.findWire(wire.operation.wire1)) &
          this.getWireValue(this.findWire(wire.operation.wire2));
        break;

      case "OR":
        wire.value =
          this.getWireValue(this.findWire(wire.operation.wire1)) |
          this.getWireValue(this.findWire(wire.operation.wire2));
        break;

      case "LSHIFT":
        wire.value =
          this.getWireValue(this.findWire(wire.operation.wire1)) <<
          parseInt(wire.operation.wire2);
        break;

      case "RSHIFT":
        wire.value =
          this.getWireValue(this.findWire(wire.operation.wire1)) >>
          parseInt(wire.operation.wire2);
        break;

      default:
        wire.value = this.getWireValue(this.findWire(wire.operation.wire1));
        break;
    }
    return wire.value;
  };
}
