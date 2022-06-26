import { EventManager } from './EventManager.js';
import { useEffect } from './SystemManager.js';

/**
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 */

/** @param {SystemContext} m */
export function useRenderEventController(m) {
    /** @type {EventManager} */
    let events = m.global.renderEvents;
    return [events.flushEvents];
}

/** @param {SystemContext} m */
export function useRenderEventDispatcher(m) {
    /** @type {EventManager} */
    let events = m.global.renderEvents;
    return [events.dispatchEvent];
}

/** @param {SystemContext} m */
export function useRenderEvent(m, eventType, callback) {
    useEffect(m, () => {
        /** @type {EventManager} */
        let events = m.global.renderEvents;
        events.addEventListener(eventType, callback);
        return () => {
            events.removeEventListener(eventType, callback);
        };
    });
}

/** @param {SystemContext} m */
export function RenderEventSystem(m) {
    m.global.renderEvents = new EventManager();
}
