# 手撸俄罗斯方块——聊聊 TS

## TS 简介

Typescript 作为 Javascript 的超集，提供了静态类型检查、代码提示、代码可读性等优势。在大型项目中，TS 可以减少运行时错误，提高代码质量。它最早是由微软在 2012 年发布第一个版本，也就是所谓的 TS 0.8 版本。之后陆续迭代了多个版本，目前最新版本是 5.5.4。

## TS 的优势

TS 的优势主要体现在以下几个方面：

- **静态类型检查**：TS 提供了静态类型检查，可以在编译阶段发现一些潜在的问题，提高代码质量。

- **代码提示**：TS 可以根据类型信息提供更好的代码提示，提高开发效率。

- **代码可读性**：TS 可以提高代码的可读性，让代码更加易于维护。

- **更好的工具支持**：TS 提供了更好的工具支持，比如 VSCode 对 TS 的支持非常好。

- **API define 文档导出**：可以通过定义生产 d.ts 文档，方便其他人使用。

## TS 的使用

对于新人而言，嵌入 TS 开发相对比较简单，我归纳了如下几步：

- TS 基本语法的学习，可以参考[官方文档](https://www.typescriptlang.org/docs/handbook/intro.html)。

- 在项目中引入 TS，可以通过`npm install typescript`安装 TS。

- 在项目中新建`tsconfig.json`文件，配置 TS 编译选项。

之后就可以愉快的使用 TS 进行开发了。

### Hello World

下面我们简单的来看一个 TS 的 Hello World 例子：

1. 新建一个项目，执行`npm init -y`初始化项目。

2. 安装 TS，执行`npm install typescript -D`。

3. 新建`tsconfig.json`文件，通过命令行工具`./node_modules/.bin/tsc --init`生成。

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs" ,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    /* Type Checking */
    "strict": true /* Enable all strict
  }
}
```

4. 新建`src/index.ts`文件，写入如下代码：

```typescript
function sayHello(name: string) {
  return `Hello, ${name}!`;
}
sayHello("World");
```

5. 配置`package.json`文件，添加`scripts`字段：

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

6. 执行`npm run build`，编译 TS 文件。

7. 执行`node dist/index.js`，查看输出结果。

通过上述的步骤，我们可以简单的创建一个 TS 项目。

### 编译的产物

如上述的例子，我们通过`npm run build`命令编译 TS 文件，编译后的产物是`dist/index.js`文件。

编译前：

```typescript
export function sayHello(name: string) {
  return `Hello, ${name}!`;
}
sayHello("World");
```

编译后：

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sayHello = sayHello;
function sayHello(name) {
  return "Hello, ".concat(name, "!");
}
sayHello("World");
```
