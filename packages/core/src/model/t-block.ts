import { Block } from './block';

/**
 * TBlock
 * 　口
 * 口口口
 */
export class TBlock extends Block {
  getChanges(): number[] {
    return [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2]
  }
  getCenterIndex(): number {
    return 2;
  }
}
