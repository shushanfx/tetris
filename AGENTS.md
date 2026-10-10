# AGENTS.md

## 项目概览

俄罗斯方块 monorepo 教学项目。yarn workspaces + lerna 管理，所有子包在 `packages/` 下：

| 包 | 说明 |
| --- | --- |
| `@shushanfx/tetris-core` | 平台无关的游戏核心逻辑（唯一有单元测试的包，vitest） |
| `@shushanfx/tetris-web` | 浏览器 DOM 渲染层（rollup 构建） |
| `@shushanfx/tetris-console` | 终端 CLI 版本（commander，注册 `tetris` bin） |
| `@shushanfx/tetris-web-demo` | Vue3 + Vite 演示工程（private，不发布） |

## 提交工作流（重要）

**未经用户确认，禁止执行 `git commit` / `git push`。**

标准流程：
1. 修改代码、完成验证（build / lint / test 通过）
2. 向用户汇总改动内容（文件、原因、验证结果）
3. 给出 commit log 草稿，等用户明确确认
4. 确认后执行 commit 和 push

## 提交规范

- Conventional Commits：`type: 中文描述`（type 用 fix/feat/chore/ci/test/style/docs/refactor）
- commitlint 强校验：body 每行不超过 100 字符（超长会被拦截，需手动折行）
- 提交会触发 husky + lint-staged（`eslint --max-warnings=0`），提交前确保增量代码无 lint 警告
- 仓库署名：`dengjianxin <dengjianxin1990s@163.com>`（仓库级 git config 已配置）

## 常用命令

```bash
yarn build                                               # 全部包构建（含 web-demo 的 vue-tsc）
yarn lint                                                # 全部包 eslint
yarn workspace @shushanfx/tetris-core test               # 单元测试
yarn workspace @shushanfx/tetris-core test:coverage      # 测试 + 覆盖率
yarn workspace @shushanfx/tetris-web-demo dev            # 启动演示
```

## CI（GitHub Actions）

- `.github/workflows/lint-increment.yml`：PR 增量代码 lint（脚本 `.github/scripts/lint-increment.sh`），结果以 check + PR 评论（原地更新）反馈
- `.github/workflows/unit-test.yml`：PR 涉及 `*.ts/*.js/*.mjs/package.json` 变更时全量跑 core 测试 + 覆盖率，结果同上反馈
- 两个 workflow 均为 Node 22；`pull_request` 事件的 workflow 必须存在于 base 分支才触发
- 仓库未提交 yarn.lock，CI 用 `**/package.json` 哈希手动缓存 yarn

## 工程约定

- 依赖管理用 yarn（经典版 v1），新增依赖装到对应 workspace
- 未提交 yarn.lock 是历史约定；若安装依赖导致行为差异需向用户说明
- `.gitignore` 已含：`dist`、`coverage`、`lint-report.md`、`test-results.json`（后两个是 CI 产物）
- 每个子包有独立 eslint flat config（根目录与 `packages/web-demo`），改代码时注意文件归属的配置
- `packages/web-demo` 是唯一允许依赖 Vue/Vite 的包；core 包不得引入任何平台/DOM 依赖
