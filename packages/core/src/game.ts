import { AbstractCanvas } from "./canvas/index";
import { Stage } from "./stage";
import { AbstractFactory } from "./factory/index";
import { Direction, Dimension } from "./model/index";
import { AbstractController } from "./controller/index";

export interface GameOptions {
  dimension: Dimension;
  canvas: AbstractCanvas;
  factory?: AbstractFactory;
  controller?: AbstractController;
}

export enum GameStatus {
  READY = 1,
  RUNNING = 2,
  PAUSE = 3,
  STOP = 4,
  OVER = 5
}

export class Game {
  controller?: AbstractController;
  canvas: AbstractCanvas;
  options: GameOptions;
  dimension: Dimension;
  stage: Stage;
  status: GameStatus;
  speed: number = 50;
  tickTimer: number = 0;
  tickCount: number = 0;
  tickMaxCount: number = 10;
  constructor(options: GameOptions) {
    this.options = options;
    this.dimension = options.dimension;
    this.stage = new Stage(this.dimension, this.options.factory);
    this.canvas = options.canvas;
    this.canvas.stage = this.stage;
    this.canvas.game = this;
    this.controller = options.controller;
    if (this.controller) {
      this.controller.game = this;
    }
    this.status = GameStatus.READY;
  }
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
  pause() {
    if (this.status === GameStatus.PAUSE) {
      return ;
    }
    if (this.tickTimer > 0) {
      this.status = GameStatus.PAUSE;
      clearTimeout(this.tickTimer);
      this.canvas.update();
      this.tickTimer = 0;
    }
  }
  stop() {
    if (this.status === GameStatus.STOP) {
      return ;
    }
    if (this.tickTimer > 0) {
      clearTimeout(this.tickTimer);
      this.tickTimer = 0;
    }
    this.status = GameStatus.STOP;
    this.canvas.update();
  }
  rotate() {
    this.stage.rotate();  
    this.canvas.update();
  }
  move(direction: Direction) {
    this.stage.move(direction);
    this.canvas.update();
  }
  toggle() {
    if (this.status === GameStatus.PAUSE
        || this.status === GameStatus.OVER
        || this.status === GameStatus.STOP) {
      this.start();
    } else if(this.status === GameStatus.RUNNING) {
      this.pause();
    }
  }
  destroy() {
    this.stop();
    this.controller?.unbind();
  }
  private checkIsOver(): void {
    const isOver = this.stage.isOver;
    if (isOver) {
      this.status = GameStatus.OVER;
      clearInterval(this.tickTimer);
    }
  }
}