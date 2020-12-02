import { boxIds } from "./ids";

// What letters are common between the two correct box IDs?
let box2 = "";
const box = boxIds.find((boxId1) => {
  const letters1 = Array.from(boxId1);
  return boxIds.some((boxId2) => {
    const letters2 = Array.from(boxId2);
    box2 = boxId2;
    return letters1.filter((_l, i) => letters2[i] != letters1[i]).length == 1;
  });
});

console.log(box);
console.log(box2);

let newId = "";
for (let i = 0; i < box.length; i++) newId += box[i] == box2[i] ? box[i] : "";
console.log(newId);
