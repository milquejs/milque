import {
  useEffect,
  dispatchEvent,
  usePreloadedSystemState,
} from './core/index.js';

/**
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 * @typedef {import('./SystemManager.js').System} System
 */

/**
 * Load in parallel.
 * 
 * @param {SystemContext} m
 * @param {() => Promise<?>} asyncLoader
 */
export function useLoad(m, asyncLoader) {
  const loadSystem = usePreloadedSystemState(m, LoadSystem);
  const system = m.current;
  if (loadSystem.loads.has(system)) {
    let loadState = loadSystem.loads.get(system);
    loadState.loaders.push(asyncLoader);
  } else {
    let loadState = createLoadState();
    loadState.loaders.push(asyncLoader);
    loadSystem.loads.set(system, loadState);
  }
}

/**
 * @param {SystemContext} m
 */
export function LoadSystem(m) {
  /** @type {Map<System, ReturnType<createLoadState>>} */
  const loads = new Map();
  useEffect(m, async () => {
    let promises = [];
    for (let s of loads.values()) {
      let loaders = s.loaders;
      let loaderPromises = loaders.map((loader) => loader());
      promises.push(...loaderPromises);
    }
    await Promise.all(promises);
    dispatchEvent(m, { type: 'loadEnd' });
  });
  return {
    loads,
  };
}

function createLoadState() {
  let result = {
    loaders: [],
  };
  return result;
}
