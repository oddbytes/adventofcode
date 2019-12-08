import { ImageDecoder } from "./imageDecoder";
import { imageStream } from "./imagestream";

var imageDecoder = new ImageDecoder(imageStream, 25, 6);
const layers = imageDecoder.getLayers();

const layer = imageDecoder.decodeImage(layers);

//Make decoded image it readable
for (let index = 0; index < layer.height; index++)
  console.log(
    layer.bytes
      .slice(index * layer.width, (index + 1) * layer.width)
      .join("")
      .replace(/1/g, "*")
      .replace(/0/g, " ")
  );
