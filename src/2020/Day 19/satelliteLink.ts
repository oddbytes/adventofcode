import * as fs from "fs";

class Rule {
  constructor(public index: number, public rule: string) {}
}

export class SatelliteLink {
  //reglas de mensaje
  public rules: Rule[];
  //Mensajes recibidos
  private messages: string[];

  constructor(messagesFile: string) {
    const sections = fs.readFileSync(messagesFile, "utf8").split("\r\n\r\n");
    this.messages = sections[1].split("\r\n");
    this.rules = sections[0]
      .replace(/"/g, "")
      .split("\r\n")
      .map((line) => {
        const parts = line.split(": ");

        return new Rule(parseInt(parts[0]), parts[1]);
      })
      .sort((a, b) => a.index - b.index);
  }

  /**
   * Inicializa las reglas
   * @param rules array de reglas
   */
  private initRules = () => {
    while (this.rules.some((r) => /\d/.test(r.rule))) {
      //Buscar las reglas que solo contengan letras
      const decodedRules = this.rules.filter((r) => !/[\d]/.test(r.rule));

      const decodedIndexes = decodedRules.map((r) => r.index);
      //Buscar las reglas que referencien las anteriores
      const referencingRules = this.rules.filter((r) => {
        const referencesRules = Array.from(
          r.rule.matchAll(/(\d+)\s*/g)
        ).map((m) => parseInt(m[1]));

        return (
          referencesRules.length > 0 &&
          referencesRules.every((referencedRule) =>
            decodedIndexes.includes(referencedRule)
          )
        );
      });

      //En caso de haber bucles quedarn reglas que no referencien a ninguna de las ya resueltas
      if (referencingRules.length == 0) return false;

      //Hacer la combinaion
      referencingRules.forEach((referencingRule) => {
        const referencedRulesIndexes = [
          ...new Set(
            Array.from(referencingRule.rule.matchAll(/(\d+)\s*/g)).map((m) =>
              parseInt(m[1])
            )
          ),
        ];
        //Si todas las regla referenciada son simples sustituir indices

        if (
          decodedRules
            .filter((decodedRule) =>
              referencedRulesIndexes.includes(decodedRule.index)
            )
            .every((decodedRule) => decodedRule.rule.indexOf("|") == -1)
        ) {
          this.substituteRule(referencingRule, referencedRulesIndexes);
        } else {
          //Al menos una regla referenciada es compleja
          if (referencingRule.rule.includes("|"))
            this.combineRule(referencingRule);
          else this.concatenateRule(referencingRule);
        }
      });
    }
    return true;
  };

  /**
   * Sustituye referencias por caracteres en reglas finales
   * @param referencingRule
   * @param referencedRulesIndexes
   */
  private substituteRule(
    referencingRule: Rule,
    referencedRulesIndexes: number[]
  ) {
    let rule = referencingRule.rule;

    referencedRulesIndexes.forEach(
      (referencedRuleIndex) =>
        (rule = rule.replace(
          new RegExp(referencedRuleIndex.toString() + "\\b", "g"),
          this.findRuleByIndex(referencedRuleIndex).rule
        ))
    );
    this.findRuleByIndex(referencingRule.index).rule = rule.replace(/\s/g, "");
  }

  /**
   * Concatena dos reglas
   * @param referencingRule
   */
  private concatenateRule(referencingRule: Rule) {
    //La regla que referencia es una concatenacion
    let finalRuleParts: string[] = [];

    const referencedRulesIndexes = Array.from(
      referencingRule.rule.matchAll(/(\d+)\s*/g)
    ).map((m) => parseInt(m[1]));

    finalRuleParts = referencedRulesIndexes.map((referencedRulesIndex) => {
      const r = this.findRuleByIndex(referencedRulesIndex).rule;
      return r.indexOf("|") > -1
        ? `(?:${r.replace(/\|/g, "#")})`
        : r.replace(/\|/g, "#");
    });

    this.findRuleByIndex(referencingRule.index).rule = finalRuleParts.join("");
  }

  private findRuleByIndex = (index: number): Rule =>
    this.rules.find((rule) => rule.index == index);
  /**
   * Combina una regla cuando al menos una de sus referenciadas es compleja
   * @param referencingRule Regla a generar, referencia a otras ya decodificadas
   * @param referencedRules Reglas referenciadas, ya decodificadas
   */
  private combineRule(referencingRule: Rule) {
    /*
        1: 2 3 | 3 2
        2: aa|bb
        3: ab|ba
        */
    const finalRuleParts: string[] = [];

    //Si la regla que referencia es compleja
    referencingRule.rule.split("|").map((referencingRulePart) => {
      //2 3
      const referencedRulesIndexes = Array.from(
        referencingRulePart.matchAll(/(\d+)\s*/g)
      ).map((m) => parseInt(m[1]));

      //Para cada parte de la primera regla, combinar con cada parte de la segunda

      finalRuleParts.push(
        ...this.rules
          .find((r) => r.index == referencedRulesIndexes[0])
          .rule.split("|")
          .map((rule1Part) => {
            const int = this.findRuleByIndex(referencedRulesIndexes[1]).rule;
            return int.indexOf("|") > -1
              ? `${rule1Part}(?:${int.replace(/\|/g, "#")})`
              : `${rule1Part}${int.replace(/\|/g, "#")}`;
          })
      );
    });

    this.rules.find(
      (r) => r.index == referencingRule.index
    ).rule = finalRuleParts.join("|");
  }

  /**
   * Inicializa manualmente las reglas recursivas
   * Segun la definicion del porblema no hay que tratar de dar una solucion general
   * ya que sería excesivamente complicado, por lo que una solucion especifica
   * es aceptable
   */
  public initRecursiveRules = (): void => {
    this.findRuleByIndex(8).rule = `(?:${this.findRuleByIndex(42).rule})+`;

    const r11 =
      "(?:42)(?:(?:42)(?:(?:42)(?:(?:42)(?:(?:42) (?:31))?(?:31))?(?:31))?(?:31))?(?:31)";

    const r42 = this.findRuleByIndex(42).rule;
    const r31 = this.findRuleByIndex(31).rule;

    this.findRuleByIndex(11).rule = r11
      .replace(/42/g, r42)
      .replace(/31/g, r31)
      .replace(/\s/g, "");
  };

  /**
   * Devuelve el numero d emensajes validos segun las reglas
   * @param part parte del puzzle (1|2)
   */
  public getValidMessages = (part = 1): string[] => {
    if (part == 2) {
      //reglas recursivas
      this.findRuleByIndex(8).rule = " 42 | 42 8";
      this.findRuleByIndex(11).rule = " 42 31 | 42 11 31";
    }

    if (!this.initRules()) {
      //si el metodo devuelve false es poeque hay bucles en las reglas
      //en ese caso inicializamos las reglas con bucles a mano
      this.initRecursiveRules();
      if (!this.initRules()) throw new Error("0 no lista");
    }

    //generar la regla final
    const reRule0 = new RegExp(
      "^" + this.findRuleByIndex(0).rule.replace(/#/g, "|") + "$"
    );

    return this.messages.filter((m) => reRule0.test(m));
  };
}
