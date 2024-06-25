# 手撸俄罗斯方块——游戏核心模块设计

## 开始游戏

按照之前的设计，我们需要游戏的必要元素之后即可开始游戏，下面以控制台上运行俄罗斯方块为例进行展开讲解。

```javascript
import { ConsoleCanvas, ConsoleController, ConsoleColorTheme, Color } from '@shushanfx/tetris-console';
import { Dimension, ColorFactory, Game } from '@shushanfx/tetris-core';

const theme = new ConsoleColorTheme();
const canvas = new ConsoleCanvas(theme);
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
```

下面我们逐行进行分析：

* 包的引入，分为tetris-core、tetris-console，这个是包的划分，将核心包的组件放在tetris-core中，具体的实现放在tetris-console中。

* theme、canvas、controller的初始化；

* factory、dimension的初始化；

* game的初始化，使用之前初始化的canvas、factory、canvas、dimension对象；

* game调用start方法。

接下来，我们看下start做了啥？

### Game.start的逻辑

```javascript

class Game {
  start() {
    const { status } = this;
    if (status === GameStatus.RUNNING) {
      return ;
    }
    if (status === GameStatus.OVER
      || status === GameStatus.STOP) {
      this.stage.reset();
      this.canvas.render();
    } else if (status === GameStatus.READY) {
      this.controller?.bind();
      this.canvas.render();
    }
    this.status = GameStatus.RUNNING;
    this.tickCount = 0;
    this.canvas.update();
    // @ts-ignore
    this.tickTimer = setInterval(() => {
      if (this.tickCount == 0) {
        // 处理向下
        this.stage.tick();
        this.checkIsOver();
      }
      this.canvas.update();
      this.tickCount++;
      if (this.tickCount >= this.tickMaxCount) {
        this.tickCount = 0;
      }
    }, this.speed);
  }
}

```

我们逐行分析一下：

1. 获取`status`变量，`status`为`Game`游戏状态的内部表示，分别为`准备就绪(READY)`、`游戏中(RUNNING)`、`暂停(PAUSE)`、`停止(STOP)`、`游戏结束(OVER)`。其中停止和游戏结束的区别是，前者是主动停止游戏，后者为游戏触发结束逻辑导致游戏结束。

2. 如果游戏正在进行中，则直接返回；

3. 如果游戏在停止和游戏结束的状态，则对`Stage`进行重置和对`canvas`进行整体重绘。

4. 如果游戏在准备就续中，说明游戏刚完成初始化，从未开始。调用controller进行事件的绑定以及canvas首次绘制；

5. 设置游戏状态为 `游戏中(RUNNING)`，内部状态tickCount = 0；

6. 调用`canvas`立即进行一次局部更新，此处更新主要是status发生了变化，导致游戏状态需要重新渲染；

7. 开启定时器，定时器的时间通过this.speed，`speed`后续会考虑跟游戏的level进行搭配（暂时未支持）。

  * 如果tickCount == 0，则触发一次stage的tick动作，触发后立即检查是否结束；
  * 触发canvas的update操作
  * tickCount自增，如果满足 >= tickMaxCount，则重置；

  之所以引入tickCount机制，主要是保证canvas的更新频率，一般情况下屏幕刷新率要高于stage.tick速度，如果两者保持一致可能会出现游戏界面不流畅的情况。

## Stage tick

从上述代码可以看出，游戏的核心逻辑是`stage.tick`，其内部实现如下：

```javascript
class Stage {
  tick(): void {
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
}
```

* 首先判断游戏是否结束或者正在执行清除操作。

* 如果`current`为空，则表示游戏是首次加载，分别初始化`current`和`next`。

* 判断游戏是否达到结束条件，即`current`与`points`有重叠。如果有重叠则标记游戏结束。

* 判断当前current是否可以往下移动，如果能往下移动，则往下移动一格，否则检测是否可以消除。

接下来我们来看如何检测消除，即`handleClear`的实现。

```javascript
class Stage {
  private handleClear() {
    if (!this.current) {
      return;
    }
    // 1. 复制新的points
    const pointsClone: Point[][] = this.points.map((row) => row.map((point) => point.clone()));
    this.current.points.forEach((point) => {
      pointsClone[point.y][point.x] = point.clone();
    });
    // 2. 检查是否有消除的行
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
    // 3. 对行进行消除
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
        // 4. 扫尾工作，变量赋值
        this.points = pointsClone;
        this.current = this.next;
        this.next = this.factory.randomBlock();
        this.toTop(this.next);
      });
    } else {
      // 4. 扫尾工作，变量赋值
      this.points = pointsClone;
      this.current = this.next;
      this.next = this.factory.randomBlock();
      this.toTop(this.next);
    }
  }
}
```

