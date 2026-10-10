# packages/core — @shushanfx/tetris-core

平台无关的俄罗斯方块游戏核心逻辑。**不得引入任何平台相关依赖**（DOM、终端、Node API 都不允许），渲染与输入通过抽象类由上层实现。

## 结构

```
src/
├── game.ts        # Game：主循环（setInterval tick）与状态机 READY/RUNNING/PAUSE/STOP/OVER
├── stage.ts       # Stage：点阵数据、方块下落、消行判定与计分（1/2/3/4 行 = 100/300/700/1500）
├── model/         # Point / Dimension / Block 基类 + I/J/L/O/S/T/Z 七种子类
├── factory/       # BaseFactory（随机方块）/ ColorFactory（附加调色板颜色）
├── canvas/        # AbstractCanvas 渲染抽象
├── controller/    # AbstractController 输入抽象
└── theme/         # AbstractTheme 主题抽象 + DefaultTheme 空实现
```

## 命令

```bash
yarn build           # rollup 构建 UMD + ESM 到 dist/
yarn lint            # eslint src/index.ts test
yarn test            # vitest run
yarn test:coverage   # 测试 + 覆盖率
yarn test:ci         # CI 用：额外输出 test-results.json 与 coverage-summary.json
```

## 约定与注意点

- 单元测试在 `test/`（vitest，直接对 src 源码跑，无需先 build）
- 涉及消行的测试用 `vi.useFakeTimers()` + `advanceTimersByTime(250)` 驱动消行动画（20ms × 10 次）
- `Block.rotate()` 只校验越界、不校验目标占用；碰撞检查由调用方先调 `canRotate(grid)` 兜底
- `Game` 的 `speed=50ms × tickMaxCount=10`，即每 500ms 下落一格；改定时逻辑时注意 `pause()`/`stop()` 用 `clearInterval` 清理
