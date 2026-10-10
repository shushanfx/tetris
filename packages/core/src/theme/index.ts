/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Point } from "../index";

abstract class AbstractTheme {
  /**
   * 设置外框的样式，如外框的颜色、整体的背景等。
   * @param outer 指代外框对象的元素，通过修改其内容改变显示样式。
   */
  abstract outStyle(outer: any): void;
  /**
   * 设置内框的样式，如内框的颜色、整体的背景等。
   * @param inner 指代内框对象的元素，通过修改其内容改变显示样式。
   */
  abstract innerStyle(inner: any): void;
  /**
   * 设置分数的样式。
   * @param score 指代分数对象的元素，通过修改其内容改变显示样式。
   */
  abstract scoreStyle(score: any): void;
  /**
   * 设置状态栏的样式
   * @param status 指代状态对象的元素。
   */
  abstract statusStyle(status: any): void;
  /**
   * 分数的格式化字符串，输入一个分数的数字，将其转换为目标的样式；
   * @param score {number} 当前游戏的分数
   */
  abstract scoreTemplate(score: number): string;
  abstract nextStyle(blocks: any): void;
  abstract currentStyle(current: any): void;
  /**
   * 设置方块区域的样式
   * @param block 指代当前方块区域 
   */
  abstract blockStyle(block: any): void;
  /**
   * 设置current区域和已填充区域的小方块的样式
   * @param blockItem 当前小方块，如一个IBlock会拆分成4各BlockItem。
   * @param point 当前小方块的位置信息，包括`x`轴和`y`轴的坐标等信息
   */
  abstract blockPointStyle(blockItem: any, point: Point): void;
  /**
   * 设置next区域的小方块的样式
   * @param blockItem 
   * @param point 
   */
  abstract nextPointStyle(blockItem: any, point: Point): void;
}

class DefaultTheme extends AbstractTheme {
  outStyle(outer: any): void { }
  innerStyle(inner: any): void { }
  scoreStyle(score: any): void { }
  statusStyle(status: any): void { }
  scoreTemplate(score: number): string {
    return score.toString();
  }
  nextStyle(blocks: any): void { }
  currentStyle(current: any): void { }
  blockStyle(block: any): void { }
  blockPointStyle(blockItem: any, point: Point): void { }
  nextPointStyle(blockItem: any, point: Point): void { }
}


export { AbstractTheme, DefaultTheme };