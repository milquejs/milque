import { EffectManager } from './EffectManager.js';

/**
 * @template T
 * @typedef {import('./SystemManager').System<T>} System<T>
 */
/** @typedef {import('./SystemManager').SystemManager} SystemManager */
/** @typedef {import('./EffectManager').EffectHandler} EffectHandler */
/** @typedef {import('./EffectManager').AfterEffectHandler} AfterEffectHandler */

/** @template T */
export class SystemContext {

    /**
     * @param {SystemManager} parent 
     * @param {string} name 
     * @param {System<T>} init
     */
    constructor(parent, name, init) {
        this.name = name;
        /** @type {T} */
        this.state = null;

        /** @protected */
        this.parent = parent;
        /** @protected */
        this.init = init;
        /** @protected */
        this.effects = new EffectManager();
        /** @protected */
        this.dead = false;
    }

    /**
     * @param {EffectHandler} callback
     */
    before(callback) {
        this.effects.attachEffect(callback);
    }

    /**
     * @param {AfterEffectHandler} callback
     */
    after(callback) {
        this.effects.attachAfterEffect(callback);
    }

    /**
     * @template E
     * @param {System<E>} system
     * @returns {E}
     */
    use(system) {
        return this.parent.getState(system);
    }

    /**
     * @template E
     * @param {import('./EventSource').EventSource<E>} src
     * @param {import('../EventSourceManager').EventCallback<E>} callback
     */
    on(src, callback) {
        src.addEventListener(callback);
        return this;
    }

    /**
     * @template E
     * @param {import('./EventSource').EventSource<E>} src
     * @param {import('../EventSourceManager').EventCallback<E>} callback
     */
    off(src, callback) {
        src.removeEventListener(callback);
        return this;
    }

    /**
     * @template E
     * @param {import('./EventSource').EventSource<E>} src
     * @param {import('../EventSourceManager').EventCallback<E>} callback
     */
    once(src, callback) {
        let wrapper = (attachment) => {
            this.off(src, wrapper);
            return callback(attachment);
        };
        return this.on(src, wrapper);
    }
}
