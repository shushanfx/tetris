import { AbstractFactory, BaseFactory } from './factory/index';
import { Block, Direction, Point, Dimension } from './model/index';

export class Stage {
  score: number = 0;
  dimension: Dimension;
  points: Point[][] = [];
  current: Block | null = null;
  next: Block | null = null;
  factory: AbstractFactory;
  isOver: boolean = false;
  clearTimers: number[] = [];
  constructor(dimension: Dimension, factory?: AbstractFactory) {
    this.dimension = dimension;
    this.factory = factory || new BaseFactory(dimension);
    this.reset();
  }
  reset() {
    const { dimension } = this;
    this.isOver = false;
    this.current = null;
    this.score = 0;
    this.points = 
      Array.from(
        { length: dimension.ySize }, 
        () => Array.from(
          { length: dimension.xSize }, 
            () => {
              return new Point(-1, -1);
            }
          )
        );
  }
  private toTop(block?: Block) {
    if (!block) {
      return 
    }
    do {
      const canMove = block.canMove('up', this.points);
      if (canMove) {
        block.move('up');
      } else {
        break;
      }
    } while(true);
  }
  private startClear(newPoints: Point[][], clearRows: number[], callback: () => void) {
    let iCount = 0;
    const timerFunction = () => {
      if (iCount >= 10) {
        clearInterval(timer);
        iCount = 0;
        this.clearTimers = this.clearTimers.filter((t) => t !== timer);
        callback();
        return;
      }
      const { points } = this;
      for (let i = 0; i < clearRows.length; i++) {
        const row = clearRows[i];
        points[row].forEach((point) => {
          if (point.isEmpty) {
            return;
          }
          point.attrs.isReadyToClear = iCount % 2 === 0;
        });
        this.current?.points.forEach(item => {
          if (item.y !== row){
            return;
          }
          item.attrs.isReadyToClear = iCount % 2 === 0;
        });
      }
      iCount++;
    }
    const timer: number = setInterval(timerFunction, 20) as unknown as number;
    timerFunction();
    this.clearTimers.push(timer);
  }
  tick() {
    if (this.isOver || this.clearTimers.length > 0) {
      return;
    }
    // 首次加载，current为空
    if (!this.current) {
      this.next = this.factory.randomBlock();
      this.toTop(this.next);
      this.current = this.factory.randomBlock();
      this.toTop(this.current);
      return ;
    }
    const isOver = this.current.points.some((point) => {
      return !this.points[point.y][point.x].isEmpty;
    });
    if (isOver) {
      this.isOver = true;
      return;
    }
    const canMove = this.current.canMove('down', this.points);
    if (canMove) {
      this.current.move('down');
    } else {
      this.handleClear();
    }
  }
  private handleClear() {
    if (!this.current) {
      return;
    }
    const pointsClone: Point[][] = this.points.map((row) => row.map((point) => point.clone()));
    this.current.points.forEach((point) => {
      pointsClone[point.y][point.x] = point.clone();
    });
    const cleanRows: number[] = [];
    for(let i = 0; i < pointsClone.length; i ++) {
      const row = pointsClone[i];
      const isFull = row.every((point) => {
        return !point.isEmpty
      });
      if (isFull) {
        cleanRows.push(i);
      }
    }
    if (cleanRows.length > 0) {
      this.startClear(pointsClone, cleanRows, () => {
        // 处理计算分数
        this.score += this.getScore(cleanRows.length);
        // 处理消除和下落
        cleanRows.forEach((rowIndex) => {
          for(let i = rowIndex; i >= 0; i--) {
            if (i === 0) {
              pointsClone[0] = Array.from({ length: this.dimension.xSize }, () => new Point(-1, -1));
            } else {
              pointsClone[i] = pointsClone[i - 1];
            }
          }
        });
        this.points = pointsClone;
        this.current = this.next;
        this.next = this.factory.randomBlock();
        this.toTop(this.next);
      });
    } else {
      this.points = pointsClone;
      this.current = this.next;
      this.next = this.factory.randomBlock();
      this.toTop(this.next);
    }
  }
  getScore(rowCount: number): number {
    if (rowCount === 1) {
      return 100;
    } else if (rowCount === 2) {
      return 300;
    } else if (rowCount === 3) {
      return 700;
    } else if (rowCount === 4) {
      return 1500;
    }
    return 0;
  }
  rotate() {
    if (!this.current) {
      return false;
    }
    const canChange = this.current.canRotate(this.points);
    if (canChange) {
      this.current.rotate();
    }
    return false;
  }
  move(direction: Direction) {
    if (!this.current) {
      return false;
    }
    const canMove = this.current.canMove(direction, this.points);
    if (canMove) {
      this.current.move(direction);
    }
    return canMove;
  }
}