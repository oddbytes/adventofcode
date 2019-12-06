import { boxIds } from "./ids";

// https://adventofcode.com/2018/day/2

const twoLetters = boxIds.reduce((acum, boxId) => {
  const letters = Array.from(boxId);
  if (letters.some(letter => letters.filter(l => l == letter).length === 2))
    return acum + 1;
  return acum;
}, 0);

const threeLetters = boxIds.reduce((acum, boxId) => {
  const letters = Array.from(boxId);
  if (letters.some(letter => letters.filter(l => l == letter).length === 3))
    return acum + 1;
  return acum;
}, 0);

console.log(twoLetters * threeLetters);
