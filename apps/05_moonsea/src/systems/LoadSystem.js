import { dispatchEvent, useEffect, usePreloadedSystemState } from '../SystemManager.js';

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
    let loadSystem = usePreloadedSystemState(m, LoadSystem);
    const system = m.current;
    let load;
    if (loadSystem.loads.has(system)) {
        load = loadSystem.loads.get(system);
    } else {
        load = createSystemLoadState();
        loadSystem.loads.set(system, load);
    }
    load.loaders.push(asyncLoader);
}

/**
 * @param {SystemContext} m
 */
export function LoadSystem(m) {
    /** @type {Map<System, ReturnType<createSystemLoadState>>} */
    const loads = new Map();
    useEffect(m, async () => {
        let promises = [];
        for(let s of loads.values()) {
            let loaders = s.loaders;
            let loaderPromises = loaders.map(loader => loader());
            promises.push(...loaderPromises);
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
    };
    return result;
}
