import { afterEach, describe, expect, it, vi } from 'vitest';
import { BaseFactory, Block, ColorFactory, Dimension } from '../src/index';

const dimension = new Dimension(10, 20);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BaseFactory', () => {
  it('randomBlock 返回舞台内由 4 个点组成的方块', () => {
    const factory = new BaseFactory(dimension);
    const block = factory.randomBlock();
    expect(block).toBeInstanceOf(Block);
    expect(block.points).toHaveLength(4);
    block.points.forEach((point) => {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThan(dimension.xSize);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThan(dimension.ySize);
    });
  });

  it('randomBlock 每次返回克隆出的新实例', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const factory = new BaseFactory(dimension);
    const first = factory.randomBlock();
    const second = factory.randomBlock();
    expect(second).not.toBe(first);
    second.points[0].x = 99;
    expect(first.points[0].x).not.toBe(99);
  });
});

describe('ColorFactory', () => {
  it('randomBlock 为每个点随机分配调色板中的颜色', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const factory = new ColorFactory(dimension, ['#111', '#222']);
    const block = factory.randomBlock();
    expect(block.points.every((point) => point.attrs.color === '#222')).toBe(true);
  });
});
