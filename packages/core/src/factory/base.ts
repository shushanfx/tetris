import {
  Block,
  IBlock,
  LBlock,
  JBlock,
  OBlock,
  TBlock,
  SBlock,
  ZBlock,
  Dimension,
  Point
} from '../model/index';

export abstract class AbstractFactory {
  abstract randomBlock(): Block;
}

export class BaseFactory extends AbstractFactory {
  private dimension: Dimension;
  private blocks: Block[];
  constructor(dimension: Dimension) {
    super();
    this.dimension = dimension;
    const halfXSize = this.dimension.halfXSize;
    this.blocks = [
      new IBlock(
        [
          new Point(halfXSize - 1, 1),
          new Point(halfXSize, 1),
          new Point(halfXSize + 1, 1),
          new Point(halfXSize + 2, 1)
        ],
        dimension
      ),
      new LBlock(
        [
          new Point(halfXSize + 1, 1),
          new Point(halfXSize - 1, 2),
          new Point(halfXSize, 2),
          new Point(halfXSize + 1, 2)
        ],
        dimension
      ),
      new JBlock(
        [
          new Point(halfXSize - 1, 1),
          new Point(halfXSize - 1, 2),
          new Point(halfXSize, 2),
          new Point(halfXSize + 1, 2)
        ],
        dimension
      ),
      new OBlock(
        [
          new Point(halfXSize, 1),
          new Point(halfXSize + 1, 1),
          new Point(halfXSize, 2),
          new Point(halfXSize + 1, 2)
        ],
        dimension
      ),
      new TBlock(
        [
          new Point(halfXSize, 1),
          new Point(halfXSize - 1, 2),
          new Point(halfXSize, 2),
          new Point(halfXSize + 1, 2)
        ],
        dimension
      ),
      new SBlock(
        [
          new Point(halfXSize, 1),
          new Point(halfXSize + 1, 1),
          new Point(halfXSize - 1, 2),
          new Point(halfXSize, 2)
        ],
        dimension
      ),
      new ZBlock(
        [
          new Point(halfXSize - 1, 1),
          new Point(halfXSize, 1),
          new Point(halfXSize, 2),
          new Point(halfXSize + 1, 2)
        ],
        dimension
      )
    ]
  }
  randomBlock(): Block {
    return this.blocks[Math.floor(Math.random() * this.blocks.length)].clone().randomChange();
  }
}
