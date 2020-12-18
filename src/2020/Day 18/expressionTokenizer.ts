/**
 * Parte la expresion en sus diferentes tokens (operandos, operadores y parentesis)
 * y permite desplazarse por ellos de manera secuancial hacia adelante
 */
export class ExpressionTokenizer {
  private reToken = /\s*(\d+|.)/g;
  public currentTokenIndex = 0;

  private tokens: string[];
  constructor(expression: string) {
    this.tokens = Array.from(expression.matchAll(this.reToken)).map(
      (t) => t[1] //Primera captura
    );
  }

  /**
   * Avanza al siguiente token, devolviendolo
   */
  public nextToken = (): string => {
    this.currentTokenIndex++;
    return this.currentToken;
  };

  /**
   * Indica si se han recorrido todos los tokens de la expresion
   */
  public get isEmpty(): boolean {
    return this.currentTokenIndex > this.tokens.length - 1;
  }

  /**
   * Devuelve el token actual
   */
  public get currentToken(): string {
    return this.tokens[this.currentTokenIndex];
  }
}
