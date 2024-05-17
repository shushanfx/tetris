export class Dimension {
  xSize: number;
  ySize: number;
  constructor(xSize: number, ySize: number) {
    this.xSize = xSize;
    this.ySize = ySize;
  }
  get halfXSize(): number {
    return ~~(this.xSize / 2) - 1;
  }
  get halfYSize(): number {
    return ~~(this.ySize / 2) - 1;
  }
}