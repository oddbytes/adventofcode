export interface ITreeNode {
  data: string;
  parent: ITreeNode;
  children: ITreeNode[];
  /**
   * Returns the depth of a node in the tree. Root node depth=0
   */
  depth: number;
  /**
   * returns an array of parent nodes from this one to the root
   */
  parents: ITreeNode[];
}

export class TreeNode implements ITreeNode {
  constructor(
    public data: string,
    public parent: ITreeNode,
    public children: ITreeNode[]
  ) {}

  get depth() {
    if (this.parent) return this.parent.depth + 1;
    return 0;
  }

  get parents(): ITreeNode[] {
    if (this.parent) return this.parent.parents.concat(this);
    return [this];
  }
}
