import { dispatchEvent, getSystemState, useEffect } from '../SystemManager.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').System} System
 */

/**
 * @param {SystemContext} m 
 * @param {() => Promise<?>} asyncLoader 
 */
export function useLoad(m, asyncLoader) {
    // Always run in parallel.
    let state = getSystemLoadState(m, m.current);
    state.loaders.push(asyncLoader);
}

/**
 * @param {SystemContext} m 
 * @param {System} system
 * @param {() => Promise<?>} asyncLoader 
 */
export function useLoadAfterSystem(m, system, asyncLoader) {
    // Only run after another system completes loading (if it has any).
    let n = getSystemState(m, LoadSystem);
    let state = getSystemLoadState(m, system);
    state.postLoaders.push(asyncLoader);
}

/**
 * @param {SystemContext} m
 */
export function LoadSystem(m) {
    const loads = new Map();
    useEffect(m, async () => {
        let promises = [];
        for(let s of loads.values()) {
            let loaders = s.loaders;
            let postLoaders = s.postLoaders;
            let loaderPromises = loaders.map(loader => loader());
            let postPromise = Promise.all(loaderPromises)
                .then(() => Promise.all(postLoaders.map(loader => loader())));
            promises.push(...loaderPromises);
            promises.push(postPromise);
        }
        await Promise.all(promises);
        dispatchEvent(m, { type: 'loadEnd' });
    });
    return {
        loads
    };
}

function createSystemLoadState() {
    let result = {
        loaders: [],
        postLoaders: [],
    };
    return result;
}

/** @returns {ReturnType<createSystemLoadState>} */
function getSystemLoadState(m, system) {
    let { loads } = getSystemState(m, LoadSystem);
    if (loads.has(system)) {
        return loads.get(system);
    } else {
        let result = createSystemLoadState();
        loads.set(system, result);
        return result;
    }
}
