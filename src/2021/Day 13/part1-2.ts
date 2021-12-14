import * as fs from "fs";
import { IPoint, Point } from "../../common/point";

console.time("day13");

const file = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .filter((l) => l.length);
const dots = file
  .filter((l) => l.includes(","))
  .map((line) => {
    const [x, y] = line.split(",");
    return new Point(parseInt(x), parseInt(y));
  });

interface iFold {
  axis: string;
  index: number;
}
const reFold = /fold along (?<axis>.)=(?<index>\d+)/;
const folds: iFold[] = file
  .filter((l) => !l.includes(","))
  .map((l) => {
    const match = reFold.exec(l);
    return {
      axis: match.groups["axis"],
      index: parseInt(match.groups["index"]),
    };
  });

/**
 * Assumes folds are always by mid line
 * @param dots dots map
 * @param foldBy fold index/axis
 * @returns new dots map
 */
const fold = (dots: IPoint[], foldBy: iFold): IPoint[] => {
  const size = foldBy.index * 2 + 1;
  if (foldBy.axis == "y") {
    //horizontal axis
    const foldedDots = dots
      .filter((d) => d.y > foldBy.index)
      .map((d) => new Point(d.x, Math.abs(d.y - size + 1)));
    return dots.filter((d) => d.y < foldBy.index).concat(foldedDots);
  } else {
    //vertical axis
    const foldedDots = dots
      .filter((d) => d.x > foldBy.index)
      .map((d) => new Point(Math.abs(d.x - size + 1), d.y));
    return dots.filter((d) => d.x < foldBy.index).concat(foldedDots);
  }
};

const replaceAt = (string: string, index: number, replacement: string) =>
  string.substr(0, index) +
  replacement +
  string.substr(index + replacement.length);

const print = (dots: IPoint[]) => {
  const width = Math.max(...dots.map((d) => d.x)) + 1;
  const height = Math.max(...dots.map((d) => d.y)) + 1;
  for (let r = 0; r < height; r++) {
    let line = " ".repeat(width);
    dots
      .filter((d) => d.y == r)
      .forEach((d) => (line = replaceAt(line, d.x, "#")));
    console.log(line);
  }
};

const part1 = (dots: IPoint[]) => {
  console.time("part1");

  const fd = fold(dots, folds[0]);
  console.log("Answer 1", new Set(fd.map((p) => p.toString())).size);
  console.timeEnd("part1");

  return fd;
};

const part2 = (dots: IPoint[], folds: iFold[]) => {
  console.time("part2");
  folds.forEach((f) => (dots = fold(dots, f)));

  const fd = fold(dots, folds[0]);
  print(dots);
  console.timeEnd("part2");

  return fd;
};

const paper = part1(dots);
part2(paper, folds.slice(1));
console.timeEnd("day13");
