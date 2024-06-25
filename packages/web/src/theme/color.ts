import { Point } from "@shushanfx/tetris-core";
import { DefaultTheme } from './base'


class ColorTheme extends DefaultTheme {
  private borderColor = '#cd700a69';
  private blockBorderColor = '#a5771369';
  innerStyle(inner: any): void {
    inner.style.border = `2px solid ${this.borderColor}`;
  }
  outStyle(outer: HTMLElement): void {
    outer.style.borderRadius = '5px';
    outer.style.border = `2px solid ${this.borderColor}`;
  }
  nextPointStyle(block: HTMLElement, point: Point): void {
    block.style.backgroundColor = point.attrs.color || 'gray';
    block.style.border = `1px solid ${this.blockBorderColor}`;
  }
  blockPointStyle(block: HTMLElement, point: Point): void {
    block.style.backgroundColor = point.isEmpty ? '#FFF' : (point.attrs.color || 'gray');
    block.style.border = `1px solid ${this.blockBorderColor}`;
  }
  statusStyle(status: any): void {
    super.statusStyle(status);
    const statusElement: HTMLElement = status as HTMLElement;
    statusElement.style.background = 'rgb(139 46 22 / 89%)';
  }
}

export { ColorTheme };