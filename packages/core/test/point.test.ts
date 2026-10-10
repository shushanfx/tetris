import { describe, expect, it } from 'vitest';
import { Point } from '../src/index';

describe('Point', () => {
  it('(-1, -1) 表示空点', () => {
    expect(new Point(-1, -1).isEmpty).toBe(true);
    expect(Point.isEmpty(-1, -1)).toBe(true);
  });

  it('普通坐标不是空点', () => {
    expect(new Point(0, 0).isEmpty).toBe(false);
    expect(Point.isEmpty(3, 4)).toBe(false);
  });

  it('clone 生成坐标与属性一致的新对象', () => {
    const point = new Point(3, 4, { color: '#fff', isReadyToClear: true });
    const cloned = point.clone();
    expect(cloned).not.toBe(point);
    expect(cloned.x).toBe(3);
    expect(cloned.y).toBe(4);
    expect(cloned.attrs.color).toBe('#fff');
    expect(cloned.attrs.isReadyToClear).toBe(true);
  });

  it('clone 的属性对象是深拷贝', () => {
    const point = new Point(3, 4, { color: '#fff' });
    const cloned = point.clone();
    cloned.attrs.color = '#000';
    expect(point.attrs.color).toBe('#fff');
  });

  it('setXY 修改坐标并返回自身', () => {
    const point = new Point(0, 0);
    expect(point.setXY(5, 6)).toBe(point);
    expect(point.x).toBe(5);
    expect(point.y).toBe(6);
  });
});
