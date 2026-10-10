# packages/console — @shushanfx/tetris-console

终端平台的渲染实现 + CLI 入口，依赖 `@shushanfx/tetris-core`，注册 `tetris` 命令。

## 结构

```
src/
├── index.ts                 # 库入口：导出 ConsoleCanvas / TTYCanvas / 主题 / 颜色
├── index.main.ts            # CLI 入口（commander）：-c 无彩色 / -b 方块字符 / -d 默认画布 / -o 隐藏边框
├── canvas/
│   ├── console-canvas.ts    # ConsoleCanvas：ANSI 转义序列渲染
│   ├── tty-canvas.ts        # TTYCanvas：raw 模式 + 全屏重绘
│   ├── console-controller.ts# 终端按键控制
│   ├── console-theme.ts     # 无色主题
│   └── console-color-theme.ts # colors 包的彩色主题
└── util/
rollup.config.mjs      # 库构建
rollup.main.mjs        # CLI 构建（带 shebang）
```

## 命令

```bash
yarn build    # rollup -c && rollup -c rollup.main.mjs
yarn lint     # eslint src
yarn test     # ts-node src/index.main.ts（手动试跑，非断言测试）
```

## 约定与注意点

- 库与 CLI 分开构建：改渲染逻辑只需管 `rollup.config.mjs`，改 CLI 参数需同步 `rollup.main.mjs`
- 自动探测终端彩色能力（`process.stdout.hasColors()`）选择主题
- 无单元测试；验证方式是 `yarn test` 在终端里人工试玩
