import { ImageDecoder } from "./imageDecoder";
import { imageStream } from "./imagestream";

var imageDecoder = new ImageDecoder(imageStream, 25, 6);
const image = imageDecoder.getImage();

const composedImage = imageDecoder.composeImage(image);

//Make decoded image it readable
for (let index = 0; index < composedImage.height; index++)
  console.log(
    composedImage.layers[0].bytes
      .slice(index * composedImage.width, (index + 1) * composedImage.width)
      .join("")
      .replace(/1/g, "*")
      .replace(/0/g, " ")
  );
