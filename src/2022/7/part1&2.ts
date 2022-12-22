import * as fs from "fs";
import { ITreeNode, TreeNode } from "../../common/treeNode";
interface IFile {
  name: string;
  size: number;
}
interface IFolder {
  name: string;
  size?: number;
  files?: IFile[];
  //size: number;
}

console.time("day7");
const terminalOutput = fs.readFileSync("./input.txt", "utf8").split("\n");

const scanFiles = (terminalOutput: string[]) => {
  const root = new TreeNode<IFolder>({ name: "/" }, null, []);
  root.data.files = [];
  let currentFolder = root;

  let lineIndex = 1;
  while (lineIndex < terminalOutput.length) {
    let line = terminalOutput[lineIndex];

    //New command
    if (line.startsWith("$ cd")) {
      const newFolder = terminalOutput[lineIndex].split(" ").reverse()[0];
      if (newFolder == "..") currentFolder = currentFolder.parent;
      else
        currentFolder = currentFolder.children.find(
          (c) => c.data.name == newFolder
        );

      lineIndex++;
    }

    if (line == "$ ls") {
      //Process folder... all lines till $
      lineIndex++;
      while (
        lineIndex < terminalOutput.length &&
        terminalOutput[lineIndex][0] != "$"
      ) {
        line = terminalOutput[lineIndex];

        if (line.startsWith("dir")) {
          //Add folder to current folder
          currentFolder.children.push(
            new TreeNode<IFolder>(
              { name: line.substring(4) },
              currentFolder,
              []
            )
          );
          currentFolder.children[
            currentFolder.children.length - 1
          ].data.files = [];
        } else {
          const [size, name] = line.split(" ");
          currentFolder.data.files.push({ name, size: parseInt(size) });
        }

        lineIndex++;
      }
    }
  }

  const calculateFolderSize = (folder: ITreeNode<IFolder>) => {
    folder.data.size = folder.data.files.reduce((a, b) => a + b.size, 0);
    folder.children.forEach(
      (subfolder) => (folder.data.size += calculateFolderSize(subfolder))
    );

    return folder.data.size;
  };
  calculateFolderSize(root);
  return root;
};

const flatFolder = (folder: ITreeNode<IFolder>) => {
  let folders = folder.children;
  folder.children.forEach(
    (subfolder) => (folders = folders.concat(flatFolder(subfolder)))
  );
  return folders;
};

const root = scanFiles(terminalOutput);

const part1 = () => {
  const listOfFolder = flatFolder(root).filter((f) => f.data.size < 100000);
  return listOfFolder.reduce((a, b) => (a += b.data.size), 0);
};

const part2 = () => {
  const diskSize = 70000000;
  const freeSpace = diskSize - root.data.size;
  const neededSpace = 30000000 - freeSpace;
  const listOfFolder = flatFolder(root)
    .filter((f) => f.data.size >= neededSpace)
    .sort((a, b) => a.data.size - b.data.size);

  return listOfFolder[0].data.size;
};
console.time("part1");

console.log(`Part1 response: ${part1()}`);

console.timeEnd("part1");

console.time("part2");

console.log(`Part2 response: ${part2()}`);

console.timeEnd("part2");

console.timeEnd("day7");
