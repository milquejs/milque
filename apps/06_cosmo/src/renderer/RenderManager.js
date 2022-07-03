import { ManagerContext } from '../Manager.js';
import { DrawContextFixedGLText } from './drawcontext/DrawContextFixedGLText.js';

/** @typedef {import('@milque/display').DisplayPort} DisplayPort */

/**
 * @typedef RenderManager
 * @property {DisplayPort} display
 * @property {DrawContextFixedGLText} ctx
 */

export const RenderManagerContext = new ManagerContext(() => {
    /** @type {DisplayPort} */
    const display = document.querySelector('display-port');
    const gl = /** @type {WebGLRenderingContext} */ (display.getContext('webgl'));
    const ctx = new DrawContextFixedGLText(gl);
    return {
        display,
        ctx,
    };
});

export function useRenderManager(m) {
    return RenderManagerContext.resolve(m);
}
