import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Dimension, IBlock, OBlock, Point, Stage } from '../src/index';

const dimension = new Dimension(10, 20);

function createStage(): Stage {
  return new Stage(dimension);
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Stage 初始化', () => {
  it('reset 生成指定尺寸的空点阵并清零分数', () => {
    const stage = createStage();
    expect(stage.score).toBe(0);
    expect(stage.isOver).toBe(false);
    expect(stage.current).toBeNull();
    expect(stage.points).toHaveLength(20);
    stage.points.forEach((row) => {
      expect(row).toHaveLength(10);
      row.forEach((point) => expect(point.isEmpty).toBe(true));
    });
  });
});

describe('Stage.tick', () => {
  it('首次 tick 生成 current 与 next 两个方块', () => {
    const stage = createStage();
    stage.tick();
    expect(stage.current).not.toBeNull();
    expect(stage.next).not.toBeNull();
    expect(stage.current).not.toBe(stage.next);
  });

  it('后续 tick 使方块逐行下落', () => {
    const stage = createStage();
    stage.tick();
    const before = stage.current!.points.map((point) => point.y);
    stage.tick();
    stage.current!.points.forEach((point, index) => {
      expect(point.y).toBe(before[index] + 1);
    });
  });

  it('current 与已填充点重叠时判定游戏结束', () => {
    const stage = createStage();
    stage.current = new OBlock(
      [new Point(0, 5), new Point(1, 5), new Point(0, 6), new Point(1, 6)],
      dimension
    );
    stage.points[5][0] = new Point(0, 5);
    stage.points[5][1] = new Point(1, 5);
    stage.points[6][0] = new Point(0, 6);
    stage.points[6][1] = new Point(1, 6);
    stage.tick();
    expect(stage.isOver).toBe(true);
    expect(stage.points[5][0].x).toBe(0);
    expect(stage.points[5][0].y).toBe(5);
  });
});

describe('Stage.move / rotate', () => {
  it('move 移动当前方块', () => {
    const stage = createStage();
    stage.tick();
    const before = stage.current!.points.map((point) => point.x);
    stage.move('left');
    stage.current!.points.forEach((point, index) => {
      expect(point.x).toBe(before[index] - 1);
    });
  });

  it('贴墙时 move 被阻挡且返回 false', () => {
    const stage = createStage();
    stage.current = new OBlock(
      [new Point(0, 5), new Point(1, 5), new Point(0, 6), new Point(1, 6)],
      dimension
    );
    expect(stage.move('left')).toBe(false);
    expect(stage.current.points.map((point) => point.x)).toEqual([0, 1, 0, 1]);
  });

  it('current 为空时 move / rotate 返回 false', () => {
    const stage = createStage();
    expect(stage.move('left')).toBe(false);
    expect(stage.rotate()).toBe(false);
  });
});

describe('Stage 消行与计分', () => {
  it('getScore 按消除行数计分', () => {
    const stage = createStage();
    expect(stage.getScore(1)).toBe(100);
    expect(stage.getScore(2)).toBe(300);
    expect(stage.getScore(3)).toBe(700);
    expect(stage.getScore(4)).toBe(1500);
    expect(stage.getScore(0)).toBe(0);
  });

  it('填满一行后触发消除、计分并使上方行下落', () => {
    const stage = createStage();
    for (let x = 0; x < 6; x++) {
      stage.points[19][x] = new Point(x, 19);
    }
    stage.points[18][3] = new Point(3, 18);
    stage.current = new IBlock(
      [new Point(6, 19), new Point(7, 19), new Point(8, 19), new Point(9, 19)],
      dimension
    );
    const nextBlock = new OBlock(
      [new Point(4, 0), new Point(5, 0), new Point(4, 1), new Point(5, 1)],
      dimension
    );
    stage.next = nextBlock;
    stage.tick();
    expect(stage.score).toBe(0);
    vi.advanceTimersByTime(250);
    expect(stage.score).toBe(100);
    // 原 18 行随消除下落到 19 行
    expect(stage.points[19][3].x).toBe(3);
    expect(stage.points[19].filter((point) => !point.isEmpty)).toHaveLength(1);
    // 最顶部补出新空行
    expect(stage.points[0].every((point) => point.isEmpty)).toBe(true);
    // 消除完成后切换到预览方块
    expect(stage.current).toBe(nextBlock);
    expect(stage.clearTimers).toHaveLength(0);
  });

  it('消行动画播放期间 tick 暂停下落', () => {
    const stage = createStage();
    for (let x = 0; x < 6; x++) {
      stage.points[19][x] = new Point(x, 19);
    }
    stage.current = new IBlock(
      [new Point(6, 19), new Point(7, 19), new Point(8, 19), new Point(9, 19)],
      dimension
    );
    stage.tick();
    const yBefore = stage.current!.points.map((point) => point.y);
    stage.tick();
    expect(stage.current!.points.map((point) => point.y)).toEqual(yBefore);
  });
});
