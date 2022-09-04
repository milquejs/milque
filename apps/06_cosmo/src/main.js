import '@milque/display';
import './error.js';
import './asteroids/Blocks.js';

import { loadAssets } from './assets.js';
import { loadInputs } from './inputs.js';
import { useRenderManager } from './renderer/RenderManager.js';
import { AsteroidSystem } from './asteroids/AsteroidSystem.js';
import { LaneSystem } from './lanes/LaneSystem.js';
import { callListeners } from './core/Listenable.js';
import { mat4 } from 'gl-matrix';


/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 */

window.addEventListener('DOMContentLoaded', main);
async function main() {
  const m = {
    listeners: {
      update: [],
      draw: [],
    },
  };
  await loadAssets();
  const inputs = await loadInputs();
  const { display, ctx } = useRenderManager(m);
  
  //AsteroidSystem(m);
  LaneSystem(m);

  // Init
  callListeners(m, 'init');

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    const { now, deltaTime } = e.detail;

    // Update
    callListeners(m, 'update', deltaTime);

    // Input Update
    inputs.poll(now);
    callListeners(m, 'input');

    // Render
    ctx.resize();
    ctx.reset();

    // ctx.setTranslation(display.width / 2, display.height / 2);
    // mat4.fromTranslation(ctx.getViewMatrix(), [display.width / 2, display.height / 2, 0]);

    // World
    ctx.pushTransform();
    {
      callListeners(m, 'render', ctx);
    }
    ctx.popTransform();
  });
}
