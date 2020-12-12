export interface IPoint {
  x: number;
  y: number;
  rotate(angle: number): void;
}

/**
 * Implementa un objeto punto 2D con coordenadas x e y
 */
export class Point implements IPoint {
  constructor(public x: number, public y: number) {}

  /**
   * Rota el punto respecto a 0,0
   * @param degrees ángulo de rotación en grados
   */
  public rotate = (degrees: number): void => {
    const rad = (degrees * Math.PI) / 180;
    const rotatedX = this.x * Math.cos(rad) - this.y * Math.sin(rad);
    this.y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
    this.x = rotatedX;
  };
}
