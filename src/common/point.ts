export interface IPoint {
  x: number;
  y: number;
}

/**
 * Implementa un objeto punto 2D con coordenadas x e y
 */
export class Point implements IPoint {
  constructor(public x: number, public y: number) {}
}
