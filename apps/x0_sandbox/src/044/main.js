import { World } from './World.js';

/**
 * @param {import('../lib/game/Game.js').Game} game
 */
export async function main(game) {
  const world = new World(game);

  const FIXED_UPDATE_FRAME_MILLIS = 1_000 / 20; // 20 frames per second
  const MAX_FIXED_UPDATES_PER_FRAME_MILLIS = 100 * FIXED_UPDATE_FRAME_MILLIS;

  let loaded = false;
  let started = false;
  let accumulatedTime = 0;
  await world.onLoad();
  loaded = true;
  game.on('frame', () => {
    const { deltaTime, inputs } = game;
    if (loaded) {
      if (started) {
        inputs.poll();
        if (world.onUpdate) {
          world.onUpdate(deltaTime);
        }
        if (accumulatedTime > MAX_FIXED_UPDATES_PER_FRAME_MILLIS) {
          console.log('Too many frames. Skipping ahead...');
          accumulatedTime %= MAX_FIXED_UPDATES_PER_FRAME_MILLIS;
        }
        for (
          accumulatedTime += deltaTime;
          accumulatedTime > FIXED_UPDATE_FRAME_MILLIS;
          accumulatedTime -= FIXED_UPDATE_FRAME_MILLIS
        ) {
          if (world.onFixedUpdate) {
            world.onFixedUpdate();
          }
        }
        if (world.onFrame) {
          world.onFrame(deltaTime);
        }
      } else {
        if (world.onStart) {
          world.onStart();
        }
        started = true;
      }
    }
  });
}
