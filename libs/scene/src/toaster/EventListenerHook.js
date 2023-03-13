import { useEffect } from './EffectHook';

/**
 * @template M
 * @template {keyof WindowEventHandlersEventMap} K
 * @param {M} m 
 * @param {keyof WindowEventMap} event
 * @param {(this: WindowEventHandlers, ev: WindowEventHandlersEventMap[K]) => any} listener
 */
export function useWindowEventListener(m, event, listener) {
    useEffect(m, () => {
        const root = window;
        root.addEventListener(event, listener);
        return () => {
            root.removeEventListener(event, listener);
        };
    });
}

/**
 * @template M
 * @template {keyof DocumentAndElementEventHandlersEventMap} K
 * @param {M} m 
 * @param {keyof DocumentEventMap} event
 * @param {(this: DocumentAndElementEventHandlers, ev: DocumentAndElementEventHandlersEventMap[K]) => any} listener
 */
export function useDocumentEventListener(m, event, listener) {
    useEffect(m, () => {
        const root = window.document;
        root.addEventListener(event, listener);
        return () => {
            root.removeEventListener(event, listener);
        };
    });
}

/**
 * @template M
 * @template {keyof DocumentAndElementEventHandlersEventMap} K
 * @param {M} m 
 * @param {HTMLElement} element
 * @param {keyof ElementEventMap} event
 * @param {(this: DocumentAndElementEventHandlers, ev: DocumentAndElementEventHandlersEventMap[K]) => any} listener
 */
export function useHTMLElementEventListener(m, element, event, listener) {
    useEffect(m, () => {
        element.addEventListener(event, listener);
        return () => {
            element.removeEventListener(event, listener);
        };
    });
}
