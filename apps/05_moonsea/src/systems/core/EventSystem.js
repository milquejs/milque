import { useEffect } from './EffectManager.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemEvent} SystemEvent
 */

/**
 * @param {SystemContext} m
 * @param {string} eventType
 * @param {Function} callback
 */
export function useEvent(m, eventType, callback) {
  useEffect(m, () => {
    let manager = m.__manager__;
    manager.addEventListener(eventType, callback);
    return () => {
      manager.removeEventListener(eventType, callback);
    };
  });
}

/**
 * @param {SystemContext} m
 * @param {SystemEvent} event
 */
export function dispatchEvent(m, event) {
  let manager = m.__manager__;
  manager.dispatchEvent(event);
}
