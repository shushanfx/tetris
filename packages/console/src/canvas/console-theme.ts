/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractTheme, Point } from '@shushanfx/tetris-core';
import { toFullNumber } from '../util';

export class ConsoleTheme extends AbstractTheme {
  outStyle(outer: any): void {

  }
  innerStyle(inner: any): void {

  }
  scoreStyle(score: any): void {

  }
  statusStyle(status: any): void {

  }
  scoreTemplate(score: number): string {
    return `${toFullNumber(score)}`;
  }
  blockStyle(blocks: any): void {

  }
  blockPointStyle(block: any, point: Point): void {

  }
  nextStyle(block: any): void {

  }
  currentStyle(current: any): void {

  }
  nextPointStyle(block: any, point: Point): void {

  }
};