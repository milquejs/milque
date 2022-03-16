import { AssetManager } from '@milque/asset';
import { FISHING_STATE } from './Fisher.js';
import { INPUTS } from './Inputs.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('./main.js').Game} Game
 */

const ASSETS = {};

/** @param {Game} game */
export async function load(game) {
  await AssetManager.loadAssetRefs(Object.values(ASSETS));
}

/** @param {Game} game */
export function init(game) {
  const canvasWidth = game.display.width;

  let player = {
    x: canvasWidth - 100,
    y: 0,
    motionX: 0,
  };
  return {
    player,
  };
}

/**
 * @param {number} dt
 * @param {Game} game
 * @param {ReturnType<init>} world
 * @param {ReturnType<import('./Fisher.js').init>} fisher
 */
export function update(dt, game, world, fisher) {
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;

  let player = world.player;
  let friction = 0.4;
  let invFriction = 1 - friction;
  let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
  player.motionX += dx * dt * 0.1;
  player.motionX *= invFriction;
  player.x += player.motionX;
  player.y = canvasHeight - 200;
  fisher.headX = player.x;
  fisher.headY = player.y;
  if (
    fisher.fishingState === FISHING_STATE.IDLE ||
    fisher.fishingState === FISHING_STATE.POWERING
  ) {
    fisher.bobX = player.x;
    fisher.bobY - player.y;
  }
  if (player.x > canvasWidth - 10) {
    player.x = canvasWidth - 10;
  } else if (player.x < canvasWidth - 130) {
    player.x = canvasWidth - 130;
  }
}

/**
 * @param {DrawContextFixedGLText} ctx
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function render(ctx, game, world) {
  let player = world.player;
  // Player
  ctx.setColor(0x00ffaa);
  ctx.drawCircle(player.x, player.y);

  // Player Shadow
  ctx.pushTransform();
  {
    ctx.setTranslation(player.x, player.y + 75);
    ctx.setScale(3, 1);
    ctx.setColor(0x333333);
    ctx.setOpacityFloat(0.3);
    ctx.drawCircle();
    ctx.setOpacityFloat(1);
  }
  ctx.popTransform();
}
