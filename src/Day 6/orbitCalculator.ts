import { ITreeNode, TreeNode } from "./treeNode";

export class OrbitCalculator {
  /**
   * Retus a tree of or orbits
   * @param orbitMap list of orbits
   */
  private getTree(orbitMap: string[]): ITreeNode[] {
    const tree: ITreeNode[] = [];
    orbitMap.forEach(orbit => {
      const planets = orbit.split(")");
      let parent = tree.find(n => n.data == planets[0]);
      let child = tree.find(n => n.data == planets[1]);
      if (!parent) {
        parent = new TreeNode(planets[0], undefined, []);
        tree.push(parent);
      }

      if (child) {
        child.parent = parent;
      } else {
        child = new TreeNode(planets[1], parent, []);
        tree.push(child);
      }
      parent.children.push(child);
    });
    return tree;
  }

  /**
   * Counts the number of direct and indirect orbits withing a orbital map
   * @param orbitMap
   */
  public countOrbits(orbitMap: string[]) {
    const orbitsTree = this.getTree(orbitMap);
    // The count of direct and indirect orbits is the depth of a node within the tree
    return orbitsTree.reduce((accum, node) => accum + node.depth, 0);
  }

  public countOrbitTranfers(
    orbitMap: string[],
    origin: string,
    destination: string
  ) {
    const orbitsTree = this.getTree(orbitMap);

    const originNode = orbitsTree.find(n => n.data === origin);
    const destNode = orbitsTree.find(n => n.data === destination);

    const commonNodes = originNode.parents.filter(o =>
      destNode.parents.find(d => d.data === o.data)
    );

    const closestCommonNode = commonNodes.sort((a, b) => b.depth - a.depth)[0];

    //Let's use depth property. Cut the tree at closest common node!
    closestCommonNode.parent = null;

    //Return sum of depths of both nodes in the  cut tree
    return originNode.parent.depth + destNode.parent.depth;
  }
}
