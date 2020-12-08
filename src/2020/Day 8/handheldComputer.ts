import * as fs from "fs";

export class HandheldComputer {
  private ptr = 0;
  private acc = 0;
  private instructions: string[];
  private reInstruction = /(?<op>\w+) (?<p1>[+\-0-9]+)/;
  constructor(programFile: string) {
    this.instructions = fs.readFileSync(programFile, "utf8").split("\r\n");
  }

  /**
   * Ejecuta la instruccion en la direccion apuntada por ptr
   */
  private executeInstruction = () => {
    const instruction = this.reInstruction.exec(this.instructions[this.ptr]);
    const p1 = parseInt(instruction.groups["p1"]);

    switch (instruction.groups["op"]) {
      case "acc":
        this.acc += p1;
        this.ptr++;
        break;
      case "jmp":
        this.ptr += p1;
        break;
      default:
        this.ptr++;
    }
  };

  /**
   * Devuelve un booleano indicando si el programa ha terminado (End Of Program)
   */
  private get EOP() {
    return this.ptr >= this.instructions.length;
  }

  /**
   * Encuentra el valor del acumulador justo antes de que el programa entre en bucle
   */
  public findAccBeforeLoop = (): number => {
    this.ptr = this.acc = 0;
    const executedAddresses: boolean[] = [];
    while (!executedAddresses[this.ptr] && !this.EOP) {
      executedAddresses[this.ptr] = true;
      this.executeInstruction();
    }
    return this.acc;
  };

  /**
   * Cambia nop por jmp y viceversa en la direccion indicada
   * @param address Direccion de la instruccion a cambiar
   */
  private toggleInstruction = (address: number) => {
    this.instructions[address] = this.instructions[address].startsWith("nop")
      ? this.instructions[address].replace("nop", "jmp")
      : this.instructions[address].replace("jmp", "nop");
  };

  /**
   * Modifica una instruccion nop o jmp por turno y ejecuta el programa. Si este termina, la funcion finaliza
   */
  public findAccAfterFix = (): number => {
    //Indices de las instrucciones nop y acc
    const corruptedAddresses = this.instructions
      .map((instruction, index) => (instruction.startsWith("acc") ? -1 : index))
      .filter((address) => address > -1);

    let acc = 0;
    for (
      let instructionIndex = 0;
      instructionIndex < corruptedAddresses.length;
      instructionIndex++
    ) {
      this.ptr = this.acc = 0; //Inicializar el programa
      this.toggleInstruction(corruptedAddresses[instructionIndex]); //Probar con la siguiente instruccion sospechosa
      acc = this.findAccBeforeLoop();
      if (this.EOP) break; // Si el programa ha finalizado ya hemos localizado la instruccion corrupta
      this.toggleInstruction(corruptedAddresses[instructionIndex]); // Dejar el programa como estaba
    }
    return acc;
  };
}
