import * as fs from "fs";
import * as moment from "moment";

export class Log {
  constructor(public date: moment.Moment, public asleep: "up" | "asleep") {}
}

export class LogReader {
  //[1518-11-01 00:00] Guard #10 begins shift
  //[1518-11-01 00:05] falls asleep
  //[1518-11-01 00:25] wakes up
  private static reState = /\[(?<date>.+)\] (?:\w+) ((?<token>\w+|#\d+))/g;
  public read = (file: string): Log[] => {
    const lines = fs
      .readFileSync(file, "utf8")
      .split("\r\n")
      .map((line) => {
        const def = LogReader.reState.exec(line);
        return new Log(
          moment(def.groups["date"]),
          def.groups["token"].startsWith("#")
            ? def.groups["token"]
            : def.groups["token"]
        );
      });
  };
}
