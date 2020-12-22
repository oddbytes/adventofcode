import * as fs from "fs";
import { Queue } from "../../common/queue";

export class Combat {
  public player1Cards: Queue<number>;
  public player2Cards: Queue<number>;

  constructor(tilesFile: string) {
    const cards = fs.readFileSync(tilesFile, "utf8").split("\r\n\r\n");
    this.player1Cards = new Queue(
      cards[0]
        .split("\r\n")
        .slice(1)
        .map((c) => parseInt(c))
    );
    this.player2Cards = new Queue(
      cards[1]
        .split("\r\n")
        .slice(1)
        .map((c) => parseInt(c))
    );
  }

  /**
   * Parte 1: juego no recursivo
   */
  public play = (): Queue<number> => {
    while (!(this.player1Cards.isEmpty || this.player2Cards.isEmpty)) {
      const player1Card = this.player1Cards.pop();
      const player2Card = this.player2Cards.pop();
      const winner =
        player1Card > player2Card ? this.player1Cards : this.player2Cards;
      winner.push(Math.max(player1Card, player2Card));
      winner.push(Math.min(player1Card, player2Card));
    }
    return this.player1Cards.isEmpty ? this.player2Cards : this.player1Cards;
  };

  /**
   * Obtiene un  identificador unico para el estado del juego a partir d elas posiciones de las cartas de cada jugador
   * @param player1Cards
   * @param player2Cards
   */
  private getGameState = (
    player1Cards: Queue<number>,
    player2Cards: Queue<number>
  ): number =>
    player1Cards.items.reduce((a, b, i) => (a *= b * (i + 1)), 1) +
    player2Cards.items.reduce((a, b, i) => (a *= b * (i + 1)), 1) * 2;

  /**
   *
   * @param player1Cards
   * @param player2Cards
   */
  public playRecursive = (
    player1Cards: Queue<number>,
    player2Cards: Queue<number>
  ): number => {
    const gameStates: Set<number> = new Set<number>();

    while (!(player1Cards.isEmpty || player2Cards.isEmpty)) {
      const gameState = this.getGameState(player1Cards, player2Cards);

      if (gameStates.has(gameState)) return 1; //Si el juego ya ha pasado por este estado, el jugador instantaneo es el 1

      const player1Card = player1Cards.peek();
      const player2Card = player2Cards.peek();
      const winner = this.playRound(player1Cards, player2Cards);
      const winnerCards = winner == 1 ? player1Cards : player2Cards;
      winnerCards.push(winner == 1 ? player1Card : player2Card);
      winnerCards.push(winner == 1 ? player2Card : player1Card);

      gameStates.add(gameState);
    }
    return player1Cards.isEmpty ? 2 : 1;
  };

  public playRound = (
    player1Cards: Queue<number>,
    player2Cards: Queue<number>
  ): number => {
    const player1Card = player1Cards.pop();
    const player2Card = player2Cards.pop();

    // si los dos jugadores tienen en su mazo al menos tantas cartas como el numero que ha sacado cada uno
    // el ganador se decide en una subpartida
    if (
      player1Card <= player1Cards.length &&
      player2Card <= player2Cards.length
    ) {
      return this.playRecursive(
        new Queue(player1Cards.items.slice(0, player1Card)),
        new Queue(player2Cards.items.slice(0, player2Card))
      );
    }

    // Si no la mano la gana el que tenga la carta mas alta
    return player1Card > player2Card ? 1 : 2;
  };
}
