import { useEffect } from './systems/core/index.js';

/**
 * @typedef {import('./systems/SystemManager.js').SystemContext} SystemContext
 * @typedef {import('./systems/SystemManager.js').System} System
 */

/**
 * @param {SystemContext} m
 * @param {System} system
 * @param {string} [name]
 */
export function assertSystemLoaded(m, system, name = system.name) {
  if (!m.__manager__.systems.has(name)) {
    throw new Error(`System '${name}' is not yet loaded!`);
  }
}

/**
 * @param {SystemContext} m
 * @param {System} system
 * @param {string} [name]
 */
export async function whenSystemLoaded(m, system, name = system.name) {
  return await m.__manager__.getSystemContext(system, name).__ready__.then();
}

/**
 * @param {SystemContext} m
 * @param {string} elementSelector
 * @returns {Promise<Element>}
 */
export async function whenElementLoaded(m, elementSelector) {
  return new Promise((resolve, _) => {
    const animation = () => {
      let result = document.querySelector(elementSelector);
      if (result) {
        resolve(result);
      } else {
        // Continue to wait and poll for the selector...
        window.requestAnimationFrame(animation);
      }
    };
    const callback = () => {
      window.removeEventListener('DOMContentLoaded', callback);
      let result = document.querySelector(elementSelector);
      if (result) {
        resolve(result);
      } else {
        window.requestAnimationFrame(animation);
      }
    };
    if (document.readyState !== 'loading') {
      // No wait necessary.
      callback();
    } else {
      window.addEventListener('DOMContentLoaded', callback);
    }
  });
}

/**
 * @param {SystemContext} m
 * @param {(now: number) => void} callback
 */
export function useAnimationFrame(m, callback) {
  useEffect(m, () => {
    let handle = null;
    let wrapper = (now) => {
      if (!handle) {
        return;
      }
      callback(now);
      handle = window.requestAnimationFrame(wrapper);
    };
    handle = window.requestAnimationFrame(wrapper);
    return () => {
      window.cancelAnimationFrame(handle);
      handle = null;
    };
  });
}

/**
 * @param {SystemContext} m
 * @param {number} intervalMillis
 * @param {() => void} callback
 */
export function useInterval(m, intervalMillis, callback) {
  useEffect(m, () => {
    let handle = setInterval(callback, intervalMillis);
    return () => {
      clearInterval(handle);
    };
  });
}

/**
 * @param {SystemContext} m
 * @param {() => void} callback
 */
export function useDOMContentLoaded(m, callback) {
  useEffect(m, () => {
    if (document.readyState !== 'loading') {
      callback();
      // No cleanup necessary.
      return;
    } else {
      window.addEventListener('DOMContentLoaded', callback);
      return () => {
        window.removeEventListener('DOMContentLoaded', callback);
      };
    }
  });
}
