import { loadAssetRefs } from './loader/AssetHelper.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('./main.js').Game} Game
 */

export const ASSETS = {};

/** @param {Game} game */
export async function load(game) {
  await loadAssetRefs(Object.values(ASSETS));
}

/** @param {Game} game */
export function init(game) {
  let ripples = [];
  for (let i = 0; i < 10; ++i) {
    ripples.push({
      x: 0,
      y: 0,
      startTime: 0,
      dead: false,
    });
  }
  return {
    ripples,
  };
}

/**
 * @param {number} dt
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function update(dt, game, world) {
  for (let ripple of world.ripples) {
    if (ripple.dead) {
      continue;
    }
    let dt = game.now - ripple.startTime;
    if (dt > MAX_RIPPLE_AGE) {
      ripple.dead = true;
    }
  }
}

/**
 * @param {DrawContextFixedGLText} ctx
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function render(ctx, game, world) {
  let now = game.now;
  for (let ripple of world.ripples) {
    if (ripple.dead) {
      continue;
    }
    drawRippleEffect(ctx, ripple.x, ripple.y, ripple.startTime, now, false);
  }
}

/**
 * @param {ReturnType<init>} rippleWorld
 * @param {number} x
 * @param {number} y
 * @param {number} now
 */
export function startRipple(rippleWorld, x, y, now) {
  let target = null;
  for (let ripple of rippleWorld.ripples) {
    if (ripple.dead) {
      target = ripple;
      break;
    }
  }
  if (target) {
    target.x = x;
    target.y = y;
    target.startTime = now;
    target.dead = false;
  }
  return target;
}

const MAX_RIPPLE_AGE = 8_000;
export function drawRippleEffect(ctx, x, y, startTime, now, loop = false) {
  let dt = now - startTime;
  if (loop) {
    // Loop back.
    dt %= MAX_RIPPLE_AGE;
  } else if (dt >= MAX_RIPPLE_AGE) {
    // Already too old :(
    return;
  }

  let dr = 1 - dt / MAX_RIPPLE_AGE;
  let ds = (1 - dr) * 0.9;
  let du = (1 - dr) * 0.5;

  ctx.setColor(0xffffff);
  ctx.setTranslation(x, y, 10);
  ctx.setScale(2 + ds * 2, 0.5 + ds);
  ctx.setOpacityFloat(dr);
  ctx.drawLineCircle();
  ctx.setScale(1 + du * 2, 0.1 + du);
  ctx.drawLineCircle();
  ctx.setOpacityFloat(1);
  ctx.resetTransform();
}
