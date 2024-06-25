import { Dimension } from "./dimension";

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PointAttributes {
  color?: string;
  isReadyToClear?: boolean;
}

export class Point {
  x: number;
  y: number;
  attrs: PointAttributes = {};
  constructor(x: number, y: number, attrs?: PointAttributes) {
    this.x = x;
    this.y = y;
    if (attrs) {
      this.attrs = attrs!;
    }
  }
  get isEmpty(): boolean {
    return Point.isEmpty(this.x, this.y);
  }
  static isEmpty(x: number, y: number) {
    return x === -1 && y === -1;
  }
  clone(): Point {
    return new Point(this.x, this.y, {
      ...this.attrs
    });
  }
  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
}

export abstract class Block {
  private static isValid(points: Point[], stage: Dimension): boolean {
    return points.every((point) => {
      return point.x >= 0 && point.x < stage.xSize && point.y >= 0 && point.y < stage.ySize;
    });
  }
  points: Point[];
  dimension: Dimension;
  currentChangeIndex: number = -1;
  constructor(points: Point[], dimension: Dimension) {
    this.points = points;
    this.dimension = dimension;
  }
  abstract getCenterIndex(): number;
  abstract getChanges(): number[];
  canMove(direction: Direction, points: Point[][]): boolean {
    return this.points.every((point) => {
      switch (direction) {
        case 'up':
          return point.y > 0 && points[point.y - 1][point.x].isEmpty;
        case 'down':
          return point.y < this.dimension.ySize - 1 && points[point.y + 1][point.x].isEmpty;
        case 'left':
          return point.x > 0 && points[point.y][point.x - 1].isEmpty;
        case 'right':
          return point.x < this.dimension.xSize - 1 && points[point.y][point.x + 1].isEmpty;
      }
    });
  };
  private changePoints(points: Point[], center: Point, change: number): Point[] {
    return points.map((point) => {
      const newPoints = point.clone();
      return newPoints.setXY(
        center.x 
          + Number.parseInt(((point.x - center.x) * Math.cos(change)).toFixed(0), 10)
          + Number.parseInt(((point.y - center.y) * Math.sin(change)).toFixed(0), 10),
        center.y
          - Number.parseInt(((point.x - center.x) * Math.sin(change)).toFixed(0), 10)
          + Number.parseInt(((point.y - center.y) * Math.cos(change)).toFixed(0), 10)
      );
    });
  }
  canRotate(points: Point[][]): boolean {
    const centerIndex = this.getCenterIndex();
    if (centerIndex === -1) {
      return false;
    }
    const changes = this.getChanges();
    if (changes.length === 0) {
      return false;
    }
    const nextChange = changes[(this.currentChangeIndex + 1) % changes.length];

    const newPoints = this.changePoints(this.points, this.points[centerIndex], nextChange);
    const isValid = Block.isValid(newPoints, this.dimension);
    if (isValid) {
      return newPoints.every((point) => {
        return points[point.y][point.x].isEmpty;
      });
    }
    return isValid;
  }
  rotate(): boolean {
    const centerIndex = this.getCenterIndex();
    if (centerIndex === -1) {
      return false;
    }
    const changes = this.getChanges();
    if (changes.length === 0) {
      return false;
    }
    const nextChange = changes[(this.currentChangeIndex + 1) % changes.length];
    const newPoints = this.changePoints(this.points, this.points[centerIndex], nextChange);
    const isValid = Block.isValid(newPoints, this.dimension);
    if (isValid) {
      this.currentChangeIndex = (this.currentChangeIndex + 1) % changes.length;
      this.points = newPoints;
    }
    return isValid;
  }
  move(direction: Direction): boolean {
    switch (direction) {
      case 'up':
        this.points.forEach((point) => { point.y = point.y - 1})
        break;
      case 'down':
        this.points.forEach((point) => { point.y = point.y + 1})
        break;
      case 'left':
        this.points.forEach((point) => { point.x = point.x - 1})
        break;
      case 'right':
        this.points.forEach((point) => { point.x = point.x + 1})
        break;
    }
    return true;
  }
  clone(): Block {
    return new (this.constructor as any)(this.points.map((point) => point.clone()), this.dimension);
  }
  randomRotate(): this {
    const changes = this.getChanges();
    if (changes.length === 0) {
      return this;
    }
    const randomIndex = Math.floor(Math.random() * changes.length);
    for (let i = 0; i < randomIndex; i++) {
      const result = this.rotate();
      if (!result) {
        break;
      };
    }
    return this;
  }
}