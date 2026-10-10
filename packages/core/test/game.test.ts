import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AbstractCanvas,
  AbstractController,
  DefaultTheme,
  Dimension,
  Game,
  GameStatus,
} from '../src/index';

class MockCanvas extends AbstractCanvas {
  renderCount = 0;
  updateCount = 0;
  render(): void {
    this.renderCount++;
  }
  update(): void {
    this.updateCount++;
  }
}

class MockController extends AbstractController {
  bindCount = 0;
  unbindCount = 0;
  bind(): void {
    this.bindCount++;
  }
  unbind(): void {
    this.unbindCount++;
  }
}

function createGame() {
  const dimension = new Dimension(10, 20);
  const canvas = new MockCanvas(new DefaultTheme());
  const controller = new MockController();
  const game = new Game({ dimension, canvas, controller });
  return { game, canvas, controller };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Game 初始化', () => {
  it('初始状态为 READY，并关联 stage / canvas / controller', () => {
    const { game, canvas, controller } = createGame();
    expect(game.status).toBe(GameStatus.READY);
    expect(game.stage).not.toBeNull();
    expect(canvas.stage).toBe(game.stage);
    expect(canvas.game).toBe(game);
    expect(controller.game).toBe(game);
  });
});

describe('Game.start', () => {
  it('绑定控制器、渲染并进入 RUNNING', () => {
    const { game, canvas, controller } = createGame();
    game.start();
    expect(game.status).toBe(GameStatus.RUNNING);
    expect(controller.bindCount).toBe(1);
    expect(canvas.renderCount).toBe(1);
  });

  it('RUNNING 状态下重复 start 是空操作', () => {
    const { game, canvas, controller } = createGame();
    game.start();
    const renderCount = canvas.renderCount;
    game.start();
    expect(controller.bindCount).toBe(1);
    expect(canvas.renderCount).toBe(renderCount);
  });

  it('定时驱动 stage 下落', () => {
    const { game } = createGame();
    game.start();
    expect(game.stage.current).toBeNull();
    vi.advanceTimersByTime(50);
    expect(game.stage.current).not.toBeNull();
    game.destroy();
  });
});

describe('Game.pause / stop / toggle', () => {
  it('pause 进入 PAUSE 并暂停定时刷新', () => {
    const { game, canvas } = createGame();
    game.start();
    vi.advanceTimersByTime(50);
    game.pause();
    expect(game.status).toBe(GameStatus.PAUSE);
    const updateCount = canvas.updateCount;
    vi.advanceTimersByTime(200);
    expect(canvas.updateCount).toBe(updateCount);
    game.destroy();
  });

  it('toggle 在 RUNNING 与 PAUSE 之间切换', () => {
    const { game } = createGame();
    game.start();
    game.toggle();
    expect(game.status).toBe(GameStatus.PAUSE);
    game.toggle();
    expect(game.status).toBe(GameStatus.RUNNING);
    game.destroy();
  });

  it('stop 进入 STOP，再次 start 重置舞台', () => {
    const { game, controller } = createGame();
    game.start();
    vi.advanceTimersByTime(50);
    game.stop();
    expect(game.status).toBe(GameStatus.STOP);
    game.start();
    expect(game.status).toBe(GameStatus.RUNNING);
    expect(game.stage.score).toBe(0);
    expect(game.stage.current).toBeNull();
    expect(controller.bindCount).toBe(1);
    game.destroy();
  });
});

describe('Game 操作转发', () => {
  it('move / rotate 转发给 stage 并触发 canvas 更新', () => {
    const { game, canvas } = createGame();
    game.start();
    vi.advanceTimersByTime(50);
    const updateCount = canvas.updateCount;
    game.move('left');
    game.rotate();
    expect(canvas.updateCount).toBe(updateCount + 2);
    game.destroy();
  });
});

describe('Game.destroy', () => {
  it('停止游戏并解绑控制器', () => {
    const { game, controller } = createGame();
    game.start();
    game.destroy();
    expect(game.status).toBe(GameStatus.STOP);
    expect(controller.unbindCount).toBe(1);
  });
});
