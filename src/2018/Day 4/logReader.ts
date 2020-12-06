import * as fs from "fs";
export class LogReader {
  public read = (file: string): Passport[] =>
    fs
      .readFileSync(file, "utf8")
      .split("\r\n\r\n")
      .map((passport) => new Passport(passport.split(/\s|\r\n/)));
}
