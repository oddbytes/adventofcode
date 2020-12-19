import * as fs from "fs";
import { ExpressionTokenizer } from "./expressionTokenizer";

/**
 * Representa un evaluador de expresiones
 * basado en https://eli.thegreenplace.net/2012/08/02/parsing-expressions-by-precedence-climbing
 */
export class ExpressionEvaluator {
  private expressions: string[];

  /**
   * Prioridad de operadores. A mayor valor, mayor prioridad.
   * Pra la parte 1 suma y multiplicacion tienen la misma
   */
  private operatorPrecedence: Record<string, number> = {
    "+": 1,
    "*": 1,
  };

  constructor(expresionsFile: string) {
    this.expressions = fs.readFileSync(expresionsFile, "utf8").split("\r\n");
  }

  /**
   * Evalua la operacion indicada por el operador y operandos pasados
   */
  private evaluateOperation = (op: string, val1: number, val2: number) =>
    eval(`${val1}${op}${val2}`);

  /**
   * Devuelve el siguiente átomo (numero o expresion entre parentesis)
   * @param tokenizer tokenizador de la expresion
   */
  private getAtom = (tokenizer: ExpressionTokenizer): number => {
    let atom: string | number = tokenizer.currentToken;

    if (atom == "(") {
      tokenizer.nextToken();
      atom = this.evaluateExpression(tokenizer, 1);
      if (tokenizer.currentToken != ")")
        throw new Error('error, falta parentesis de cierre ")"');
    } else {
      // atom = parseInt(atom);
    }
    tokenizer.nextToken();
    return parseInt(atom as string);
  };

  /**
   * Evalua una expresion segun la precedencia de operadores establecida
   * utilizandoun algritmo de precedencia de operadores (precedence climbing o ascension de precedencia)
   * https://en.wikipedia.org/wiki/Operator-precedence_parser#Precedence_climbing_method
   * @param tokenizer tokenizador de la expresion a utilizar
   * @param minimumPrecedence precendecia minima que se evalua
   * 2 * 3 + 4 + 5 * 6 (en caso de parte 2)
   * |---------------|   : precedencia minima 1
   *     |-------|       : precedencia minima 2
   */
  private evaluateExpression = (
    tokenizer: ExpressionTokenizer,
    minimumPrecedence: number
  ): number => {
    let leftAtom = this.getAtom(tokenizer);
    while (!tokenizer.isEmpty) {
      const currentToken = tokenizer.currentToken;
      if (
        (currentToken != "*" && currentToken != "+") ||
        this.operatorPrecedence[currentToken] < minimumPrecedence
      )
        break;

      // Obtener la precedencia de operadores (la asociatividad siempre es a la izquierda en este ejercicio) y
      // calcular el precedencia minima para la llamada recursiva
      const nextMinimumPrecedence = this.operatorPrecedence[currentToken] + 1;
      const operator = currentToken;

      // Consumir el token actual y dejar listo el siguiente para la llamada recursiva
      tokenizer.nextToken();
      const rightAtom = this.evaluateExpression(
        tokenizer,
        nextMinimumPrecedence
      );

      // Actualizar el operando de la izquierda con el resultado de la operacion
      leftAtom = this.evaluateOperation(operator, leftAtom, rightAtom);
    }
    return leftAtom;
  };

  /**
   * Evalua todas las expresiones y devuelve un array con sus resultados
   * @param usePrecedence Indica si se debe usar precedencia del operador + sobre * (parte 2)
   */
  public evaluateAll(usePrecedence: boolean): number[] {
    this.operatorPrecedence["+"] = usePrecedence ? 2 : 1;
    return this.expressions.map((exp) =>
      this.evaluateExpression(new ExpressionTokenizer(exp), 0)
    );
  }
}
