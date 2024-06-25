import { Point, AbstractTheme } from '@shushanfx/tetris-core';

export class DefaultTheme extends AbstractTheme {
  currentStyle(current: any): void {
    
  }
  innerStyle(inner: any): void {
    const innerElement: HTMLElement = inner as HTMLElement;
    innerElement.style.border = '1px solid rgb(155 139 139)';
  }
  scoreStyle(score: any): void {
    const scoreElement: HTMLElement = score as HTMLElement;
    scoreElement.style.font = '12px Arial';
    scoreElement.style.color = '#000';
  }
  statusStyle(status: any): void {
    const statusElement: HTMLElement = status as HTMLElement;
    statusElement.style.background = 'gray';
    statusElement.style.textAlign = 'center';
    statusElement.style.width = '100%';
    statusElement.style.height = '40px';
  }
  blockPointStyle(block: any, point: Point): void {
    if (point.attrs?.isReadyToClear) {
      block.style.backgroundColor = '#FFF';
      block.style.border = '1px solid #ccc';
    }
    else {
      block.style.backgroundColor = point.isEmpty ? '#FFF' : 'gray';
      block.style.border = point.isEmpty ? '1px solid rgb(155 139 139)' : '1px solid #ccc';
    }
  }
  nextPointStyle(block: any, point: Point): void {
    block.style.backgroundColor = 'gray';
    block.style.border = '1px solid #ccc';
  }
  nextStyle(block: HTMLElement): void {
    
  }
  scoreTemplate(score: number): string {
    return `得分：${score}`
  }
  blockStyle(block: HTMLElement): void {

  }
  outStyle(outer: HTMLElement): void {
    outer.style.borderRadius = '5px';
    outer.style.border = '1px solid rgb(155 139 139)';
    outer.style.backgroundColor = '#FFFFFF';
  }
}