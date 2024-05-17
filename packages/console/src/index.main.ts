import { Game, Dimension, ColorFactory } from '@shushanfx/tetris-core';
import { ConsoleCanvas, Color, ConsoleColorTheme } from './index';

const theme = new ConsoleColorTheme();
const canvas = new ConsoleCanvas(theme, {
  isHideOuter: true
});
const dimension = new Dimension(10, 20);
const factory = new ColorFactory(dimension, [
  Color.black,
  Color.red,
  Color.green,
  Color.yellow,
  Color.blue,
  Color.magenta,
  Color.cyan,
  Color.white,
  Color.gray,
  Color.grey,
]);
const game = new Game({ dimension, canvas, factory });
game.start();

