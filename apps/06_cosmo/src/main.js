import '@milque/display';
import './error.js';
import './Blocks.js';

import { loadAssets } from './assets.js';
import { loadInputs } from './inputs.js';
import { useRenderManager } from './renderer/RenderManager.js';
import { ChunkSystem } from './systems/ChunkSystem.js';
import { CursorSystem } from './systems/CursorSystem.js';
import { callListeners } from './core/Listenable.js';


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
  
  ChunkSystem(m);
  CursorSystem(m);

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

    ctx.setTranslation(display.width / 2, display.height / 2);

    // World
    ctx.pushTransform();
    {
      callListeners(m, 'render', ctx);
    }
    ctx.popTransform();
  });
}
