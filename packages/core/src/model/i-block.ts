import { Block } from './block';

/**
 * IBlock
 * 口口口口
 */
export class IBlock extends Block {
  getChanges(): number[] {
    return [Math.PI / 2, 0 - Math.PI / 2]
  }
  getCenterIndex(): number {
    return 1;
  }  
}
