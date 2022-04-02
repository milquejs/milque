import { whenElementLoaded } from '../BaseHooks.js';
import { getSystemState, useEffect, useEvent } from '../SystemManager.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @param {SystemContext} m
 */
export function useDisplayPort(m) {
    return getSystemState(m, DisplayPortSystem).element;
}

/**
 * @param {SystemContext} m
 * @param {(e: CustomEvent) => void} callback
 */
export function useDisplayPortFrame(m, callback) {
    const display = useDisplayPort(m);
    useEffect(m, () => {
        let wrapper = (e) => {
            let { loaded } = getSystemState(m, DisplayPortSystem);
            if (!loaded) {
                return;
            }
            try {
                callback(e);
            } catch (e) {
                console.error(e);
            }
        };
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
    const element = /** @type {DisplayPort} */ (await whenElementLoaded(m, selector));
    const state = {
        element,
        loaded: false,
    };
    useEvent(m, 'loadEnd', () => {
        state.loaded = true;
    });
    return state;
}
