import { nextAvailableHookHandle } from '../SystemManager.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemHandler} SystemHandler
 */

/**
 * @param {SystemContext} m
 * @param {SystemHandler} handler
 */
export function useEffect(m, handler) {
    let handle = nextAvailableHookHandle(m);
    m.__manager__.systems.get(m.name).beforeEffects[handle] = handler;
}

export class EffectManager {
    constructor(systems) {
        this.systems = systems;

        this.onSystemContextCreate = this.onSystemContextCreate.bind(this);
        this.onSystemInitialize = this.onSystemInitialize.bind(this);
        this.onSystemTerminate = this.onSystemTerminate.bind(this);
        this.onSystemUpdate = this.onSystemUpdate.bind(this);
        this.onError = this.onError.bind(this);
    }

    /**
     * @param {SystemContext} m 
     */
    onSystemContextCreate(m) {
        /** @type {Record<number, Function>} */
        m.beforeEffects = {};
        /** @type {Record<number, Function>} */
        m.afterEffects = {};
    }

    /**
     * @param {SystemContext} m 
     */
    onSystemInitialize(m) {
    }

    /**
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
     * @param {SystemContext} m 
     * @param {Error} e
     */
     onError(m, e) {
        console.error(e);
    }
}

/**
 * @param {SystemContext} m
 * @returns {Record<number, Function>}
 */
function getAfterEffects(m) {
    return m.afterEffects;
}

/**
 * @param {SystemContext} m
 * @returns {Record<number, Function>}
 */
function getBeforeEffects(m) {
    return m.beforeEffects;
}
