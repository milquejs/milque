export class SystemManager {
    
    constructor() {
        /** @type {Array<ReturnType<createSystemContext>>} */
        this.systems = [];
    }

    /**
     * @param {...Function} systems
     */
    async start(...systems) {
        // Create system contexts to be started
        let created = [];
        for(let init of systems) {
            let ctx = createSystemContext(this, init.name, init);
            this.systems.push(ctx);
            created.push(ctx);
        }
        // Connect systems
        for(let ctx of created) {
            ctx.teardown = await ctx.setup(ctx);
        }
        // Initialize systems
        for(let ctx of created) {
            await ctx.effects.startEffects();
        }
    }

    /**
     * @param  {...Function} systems 
     */
    async stop(...systems) {
        // Find system contexts to be stopped
        let deleted = [];
        for(let init of systems) {
            let i = this.systems.findIndex(ctx => ctx.name === init.name);
            if (i < 0) {
                // System was not started here.
                continue;
            }
            let ctx = this.systems[i];
            ctx.dead = true;
            deleted.push(ctx);
        }
        // Terminate systems
        for(let ctx of deleted) {
            await ctx.effects.stopEffects();
        }
        // Disconnect systems
        for(let ctx of deleted) {
            let i = this.systems.indexOf(ctx);
            if (i < 0) {
                throw new Error('Cannot find system context object in deleted list?');
            }
            let teardown = ctx.teardown;
            ctx.teardown = null;
            await teardown();
            this.systems.splice(i, 1);
        }
    }
}

function createSystemContext(parent, name, setup) {
    return {
        parent: parent,
        effects: new EffectManager(),
        name,
        setup,
        teardown: null,
        dead: false,
    };
}

/** @typedef {() => Promise<AfterEffectHandler>} EffectHandler */
/** @typedef {() => Promise<void>} AfterEffectHandler */

class EffectManager {

    constructor() {
        /** @type {Array<EffectHandler>} */
        this.before = [];
        /** @type {Array<AfterEffectHandler>} */
        this.after = [];
        this.started = false;
    }

    /**
     * @param {EffectHandler} effectHandler
     */
    attachEffect(effectHandler) {
        if (this.started) {
            throw new Error('Cannot attach effect when already started.');
        }
        this.before.push(effectHandler);
        return this;
    }

    async startEffects() {
        if (this.started) {
            throw new Error('Cannot start effects already started.');
        }
        this.started = true;
        let befores = this.before.slice();
        this.before.length = 0;
        this.after.push(...await Promise.all(befores.map(effect => effect && effect())));
    }

    async stopEffects() {
        if (!this.started) {
            throw new Error('Cannot stop effects not yet started.');
        }
        this.started = false;
        let afters = this.after.slice();
        this.after.length = 0;
        await Promise.all(afters.map(effect => effect && effect()));
    }
}
