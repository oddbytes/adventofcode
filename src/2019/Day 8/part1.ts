import { ImageDecoder } from "./imageDecoder";
import { imageStream } from "./imagestream";

/**
 * Counts the number of appearances of digit in array
 * @param array
 * @param digit
 */
const digitCount = (array: number[], digit: number): number =>
  array.reduce((accum, byte) => (byte == digit ? accum + 1 : accum), 0);

var imageDecoder = new ImageDecoder(imageStream, 25, 6);
const layers = imageDecoder.getLayers();
// the layer that contains the fewest 0 digits
const layer0 = layers.sort(
  (a, b) => digitCount(a.bytes, 0) - digitCount(b.bytes, 0)
)[0];

console.log(digitCount(layer0.bytes, 1) * digitCount(layer0.bytes, 2));
