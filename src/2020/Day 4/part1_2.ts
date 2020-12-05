import * as fs from "fs";

class Passport {
  private static mandatoryFields = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
  ];

  private static fourDigits = /^\d{4}$/;
  private static height = /^(\d+)(cm|in)$/;
  private static hairColor = /^#[0-9a-f]{6}$/;
  private static eyeColor = /^(amb|blu|brn|gry|grn|hzl|oth)$/;
  private static pid = /^\d{9}$/;

  constructor(fields: string[]) {
    fields
      .filter((f) => f) //Eliminar vacios
      .forEach((pair) => {
        const parts = pair.split(":");
        this[parts[0]] = parts[1];
      });
  }

  public get hasValidFields() {
    //Comprobar si tiene todos los campos obligatorios
    const passportFields = Object.keys(this);
    return Passport.mandatoryFields.every((field) =>
      passportFields.includes(field)
    );
  }

  //byr (Birth Year) - four digits; at least 1920 and at most 2002.
  private byrValid = (value) =>
    Passport.fourDigits.test(value) && value >= 1920 && value <= 2002;

  //iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  private iyrValid = (value) =>
    Passport.fourDigits.test(value) && value >= 2010 && value <= 2020;

  //eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  private eyrValid = (value) =>
    Passport.fourDigits.test(value) && value >= 2020 && value <= 2030;

  /*    hgt (Height) - a number followed by either cm or in:
        If cm, the number must be at least 150 and at most 193.
        If in, the number must be at least 59 and at most 76.*/
  private hgtValid = (value) => {
    if (!Passport.height.test(value)) return false;

    const matches = value.match(Passport.height);
    return matches[2] == "cm"
      ? matches[1] >= 150 && matches[1] <= 193
      : matches[1] >= 59 && matches[1] <= 76;
  };

  //hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  private hclValid = (value) => Passport.hairColor.test(value);

  //ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  private eclValid = (value) => Passport.eyeColor.test(value);

  //pid (Passport ID) - a nine-digit number, including leading zeroes.
  private pidValid = (value) => Passport.pid.test(value);

  public get isValid() {
    if (!this.hasValidFields) return false;

    return Passport.mandatoryFields.every((field) =>
      this[`${field}Valid`](this[field])
    );
  }
}

class PassportDatabase {
  public read = (file: string): Passport[] =>
    fs
      .readFileSync(file, "utf8")
      .split("\r\n\r\n")
      .map((passport) => new Passport(passport.split(/\s|\r\n/)));
}

console.time("part1");
const passports = new PassportDatabase().read("./passports.txt");
console.log(
  "Answer:",
  passports.filter((passport) => passport.hasValidFields).length
);
console.timeEnd("part1");

console.time("part2");
console.log("Answer:", passports.filter((passport) => passport.isValid).length);
console.timeEnd("part2");
