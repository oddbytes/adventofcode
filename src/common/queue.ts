/**
 * A generic queue
 */
export class Queue<T> {
  private items: T[] = [];
  constructor(items?: T[]) {
    if (items) this.items = items;
  }

  public push = (item: T): number => this.items.push(item);

  public pop = (): T => this.items.shift();

  public peek = (): T => this.items[this.items.length - 1];

  public get length(): number {
    return this.items.length;
  }
  public get isEmpty(): boolean {
    return this.items.length == 0;
  }
}
