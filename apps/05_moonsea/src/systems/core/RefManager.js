import { CONTEXT_CREATE, TERMINATE } from '../SystemEvents.js';
import { nextAvailableHookHandle } from '../SystemManager.js';
import { ManagerBase } from './ManagerBase.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemManager} SystemManager
 */

/**
 * @typedef {{ current: any }} Ref
 */

export const REFS = Symbol('refs');

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
    m[REFS][handle] = ref;
    return ref;
}

export class RefManager extends ManagerBase {

    /** @param {SystemManager} systems */
    constructor(systems) {
        super(systems);

        /** @protected */
        this.onSystemContextCreate = this.onSystemContextCreate.bind(this);
        /** @protected */
        this.onSystemTerminate = this.onSystemTerminate.bind(this);

        systems.addSystemEventListener(CONTEXT_CREATE, this.onSystemContextCreate);
        systems.addSystemEventListener(TERMINATE, this.onSystemTerminate);
    }

    /** @protected */
    onSystemContextCreate(m) {
        /** @type {Record<number, Ref>} */
        m[REFS] = {};
    }

    /** @protected */
    onSystemTerminate(m) {
        m[REFS] = {};
    }
}