从上述代码可以看出，整个流程分为四步：

1. 复制一个新的pointsClone，包括current和当前的points。

2. 逐行检测pointsClone，如果整行被填充，则进行标记；

3. 按照2生成的标记内容，逐行删除。注意删除的操作是从上往下进行，删除一行时从顶部补充一行空行。

4. 扫尾工作。不管是否进行清除操作均需要进行该步骤，将pointsClone赋值给`this.points`，同时完成`current`和`next`的切换。


## 旋转（rotate）

方块旋转是怎么回事呢 ？

所有旋转行为都是通过调用game.rotate方法触发，包括controller定义的事件、外部调用等；

Game中实现逻辑如下：

```javascript
class Game {
  rotate() {
    this.stage.rotate();  
    this.canvas.update();
  }
}
```

接下来看`Stage`的实现

```javascript
class Stage {
  rotate(): boolean {
    if (!this.current) {
      return false;
    }
    const canChange = this.current.canRotate(this.points);
    if (canChange) {
      this.current.rotate();
    }
    return false;
  }
}
```

* 首先判断`current`是否存在，如果不存在则直接返回；

* 调用`current`的`canRotate`方法，查看当前位置是否可以旋转；如果能选择则调用旋转方法进行旋转。

我们进一步，查看`Block`的`canRotate`和`rotate`方法。

```javascript
class Block {
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
}
```

我们先看`canRotate`的实现。 

* 获取centerIndex，centerIndex即旋转的中心点的索引。这个每个图形都不一样，如IBlock，其定义如下：

  ```javascript
  class IBlock extends Block {
    getCenterIndex(): number {
      return 1;
    }
  }
  ```

  即，旋转中心点为第二个节点。如`口口口口`， 第二个中心点`口田口口`。

  另外在设计该方块时也考虑有些方块是无法旋转的，如OBlock，它无法选择。则`getCenterIndex`返回`-1`。

* 获取changes数组，该数组的定义为当前旋转的角度，数组长度表示旋转次数，数组内容表示本次旋转相对上次旋转的角度。如`IBlock`的定义如下:

  ```javascript
  class IBlock extends Block {
    currentChangeIndex: number = -1;
    getChanges(): number[] {
      return [
        Math.PI / 2,
        0 - Math.PI / 2
      ];
    }
  }
  ```

  即，第一次旋转为初始状态Math.PI / 2(即90度)，第二次旋转为第一次旋转的-Math.PI / 2（即-90度）。如下：

  ```javascript
  // 初始状态
  // 口田口口

  // 第一次旋转
  // 　口
  // 　田
  // 　口
  // 　口

  // 第二次旋转
  // 口田口口

  ```

  > PS： 这里要注意坐标轴是从左到右，从上到下。

* 进行旋转判断，判断的标准为：

  1. 旋转后的坐标点不能超过整个游戏的边界；
  2. 旋转后的坐标点不能占用已填充方块的点。

  因此，我们看到有`isValid`和`newPoints.every`的判断。


我们接下来看`Block.rotate`，如下：

```javascript
class Block {
  rotate() {
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
}
```

通过上面的描述，`rotate`的逻辑就容易理解了。

* 获取`centerIndex`和`changes`，将`currentChangeIndex`进行循环自增，并将将Block指向新的坐标。

* 其中`currentChangeIndex`初始值为-1,表示当前为旋转，大于等于0则表示选择 index + 1次。（此处请仔细思考，因为数组的索引从0开始）

## 移动

移动即将Block向四个方向进行移动。我们来看其实现

```javascript
class Game {
  move(direction: Direction) {
    this.stage.move(direction);
    this.canvas.update();
  }
}
```

其中，Direction定义如下：

```javascript
type Direction = 'up' | 'down' | 'left' | 'right'；
```

进一步看`Stage`的实现：

```javascript
class Stage {
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
```

进一步看`canMove`和`move`的实现。


```javascript
class Block {
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
}
```

  我们简单翻译一下如下：

  * 上移，所有的y轴点必须大于0（即大于等于1），且移动之后的点必须是空点；

  * 左移，所有的x轴点必须大于0（即大于等于1），且移动之后的点必须是空点；

  * 右移，所有的x轴点必须小于x坐标轴长度-1（即小于等于xSize - 2），且移动之后的点必须是空点；

  * 下移，所有的y轴点必须小于y坐标轴长度-1（即小于等于ySize - 2），且移动之后的点必须是空点。


满足移动条件之后，我们来看`move`的实现。

```javascript
class Block {
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
}
```

直接是修改坐标点的值。

## 小结

本章描述了游戏的三个重要行为：清除、旋转和移动。它们三者之间相互配合，完成游戏。下一章我们将分享游戏的界面渲染和操作控制。