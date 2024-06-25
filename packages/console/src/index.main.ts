#!/bin/env node

import { Game, Dimension, ColorFactory } from "@shushanfx/tetris-core";
import { TTYCanvas, ConsoleCanvas, Color, ConsoleTheme, ConsoleColorTheme } from "./index";
import { Command } from "commander";
import { ConsoleController } from "./canvas/console-controller";

const program = new Command();
program
  .option("-c, --hidden-color", "是否使用无彩色控制台", false)
  .option("-b, --block <block>", "方块字符", "回")
  .option("-d, --default", "是否使用默认控制台", false)
  .option("-o, --hidden-outer", "是否隐藏外边框", false)
  .action((options) => {
    const theme = !options.hiddenColor
      ? process.stdout.hasColors()
        ? new ConsoleColorTheme()
        : new ConsoleTheme()
      : new ConsoleTheme();
    const ConsoleClass = options.default ? ConsoleCanvas : TTYCanvas;
    const canvas = new ConsoleClass(theme, {
      blockChar: options.block,
      isHideOuter: options.hiddenOuter,
    });
    const controller = new ConsoleController();
    const dimension = new Dimension(10, 20);
    const factory = new ColorFactory(dimension, [
      Color.red,
      Color.green,
      Color.yellow,
      Color.blue,
      Color.magenta,
      Color.cyan,
    ]);
    const game = new Game({ dimension, canvas, factory, controller });
    game.start();
  })
  .parse(process.argv);
