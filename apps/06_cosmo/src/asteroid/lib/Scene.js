/** @typedef {(sceneDetail: Scene) => Promise<SceneTerminationCallback>} SceneInitializationCallback */
/** @typedef {(sceneDetail: Scene) => Promise<void>} SceneTerminationCallback */

// TODO: A scene is a preset configuration of systems.

export class Scene {
    /**
     * @param {SceneInitializationCallback} callback 
     * @param {object} [opts]
     */
    constructor(callback, opts = undefined) {
        const {} = opts || {};

        this.context = {};
        this.detail = {};

        /** @protected */
        this.effects = new EffectManager();

        /** @protected */
        this.callback = callback;
        /** @protected */
        this.afterCallback = null;

        /**
         * @protected
         * @type {Record<string, Array<Function>>}
         */
        this.listeners = {};

        this.initialize = this.initialize.bind(this);
        this.terminate = this.terminate.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.once = this.once.bind(this);
        this.dispatchEvent = this.dispatchEvent.bind(this);
    }

    async initialize(opts = {}) {
        this.afterCallback = await this.callback.call(this.context, opts);
        await this.effects.initialize();
    }

    async terminate() {
        await this.effects.terminate();
        await this.afterCallback.call(this.context);
    }

    use(callback) {
        this.effects.attachEffect(callback);
    }

    on(event, callback) {
        let events;
        if (event in this.listeners) {
            events = this.listeners[event];
        } else {
            events = [];
            this.listeners[event] = events;
        }
        events.push(callback);
        return callback;
    }

    off(event, callback) {
        if (!(event in this.listeners)) {
            return null;
        }
        let events = this.listeners[event];
        let i = events.indexOf(callback);
        if (i < 0) {
            return null;
        }
        let [ deleted ] = events.splice(i, 1);
        return deleted;
    }

    once(event, callback) {
        const wrapper = (attachment) => {
            this.off(event, wrapper);
            return callback(attachment);
        };
        return this.on(event, wrapper);
    }

    async dispatchEvent(event, attachment = undefined) {
        if (!(event in this.listeners)) {
            return [];
        }
        return await Promise.all(this.listeners[event].map(callback => callback(attachment)));
    }
}

class EffectManager {

    constructor() {
        this.before = [];
        this.after = [];
        this.initialized = false;
    }

    attachEffect(effectHandler) {
        if (this.initialized) {
            throw new Error('Cannot add effect to already initialized scene.');
        }
        this.before.push(effectHandler);
        return this;
    }

    async initialize() {
        if (this.initialized) {
            throw new Error('Cannot initialize already initialized scene.');
        }
        this.initialized = true;
        this.after = await Promise.all(this.before.map(effect => effect && effect()));
    }

    async terminate() {
        if (!this.initialized) {
            throw new Error('Cannot terminate un-initialized scene.');
        }
        this.initialized = false;
        await Promise.all(this.after.map(effect => effect && effect()));
    }
}
