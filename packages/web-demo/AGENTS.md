# packages/web-demo — @shushanfx/tetris-web-demo

Vue 3 + Vite 的 Web 演示工程（private，不随 lerna 发布），依赖 `@shushanfx/tetris-core` 与 `@shushanfx/tetris-web`。用途是人工演示与联调，不是独立产品。

## 结构

```
src/
├── App.vue    # 挂载 Game 实例：开始/暂停/停止按钮 + 主题切换
├── main.ts
└── style.css
eslint.config.mjs   # 本包独立 flat config（含 vue 插件），与根配置并存
```

## 命令

```bash
yarn dev       # vite 开发服务器
yarn build     # vue-tsc 类型检查 + vite build
yarn lint      # eslint（走本包自己的配置）
```

## 约定与注意点

- 这是仓库里唯一允许依赖 Vue/Vite 的包；不要把业务逻辑写进这里，可复用的逻辑应下沉到 core/web
- 本包有自己的 `eslint.config.mjs`（带 vue 规则），CI 的增量 lint 会按文件就近选择配置根，改这里要遵守 vue 规则（如按钮内容需换行，会触发 `vue/singleline-html-element-content-newline`）
- 从 `app` 目录迁移而来（见仓库根 AGENTS.md 的提交历史），旧文档中的 `app` 均指本包
