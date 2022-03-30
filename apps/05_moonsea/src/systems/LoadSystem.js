import { dispatchEvent, useEffect, getSystemContext } from '../SystemManager.js';

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
    let n = getSystemContext(m, LoadSystem);
    let state = getSystemLoadState(n, m.current);
    state.loaders.push(asyncLoader);
}

/**
 * @param {SystemContext} m 
 * @param {System} system
 * @param {() => Promise<?>} asyncLoader 
 */
export function useLoadAfterSystem(m, system, asyncLoader) {
    // Only run after another system completes loading (if it has any).
    let n = getSystemContext(m, LoadSystem);
    let state = getSystemLoadState(n, system);
    state.postLoaders.push(asyncLoader);
}

/**
 * @param {SystemContext} m
 */
export function LoadSystem(m) {
    m.loads = new Map();
    useEffect(m, async () => {
        let promises = [];
        for(let state of m.loads.values()) {
            let loaders = state.loaders;
            let postLoaders = state.postLoaders;
            let loaderPromises = loaders.map(loader => loader());
            let postPromise = Promise.all(loaderPromises)
                .then(() => Promise.all(postLoaders.map(loader => loader())));
            promises.push(...loaderPromises);
            promises.push(postPromise);
        }
        await Promise.all(promises);
        dispatchEvent(m, { type: 'loadEnd' });
    });
    return m;
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
    if (m.loads.has(system)) {
        return m.loads.get(system);
    } else {
        let result = createSystemLoadState();
        m.loads.set(system, result);
        return result;
    }
}
