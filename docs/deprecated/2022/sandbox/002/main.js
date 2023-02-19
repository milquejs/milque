import * as PlayerInputs from './PlayerInputs.js';
import { Player } from './Player.js';

import { Bullet } from './Bullet.js';
import { Room } from './Room.js';

document.title = 'Bioform';

/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const display = game.display;
  const ctx = display.canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.assets = game.assets;

  const inputs = game.inputs;
  inputs.bindBindings(Object.values(PlayerInputs));

  const room = new Room(display.width, display.height, [
    { x: 0, y: 0, object: Player },
    { x: 0, y: 0, object: Bullet },
  ]);
  room.start();

  display.addEventListener('frame', (e) => {
    const dt = (e.detail.deltaTime / 1000) * 60;

    room.update(dt);

    ctx.clearRect(0, 0, display.width, display.height);

    room.render(ctx);
  });
}
