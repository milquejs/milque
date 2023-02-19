import { SystemContext } from './SystemContext.js';
import { assertNotNull } from '../Assertion.js';

/**
 * @template T
 * @typedef {(m: SystemContext<T>) => void|T|Promise<T>} System<T>
 */

export class SystemManager {

    constructor() {
        /**
         * @protected
         * @type {Array<SystemContext<?>>}
         */
        this.pendingSystems = [];
        /**
         * @protected
         * @type {Array<SystemContext<?>>}
         */
        this.activeSystems = [];
    }

    /**
     * @template T
     * @param {any} handle 
     * @param {import('./SystemContext.js').SystemInitCallback<T>} [initCallback] 
     * @param {import('./SystemContext.js').SystemDeadCallback<T>} [deadCallback]
     */
    register(handle, initCallback = undefined, deadCallback = undefined) {
        assertNotNull(handle);

        // Resolve handle.
        let name;
        if (typeof handle === 'function') {
            name = /** @type {Function} */ (handle).name;
        } else if (typeof handle === 'object') {
            if ('name' in handle) {
                name = handle.name;
            } else {
                throw new Error('Invalid handle for system - missing name.');
            }
        } else {
            // Use handle as is :)
            name = handle;
        }

        // Resolve init callback.
        if (!initCallback) {
            if (typeof handle === 'function') {
                initCallback = handle;
            } else {
                initCallback = () => {};
            }
        }

        // Resolve dead callback.
        if (!deadCallback) {
            deadCallback = () => {};
        }

        let ctx = new SystemContext(this, name, initCallback, deadCallback);
        this.pendingSystems.push(ctx);
        return this;
    }

    /**
     * @param {any} handle
     */
    unregister(handle) {
        let i = this.pendingSystems.findIndex(ctx => ctx.name === handle);
        if (i >= 0) {
            this.pendingSystems.splice(i, 1);
        }
        return this;
    }

    async start() {
        let created = this.pendingSystems.slice();
        // Prepare for active
        this.pendingSystems.length = 0;
        // Connect systems
        for (let ctx of created) {
            this.activeSystems.push(ctx);
            await SystemContext.initializeContext(ctx);
        }
        // Initialize systems
        for (let ctx of created) {
            await SystemContext.initializeEffects(ctx);
        }
        return this;
    }

    async stop() {
        let deleted = this.activeSystems.slice().reverse();
        // Prepare for death
        deleted.forEach(SystemContext.markDead);
        // Terminate systems
        for (let ctx of deleted) {
            await SystemContext.terminateEffects(ctx);
        }
        // Disconnect systems
        for (let ctx of deleted) {
            await SystemContext.terminateContext(ctx);
            let i = this.activeSystems.indexOf(ctx);
            if (i >= 0) {
                this.activeSystems.splice(i, 1);
            }
        }
        return this;
    }

    /**
     * @template T
     * @param {System<T>} system
     * @returns {T}
     */
    getState(system) {
        let ctx = this.activeSystems.find(ctx => ctx.name === system.name);
        if (!ctx) {
            return null;
        }
        return /** @type {T} */ (ctx.state);
    }
}
