import * as fs from "fs";
import { number } from "mathjs";

console.time("day");

const diskLayout = fs.readFileSync("./input.txt", "utf8");

/**
 * Saves the information of a gap, its size and block index
 */
class Gap {
  constructor(
    public size: number,
    public blockIndex: number
  ) {}
}
console.time("part");
//012345678           Block index
//2333133121414131402 Blocks
//0 1 2 3 4 5 6 7 8 9 File IDs. Equals to the block index / 2

//create a list of gaps
const gaps: Gap[] = [];
const blockPointers: number[] = []; //Array containing the firts block index of each obect of the disk

let currentBlockPointer = 0,
  currentObjectIndex = 0;
for (; currentObjectIndex < diskLayout.length; currentObjectIndex += 1) {
  const isGap = currentObjectIndex % 2 != 0; //odd indexes asre gaps
  if (isGap) {
    const gapSize = parseInt(diskLayout[currentObjectIndex]);
    if (gapSize > 0) {
      gaps.push(new Gap(gapSize, currentBlockPointer));
    }
  }
  blockPointers.push(currentBlockPointer);
  currentBlockPointer += parseInt(diskLayout[currentObjectIndex]);
}
//order by zize, left positions first
gaps.sort((a, b) => a.size - b.size || a.blockIndex - b.blockIndex);
//create a Map containing gap size as key and an ordered array of gaps of that size
const gapSizesMap = new Map<number, Gap[]>();
for (let gapIndex = 0; gapIndex < gaps.length; gapIndex++) {
  const size = gaps[gapIndex].size;
  if (!gapSizesMap.has(size)) {
    let endIndex = gapIndex;
    while (endIndex < gaps.length && gaps[endIndex].size == size) {
      endIndex++;
    }
    gapSizesMap.set(size, gaps.slice(gapIndex, endIndex));
    gapIndex = endIndex - 1;
  }
}

let checkSum = 0;
//rearrange files from the end
currentObjectIndex = diskLayout.length - 1;
while (currentObjectIndex > 0) {
  //check if we have gaps of that size or greater
  const fileSize = parseInt(diskLayout[currentObjectIndex]);
  let gapSize = fileSize;
  const fileId = currentObjectIndex / 2;

  let leftmostGap: Gap = new Gap(
    10,
    blockPointers[blockPointers.length - 1] + 1
  );
  while (gapSize < 10) {
    if (gapSizesMap.has(gapSize)) {
      if (gapSizesMap.get(gapSize)[0].blockIndex < leftmostGap.blockIndex)
        leftmostGap = gapSizesMap.get(gapSize)[0];
    }
    gapSize++;
  }

  gapSize = leftmostGap.size;
  //Get the leftmot gap with a size equal or greater to the file that is leftmost

  if (gapSize != 10) {
    //We have a gap big enough
    let gapsList = gapSizesMap.get(gapSize);
    //Gap must be to the eft of the file
    if (blockPointers[currentObjectIndex] > gapsList[0].blockIndex) {
      const gap = gapsList.shift();
      if (gapsList.length == 0) gapSizesMap.delete(gapSize);

      for (let i = 0; i < fileSize; i++) {
        checkSum += fileId * (gap.blockIndex + i);
      }
      gap.size -= fileSize; //new gap size
      gap.blockIndex += fileSize; // new starting of gap

      if (gap.size > 0) {
        //Change gap to list of its new size
        if (gapSizesMap.has(gap.size)) {
          gapsList = gapSizesMap.get(gap.size);
          //serach for the index where this gap must be inserted
          let gapIndex = 0;
          while (
            gapIndex < gapsList.length &&
            gapsList[gapIndex].blockIndex < gap.blockIndex
          )
            gapIndex++;

          gapsList.splice(gapIndex, 0, gap);
        } else gapSizesMap.set(gap.size, [gap]);
      }
    } else {
      //File can not be moved, no leftmost gap for it. Compute its checksum
      for (let i = 0; i < fileSize; i++) {
        checkSum += fileId * (blockPointers[currentObjectIndex] + i);
      }
    }
  } else {
    //File can not be moved, no gap for it. Compute its checksum
    for (let i = 0; i < fileSize; i++) {
      checkSum += fileId * (blockPointers[currentObjectIndex] + i);
    }
  }

  currentObjectIndex -= 2;
}

console.log("Answer:", checkSum);
console.timeEnd("part");
console.timeEnd("day");
