import { EffectManager } from './EffectManager.js';

/**
 * @template T
 * @typedef {import('./SystemManager').System<T>} System<T>
 */
/**
 * @template T
 * @typedef {System<T>} SystemInitCallback<T>
 */
/**
 * @template T
 * @typedef {(state: T) => void} SystemDeadCallback<T>
 */
/** @typedef {import('./SystemManager').SystemManager} SystemManager */
/** @typedef {import('./EffectManager').EffectHandler} EffectHandler */
/** @typedef {import('./EffectManager').AfterEffectHandler} AfterEffectHandler */

/** @template T */
export class SystemContext {

    /** @param {SystemContext<?>} ctx */
    static async initializeContext(ctx) {
        try {
            ctx.state = await ctx.initCallback.call({}, ctx);
        } catch (e) {
            throw new Error(`Failed to initialize system context '${ctx.name}' with dependencies [${ctx.dependencies.map(dep => dep.name).join(', ')}].`, { cause: e });
        }
        return ctx.dependencies;
    }

    /** @param {SystemContext<?>} ctx */
    static async initializeEffects(ctx) {
        await ctx.effects.startEffects();
    }

    /** @param {SystemContext<?>} ctx */
    static markDead(ctx) {
        ctx.dead = true;
    }

    /** @param {SystemContext<?>} ctx */
    static async terminateEffects(ctx) {
        await ctx.effects.stopEffects();
    }

    /** @param {SystemContext<?>} ctx */
    static async terminateContext(ctx) {
        await ctx.deadCallback(ctx.state);
        ctx.state = null;
    }

    /**
     * @param {SystemManager} parent 
     * @param {string} name 
     * @param {SystemInitCallback<T>} initCallback
     * @param {SystemDeadCallback<T>} deadCallback
     */
    constructor(parent, name, initCallback, deadCallback) {
        this.name = name;
        /** @type {T} */
        this.state = null;

        /** @protected */
        this.parent = parent;
        /** @protected */
        this.effects = new EffectManager();
        /** @protected */
        this.dead = false;

        /** @protected */
        this.dependencies = [];

        /** @private */
        this.initCallback = initCallback;
        /** @private */
        this.deadCallback = deadCallback;
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
        if (this.effects.started) {
            throw new Error('use() must be called during initialization only.');
        }
        if (this.dependencies.indexOf(system) < 0) {
            this.dependencies.push(system);
        }
        return this.parent.getState(system);
    }
}
