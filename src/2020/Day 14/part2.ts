import * as fs from "fs";
import { ITreeNode, TreeNode } from "../../common/treeNode";
console.time("part2");
const data = fs.readFileSync("./program.txt", "utf8").split("\r\n");

const mem: number[] = [];

/**
 * Genera un arbol binario con los valores decimales correpondientes a las combinaciones posibles de la mascara
 * @param floatingAddress mascara de direccion flotante
 * @param treeNode nodo raiz
 */
const generateTree = (floatingAddress: string, treeNode: ITreeNode<number>) => {
  //Agrega al nodo indicado uno (valores de mascara 1) o dos (valores de mascara X) hijos
  // Si la máscara contine un 0 no agrega nodo y sigue procesando en el actual
  const pow = Math.pow(2, floatingAddress.length - 1);

  if (floatingAddress[0] != "0") {
    if (floatingAddress[0] == "X")
      treeNode.children.push(new TreeNode<number>(0, null, []));
    treeNode.children.push(new TreeNode<number>(pow, null, []));

    if (floatingAddress.length > 1)
      treeNode.children.forEach((child) =>
        generateTree(floatingAddress.substr(1), child)
      );
  } else if (floatingAddress.length > 1)
    generateTree(floatingAddress.substr(1), treeNode);
};

/**
 * Obtiene la mascara flotante para la direccion indicada aplicando la mascara
 * @param unmaskedValue direccion (decimal)
 * @param mask máscara a aplicar
 */
const maskAddress = (unmaskedValue: number, mask: string): string =>
  Array.from(unmaskedValue.toString(2).padStart(36, "0"))
    .map((bit, index) =>
      mask[index] == "0" ? bit : mask[index] == "1" ? "1" : "X"
    )
    .join("");

/**
 * Realiza un recorrido DFS sobre el arbol binario sumando en cada paso el valor del nodo. Al llegar a una hoja
 * añade dicho valor al array de direcciones
 * @param node nodo raiz
 * @param acum acumulado desde la raiz hasta este nodo
 */
const getAddresses = (node: TreeNode<number>, acum = 0): number[] => {
  acum += node.data;
  const addresses: number[] = [];

  if (node.children.length == 0) {
    addresses.push(acum);
  } else {
    node.children.forEach((child) =>
      addresses.push(...getAddresses(child, acum))
    );
  }

  return addresses;
};

const reInstruction = /(?<op>mask|mem)(\[(?<address>\d+)\])? = (?<value>[X\d]+)/;
let mask = "";
let acum = 0;

data.forEach((instruction) => {
  const inst = instruction.match(reInstruction);
  if (inst.groups["op"] == "mask") mask = inst.groups["value"];
  else {
    const floatingAddress = maskAddress(parseInt(inst.groups["address"]), mask);
    //generamos un árbol de combinaciones para la mascara flotante
    const root = new TreeNode<number>(0, null, []);
    generateTree(floatingAddress, root);
    //obtenemos las direcciones del árbol y para cada una escribimos la memoria

    getAddresses(root).forEach((address) => {
      if (mem[address]) acum -= mem[address];
      mem[address] = parseInt(inst.groups["value"]);
      acum += mem[address];
    });
  }
});

console.log("Answer:", acum);

console.timeEnd("part2");
