import * as fs from "fs";

/**
 * Representa los valores de los campos de un ticket
 */
interface ITicket {
  fields: number[];
}

interface ILimit {
  from: number;
  to: number;
}
/**
 * Definicion de cada campo del ticket: nombre y limites.
 * matchingPositions se usará par determinar el orden de este campo en la parte 2
 */
interface IFieldRule {
  name: string;
  limits: ILimit[];
  matchingPositions: number[];
}

export class TicketsChecker {
  private rules: IFieldRule[];
  private ownTicket: ITicket = { fields: [] };
  private nearbyTickets: ITicket[];
  // Cachea toda la colección de limites de todas las reglas
  private allLimits: ILimit[];
  constructor(ticketsFile: string) {
    // Lee el fichero de entrada y genera las colecciones de objetos que representan cada parte
    const sections = fs.readFileSync(ticketsFile, "utf8").split("\r\n\r\n");
    const reLimits = /(\d+)-(\d+)/g;

    this.rules = sections[0].split("\r\n").map((line) => {
      const parts = line.split(": ");
      const rule: IFieldRule = {
        name: parts[0],
        limits: [],
        matchingPositions: [],
      };
      let match = reLimits.exec(parts[1]);
      while (match) {
        rule.limits.push({ from: parseInt(match[1]), to: parseInt(match[2]) });
        match = reLimits.exec(parts[1]);
      }
      return rule;
    });

    this.ownTicket.fields = sections[1]
      .split("\r\n")[1]
      .split(",")
      .map((n) => parseInt(n));

    this.nearbyTickets = sections[2]
      .split("\r\n")
      .slice(1)
      .map((ticket) => ({ fields: ticket.split(",").map((n) => parseInt(n)) }));

    this.allLimits = this.rules.flatMap((rule) => rule.limits);
  }

  /**
   * Encuentra los valores que son invalidos para cualquier regla en los tickets cercanos
   */
  public findInvalidFields = (): number[] =>
    this.nearbyTickets
      .flatMap((ticket) => ticket.fields)
      .filter((field) => this.isFieldInvalid(field));
  /**
   * Indica si el campo es invalido (no cumple NINGUNA regla)
   * @param field Valor del campo
   */
  isFieldInvalid = (field: number): boolean =>
    !this.allLimits.some((limit) => field >= limit.from && field <= limit.to);

  /**
   * Indica si el valor de un campo cumple con la regla indicada
   */
  isFieldValidForRule = (field: number, rule: IFieldRule): boolean =>
    rule.limits.some((limit) => field >= limit.from && field <= limit.to);

  /**
   * Indica si el ticket pasado es inválido segun el valor de sus campos
   * @param ticket ticket a comporbar
   */

  private isTicketInvalid = (ticket: ITicket): boolean =>
    ticket.fields.some((field) => this.isFieldInvalid(field));

  /**
   * Encuentra las columnas a las que ertenece cada regla
   */
  private findFieldsPosition = (): void => {
    const validTickets = this.nearbyTickets.filter(
      (ticket) => !this.isTicketInvalid(ticket)
    );

    // Encontrar todas las posiciones de as columnas que cuadran con cada regla
    this.rules.forEach((_f, columnIndex) => {
      const fieldsInColumn = validTickets.map(
        (ticket) => ticket.fields[columnIndex]
      );

      this.rules.forEach((rule) => {
        if (
          fieldsInColumn.every((field) => this.isFieldValidForRule(field, rule))
        )
          rule.matchingPositions.push(columnIndex);
      });
    });

    //Ordenar las reglas por numero de columnas que cumplen sus reglas
    //la primera regla solo se cumple para una columna
    this.rules = this.rules.sort(
      (a, b) => a.matchingPositions.length - b.matchingPositions.length
    );

    //Dejar en cada regla unicamente las columnas que no estan repetidas en otras anteriores
    this.rules.forEach((rule, index) => {
      for (let i = index + 1; i < this.rules.length; i++) {
        const ruleIndex = this.rules[i].matchingPositions.findIndex(
          (r) => r == rule.matchingPositions[0]
        );
        this.rules[i].matchingPositions.splice(ruleIndex, 1);
      }
    });
  };

  /**
   * Devuelve los valores de los campos que comienzan por "departure"
   */
  public getDeparture = (): number[] => {
    this.findFieldsPosition();
    const positions = this.rules
      .filter((r) => r.name.startsWith("departure"))
      .flatMap((r) => r.matchingPositions);
    return this.ownTicket.fields.filter((_f, i) => positions.includes(i));
  };
}
