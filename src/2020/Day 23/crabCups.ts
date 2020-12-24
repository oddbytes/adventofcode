export class CrabCups {
  // mapa: clave:copa  -  valor:siguiente copa
  public circle: Map<number, number> = new Map<number, number>();
  //copa actual
  private currentCup: number;

  constructor(part: number) {
    const seed = "364289715";
    //enlazar cada copa a la siguiente
    Array.from(seed).forEach((n, i, a) =>
      this.circle.set(parseInt(n), i < a.length - 1 ? parseInt(a[i + 1]) : 10)
    );
    //enlazar la copa final a la primea
    if (part == 1) {
      this.circle.set(parseInt(seed[seed.length - 1]), parseInt(seed[0]));
    } else {
      for (let i = 10; i < 1000001; i++) this.circle.set(i, i + 1);

      this.circle.set(1000000, parseInt(seed[0]));
    }
    //empezar por la primera coppa
    this.currentCup = parseInt(seed[0]);
  }

  /**
   * Ejecuta un movimiento.
   */
  public move = (): void => {
    // Elementos a mover, los tres siguientes a la copa actual
    const firstPick = this.circle.get(this.currentCup);
    const secondPick = this.circle.get(firstPick);
    const thirdPick = this.circle.get(secondPick);

    const pickedUpsCups = [firstPick, secondPick, thirdPick];

    //copa destino: la actual -1
    let destinationLabel = this.currentCup - 1;

    // si la copa destino no está en el circulo (es una de las elegidas)
    // restar uno hasta encontrar una copa con dicho valor que esté en el círculo
    const minPickLabel = Math.min(...pickedUpsCups);
    const minLabel =
      minPickLabel > 1
        ? 1
        : pickedUpsCups.includes(2)
        ? pickedUpsCups.includes(3)
          ? 4
          : 3
        : 2;

    while (
      destinationLabel > minLabel &&
      pickedUpsCups.includes(destinationLabel)
    ) {
      destinationLabel--;
    }

    // Si no hemos encontrado una copa, utilizar el valor máximo de las que
    // hay en el circulo

    if (destinationLabel < minLabel) {
      const maxPickLabel = Math.max(...pickedUpsCups);
      destinationLabel =
        maxPickLabel < this.circle.size
          ? this.circle.size
          : pickedUpsCups.includes(this.circle.size - 1)
          ? pickedUpsCups.includes(this.circle.size - 2)
            ? this.circle.size - 3
            : this.circle.size - 2
          : this.circle.size - 1;
    }

    // Enlazar la copa actual a la siguiente a las tres retiradas
    this.circle.set(this.currentCup, this.circle.get(thirdPick));

    //Establecer la copa actual en la siguiente a la tercera retirada
    //para el proximo movimiento
    this.currentCup = this.circle.get(thirdPick);

    //Enlazar la tercera de las retiradas a la siguiente a la copa destino
    this.circle.set(thirdPick, this.circle.get(destinationLabel));

    //Enlazar la destino a la primera de las elegidas
    this.circle.set(destinationLabel, firstPick);
  };
}
