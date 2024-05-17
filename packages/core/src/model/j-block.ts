import { Block } from './block';

/**
 * JBlock
 * 口
 * 口口口
 */
export class JBlock extends Block {
  getChanges(): number[] {
    return [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2]
  }
  getCenterIndex(): number {
    return 2;
  }
}
