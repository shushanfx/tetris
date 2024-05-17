import { BaseFactory } from './base';
import { Block, Dimension } from '../model/index'

export class ColorFactory extends BaseFactory {
  colors: string[];
  constructor(dimension: Dimension, colors: string[]) {
    super(dimension);
    this.colors = colors;
  }
  randomColor() {
    const index = Math.floor(Math.random() * this.colors.length);
    return this.colors[index];
  }
  randomBlock(): Block {
    const item = super.randomBlock();
    const color = this.randomColor();
    item.points.forEach((point) => {
      point.attrs.color = color;
    });
    return item;
  }
}