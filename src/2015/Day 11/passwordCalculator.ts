export class PasswordCalculator {
  private repeatingLetter = /([a-z])\1/g;

  constructor(public password: string) {}

  private get hasThreeStraightLetters(): boolean {
    for (let index = 0; index < this.password.length - 3; index++) {
      if (
        this.password.charCodeAt(index + 1) ==
          this.password.charCodeAt(index) + 1 &&
        this.password.charCodeAt(index + 2) ==
          this.password.charCodeAt(index + 1) + 1
      )
        return true;
    }
    return false;
  }

  private get hasTwoRepeatingGroup(): boolean {
    const groups = new Set(
      Array.from(this.password.matchAll(this.repeatingLetter)).map(
        (match) => match[0]
      )
    );
    return groups.size > 1;
  }

  //Indica si la clave actual es válida
  public get isValid(): boolean {
    return !(
      this.password.includes("i") ||
      this.password.includes("o") ||
      this.password.includes("l") ||
      !this.hasThreeStraightLetters ||
      !this.hasTwoRepeatingGroup
    );
  }

  private increment(password: string, position: number) {
    if (position < 0) throw new Error("No valid password found");
    //a=97 z=122

    if (password.charCodeAt(position) == 122)
      return this.increment(password.substr(0, position), position - 1) + "a";
    else {
      return (
        password.substr(0, position) +
        String.fromCharCode(password.charCodeAt(position) + 1)
      );
    }
  }

  public calculateNext = () => {
    //Sumar una al ultimo. Si es una z, poner a y sumar al siguiete

    this.password = this.increment(this.password, this.password.length - 1);
  };
}
