import { nextAvailableHookHandle } from '../SystemManager.js';
import { ManagerBase } from './ManagerBase.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

/**
 * @typedef {() => Function|void|Promise<Function|void>} EffectHandler
 */

/**
 * @param {SystemContext} m
 * @param {EffectHandler} handler
 */
export function useEffect(m, handler) {
    let handle = nextAvailableHookHandle(m);
    m.beforeEffects[handle] = handler;
}

export class EffectManager extends ManagerBase {

    /**
     * @override
     * @param {SystemContext} m 
     */
    onSystemContextCreate(m) {
        /** @type {Record<number, EffectHandler>} */
        m.beforeEffects = {};
        /** @type {Record<number, Function>} */
        m.afterEffects = {};
    }

    /**
     * @override
     * @param {SystemContext} m 
     */
    onSystemTerminate(m) {
        let prevAfterEffects = m.afterEffects;
        m.afterEffects = {};
        m.beforeEffects = {};
        for (let afterEffect of Object.values(prevAfterEffects)) {
            afterEffect();
        }
    }

    /**
     * @override
     * @param {SystemContext} m 
     */
    onSystemUpdate(m) {
        let prevBeforeEffects = m.beforeEffects;
        let nextAfterEffects = m.afterEffects;
        m.beforeEffects = {};

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
