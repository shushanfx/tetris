import { Block } from './block';

/**
 * ZBlock
 * 口口
 * 　口口
 */
export class ZBlock extends Block {
  getChanges(): number[] {
    return [Math.PI / 2, 0 - Math.PI / 2]
  }
  getCenterIndex(): number {
    return 1;
  }
}
