import { nextAvailableHookHandle } from '../SystemManager.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @param {SystemContext} m
 * @returns {{ current: any }}
 */
export function useRef(m) {
    const handle = nextAvailableHookHandle(m);
    const ref = {
        __ready: false,
        __current: null,
        get current() {
            if (!this.__ready) {
                throw new Error(
                    'Ref is not yet ready. Try awaiting on owning system before access.'
                );
            }
            return this.__current;
        },
        set current(value) {
            this.__ready = true;
            this.__current = value;
        },
    };
    m.__refs__[handle] = ref;
    return ref;
}
