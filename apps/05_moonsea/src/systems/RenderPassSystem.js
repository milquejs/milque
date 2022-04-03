import { whenSystemLoaded } from '../BaseHooks.js';
import { DisplayPortSystem, useDisplayPortFrame } from './DisplayPortSystem.js';
import { getSystemState, useEffect, useSystemState } from '../SystemManager.js';

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
    const renderPassSystem = useSystemState(m, RenderPassSystem);
    useEffect(m, () => {
        let render = renderPassSystem.current;
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
    console.log("LOADED");
    const listeners = [];
    useDisplayPortFrame(m, (e) => {
        let { deltaTime } = e.detail;
        for (let { callback } of listeners) {
            callback(deltaTime);
        }
    });
    return {
        listeners,
    };
}
