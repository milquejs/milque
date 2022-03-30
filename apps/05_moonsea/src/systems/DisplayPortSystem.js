import { whenElementLoaded } from '../BaseHooks.js';
import { getSystemContext, useEffect, useEvent } from '../SystemManager.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @param {SystemContext} m
 */
export function useDisplayPort(m) {
    return getSystemContext(m, DisplayPortSystem).element;
}

/**
 * @param {SystemContext} m
 * @param {(e: CustomEvent) => void} callback
 */
export function useDisplayPortFrame(m, callback) {
    const display = useDisplayPort(m);
    useEffect(m, () => {
        let wrapper = (e) => {
            let n = getSystemContext(m, DisplayPortSystem);
            if (!n.loaded) {
                return;
            }
            callback(e);
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
    let element = await whenElementLoaded(m, selector);
    m.element = element;
    m.loaded = false;
    useEvent(m, 'loadEnd', () => {
        m.loaded = true;
    });
    return /** @type {T&{ element: DisplayPort }} */ (m);
}
