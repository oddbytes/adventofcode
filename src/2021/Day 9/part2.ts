import * as fs from "fs";
import { Queue } from "../../common/queue";

console.time("part2");

const rows: number[][] = fs
  .readFileSync("./puzzle.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split("").map((x) => parseInt(x)));
//number of columns
const columns = rows[0].length;
const heights = rows.flatMap((x) => x);

const getLowPointIndexes = (heights: number[], columns: number): number[] => {
  //filter points -> check up, down, left && right heights
  const lowPointIndexes: number[] = [];
  heights.forEach((height, index) => {
    const col = index % columns;
    const left = col == 0 ? -1 : index - 1;
    const right = col == columns - 1 ? -1 : index + 1;
    if (
      height < (heights[left] ?? 10) &&
      height < (heights[right] ?? 10) &&
      height < (heights[index + columns] ?? 10) &&
      height < (heights[index - columns] ?? 10)
    )
      lowPointIndexes.push(index);
  });
  return lowPointIndexes;
};

/**
 * get basin size using BFS algorithm. Marks visited nodes with value= -1, mutating original array
 * @param lowPoint index of the lowPoint
 * @returns basin size
 */
const getBasinSize = (
  lowPoint: number,
  heights: number[],
  columns: number
): number => {
  const queue: Queue<number> = new Queue<number>();

  queue.push(lowPoint); // Enqueue source cell
  let basinSize = 0;
  while (queue.length > 0) {
    //  dequeue the front cell   in the queue and enqueue  its adjacent cells
    const index = queue.pop();
    // if position is already visited go on
    if (heights[index] == -1) continue;
    basinSize++;

    //mark as visited=set -1
    heights[index] = -1;
    //push adjacent visitable nodes (not visited and heigth<9)
    const col = index % columns;
    const left = col == 0 ? -1 : index - 1;
    const right = col == columns - 1 ? -1 : index + 1;
    const down = index + columns > heights.length - 1 ? -1 : index + columns;
    const up = index - columns < 0 ? -1 : index - columns;

    if (left > -1 && heights[left] > -1 && heights[left] < 9) queue.push(left);
    if (right > -1 && heights[right] > -1 && heights[right] < 9)
      queue.push(right);
    if (down > -1 && heights[down] > -1 && heights[down] < 9) queue.push(down);
    if (up > -1 && heights[up] > -1 && heights[up] < 9) queue.push(up);
  }
  return basinSize;
};

const lowPoints = getLowPointIndexes(heights, columns);

const basinSizes = lowPoints
  .map((lowPoint) => getBasinSize(lowPoint, heights, columns))
  .sort((a, b) => b - a);

console.log("Response", basinSizes[0] * basinSizes[1] * basinSizes[2]);
console.timeEnd("part2");
