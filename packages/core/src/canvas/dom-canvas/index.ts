import { GameStatus } from '../../game';
import { AbstractTheme } from '../../theme/index';
import { AbstractCanvas } from '../base';

export * from './theme/base';
export * from './theme/color';
export * from './theme/dark';
export * from './theme/dark-color';

export class DomCanvas extends AbstractCanvas {
  el: HTMLElement;
  container: HTMLElement;
  elScore: HTMLElement | null = null;
  elNext: HTMLElement | null = null;
  elStage: HTMLElement | null = null;
  elCurrent: HTMLElement | null = null;
  blockSize: number = 22;
  elBlocks: HTMLElement[][] | null = null;
  elStatus: HTMLElement | null = null;
  constructor(selector: string, theme: AbstractTheme) {
    super(theme);
    this.container = document.querySelector(selector)!;
    this.el = document.createElement('div');
    this.container.appendChild(this.el);
  }
  render(): void {
    // 初始化渲染
    const { el } = this;
    el.innerHTML = '';
    el.style.position = 'relative';
    el.style.width = `${(this.blockSize) * this.stage!.dimension.xSize + 65}px`;
    el.style.height = `${(this.blockSize) * this.stage!.dimension.ySize + 35}px`;
    this.theme.outStyle(el);

    const elScore = document.createElement('div');
    elScore.style.position = 'absolute';
    elScore.style.top = '5px';
    elScore.style.right = '5px';
    elScore.innerText = this.theme.scoreTemplate(this.stage!.score);
    this.elScore = elScore;
    el.appendChild(elScore);
    this.theme.scoreStyle(elScore);

    const elStage = document.createElement('div');
    elStage.style.margin = '30px 60px 5px 5px';
    this.elStage = elStage;
    this.theme.innerStyle(elStage);
    el.appendChild(elStage);

    const elNext = document.createElement('div');
    elNext.style.position = 'absolute';
    elNext.style.top = '30px';
    elNext.style.right = '5px';
    elNext.style.width = '45px';
    elNext.style.height = '45px';
    this.elNext = elNext;
    el.appendChild(elNext);
    this.theme.nextStyle(elNext);

    const elStatus = document.createElement('div');
    elStatus.style.position = 'absolute';
    elStatus.style.background = 'gray';
    elStatus.style.width = '100%';
    elStatus.style.height = '40px';
    elStatus.style.top = `${this.blockSize * this.stage!.dimension.halfYSize + 30}px`;
    elStatus.style.left = '0px';
    elStatus.style.zIndex = '10';
    elStatus.style.color = 'white';
    elStatus.style.fontSize = '24px';
    elStatus.style.fontWeight = 'bold';
    elStatus.innerText = '游戏结束';
    elStatus.style.display = 'none';
    elStage.appendChild(elStatus);
    this.elStatus = elStatus;
    this.theme.statusStyle(elStatus);

    this.elBlocks = this.stage!.points.map((row, y) => {
      return row.map((point, x) => {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.width = `${this.blockSize - 1}px`;
        el.style.height = `${this.blockSize - 1}px`;
        el.style.left = `${this.blockSize * x + 5}px`;
        el.style.top = `${this.blockSize * y + 30}px`;
        this.theme.blockPointStyle(el, point);
        this.elStage!.appendChild(el);
        return el;
      });
    });
    const elCurrent = document.createElement('div');
    this.elStage.appendChild(elCurrent);
    this.elCurrent = elCurrent;
    
  }
  update(): void {
    this.renderNext();
    this.renderBlock();
    this.renderCurrent(); 
    this.renderScore();
    this.renderStatus();
  }
  bind(): void {
    const onHandleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.type === 'keypress') {
        this.game!.toggle();
        return ;
      }
      if (this.stage!.isOver) {
        return ;
      }
      switch (e.key) {
        case 'ArrowUp':
          this.game!.change();
          break;
        case 'ArrowDown':
          this.game!.move('down');
          break;
        case 'ArrowLeft':
          this.game!.move('left');
          break;
        case 'ArrowRight':
          this.game!.move('right');
          break;
      }
    }
    window.addEventListener('keydown', onHandleKey, false);  
    window.addEventListener('keypress', onHandleKey, false);
  }
  renderScore(): void {
    if (!this.elScore) {
      return;
    }
    const { elScore } = this;
    elScore.innerText = this.theme.scoreTemplate(this.stage!.score);
  }
  renderNext(): void {
    const { stage, elNext } = this;
    if (!stage || !elNext) {
      return ;
    }
    const { next } = stage;
    if (!next) {
      return ;
    }
    elNext.innerHTML = '';
    next.points.forEach((point) => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.width = `9px`;
      el.style.height = `9px`;
      el.style.left = `${9 * ( point.x - this.stage!.dimension.halfXSize + 1) + 4}px`;
      el.style.top = `${4 + 9 * (point.y - 1)}px`;
      this.theme.nextPointStyle(el, point);      
      elNext.appendChild(el);
    });
  }
  renderBlock(): void {
    const { stage } = this;
    if (!stage) {
      return ;
    }
    const { points } = stage;
    if (!this.elBlocks) {
      this.elBlocks = points.map((row, y) => {
        return row.map((point, x) => {
          const el = document.createElement('div');
          el.style.position = 'absolute';
          el.style.width = `${this.blockSize - 1}px`;
          el.style.height = `${this.blockSize - 1}px`;
          el.style.left = `${this.blockSize * x + 5}px`;
          el.style.top = `${this.blockSize * y + 30}px`;
          this.theme.blockPointStyle(el, point);
          this.elStage!.appendChild(el);
          return el;
        });
      });
    }
    points.forEach((row, y) => {
      row.forEach((point, x) => {
        const el = this.elBlocks![y][x];
        if (el) {
          this.theme.blockPointStyle(el, point);
        }
      });
    });
  }
  renderCurrent(): void {
    const { stage } = this;
    if (!stage) {
      return ;
    }
    const { blockSize } = this;
    const { current } = stage;
    if (!current) {
      return ;
    }
    this.elCurrent!.innerHTML = '';
    const { points } = current;
    points.forEach((point) => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.width = `${blockSize - 1}px`;
      el.style.height = `${blockSize - 1}px`;
      el.style.left = `${blockSize * point.x + 5}px`;
      el.style.top = `${blockSize * point.y + 30}px`;
      this.theme.blockPointStyle(el, point);
      this.elCurrent!.appendChild(el);
    });
  }
  renderStatus(): void {
    if (!this.elStatus) {
      return ;
    }
    const { game } = this;
    if (!game) {
      return ;
    }
    const { status } = game;
    if (status === GameStatus.PAUSE) {
      this.elStatus.style.display = '';
      this.elStatus.innerText = '暂停';
    } else if (status === GameStatus.OVER) {
      this.elStatus.style.display = '';
      this.elStatus.innerText = '游戏结束';
    } else if (status === GameStatus.STOP) {
      this.elStatus.style.display = '';
      this.elStatus.innerText = '游戏结束';
    } else {
      this.elStatus.style.display = 'none';
    }
  }
}