import { AbstractController, GameStatus } from '@shushanfx/tetris-core';
import { isLeft, isRight, isUp, isDown } from '../util/index';
import { ConsoleCanvas } from './console-canvas';

export class ConsoleController extends AbstractController {
  private exitChar: string = '';
  bind(): void {
    // 绑定控制台事件
    process.stdout.setNoDelay(true);
    process.stdin.setRawMode(true);
    process.stdin.on("data", this.handleInput.bind(this));
    process.stdout.on('resize', () => {
      this.game?.canvas.render();
    });
  }
  handleInput(data: Buffer): void {
    const { game } = this;
    if (!game) {
      return;
    }
    const canvas: ConsoleCanvas = game.canvas as ConsoleCanvas;
    const key = data.toString("utf-8");
    if (canvas.exitMessage) {
      // 退出中
      if (key === 'y') {
        this.exitChar = key;
        process.stdout.write(this.exitChar + '\n\r');
        setTimeout(() => {
          process.exit(0);
        }, 200);
      } else if (key === 'n') {
        this.exitChar = key;
        process.stdout.write(this.exitChar);
        canvas.exitMessage = '';
        if (game.status === GameStatus.PAUSE) {
          game.start();
        } else {
          canvas.update();
        }
      }
      return;
    }
    if (isLeft(data, key)) {
      game.move("left");
    } else if (isRight(data, key)) {
      game.move("right");
    } else if (isUp(data, key)) {
      game.rotate();
    } else if (isDown(data, key)) {
      game.move("down");
    } else {
      if (key === " ") {
        game.toggle();
      } else if (key === "p") {
        game.pause();
        canvas.exitMessage = '您确定要退出游戏吗？(y/n)：';
        canvas.update();
      } else if (key === "r") {
        game.start();
      } else if (key === "o") {
        canvas.isHideOuter = !canvas.isHideOuter;
        canvas.update();
      }
    }
  }
}