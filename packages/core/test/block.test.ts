import { describe, expect, it } from 'vitest';
import { Dimension, IBlock, OBlock, Point } from '../src/index';
import { createEmptyGrid } from './helpers';

const dimension = new Dimension(10, 20);

function createOBlockAt(x: number, y: number): OBlock {
  return new OBlock(
    [new Point(x, y), new Point(x + 1, y), new Point(x, y + 1), new Point(x + 1, y + 1)],
    dimension
  );
}

describe('Block.canMove', () => {
  it('空舞台上可以左右下移动', () => {
    const grid = createEmptyGrid(dimension);
    const block = createOBlockAt(0, 0);
    expect(block.canMove('right', grid)).toBe(true);
    expect(block.canMove('down', grid)).toBe(true);
  });

  it('贴墙时不能向墙外移动', () => {
    const grid = createEmptyGrid(dimension);
    const block = createOBlockAt(0, 0);
    expect(block.canMove('left', grid)).toBe(false);
    expect(block.canMove('up', grid)).toBe(false);
  });

  it('到达舞台底部时不能继续下移', () => {
    const grid = createEmptyGrid(dimension);
    const block = createOBlockAt(0, dimension.ySize - 2);
    expect(block.canMove('down', grid)).toBe(false);
  });

  it('目标位置存在已填充点时不能移动', () => {
    const grid = createEmptyGrid(dimension);
    grid[1][0] = new Point(0, 1);
    const block = createOBlockAt(0, 0);
    expect(block.canMove('down', grid)).toBe(false);
  });
});

describe('Block.move', () => {
  it('down 使所有点纵坐标加一', () => {
    const block = createOBlockAt(3, 5);
    const before = block.points.map((point) => ({ x: point.x, y: point.y }));
    expect(block.move('down')).toBe(true);
    block.points.forEach((point, index) => {
      expect(point.x).toBe(before[index].x);
      expect(point.y).toBe(before[index].y + 1);
    });
  });

  it('left / right 改变所有点横坐标', () => {
    const block = createOBlockAt(3, 5);
    block.move('left');
    expect(block.points.map((point) => point.x)).toEqual([2, 3, 2, 3]);
    block.move('right');
    block.move('right');
    expect(block.points.map((point) => point.x)).toEqual([4, 5, 4, 5]);
  });
});

describe('Block.rotate', () => {
  it('IBlock 水平状态可以旋转为竖直状态', () => {
    const grid = createEmptyGrid(dimension);
    const block = new IBlock(
      [new Point(3, 5), new Point(4, 5), new Point(5, 5), new Point(6, 5)],
      dimension
    );
    expect(block.canRotate(grid)).toBe(true);
    expect(block.rotate()).toBe(true);
    expect(block.points.map((point) => point.x).sort()).toEqual([4, 4, 4, 4]);
    expect(block.points.map((point) => point.y).sort((a, b) => a - b)).toEqual([3, 4, 5, 6]);
  });

  it('rotate 只校验边界，目标位置是否被占用需调用方通过 canRotate 判断', () => {
    const grid = createEmptyGrid(dimension);
    grid[4][4] = new Point(4, 4);
    const block = new IBlock(
      [new Point(3, 5), new Point(4, 5), new Point(5, 5), new Point(6, 5)],
      dimension
    );
    expect(block.canRotate(grid)).toBe(false);
    // rotate 不做占用检查，只检查旋转后是否越界，因此旋转成功
    expect(block.rotate()).toBe(true);
    expect(block.points.map((point) => point.y).sort((a, b) => a - b)).toEqual([3, 4, 5, 6]);
  });

  it('OBlock 没有旋转变化，始终不能旋转', () => {
    const grid = createEmptyGrid(dimension);
    const block = createOBlockAt(4, 4);
    expect(block.canRotate(grid)).toBe(false);
    expect(block.rotate()).toBe(false);
    expect(block.points.map((point) => [point.x, point.y])).toEqual([
      [4, 4], [5, 4], [4, 5], [5, 5]
    ]);
  });
});

describe('Block.clone', () => {
  it('生成同类型、同坐标但相互独立的新方块', () => {
    const block = createOBlockAt(4, 4);
    const cloned = block.clone();
    expect(cloned).toBeInstanceOf(OBlock);
    expect(cloned).not.toBe(block);
    expect(cloned.dimension).toBe(block.dimension);
    expect(cloned.points.map((point) => [point.x, point.y])).toEqual(
      block.points.map((point) => [point.x, point.y])
    );
    cloned.points[0].x = 99;
    expect(block.points[0].x).toBe(4);
  });
});
