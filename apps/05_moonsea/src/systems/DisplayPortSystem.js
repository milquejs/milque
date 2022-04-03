import { whenElementLoaded } from '../BaseHooks.js';
import {
  useEffect,
  useEvent,
  usePreloadedSystemState,
} from '../SystemManager.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @param {SystemContext} m
 */
export function useDisplayPort(m) {
  return usePreloadedSystemState(m, DisplayPortSystem).element;
}

/**
 * @param {SystemContext} m
 * @param {(e: CustomEvent) => void} callback
 */
export function useDisplayPortFrame(m, callback) {
  const displayPortSystem = usePreloadedSystemState(m, DisplayPortSystem);
  useEffect(m, () => {
    let wrapper = (e) => {
      if (!displayPortSystem.loaded) {
        return;
      }
      try {
        callback(e);
      } catch (e) {
        console.error(e);
      }
    };
    const display = displayPortSystem.element;
    display.addEventListener('frame', wrapper);
    return () => {
      display.removeEventListener('frame', wrapper);
    };
  });
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export async function DisplayPortSystem(m, selector = 'display-port') {
  const element = /** @type {DisplayPort} */ (
    await whenElementLoaded(m, selector)
  );
  const state = {
    element,
    loaded: false,
  };
  useEvent(m, 'loadEnd', () => {
    state.loaded = true;
  });
  return state;
}
