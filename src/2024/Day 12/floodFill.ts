class FloodFill {
  private image: number[][];
  private rows: number;
  private cols: number;
  private perimiter = 0;

  constructor(image: number[][]) {
    this.image = image;
    this.rows = image.length;
    this.cols = image[0].length;
  }

  public fill = (
    startingRow: number,
    startingColumn: number,
    newColor: number
  ) => {
    const startColor = this.image[startingRow][startingColumn];
    if (startColor === newColor) return;
    this.dfs(startingRow, startingColumn, startColor, newColor);
  };

  private dfs = (
    row: number,
    col: number,
    color: number,
    newColor: number
  ): number => {
    if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) return 0;
    if (this.image[row][col] !== color) return 0;

    this.image[row][col] = newColor;

    const down = this.dfs(row + 1, col, color, newColor); // Down
    if (down === 0) return 0;
    const up = this.dfs(row - 1, col, color, newColor); // Up
    const right = this.dfs(row, col + 1, color, newColor); // Right
    const left = this.dfs(row, col - 1, color, newColor); // Left
    return down + up + right + left + 1;
  };

  public getImage = (): number[][] => {
    return this.image;
  };
}
