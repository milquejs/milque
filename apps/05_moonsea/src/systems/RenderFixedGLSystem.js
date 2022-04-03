import { whenSystemLoaded } from '../BaseHooks.js';
import { DisplayPortSystem, useDisplayPort } from './DisplayPortSystem.js';
import { DrawContextFixedGLText } from '../renderer/drawcontext/DrawContextFixedGLText.js';
import { RenderPassSystem } from './RenderPassSystem.js';
import { usePreloadedSystemState } from './core/index.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 */

export function useFixedGLRenderer(m) {
  return usePreloadedSystemState(m, RenderFixedGLSystem).renderer;
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export async function RenderFixedGLSystem(m) {
  await whenSystemLoaded(m, RenderPassSystem);
  await whenSystemLoaded(m, DisplayPortSystem);
  const display = useDisplayPort(m);
  const canvas = display.canvas;
  const renderer = new DrawContextFixedGLText(canvas.getContext('webgl'));
  return {
    renderer,
  };
}
