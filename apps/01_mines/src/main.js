import '@milque/display';
import '@milque/input';
import './error.js';

import { AssetManager, cacheAssetPackAsRaw } from '@milque/asset';
import { InputPort } from '@milque/input';

import * as MainScene from './MainScene.js';
import * as MainRender from './MainRender.js';

import { attach } from './MinesControls.js';
import { DisplayPort } from '@milque/display';

DisplayPort.define();

/**
 * @typedef {import('@milque/input').InputContext} InputContext
 */

/*

What is good in Minesweeper?
- Inherant scaling difficulty as the game progresses (less tiles)
- Clean ruleset
    - Deductive reasoning and arithmetic (best forms of logic for play)
- Replay value (randomized maps)
- Pure form

deterministic, mostly.
High risk / High reward? (sadly, only high risk)

What is bad in minesweeper?
- Doesn't have a progression Curve.
- Don't have low risk options.
- DONT LIKE TIMED TASKS!!!
    - Hard ceiling
- CANNOT BE IMPOSSIBLE TO WIN

Maybe:
// Some of the bombs are treasures.
// Either chance it, use a life, or use a scanner.

*/

document.addEventListener('DOMContentLoaded', main);
async function main() {
  /** @type {DisplayPort} */
  const display = document.querySelector('display-port');
  const ctx = display.canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const inputs = /** @type {InputPort} */ (document.querySelector('input-port')).getContext('axisbutton');
  attach(inputs);

  const assets = new AssetManager();
  await cacheAssetPackAsRaw(assets, 'res.pack');

  const world = { display };
  await MainRender.load.call(world, assets);
  MainScene.onStart.call(world);

  display.addEventListener('frame', (e) => {
    const dt = e.detail.deltaTime / 1000;

    MainScene.onPreUpdate.call(world, dt);
    inputs.poll();
    MainScene.onUpdate.call(world, dt);

    const view = {
      context: ctx,
      width: display.width,
      height: display.height,
    };
    ctx.clearRect(0, 0, view.width, view.height);
    MainRender.onRender.call(world, view, world);
  });
}
