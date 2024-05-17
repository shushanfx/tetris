import { Point } from '../../../model/index';
import { DefaultTheme } from "./base";

class DarkTheme extends DefaultTheme {
  blockBackgroundColor = '#2116164d';
  blockColor = 'rgb(230 223 223)'
  outStyle(outer: HTMLElement): void {
    super.outStyle(outer);
    outer.style.border = '1px solid #171717';
    outer.style.backgroundColor = this.blockBackgroundColor;
  }
  blockPointStyle(block: HTMLElement, point: Point): void {
    super.blockPointStyle(block, point);
    if (point.isEmpty || point.attrs?.isReadyToClear) {
      block.style.border = `1px solid #FFFFFF70`;
      block.style.backgroundColor = this.blockBackgroundColor;
    } else {
      block.style.border = '1px solid #FFFFFF70';
      block.style.backgroundColor = this.blockColor;
    }
  }
  nextPointStyle(block: HTMLElement, point: Point): void {
    super.nextPointStyle(block, point);
    block.style.border = '1px solid #FFFFFF70';
    block.style.backgroundColor = this.blockColor;
  }
  statusStyle(status: any): void {
    super.statusStyle(status);
    const statusElement: HTMLElement = status as HTMLElement;
    statusElement.style.background = '#423836cf';
  }
  scoreStyle(score: any): void {
    super.scoreStyle(score);
    const scoreElement: HTMLElement = score as HTMLElement;
    scoreElement.style.color = '#FFFFFF';
  }
}

export { DarkTheme };