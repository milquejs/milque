import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import * as Background from './Background.js';
import * as DialogueBox from './DialogueBox.js';
import * as TaxiMeter from './TaxiMeter.js';

/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

window.addEventListener('DOMContentLoaded', main);
async function main() {
  /** @type {import('@milque/display').DisplayPort}  */
  const display = document.querySelector('#display');
  const ctx = display.canvas.getContext('2d');
  const world = {
    display,
    ctx,
    frames: 0,
  };

  Background.load(world);
  DialogueBox.load(world);
  TaxiMeter.load(world);

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    const { deltaTime } = e.detail;
    const dt = deltaTime / 60;
    update(dt, world);
    render(ctx, world);
    world.frames += 1;
  });
}

function update(dt, world) {
  Background.update(dt, world);
  DialogueBox.update(dt, world);
  TaxiMeter.update(dt, world);
}

function render(ctx, world) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, world.display.width, world.display.height);

  Background.render(ctx, world);
  DialogueBox.render(ctx, world);
  TaxiMeter.render(ctx, world);
}
