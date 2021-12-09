/**
 * Una cola generica
 */
export class Queue<T> {
  public items: T[] = [];
  constructor(items?: T[]) {
    if (items) this.items = [...items];
  }

  public push = (item: T): number => this.items.push(item);

  public pop = (): T => this.items.shift();

  public peek = (): T => (this.isEmpty ? null : this.items[0]);

  public get length(): number {
    return this.items.length;
  }
  public get isEmpty(): boolean {
    return this.items.length == 0;
  }

  public toString = (): string => this.items.join();
}

export interface IBFSQueueNode<T> {
  node: T;
  visited: boolean;
}

export class BFSQueueNode<T> implements IBFSQueueNode<T> {
  constructor(public node: T, public visited: boolean) {}
}
