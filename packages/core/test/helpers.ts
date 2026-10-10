import { Dimension, Point } from '../src/index';

export function createEmptyGrid(dimension: Dimension): Point[][] {
  return Array.from({ length: dimension.ySize }, () =>
    Array.from({ length: dimension.xSize }, () => new Point(-1, -1))
  );
}
