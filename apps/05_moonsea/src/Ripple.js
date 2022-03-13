import { Random } from '@milque/random';
import { bindRefs, loadRefs } from './loader/AssetRef.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('./main.js').Game} Game
 */

export const ASSETS = {
};

/** @param {Game} game */
export async function load(game) {
  bindRefs(game.assets, Object.values(ASSETS));
  await loadRefs(Object.values(ASSETS));
}

/** @param {Game} game */
export function init(game) {
  let ripples = [];
  for (let i = 0; i < 10; ++i) {
    ripples.push({
      x: 0,
      y: 0,
      age: 0,
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
        if (ripple.age > 0) {
            ripple.age -= dt;
        }
    }
}

/**
 * @param {DrawContextFixedGLText} ctx
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function render(ctx, game, world) {
  for (let ripple of world.ripples) {
    if (ripple.age <= 0) continue;
    drawRipple(ctx, ripple.x, ripple.y, ripple.age);
  }
}

// TODO: Would be better if the ripple only relies on
//  start time, and whether to "bounce" infinitely

export function drawRipple(ctx, x, y, age) {
    if (age <= 0) return;
    ctx.setColor(0xffffff);
    let dr = age / 10_000;
    ctx.setTranslation(x, y, 10);
    let ds = (1 - dr) * 0.9;
    ctx.setScale(2 + ds * 2, 0.5 + ds);
    ctx.setOpacityFloat(dr);
    ctx.drawLineCircle();
    let dt = (1 - dr) * 0.5;
    ctx.setScale(1 + dt * 2, 0.1 + dt);
    ctx.drawLineCircle();
    ctx.setOpacityFloat(1);
    ctx.resetTransform();
}

/**
 * @param {ReturnType<init>} rippleWorld 
 * @param {number} x 
 * @param {number} y 
 */
export function startRipple(rippleWorld, x, y) {
    let target = null;
    for (let ripple of rippleWorld.ripples) {
        if (ripple.age <= 0) {
            target = ripple;
            break;
        }
    }
    if (target) {
        target.x = x;
        target.y = y;
        target.age = Random.range(5_000, 10_000);
    }
    return target;
}
