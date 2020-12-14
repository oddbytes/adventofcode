export interface ITreeNode<T> {
  data: T;
  parent: ITreeNode<T>;
  children: ITreeNode<T>[];
  /**
   * Devuelve la porfundidad del nodo en el árbol. La raiz tiene profundidad=0
   */
  depth: number;
  /**
   * Devuelve un array con los nodos padre de este nodo
   */
  parents: ITreeNode<T>[];
}

export class TreeNode<T> implements ITreeNode<T> {
  constructor(
    public data: T,
    public parent: ITreeNode<T>,
    public children: ITreeNode<T>[]
  ) {}

  get depth(): number {
    if (this.parent) return this.parent.depth + 1;
    return 0;
  }

  get parents(): ITreeNode<T>[] {
    if (this.parent) return this.parent.parents.concat(this);
    return [this];
  }
}
