<script setup lang="ts">
import { Game, Dimension, ColorFactory } from '@shushanfx/tetris-core';
import { DomCanvas, DarkTheme, DarkColorTheme, DefaultTheme, ColorTheme, DomController } from "@shushanfx/tetris-web"
import { onMounted, ref } from 'vue';

let tetris: Game;
const themes = [new DarkTheme(), new DarkColorTheme(), new DefaultTheme(), new ColorTheme()];
const currentThemeIndex = ref(0);

onMounted(() => {
  const theme = new DefaultTheme();
  const domCanvas = new DomCanvas('.tetris-container', theme);
  const domController = new DomController();
  const dimension = new Dimension(10, 20);
  tetris = new Game({
    dimension,
    canvas: domCanvas,
    factory: new ColorFactory(
      dimension, 
      ['#F948F7', '#D1C667', '#468B58', '#C76813', '#AED54C', '#535332', '#499C9F', '#7944B7', '#F034C1']
    ),
    controller: domController
  });
  tetris.start();
});

const updateTheme = () => {
  currentThemeIndex.value = (currentThemeIndex.value + 1) % themes.length;
  tetris.canvas.updateTheme(themes[currentThemeIndex.value]);
};

</script>

<template>
  <div>
    <div class="tetris-container"></div>
    <div class="tetris-button">
      <button @click="tetris.start()">
        开始
      </button>
      <button @click="tetris.pause()">
        暂停
      </button>
      <button @click="tetris.start()">
        继续
      </button>
      <button @click="tetris.stop()">
        停止
      </button>
    </div>
    <div class="tetris-button">
      <button @click="updateTheme">
        切换主题123
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.tetris-button {
  display: flex;
  margin-top: 20px;
  width: 100%;
  flex: 1;
  justify-content: space-between;
}
.tetris-button button {
  margin-left: 5px;
  padding: 0.6rem 0.8rem;
}
.tetris-button button:first-child{
  margin-left: 0;
}
</style>
