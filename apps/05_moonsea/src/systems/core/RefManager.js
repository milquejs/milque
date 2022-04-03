import { nextAvailableHookHandle } from '../SystemManager.js';
import { ManagerBase } from './ManagerBase.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @typedef {{ current: any }} Ref
 */

/**
 * @param {SystemContext} m
 * @returns {Ref}
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
    m.refs[handle] = ref;
    return ref;
}

export class RefManager extends ManagerBase {
    constructor() {
        super();
    }

    /** @override */
    onSystemContextCreate(m) {
        /** @type {Record<number, Ref>} */
        m.refs = {};
    }

    /** @override */
    onSystemTerminate(m) {
        m.refs = {};
    }
}
