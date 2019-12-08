export interface ILayer {
  bytes: number[];
}

export interface IImage {
  width: number;
  height: number;
  layers: ILayer[];
}

export class ImageDecoder {
  /**
   * Constructs an instance of image decoder for a give strem
   * @param imageStream image stream
   * @param layerWidth layer width
   * @param layerHeight layer height
   */
  constructor(
    public imageStream: string,
    public layerWidth: number,
    public layerHeight: number
  ) {}

  /**
   * return the imagerepresented by the raw stream passed to this instance constructor
   */
  public getImage(): IImage {
    const layers: ILayer[] = [];
    const chunks =
      this.imageStream.length / (this.layerWidth * this.layerHeight);
    for (let chunk = 0; chunk < chunks; chunk++)
      layers.push({
        bytes: Array.from(
          this.imageStream.slice(
            chunk * this.layerWidth * this.layerHeight,
            (chunk + 1) * this.layerWidth * this.layerHeight
          )
        ).map(c => parseInt(c))
      });
    return {
      width: this.layerWidth,
      height: this.layerHeight,
      layers
    };
  }

  /**
   * Returns an image with one layer composed with non-transparent bytes of the layers stack
   * @param image Raw image
   */
  public composeImage(image: IImage): IImage {
    return {
      width: this.layerWidth,
      height: this.layerHeight,
      layers: [
        {
          bytes: image.layers[0].bytes.map((byte, index) =>
            byte != 2
              ? byte
              : image.layers.find(l => l.bytes[index] != 2).bytes[index]
          )
        }
      ]
    };
  }
}
