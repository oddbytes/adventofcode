export interface ITreeNode<T> {
  data: T;
  parent: ITreeNode<T>;
  children: ITreeNode<T>[];
  /**
   * Returns the depth of a node in the tree. Root node depth=0
   */
  depth: number;
  /**
   * returns an array of parent nodes from this one to the root
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
