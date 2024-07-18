import {
  AbstractCanvas,
  AbstractTheme,
  GameStatus,
} from "@shushanfx/tetris-core";
import { bold } from 'colors';

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
  blockChar?: string;
  emptyBlockChar?: string;
}

export class ConsoleCanvas extends AbstractCanvas {
  rightWidth: number = 8;
  isHideOuter: boolean = false;
  options?: ConsoleCanvasOptions;
  blockChar: string = "田";
  emptyBlockChar: string = '　';
  outerLeftTopChar: string = '┏━';
  innerLeftTopChar: string = ' ┏';
  outerRightTopChar: string = '━┓';
  innerRightTopChar: string = '┓ ';
  outerLeftBottomChar: string = '┗━';
  innerLeftBottomChar: string = ' ┗';
  outerRightBottomChar: string = '━┛';
  innerRightBottomChar: string = '┛ ';
  horizonalChar: string = '━━';
  outerLeftVerticalChar: string = '┃ ';
  innerLeftVerticalChar: string = ' ┃';
  outerRightVerticalChar: string = ' ┃';
  innerRightVerticalChar: string = '┃ ';
  spaceChar: string = '　';
  private updateTimer: number = -1;
  exitMessage: string = '';
  helpMessages = [
    "操作说明：",
    "暂停：空格键",
    "退出：Ｐ键",
    "重开：Ｒ键",
    "边框：Ｏ键",
    "旋转：Ｗ",
    "左移：Ａ",
    "右移：Ｄ",
    "下移：Ｓ",
  ];
  constructor(theme: AbstractTheme, options?: ConsoleCanvasOptions) {
    super(theme);
    this.options = options;
    if (options && options.rightWidth && options.rightWidth > 0) {
      this.rightWidth = this.options!.rightWidth!;
    }
    if (options && options.isHideOuter) {
      this.isHideOuter = options.isHideOuter;
    }
    if (options && options.blockChar) {
      this.blockChar = options.blockChar;
    }
    if (options && options.emptyBlockChar) {
      this.emptyBlockChar = options.emptyBlockChar;
    }
  }
  update(): void {
    this.render();
  }
  handleOutput(lineCharCount: number, lines: string[]): string[] {
    return lines;
  }
  private getHelpMessage(line: number): string {
    const message = this.helpMessages[line];
    return message || "";
  }
  private getInnerLine(str?: string): string {
    const consoleChar = new ConsoleChar(str || "|");
    this.theme.innerStyle(consoleChar);
    return consoleChar.ch;
  }
  private getOutterLine(str?: string): string {
    if (this.isHideOuter) {
      return "";
    }
    const consoleChar = new ConsoleChar(str || "|");
    this.theme.outStyle(consoleChar);
    return consoleChar.ch;
  }
  private getStatusLine(str: string): string {
    const consoleChar = new ConsoleChar(str);
    this.theme.statusStyle(consoleChar);
    return consoleChar.ch;
  }
  private createChar(length: number, ch: string = this.spaceChar): string {
    return new Array(length).fill(ch).join("");
  }
  render(): void {
    if (this.updateTimer > 0) {
      return;
    }
    const handler = () => {
      const { game } = this;
      if (!game) {
        return;
      }
      const { stage, dimension } = game;
      const printArray: string[] = [];
      console.clear();
      const { score, current, next } = stage;
      const { xSize, ySize } = dimension;
      const outLength = 1 + 1 + xSize + 1 + this.rightWidth + 1;
      if (!this.isHideOuter) {
        // 1. 渲染外边框的上边框
        const outLine1 = this.getOutterLine(
          this.outerLeftTopChar +
          this.createChar(xSize + 2 + this.rightWidth, this.horizonalChar) +
          this.outerRightTopChar
        );
        printArray.push(outLine1);
      }

      // 2. 渲染score
      const scoreText = this.theme.scoreTemplate(score);
      const scoreConsoleChar = ConsoleChar.create(scoreText);
      this.theme.scoreStyle(scoreConsoleChar);
      // 计算左侧需要补充的空格
      const leftSpace = this.rightWidth - scoreText.length - 3;
      // 右侧需要补充的空格
      const rightSpace = 3;
      const scoreLine =
        this.getOutterLine(this.outerLeftVerticalChar) +
        this.createChar(xSize + 2 + leftSpace) +
        scoreConsoleChar.ch +
        this.createChar(rightSpace) +
        this.getOutterLine(this.outerRightVerticalChar);
      printArray.push(scoreLine);

      // 3. 渲染内边框的上边框
      let line1 =
        this.getOutterLine(this.outerLeftVerticalChar) +
        this.getInnerLine(this.innerLeftTopChar);
      for (let x = 0; x < xSize; x++) {
        const oneBlockItem = current?.points.find(item => item.x === x);
        if (oneBlockItem) {
          line1 += this.getInnerLine(bold(this.horizonalChar))
        } else {
          line1 += this.getInnerLine(this.horizonalChar)
        }
      }
      line1 +=
        this.getInnerLine(this.innerRightTopChar) +
        this.createChar(this.rightWidth) +
        this.getOutterLine(this.outerRightVerticalChar);
      printArray.push(line1);

      // 4. 渲染操作区域
      for (let y = 0; y < ySize; y++) {
        let rowLength = 2;
        let row = this.getOutterLine(this.outerLeftVerticalChar)
          + this.getInnerLine(this.innerLeftVerticalChar);
        for (let x = 0; x < xSize; x++) {
          const point = stage.points[y][x];
          const currentPoint = current
            ? current?.points.find((p) => p.x === x && p.y === y)
            : null;
          if (currentPoint || !point.isEmpty) {
            const consoleChar = new ConsoleChar(this.blockChar);
            this.theme.blockPointStyle(consoleChar, currentPoint || point);
            row += consoleChar.ch;
          } else {
            row += this.emptyBlockChar;
          }
        }
        rowLength += xSize;
        row += this.getInnerLine(this.innerRightVerticalChar);
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
            for (let x = xStart; x <= xEnd; x++) {
              const point = next.points.find((p) => p.x === x && p.y === y);
              const consoleChar: ConsoleChar | null = point
                ? new ConsoleChar(this.blockChar)
                : null;
              if (point) {
                this.theme.nextPointStyle(consoleChar, point);
              }
              row += consoleChar ? consoleChar.ch : this.spaceChar;
              rowLength += 1;
            }
          }
        }
        // drawStatus
        else if (y === 6) {
          const { status } = game;
          if (status === GameStatus.PAUSE) {
            row += this.createChar(1) + this.getStatusLine("游戏暂停");
            rowLength += 5;
          } else if (status === GameStatus.OVER) {
            row += this.createChar(1) + this.getStatusLine("游戏结束");
            rowLength += 5;
          } else if (status === GameStatus.STOP) {
            row += this.createChar(1) + this.getStatusLine("游戏停止");
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
          row += new Array(leftLength).fill(this.spaceChar).join("");
        }
        row += this.getOutterLine(this.outerRightVerticalChar);
        printArray.push(row);
      }
      let line2 =
        this.getOutterLine(this.outerLeftVerticalChar) +
        this.getInnerLine(this.innerLeftBottomChar);
      for (let x = 0; x < xSize; x++) {
        const oneBlockItem = current?.points.find(item => item.x === x);
        if (oneBlockItem) {
          line2 += this.getInnerLine(bold(this.horizonalChar))
        } else {
          line2 += this.getInnerLine(this.horizonalChar)
        }
      }
      line2 += this.getInnerLine(this.innerRightBottomChar) +
        this.createChar(this.rightWidth) +
        this.getOutterLine(this.outerRightVerticalChar);
      printArray.push(line2);
      if (!this.isHideOuter) {
        const outLine2 = this.getOutterLine(
          this.outerLeftBottomChar +
          this.createChar(xSize + 2 + this.rightWidth, this.horizonalChar) +
          this.outerRightBottomChar
        );
        printArray.push(outLine2);
      }
      if (this.exitMessage) {
        printArray.push(this.exitMessage);
      } else {
        printArray.push("");
      }
      process.stdout.write(this.handleOutput(outLength, printArray).join("\n"));
    };
    this.updateTimer = setTimeout(() => {
      this.updateTimer = -1;
      handler();
    }, 1000 / 24) as unknown as number;
  }
}
