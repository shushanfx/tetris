import { Block } from './block';

/**
 * LBlock
 * 　　口
 * 口口口
 */
export class LBlock extends Block {
  getCenterIndex(): number {
    return 2;
  }  
  getChanges(): number[] {
    return [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2]
  }
}
