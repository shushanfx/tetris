# packages/web — @shushanfx/tetris-web

浏览器平台的渲染实现，依赖 `@shushanfx/tetris-core`。纯库包，不提供 CLI（`bin` 配置是历史遗留并已移除，勿再加回）。

## 结构

```
src/
├── index.ts       # DomCanvas：用绝对定位 div 渲染舞台/分数/下一个方块/结束遮罩
├── controller.ts  # DomController：键盘事件绑定（绑定到 window）
└── theme/         # base / color / dark / dark-color 四套主题
```

## 命令

```bash
yarn build    # rollup 构建 UMD + ESM 到 dist/
yarn lint     # eslint src/index.ts
```

## 约定与注意点

- 所有渲染必须继承 core 的 `AbstractCanvas`、主题继承 `AbstractTheme`，不得绕开抽象直接操作游戏状态
- 暴露的主题、控制器、画布均从 `src/index.ts` 统一导出（app 侧按包名引用）
- 无单元测试；验证方式是通过 `packages/web-demo` 启动页面人工确认
