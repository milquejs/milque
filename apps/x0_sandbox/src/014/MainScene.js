import { EntitySpawner } from './milque.js';
import { Scene2D } from './Scene2D.js';
import * as Draws from './Draws.js';

const Pawn = EntitySpawner.createSpawner((x = 0, y = 0) => {
  return {
    x,
    y,
  };
});

export class MainScene extends Scene2D {
  /** @override */
  onSceneStart() {}

  /** @override */
  onSceneUpdate(dt) {}

  /** @override */
  onSceneRender(ctx, view) {}

  /** @override */
  onSceneUI(ctx, view) {
    Draws.box(ctx, view.width / 2, view.height - 100, view.width, 150);
    Draws.box(ctx, 0, 0, 10, 10, 'blue');
  }
}

function renderPawns(ctx) {
  for (let pawn of Pawn.entities) {
    ctx.fillStyle = 'red';
    ctx.fillRect(pawn.x - 6, pawn.y - 6, 12, 12);
  }
}
