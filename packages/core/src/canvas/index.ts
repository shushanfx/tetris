import { Stage } from "../stage";
import { Game } from "../game";
import { AbstractTheme } from "../theme/index";

abstract class AbstractCanvas {
  stage: Stage | null = null;
  game: Game | null = null;
  theme: AbstractTheme;
  constructor(theme: AbstractTheme) {
    this.theme = theme;
  }
  abstract render(): void;
  abstract update(): void;
  /*
   * 更新主题
   */
  updateTheme(theme: AbstractTheme): void {
    this.theme = theme;
    this.render();
    this.update();
  }
}

export { AbstractCanvas }; 