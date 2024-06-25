import { ConsoleCanvas } from './console-canvas';

export class TTYCanvas extends ConsoleCanvas {
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
    const xStart = Math.floor((xSize - lineCharCount * 2) / 2);
    if (xStart > 1) {
      for (let i = 0; i < length; i++) {
        const line = lines[i];
        const spaceLine = new Array(xStart).fill(' ').join('');
        finalLines.push(spaceLine + line);
      }
    } else {
      finalLines.push(...lines);
    }
    return finalLines;
  }
}