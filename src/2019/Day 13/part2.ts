import { IntcodeComputer, IProgramOptions } from "../Day 2/intcodeComputer";
import { Point, IPoint } from "../Day 3/SegmentCalculator";
import { GameMap } from "./gameMap";
import { gameProgram } from "./gameProgram";
import { ITile, Tile, TileType } from "./tiles";
import { Direction } from "./joystick";

const gameMap = new GameMap();

const computer = new IntcodeComputer();
const options: IProgramOptions = {
  suspendOnOutput: true,
  input: [0] //initial joystick position
};

gameProgram[0] = 2;
let program = computer.execute(gameProgram, options);
let score = 0;
let moveCount = 0;

let ballPosition: IPoint = new Point(0, 0);
const ballPositions: IPoint[] = []; //ball position history. We don't really need this, just the previous one, but lets store it just in case we want to save a replay video

let currentPaddlePosition: IPoint = new Point(0, 0);
const tiles: ITile[] = [];
let ballDirection: Direction = Direction.neutral;

let rightWallX: number = -1;

while (program.exitCode != 99) {
  let joystickDirection: Direction;
  program = computer.resume(); //get second output parmam
  program = computer.resume(); //get third output param
  if (program.output[program.output.length - 3] == -1) {
    score = program.output[program.output.length - 1]; //score update
    console.log(`Score: ${score}`);
    if (score == 0) {
      rightWallX = Math.max(...tiles.map(t => t.position.x));
      console.log(`GAME START! Right wall @${rightWallX}, assuming left @0 `);
    }
  } else {
    switch (program.output[program.output.length - 1]) {
      case TileType.ball: {
        ballPosition.x = program.output[program.output.length - 3];
        ballPosition.y = program.output[program.output.length - 2];
        if (ballPositions.length > 0)
          ballDirection =
            ballPosition.x > ballPositions[ballPositions.length - 1].x
              ? Direction.right
              : Direction.left;
        if (
          currentPaddlePosition.x > -1 &&
          ballDirection != Direction.neutral
        ) {
          //We know where the paddle is and the ball direction,calculate target
          let paddleTargetX =
            ballDirection == Direction.right ? ballPosition.x : ballPosition.x;
          //Correct walls
          if (paddleTargetX < 1) paddleTargetX = 1;
          if (paddleTargetX > rightWallX - 1) paddleTargetX = rightWallX - 1;
          joystickDirection = Direction.neutral;

          if (currentPaddlePosition.x > paddleTargetX)
            joystickDirection = Direction.left;
          if (currentPaddlePosition.x < paddleTargetX)
            joystickDirection = Direction.right;

          console.log(
            `${moveCount} Ball: ${ballPosition.x},${ballPosition.y} Dir: ${ballDirection} Paddle:${currentPaddlePosition.x},${currentPaddlePosition.y} target: ${paddleTargetX} Move:${joystickDirection}`
          );

          if (
            ballPosition.x == currentPaddlePosition.x + joystickDirection &&
            ballPosition.y == currentPaddlePosition.y - 1
          )
            console.log("Bong!");
        } else {
          console.log(
            `${moveCount} Ball: ${ballPosition.x},${ballPosition.y} Dir: ${ballDirection} Paddle:${currentPaddlePosition.x},${currentPaddlePosition.y} Move: NO MOVE`
          );
        }

        ballPositions.push(Object.assign({}, ballPosition));

        moveCount++;
        break;
      }

      case TileType.paddle: {
        currentPaddlePosition.x = program.output[program.output.length - 3];
        currentPaddlePosition.y = program.output[program.output.length - 2];

        break;
      }

      default: {
        const tile = tiles.find(
          t =>
            t.position.x == program.output[program.output.length - 3] &&
            t.position.y == program.output[program.output.length - 2]
        );
        if (tile) {
          if (tile.type == TileType.block)
            console.log(
              `Block destroyed @ ${program.output[program.output.length - 3]},${
                program.output[program.output.length - 2]
              }`
            );
          tile.type = program.output[program.output.length - 1];
        } else
          tiles.push(
            new Tile(
              new Point(
                program.output[program.output.length - 3],
                program.output[program.output.length - 2]
              ),
              program.output[program.output.length - 1]
            )
          );
      }
    }
  }
  if (program.exitCode != 99) {
    program = computer.resume(
      joystickDirection ? [joystickDirection] : undefined
    );
  }
}

// lets render the state with the ball history

const ballTiles: ITile[] = [];
ballPositions.forEach(b => {
  const tile = tiles.find(t => t.position.x == b.x && t.position.y == b.y);
  if (tile) tile.type = TileType.ball;
  else ballTiles.push(new Tile(b, TileType.ball));
});

const tile = tiles.find(
  t =>
    t.position.x == currentPaddlePosition.x &&
    t.position.y == currentPaddlePosition.y
);
tile.type = TileType.paddle;

console.log(gameMap.render(tiles.concat(ballTiles)));
