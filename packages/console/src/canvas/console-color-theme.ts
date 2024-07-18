import { Point } from '@shushanfx/tetris-core';
import { ConsoleTheme } from './console-theme';
import { ConsoleChar } from './console-canvas';
import {
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  grey
} from 'colors';

export enum Color {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  magenta = 'magenta',
  cyan = 'cyan',
  white = 'white',
  gray = 'gray',
  grey = 'grey',
}

const COLORS_FUNCTION = {
  'red': red,
  'green': green,
  'yellow': yellow,
  'blue': blue,
  'magenta': magenta,
  'cyan': cyan,
  'white': white,
  'gray': gray,
  'grey': grey,
};

export class ConsoleColorTheme extends ConsoleTheme {
  outStyle(outer: ConsoleChar): void {
    outer.ch = cyan(outer.ch);
  }
  blockPointStyle(block: ConsoleChar, point: Point): void {
    if (block && block instanceof ConsoleChar) {
      if (point?.attrs?.color) {
        const fun = COLORS_FUNCTION[point.attrs.color as keyof typeof COLORS_FUNCTION];
        if (fun) {
          block.ch = fun(block.ch);
        }
      }
    }
  }
  nextPointStyle(block: ConsoleChar, point: Point): void {
    return this.blockPointStyle(block, point);
  }
  statusStyle(status: ConsoleChar): void {
    status.ch = red(status.ch);
  }
  scoreStyle(score: ConsoleChar): void {
    score.ch = green(score.ch);
  }
};