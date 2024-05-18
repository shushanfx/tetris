import { ConsoleCanvas } from './console-canvas';

export class TTYCanvas extends ConsoleCanvas {
  bind(): void {
    super.bind();
    process.stdout.on('resize', () => {
      this.render();
    });
  }
  handleOutput(lineCharCount: number, lines: string[]): string[] {
    const [ xSize, ySize ] = process.stdout.getWindowSize();
    const length = lines.length;
    const yStart = Math.floor((ySize - length) / 2);
    const finalLines: string[] = [];
    if (yStart > 0) {
      for (let i = 0; i < yStart; i++) {
        finalLines.push('');
      }
    }
    const xStart = Math.floor((xSize - lineCharCount) / 2);
    if (xStart > 1) {
      for (let i = 0; i < length; i++) {
        const line = lines[i];
        const spaceLine = new Array(Math.floor(xStart / 2)).fill(' ').join('');
        finalLines.push(spaceLine + line);
      }
    } else {
      finalLines.push(...lines);
    }
    return finalLines;
  }
}