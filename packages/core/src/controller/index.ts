import { Game } from '../game';

export abstract class AbstractController {
  constructor() {
    this.game = null;
  }
  game: Game | null;
  abstract bind():void;
  unbind(): void {}
}