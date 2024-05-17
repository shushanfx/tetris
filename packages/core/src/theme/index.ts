import { Point } from "../index";

abstract class AbstractTheme {
  abstract outStyle(outer: any): void;
  abstract innerStyle(inner: any): void;
  abstract scoreStyle(score: any): void;
  abstract statusStyle(status: any): void;
  abstract scoreTemplate(score: number): string;
  abstract blockStyle(blocks: any): void;
  abstract blockPointStyle(block: any, point: Point): void;
  abstract nextStyle(block: any): void;
  abstract currentStyle(current: any): void;
  abstract nextPointStyle(block: any, point: Point): void;
}

export { AbstractTheme };