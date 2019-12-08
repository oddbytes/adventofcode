import { Rectangle, IRectangle } from "./rectangle";
import { claims } from "./claims";

// const r1 = new Rectangle(5, 5, 10, 10);
// const r2 = new Rectangle(5, 3, 20, 3);
// console.log(r1.overlappingArea(r2));
// console.log(r2.overlappingArea(r1));

// return;

const rectangles = claims.map(claim => {
  //"#1 @ 469,741: 22x26",
  const dimensions = claim.match(/(\d+),(\d+):\s(\d+)x(\d+)/);
  return new Rectangle(
    parseInt(dimensions[1]),
    parseInt(dimensions[2]),
    parseInt(dimensions[3]),
    parseInt(dimensions[4])
  );
});

const checkedRectangles: IRectangle[] = [];

const totalOverlappingArea = rectangles.reduce((acum, rectangle1) => {
  checkedRectangles.push(rectangle1);
  return (
    acum +
    rectangles.reduce((acum2, rectangle2) => {
      if (checkedRectangles.includes(rectangle2)) return acum2;
      return acum2 + rectangle1.overlappingArea(rectangle2);
    }, 0)
  );
}, 0);

console.log(totalOverlappingArea);
