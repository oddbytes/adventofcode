export interface IPoint {
  x: number;
  y: number;
  rotate?(angle: number): void;
  toString(): string;
  manhattanDistanceTo(point: IPoint);
  manhattanDistanceToCoordinates(x: number, y: number);
}

/**
 * Implementa un objeto punto 2D con coordenadas x e y
 */
export class Point implements IPoint {
  constructor(public x: number = 0, public y: number = 0) {}

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

  public toString = (): string => `${this.x},${this.y}`;

  public manhattanDistanceTo = (point: IPoint): number =>
    Math.abs(this.x - point.x) + Math.abs(this.y - point.y);

  public manhattanDistanceToCoordinates = (x: number, y: number): number =>
    Math.abs(this.x - x) + Math.abs(this.y - y);
}
