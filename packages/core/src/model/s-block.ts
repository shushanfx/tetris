import { Block } from './block';

/**
 * SBlock
 * 　口口
 * 口口
 */
export class SBlock extends Block {
  getChanges(): number[] {
    return [Math.PI / 2, 0 - Math.PI / 2]
  } 
  getCenterIndex(): number {
    return 0;
  }
}
