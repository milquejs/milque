import { useEvent, usePreloadedSystemState } from './core/index.js';
import {
  getSystemId,
  nextAvailableHookHandle,
  useSystemUpdate,
} from './SystemManager.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 */

function createUpdateListener() {
  return {
    init: [],
    loop: [],
    first: true,
  };
}

/**
 * @param {SystemContext} m
 * @param {() => void} callback
 */
export function useInit(m, callback) {
  let updateSystem = usePreloadedSystemState(m, UpdateSystem);
  let handle = nextAvailableHookHandle(m);
  let key = `${getSystemId(m, m.current)}.${handle}`;
  if (!(key in updateSystem.listeners)) {
    updateSystem.listeners[key] = createUpdateListener();
  }
  updateSystem.listeners[key].init.push(callback);
}

/**
 * @param {SystemContext} m
 * @param {(dt: number) => void} callback
 */
export function useUpdate(m, callback) {
  let updateSystem = usePreloadedSystemState(m, UpdateSystem);
  let handle = nextAvailableHookHandle(m);
  let key = `${getSystemId(m, m.current)}.${handle}`;
  if (!(key in updateSystem.listeners)) {
    updateSystem.listeners[key] = createUpdateListener();
  }
  updateSystem.listeners[key].loop.push(callback);
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export async function UpdateSystem(m) {
  const state = {
    listeners: {},
    loaded: false,
  };
  useEvent(m, 'loadEnd', () => {
    state.loaded = true;
  });
  let prev = -1;
  useSystemUpdate(m, () => {
    if (!state.loaded) {
      // Do not process until loaded.
      return;
    }
    let now = performance.now();
    if (prev < 0) {
      prev = now - 1;
    }
    let dt = now - prev;
    prev = now;
    for (let listener of Object.values(state.listeners)) {
      if (listener.first) {
        for (let init of listener.init) {
          init();
        }
        listener.first = false;
      } else {
        for (let loop of listener.loop) {
          loop(dt);
        }
      }
    }
  });
  return state;
}
