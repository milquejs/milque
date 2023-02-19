import { Random } from '@milque/random';
import { ImageLoader, AssetRef, preloadAssetRefs } from '@milque/asset';
import { ComponentClass } from './ComponentClass.js';
import { startRipple } from './Ripple.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('./main.js').Game} Game
 */

const ASSETS = {
  FishImage: new AssetRef('fishShadow', ImageLoader, undefined, 'raw://fish_shadow.png'),
};

const FishComponent = new ComponentClass('fish', () => ({
  x: 0, y: 0,
  offset: 0,
  size: 0,
  speed: 0,
}));

/*
const FishTemplate = new EntityTemplate('fish', [
  FishComponent,
]);

function SwimSystem(main) {
  let [ fishes ] = useEntityTemplate(main, FishTemplate);
  let fishes = useComponents(main, FishComponent);
  main.dispatchEvent({ type: 'frame' });
  useEvent(main, 'frame', (ctx) => {

  });
}*/

/** @param {Game} game */
export async function load(game) {
  await preloadAssetRefs(game.assets, Object.values(ASSETS));
}

/** @param {Game} game */
export function init(game) {
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;

  let fishes = [];
  for (let i = 0; i < 6; ++i) {
    let result = FishComponent.create();
    result.x = Random.range(0, canvasWidth);
    result.y = Random.range(canvasHeight - 100, canvasHeight);
    result.offset = Random.range(0, Math.PI * 2);
    result.size = Random.range(0.3, 0.5);
    result.speed = Random.range(1, 3) * Random.sign();
    fishes.push(result);
  }
  return {
    fishes,
  };
}

/**
 * @param {number} dt
 * @param {Game} game
 * @param {ReturnType<init>} world
 * @param {ReturnType<import('./Ripple.js').init>} rippleWorld
 */
export function update(dt, game, world, rippleWorld) {
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;
  const now = game.now;
  const { fishes } = world;
  for (let fish of fishes) {
    fish.x += (0.2 + (Math.sin(now / 1000 + fish.offset) + 1) / 2) * fish.speed;
    if (fish.x > canvasWidth) {
      fish.x = 0;
      fish.y = Random.range(canvasHeight - 100, canvasHeight);
    }
    if (fish.x < 0) {
      fish.x = canvasWidth;
      fish.y = Random.range(canvasHeight - 100, canvasHeight);
    }
    if (Math.floor(now / 10 + fish.y * 10) % 400 === 0 && Math.random() < 0.1) {
      startRipple(rippleWorld, fish.x, fish.y - 5, now);
    }
  }
}

/**
 * @param {DrawContextFixedGLText} ctx
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function render(ctx, game, world) {
  ctx.setTextureImage(6, ASSETS.FishImage.current);
  ctx.setColor(0x333333);
  for (let fish of world.fishes) {
    ctx.pushTransform();
    let dt = Math.sin(fish.x / 5 + fish.y);
    let dt2 = Math.cos(fish.x / 20);
    ctx.setTranslation(fish.x, fish.y + dt2 * 4);
    ctx.setOpacityFloat(0.5);
    ctx.setRotation(0, 0, 90 + dt * 4 + (fish.speed < 0 ? 180 : 0));
    ctx.setScale(fish.size, fish.size + ((dt2 + 1) / 2) * 0.1);
    ctx.drawTexturedBox(6, 0, 20);
    ctx.popTransform();
  }
  ctx.setOpacityFloat(1);
  ctx.resetTransform();
}
