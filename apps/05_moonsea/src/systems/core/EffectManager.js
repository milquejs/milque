import { nextAvailableHookHandle } from '../SystemManager.js';
import { ManagerBase } from './ManagerBase.js';
import { CONTEXT_CREATE, TERMINATE, UPDATE } from '../SystemEvents.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemManager} SystemManager
 */

/**
 * @typedef {() => Function|void|Promise<Function|void>} EffectHandler
 */

export const BEFORE_EFFECTS = Symbol('beforeEffects');
export const AFTER_EFFECTS = Symbol('afterEffects');

/**
 * @param {SystemContext} m
 * @param {EffectHandler} handler
 */
export function useEffect(m, handler) {
    let handle = nextAvailableHookHandle(m);
    m[BEFORE_EFFECTS][handle] = handler;
}

export class EffectManager extends ManagerBase {

    /** @param {SystemManager} systems */
    constructor(systems) {
        super(systems);

        /** @protected */
        this.onSystemContextCreate = this.onSystemContextCreate.bind(this);
        /** @protected */
        this.onSystemTerminate = this.onSystemTerminate.bind(this);
        /** @protected */
        this.onSystemUpdate = this.onSystemUpdate.bind(this);

        systems.addSystemEventListener(CONTEXT_CREATE, this.onSystemContextCreate);
        systems.addSystemEventListener(TERMINATE, this.onSystemTerminate);
        systems.addSystemEventListener(UPDATE, this.onSystemUpdate);
    }

    /**
     * @protected
     * @param {SystemContext} m 
     */
    onSystemContextCreate(m) {
        /** @type {Record<number, EffectHandler>} */
        m[BEFORE_EFFECTS] = {};
        /** @type {Record<number, Function>} */
        m[AFTER_EFFECTS] = {};
    }

    /**
     * @protected
     * @param {SystemContext} m 
     */
    onSystemTerminate(m) {
        let prevAfterEffects = m[AFTER_EFFECTS];
        m[AFTER_EFFECTS] = {};
        m[BEFORE_EFFECTS] = {};
        for (let afterEffect of Object.values(prevAfterEffects)) {
            afterEffect();
        }
    }

    /**
     * @protected
     * @param {SystemContext} m 
     */
    onSystemUpdate(m) {
        let prevBeforeEffects = m[BEFORE_EFFECTS];
        let nextAfterEffects = m[AFTER_EFFECTS];
        m[BEFORE_EFFECTS] = {};

        for (let key of Object.keys(prevBeforeEffects)) {
            let beforeEffect = prevBeforeEffects[key];
            try {
                let result = beforeEffect();
                if (typeof result === 'function') {
                    nextAfterEffects[key] = result;
                } else if (result && result instanceof Promise) {
                    result.then(value => {
                        if (typeof value === 'function') {
                            nextAfterEffects[key] = value;
                        } else {
                            // Ignore anything beyond the second value.
                        }
                    }).catch(e => {
                        this.onError(m, e);
                    });
                } else {
                    // Ignore anything of unrecognized type.
                }
            } catch (e) {
                this.onError(m, e);
            }
        }
    }

    /**
     * @protected
     * @param {SystemContext} m 
     * @param {Error} e
     */
     onError(m, e) {
        console.error(e);
    }
}
