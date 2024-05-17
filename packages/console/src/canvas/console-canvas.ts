import { AbstractCanvas, AbstractTheme, GameStatus } from '@tetris/core';
import { isDown, isLeft, isRight, isUp } from '../util/index'

export class ConsoleChar {
  ch: string;
  static create(ch: string): ConsoleChar {
    return new ConsoleChar(ch);
  }
  constructor(ch: string) {
    this.ch = ch;
  }
}

export interface ConsoleCanvasOptions {
  rightWidth?: number;
  isHideOuter?: boolean;
  isHideHelper?: boolean;
}

export class ConsoleCanvas extends AbstractCanvas {
  private rightWidth: number = 8;
  private options?: ConsoleCanvasOptions;
  private helpMessages = [
    '操作说明：',
    '暂停：空格键',
    '退出：Ｐ键',
    '重开：Ｒ键',
    '边框：Ｏ键',
    '旋转：Ｗ',
    '左移：Ａ',
    '右移：Ｄ',
    '下移：Ｓ',
  ];
  constructor(theme: AbstractTheme, options?: ConsoleCanvasOptions) {
    super(theme);
    this.options = options;
    if (options && options.rightWidth && options.rightWidth > 0) {
      this.rightWidth = this.options!.rightWidth!;
    }
    console.info(options)
  }
  render(): void {
    this.update();
  }
  private getHelpMessage(line: number): string {
    const message = this.helpMessages[line];
    return message || '';
  }
  private getInnerLine(str?: string): string {
    const consoleChar = new ConsoleChar(str || '|');
    this.theme.innerStyle(consoleChar);
    return consoleChar.ch;
  }
  private getOutterLine(str?: string): string {
    if (this.options && this.options.isHideOuter) {
      return '';
    }
    const consoleChar = new ConsoleChar(str || '|');
    this.theme.outStyle(consoleChar);
    return consoleChar.ch;
  }
  private getStatusLine(str: string): string {
    const consoleChar = new ConsoleChar(str);
    this.theme.statusStyle(consoleChar);
    return consoleChar.ch;
  }
  private createChar(length: number, ch: string = '　'): string {
    return new Array(length).fill(ch).join('');
  }
  update(): void {
    const { game } = this;
    if (!game) {
      return ;
    }
    const { stage, dimension } = game;
    console.clear();
    const { score, current, next } = stage;
    const { xSize, ySize, halfYSize } = dimension;
    const outLength = 1 + 1 + xSize + 1 + this.rightWidth + 1;
    if (!this.options || !this.options.isHideOuter) {
      const outLine1 = this.getOutterLine('+-' + this.createChar(xSize, '－') + '-' + this.createChar(this.rightWidth, '－') + '+')
      console.info(outLine1);
    }
    const scoreText = this.theme.scoreTemplate(score);
    const scoreConsoleChar = ConsoleChar.create(scoreText);
    this.theme.scoreStyle(scoreConsoleChar);
    let scoreLine = this.getOutterLine()
      + ' '
      + this.createChar(xSize)
      + ' '
      + this.createChar(1)
      + scoreConsoleChar.ch;
    const scoreLeftLength = outLength - xSize - scoreText.length - 5;
    if (scoreLeftLength > 0) {
      scoreLine += this.createChar(scoreLeftLength);
    }
    scoreLine += this.getOutterLine();
    console.info(scoreLine);
    let line1 = 
      this.getOutterLine()
      + this.getInnerLine('+' + this.createChar(xSize, '－') + '+');
    const line1Length = outLength - xSize - 4;
    if (line1Length > 0) {
      line1 += this.createChar(line1Length);
    }
    line1 += this.getOutterLine();
    console.info(line1)
    
    for (let y = 0; y < ySize; y++) {
      let rowLength = 2;
      let row = 
        this.getOutterLine()
        + this.getInnerLine();
      for (let x = 0; x < xSize; x++) {
        const point = stage.points[y][x];
        const currentPoint = current ? current?.points.find((p) => p.x === x && p.y === y) : null;
        if (currentPoint || !point.isEmpty) {
          let consoleChar = new ConsoleChar('口');
          this.theme.blockPointStyle(consoleChar, currentPoint || point);
          row += consoleChar.ch;
        } else {
          row += '　';
        }
      }
      rowLength += xSize;
      row += this.getInnerLine();
      rowLength += 1;
      // drawNext
      if (y >= 0 && y <= 4) {
        row += this.createChar(1);
        rowLength += 1;
        if (next) {
          let xStart = 0;
          let xEnd = 0;
          next.points.forEach((point) => {
            if (xStart === 0 || point.x < xStart) {
              xStart = point.x;
            }
            if (xEnd === 0 || point.x > xEnd) {
              xEnd = point.x;
            }
          });
          for(let x = xStart; x <= xEnd; x++) {
            const point = next.points.find((p) => p.x === x && p.y === y);
            let consoleChar: ConsoleChar | null = point ? new ConsoleChar('口') : null;
            if (point) {
              this.theme.nextPointStyle(consoleChar, point);
            }
            row += consoleChar ? consoleChar.ch : '　';
            rowLength += 1;
          }
        }
      }
      // drawStatus
      if (y === 6) {
        const { status } = game;
        if (status === GameStatus.PAUSE) {
          row += this.createChar(1) + this.getStatusLine('游戏暂停');
          rowLength += 5;
        } else if(status === GameStatus.OVER) {
          row += this.createChar(1) + this.getStatusLine('游戏结束');
          rowLength += 5;
        } else if (status === GameStatus.STOP) {
          row += this.createChar(1) + this.getStatusLine('游戏停止');
          rowLength += 5;
        }
      }
      // drawTips
      else if (y >= 8) {
        const messsage = this.createChar(1) + this.getHelpMessage(y - 8);
        row += messsage;
        rowLength += messsage.length;
      }
      // 扣除末尾的结束符号
      const leftLength = outLength - rowLength - 1;
      if (leftLength > 0) {
        row += new Array(leftLength).fill('　').join('');
      }
      row += this.getOutterLine();
      console.info(row);
    }
    const line2 = 
      this.getOutterLine()
      + this.getInnerLine('+' + this.createChar(xSize, '－') + '+')
      + this.createChar(this.rightWidth)
      + this.getOutterLine();
    console.info(line2);
    if (!this.options || !this.options.isHideOuter) {
      const outLine2 =
        this.getOutterLine(
          '+-' + this.createChar(xSize, '－')
          + '-' + this.createChar(this.rightWidth, '－')
          + '+');
      console.info(outLine2);    
    }
  }
  bind(): void {
    // 绑定控制台事件
    const handler = (data: Buffer) => {
      const { game } = this;
      if (!game) {
        return ;
      }
      const key = data.toString('utf-8');
      if (isLeft(data, key)) {
        game.move('left');
      } else if (isRight(data, key)) {
        game.move('right');
      } else if (isUp(data, key)) {
        game.change();
      } else if (isDown(data, key)) {
        game.move('down');
      } else {
        if (key === ' ') {
          game.toggle();
        }　else if (key === 'p') {
          process.exit(0);
        } else if (key === 'r') {
          game.start();
        }　else if (key === 'o') {
          if (this.options) {
            this.options.isHideOuter = !this.options.isHideOuter;
          }
        }
      }
    }
    process.stdin.setRawMode(true);
    process.stdin.on('data', handler);
  }
}