import { DrawContextFixedGLText } from 'src/renderer/drawcontext/DrawContextFixedGLText.js';
import * as Sky from './Sky.js';
import * as Sea from './Sea.js';
import { AssetRef, bindRefs } from 'src/loader/AssetRef.js';
import { Random } from '@milque/random';

document.title = 'Moonsea';

export const ASSETS = {
  FishImage: new AssetRef('image:fish_shadow.png'),
};

/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const { display } = game;
  const canvas = display.canvas;
  const ctx = new DrawContextFixedGLText(canvas.getContext('webgl'));
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;

  bindRefs(game.assets, Object.values(ASSETS));

  await Sky.load(game);
  await Sea.load(game);
  const skyWorld = Sky.init(game);
  const seaWorld = Sea.init(game);

  let fishes = [];
  for(let i = 0; i < 6; ++i) {
    let x = Random.range(0, canvasWidth);
    let y = Random.range(canvasHeight - 100, canvasHeight);
    let offset = Random.range(0, Math.PI * 2);
    fishes.push({
      x, y,
      offset,
      size: Random.range(0.3, 0.5),
      speed: Random.range(1, 3) * Random.sign(),
    });
  }

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    let { deltaTime, now } = e.detail;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    const worldSpeed = 1;
    deltaTime *= worldSpeed;
    now *= worldSpeed;
    game.deltaTime = deltaTime;
    game.now = now;

    // Update
    Sky.update(deltaTime, game, skyWorld);
    Sea.update(deltaTime, game, seaWorld);

    for(let fish of fishes) {
      fish.x += (0.2 + (Math.sin(now / 1000 + fish.offset) + 1) / 2) * fish.speed;
      if (fish.x > canvas.width) {
        fish.x = 0;
      }
      if (fish.x < 0) {
        fish.x = canvas.width;
      }
    }

    // Draw
    ctx.resize();
    ctx.reset();

    ctx.setTranslation(0, 0, -10);
    ctx.pushTransform();
    {
      Sky.render(ctx, game, skyWorld);
      Sea.render(ctx, game, seaWorld);
    }
    ctx.popTransform();
    
    ctx.setTextureImage(6, ASSETS.FishImage.current);
    ctx.setColor(0x333333);
    for(let fish of fishes) {
      ctx.pushTransform();
      let dt = Math.sin(fish.x / 5 + fish.y);
      let dt2 = Math.cos(fish.x / 20);
      ctx.setTranslation(fish.x, fish.y + (dt2 * 4));
      ctx.setOpacityFloat(0.5);
      ctx.setRotation(0, 0, 90 + dt * 4 + (fish.speed < 0 ? 180 : 0));
      ctx.setScale(fish.size, fish.size + ((dt2 + 1) / 2) * 0.1);
      ctx.drawTexturedBox(6, 0, 20);
      ctx.popTransform();
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();
  });
}
