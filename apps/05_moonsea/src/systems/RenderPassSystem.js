import { whenSystemLoaded } from '../BaseHooks.js';
import { DisplayPortSystem, useDisplayPortFrame } from './DisplayPortSystem.js';
import { getSystemContext, useEffect } from '../SystemManager.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @param {SystemContext} m 
 * @param {number} renderPass 
 * @param {(dt: number) => void} callback 
 */
export function useRenderPass(m, renderPass, callback) {
    useEffect(m, () => {
        let render = getSystemContext(m, RenderPassSystem);
        let listener = createRenderPassListener(renderPass, callback);
        render.listeners.push(listener);
        render.listeners.sort(compareRenderPassListener);
        return () => {
            let i = render.listeners.indexOf(listener);
            if (i >= 0) {
                render.listeners.splice(i, 1);
            }
        };
    });
}

/**
 * @param {number} renderPass 
 * @param {(dt: number) => void} callback
 */
function createRenderPassListener(renderPass, callback) {
    return {
        index: renderPass,
        callback,
    };
}

function compareRenderPassListener(a, b) {
    return a.index - b.index;
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export async function RenderPassSystem(m) {
    await whenSystemLoaded(m, DisplayPortSystem);
    m.listeners = [];
    useDisplayPortFrame(m, (e) => {
        let { deltaTime } = e.detail;
        for (let { callback } of m.listeners) {
            callback(deltaTime);
        }
    });
    return /** @type {T&{ listeners: Array<ReturnType<createRenderPassListener>> }} */ (m);
}
