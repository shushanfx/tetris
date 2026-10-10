import { describe, expect, it } from 'vitest';
import { Dimension } from '../src/index';

describe('Dimension', () => {
  it('保存横纵尺寸', () => {
    const dimension = new Dimension(10, 20);
    expect(dimension.xSize).toBe(10);
    expect(dimension.ySize).toBe(20);
  });

  it('halfXSize / halfYSize 为尺寸一半向下取整再减一', () => {
    const dimension = new Dimension(10, 20);
    expect(dimension.halfXSize).toBe(4);
    expect(dimension.halfYSize).toBe(9);
  });
});
