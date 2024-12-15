import * as fs from "fs";

console.time("day");

const stones = fs
  .readFileSync("./input.txt", "utf8")
  .split(" ")
  .map((stone) => parseInt(stone));
console.time("part");

const numbersMap = new Map<number, number>(); //map  to count instances of every number in the series of stones
for (let stoneIndex = 0; stoneIndex < stones.length; stoneIndex++) {
  if (numbersMap.has(stones[stoneIndex])) {
    numbersMap.set(stones[stoneIndex], numbersMap.get(stones[stoneIndex]) + 1);
  } else {
    numbersMap.set(stones[stoneIndex], 1);
  }
}
const setNumberCount = (numbersMap: Map<number, number>, number, value) => {
  if (numbersMap.has(number)) {
    numbersMap.set(number, numbersMap.get(number) + value);
  } else {
    numbersMap.set(number, value);
  }
};

const blink = (times: number) => {
  for (let blink = 0; blink < times; blink++) {
    const keys = Array.from(numbersMap.keys());
    const values = Array.from(numbersMap.values());
    const newNumbersMap = new Map<number, number>(); //map  to count instances of every number in the series of stones

    keys.forEach((key, index) => {
      const count = values[index];
      if (count > 0) {
        const keyString = key.toString();

        if (key === 0) {
          //Convert 0s to 1s
          setNumberCount(newNumbersMap, 1, count);
          numbersMap.set(0, 0);
        } else if (keyString.length % 2 == 0) {
          const rightStone = keyString.substring(keyString.length / 2);
          const leftStone = keyString.substring(0, keyString.length / 2);

          numbersMap.set(key, 0);
          setNumberCount(newNumbersMap, parseInt(rightStone), count);
          setNumberCount(newNumbersMap, parseInt(leftStone), count);
        } else {
          numbersMap.set(key, 0);
          setNumberCount(newNumbersMap, key * 2024, count);
        }
      }
    });
    //Copy new stones to main map
    newNumbersMap.forEach((value, key) => {
      setNumberCount(numbersMap, key, value);
    });
  }
};

blink(25);
console.log(
  "Part 1 Answer:",
  [...numbersMap.values()].reduce((a, b) => a + b, 0)
);
blink(50);
console.log(
  "Part 2 Answer:",
  [...numbersMap.values()].reduce((a, b) => a + b, 0)
);
console.timeEnd("part");
console.timeEnd("day");
