import { useRef } from './index.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemLike} SystemLike
 */

/**
 * @template {SystemLike} T
 * @param {SystemContext} m
 * @param {T} system
 * @param {string} [name]
 * @returns {{ current: Awaited<ReturnType<T>> }}
 */
export function useSystemState(m, system, name = system.name) {
    if (!m || !m.__manager__.systems.has(name)) {
        throw new Error('System not yet registered. Try preloading the system.');
    }
    const ref = useRef(m);
    m.__manager__.getSystemContext(system, name).__ready__.then((state) => {
        ref.current = state;
    });
    return ref;
}

/**
 * @template {SystemLike} T
 * @param {SystemContext} m
 * @param {T} system
 * @param {string} [name]
 * @returns {Awaited<ReturnType<T>>}
 */
export function usePreloadedSystemState(m, system, name = system.name) {
    if (!m || !m.__manager__.systems.has(name)) {
        throw new Error(
            'System not yet loaded. Try await on system before access.'
        );
    }
    return m.__manager__.getSystemContext(system, name).state;
}
