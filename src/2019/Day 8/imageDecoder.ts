export interface ILayer {
  width: number;
  height: number;
  bytes: number[];
}

export interface IImage {
  width: number;
  height: number;
  layers: ILayer[];
}

export class ImageDecoder {
  constructor(
    public imageStream: string,
    public layerWidth: number,
    public layerHeight: number
  ) {}

  public getLayers(): ILayer[] {
    const layers: ILayer[] = [];
    const chunks =
      this.imageStream.length / (this.layerWidth * this.layerHeight);
    for (let chunk = 0; chunk < chunks; chunk++)
      layers.push({
        width: this.layerWidth,
        height: this.layerHeight,
        bytes: Array.from(
          this.imageStream.slice(
            chunk * this.layerWidth * this.layerHeight,
            (chunk + 1) * this.layerWidth * this.layerHeight
          )
        ).map(c => parseInt(c))
      });
    return layers;
  }

  public decodeImage(layers: ILayer[]): ILayer {
    return {
      width: this.layerWidth,
      height: this.layerHeight,
      bytes: layers[0].bytes.map((byte, index) =>
        byte != 2 ? byte : layers.find(l => l.bytes[index] != 2).bytes[index]
      )
    };
  }
}
