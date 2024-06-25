import { AbstractController } from '@shushanfx/tetris-core';

export class DomController extends AbstractController {
  private onHandleKey?: (e: KeyboardEvent) => void;
  bind(): void {
    const onHandleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.type === 'keypress') {
        this.game!.toggle();
        return ;
      }
      if (this.game!.stage.isOver) {
        return ;
      }
      switch (e.key) {
        case 'ArrowUp':
          this.game!.rotate();
          break;
        case 'ArrowDown':
          this.game!.move('down');
          break;
        case 'ArrowLeft':
          this.game!.move('left');
          break;
        case 'ArrowRight':
          this.game!.move('right');
          break;
      }
    }
    this.onHandleKey = onHandleKey;
    window.addEventListener('keydown', this.onHandleKey, false);  
    window.addEventListener('keypress', this.onHandleKey, false);
  }
  unbind(): void {
    if (this.onHandleKey) {
      window.removeEventListener('keydown', this.onHandleKey!);
      window.removeEventListener('keypress', this.onHandleKey!);
    }
  }
}