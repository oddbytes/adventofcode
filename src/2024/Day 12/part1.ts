import * as fs from "fs";

console.time("day");

const diskLayout = fs.readFileSync("./input.txt", "utf8");
console.time("part");

let currentBlockPointer = 0,
  currentObjectIndex = 0;
//012345678           Block index
//2333133121414131402 Blocks
//0 1 2 3 4 5 6 7 8 9 File IDs. Equals to the block index / 2
let tailFileIndex = diskLayout.length - 1;

let tailFileLength = parseInt(diskLayout[tailFileIndex]);
let checkSum = 0;
while (currentObjectIndex < tailFileIndex - 1) {
  const isGap = currentObjectIndex % 2 != 0; //odd indexes asre gaps
  let currentObjectLength = parseInt(diskLayout[currentObjectIndex]);

  if (!isGap) {
    const fileId = currentObjectIndex / 2;
    for (let i = 0; i < currentObjectLength; i++) {
      checkSum += fileId * currentBlockPointer++;
    }
  } else
    //we have a gap greater than 0 blocks lets move blocks from the  file at the tail
    while (currentObjectLength > 0) {
      //start filling the gap
      const fileId = tailFileIndex / 2;
      checkSum += fileId * currentBlockPointer++;
      currentObjectLength--;
      tailFileLength--;
      //if tail file has no  more blocks, lets jump to the next file
      if (tailFileLength == 0) {
        tailFileIndex -= 2; //jump over the gap
        tailFileLength = parseInt(diskLayout[tailFileIndex]); //get the size in blocks of the file at the tail
      }
    }

  currentObjectIndex++; //go for the next file/gap
}
//Add the last file
const fileId = tailFileIndex / 2;
for (let i = 0; i < tailFileLength; i++) {
  checkSum += fileId * currentBlockPointer++;
}

console.log("Answer:", checkSum);
console.timeEnd("part");
console.timeEnd("day");
