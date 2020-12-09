/**
 * A generic queue
 */
class Queue<T> {
  private items: T[] = [];

  public add = (item: T) => this.items.push(item);

  public pop = (): T => this.items.shift();

  public get isEmpty(): boolean {
    return this.items.length == 0;
  }
}
