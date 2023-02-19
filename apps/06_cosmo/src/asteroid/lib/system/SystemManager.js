import { SystemContext } from './SystemContext.js';

/**
 * @template T
 * @typedef {(m: SystemContext<T>) => T|Promise<T>} System<T>
 */

export class SystemManager {

    constructor() {
        /**
         * @protected
         * @type {Array<SystemContext<?>>}
         */
        this.systems = [];
    }

    /**
     * @param {...System<?>} systems
     */
    async start(...systems) {
        // Create system contexts to be started
        let created = [];
        for (let init of systems) {
            let ctx = new SystemContext(this, init.name, init);
            this.systems.push(ctx);
            created.push(ctx);
        }
        // Connect systems
        for (let ctx of created) {
            // @ts-ignore
            ctx.state = await ctx.init.call({}, ctx);
        }
        // Initialize systems
        for (let ctx of created) {
            // @ts-ignore
            await ctx.effects.startEffects();
        }
    }

    /**
     * @param {...System<?>} systems 
     */
    async stop(...systems) {
        // Find system contexts to be stopped
        let deleted = [];
        for (let init of systems) {
            let i = this.systems.findIndex(ctx => ctx.name === init.name);
            if (i < 0) {
                // System was not started here.
                continue;
            }
            let ctx = this.systems[i];
            // @ts-ignore
            ctx.dead = true;
            deleted.push(ctx);
        }
        // Terminate systems
        for (let ctx of deleted) {
            // @ts-ignore
            await ctx.effects.stopEffects();
        }
        // Disconnect systems
        for (let ctx of deleted) {
            let i = this.systems.indexOf(ctx);
            if (i < 0) {
                throw new Error('Cannot find system context object in deleted list?');
            }
            ctx.state = null;
            this.systems.splice(i, 1);
        }
    }

    /**
     * @template T
     * @param {System<T>} system
     * @returns {T}
     */
    getState(system) {
        let ctx = this.systems.find(ctx => ctx.name === system.name);
        if (!ctx) {
            return null;
        }
        return /** @type {T} */ (ctx.state);
    }
}
