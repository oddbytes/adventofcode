import * as fs from "fs";
console.time("day10");

const chunks: string[] = fs.readFileSync("./puzzle.txt", "utf8").split("\r\n");

const openings = ["(", "[", "{", "<"];
const closings = [")", "]", "}", ">"];
const points = [3, 57, 1197, 25137];
/**
 * Returns pending openings if chunk is incomplete, incorrect closing token if not
 * @param chunk chunk to check
 */
const checkChunk = (chunk: string): string => {
  const stack: string[] = [];
  let index = 0;
  while (index < chunk.length) {
    const token = chunk[index++];
    if (openings.includes(token)) {
      stack.push(token);
    } else {
      if (openings.indexOf(stack.pop()) != closings.indexOf(token))
        return token; //Bad pair
    }
  }
  return stack.join(""); //pending openings stack, or "" if empty (chunk is correct and complete)
};

const part1 = (checkedChunks: string[]) => {
  console.time("part1");
  const incorrectEndings = checkedChunks.filter(
    (i) => i.length == 1 && closings.includes(i)
  );

  console.log(
    "Answer 1",
    incorrectEndings.reduce(
      (a, token) => (a += points[closings.indexOf(token)]),
      0
    )
  );
  console.timeEnd("part1");
};

const part2 = (checkedChunks: string[]) => {
  console.time("part2");

  const incompleteChunks = checkedChunks.filter(
    (c) => c.length > 1 || openings.includes(c) //just in case there's an incomplete (not incorrect) chunk with length 1
  );

  const scores = incompleteChunks
    .map((chunk) =>
      chunk
        .split("")
        .reverse() //closings are in reverse order respect to openings
        .reduce(
          (score, token) => (score = score * 5 + (openings.indexOf(token) + 1)),
          0
        )
    )
    .sort((a, b) => b - a);

  console.log("Answer 2", scores[Math.floor(scores.length / 2)]); //get middle score

  console.timeEnd("part2");
};

const checkedChunks = chunks.map((c) => checkChunk(c));
part1(checkedChunks);
part2(checkedChunks);
console.timeEnd("day10");
