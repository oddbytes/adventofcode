import * as fs from "fs";

export class GroupAnswers {
  private answers: string[];
  constructor(private questionsAnswered: string[]) {
    this.answers = questionsAnswered
      .map((personAnswers) => Array.from(personAnswers))
      .flat();
  }

  /**
   * Devuelve una sola cadena con las respuestas sin duplicados
   */
  public get uniqueAnswers(): string {
    return [...new Set<string>(this.answers)].join("");
  }

  /**
   * Devuelve una cadena con las preguntas respondidas por todo el grupo (interseccion)
   */
  public get commonAnswers(): string {
    let commonAnswers = Array.from(this.questionsAnswered[0]);
    this.questionsAnswered.slice(1).forEach((person) => {
      commonAnswers = commonAnswers.filter((answer) =>
        Array.from(person).includes(answer)
      );
    });
    return commonAnswers.join("");
  }
}

export class AnswersDatabase {
  public read = (file: string): GroupAnswers[] =>
    fs
      .readFileSync(file, "utf8")
      .split("\r\n\r\n")
      .map((answers) => new GroupAnswers(answers.split("\r\n")));
}
