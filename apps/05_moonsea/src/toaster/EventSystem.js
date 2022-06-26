import { EventManager } from './EventManager.js';
import { useEffect } from './SystemManager.js';

/**
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 */

/** @param {SystemContext} m */
export function useEventController(m) {
    /** @type {EventManager} */
    let events = m.global.events;
    return [events.flushEvents];
}

/** @param {SystemContext} m */
export function useEventDispatcher(m) {
    /** @type {EventManager} */
    let events = m.global.events;
    return [events.dispatchEvent];
}

/** @param {SystemContext} m */
export function useEvent(m, eventType, callback) {
    useEffect(m, () => {
        /** @type {EventManager} */
        let events = m.global.events;
        events.addEventListener(eventType, callback);
        return () => {
            events.removeEventListener(eventType, callback);
        };
    });
}

/** @param {SystemContext} m */
export function EventSystem(m) {
    m.global.events = new EventManager();
}
