import { ControlledPromise } from '../util/ControlledPromise.js';

/**
 * @template T
 * @typedef {(m: SystemContext, ...args) => T|Promise<T>} System<T>
 */

/**
 * @typedef {ReturnType<createSystemContext>} SystemContext
 * @typedef {Function} Handler
 * @typedef {Function} Callback
 * @typedef {Function} SubSystem
 */

const INTERNAL = Symbol('internal');
const MANAGER = Symbol('manager');

/**
 * @template S
 * @template {System<S>} T
 * @param {string} name
 * @param {SystemManager} manager
 * @param {T} system
 * @param {Array<any>} args
 * @param {object} sharedState
 */
function createSystemContext(name, manager, system, args, sharedState) {
    return {
        /** Any user-defined game state goes here. */
        state: null,
        /** Any global state goes here. */
        global: sharedState,
        /** The current system */
        current: system,
        /** The unique system name */
        name,
        /** The system function arguments initialized with. */
        args,
        /** A promise that resolves when the system is ready. */
        ready: new ControlledPromise(),
        /** A promise that resolves when the system is dead. */
        dead: new ControlledPromise(),
        /** The owning manager */
        [MANAGER]: manager,
        /** The internal managed state */
        [INTERNAL]: {
            handle: 1,
            /** @type {Record<string, Function>} */
            before: {},
            /** @type {Record<string, Function>} */
            after: {},
        }
    };
}

export class SystemManager {

    constructor() {
        /**
         * @private
         * @type {Map<string, SystemContext>}
         */
        this.contexts = new Map();

        /** @private */
        this.sharedState = null;
    }

    /**
     * @param {Array<System<any>>} systemList 
     * @param {object} [initialState] 
     */
    async start(systemList, initialState = undefined) {
        let contexts = this.contexts;

        // Create shared state...
        if (typeof initialState !== 'undefined') {
            if (this.sharedState) {
                Object.assign(this.sharedState, initialState);
            } else {
                this.sharedState = initialState;
            }
        }
        let sharedState = this.sharedState;

        // Create systems...
        for(let system of systemList) {
            await createSystemImpl(contexts, sharedState, system, system.name, []);
        }

        // Start effects...
        startEffectsImpl();
    }

    async stop() {
        let contexts = this.contexts;
        let contextList = Array.from(this.contexts.values()).reverse();

        // Stop effects...
        stopEffectsImpl(contexts);

        // Destroy systems...
        for(let m of contextList) {
            await destroySystemImpl(contexts, m);
        }

        // Destroy shared state...
        this.sharedState = null;
    }

    /**
     * @param {System<any>} system 
     * @param {string} [name] 
     * @param {Array<any>} [args] 
     */
    async subStart(system, name = system.name, args = []) {
        let contexts = this.contexts;
        let sharedState = this.sharedState;

        // Create system...
        let m = createSystemImpl(contexts, sharedState, system, name, args);

        // Start effects...
        await startEffectImpl(m);
    }

    /**
     * @param {System<any>} system 
     * @param {string} [name]
     */
    async subStop(system, name = system.name) {
        let contexts = this.contexts;
        let m = contexts.get(name);

        // Stop effects...
        stopEffectImpl(m);

        // Destroy system...
        destroySystemImpl(contexts, m);
    }

    /**
     * @param {System<any>} system 
     * @param {string} [name]
     * @returns {SystemContext}
     */
    getSystemContext(system, name = system.name) {
        return this.contexts.get(name);
    }
}

async function createSystemImpl(contexts, sharedState, system, name, args) {
    if (typeof name === 'undefined') {
        name = system.name || `UnnamedSystem${String(contexts.size).padStart(3, '0')}`;
    }
    if (contexts.has(name)) {
        throw new Error(`Cannot use system that already exists with same name '${name}'.`);
    }
    let m = createSystemContext(name, this, system, args, sharedState);

    // Add to manager.
    contexts.set(name, m);

    // Run it.
    let ready = m.ready;
    let dead = m.dead;
    try {
        let state = await m.current(m, ...m.args);
        m.state = state;
        ready.resolve(m);
    } catch (e) {
        ready.reject(e);
        dead.reject(new Error('System failed to create.'));
        return null;
    }

    return m;
}

async function destroySystemImpl(contexts, m) {
    let name = m.name;

    // Remove from manager.
    contexts.delete(name);
    let dead = m.dead;
    if (!dead.pending) {
        // Already dead. Move on.
        return;
    }
    let ready = m.ready;
    if (ready.pending) {
        let error = new Error('System destroyed before finishing create.');
        ready.reject(error);
        dead.reject(error);
        return;
    }

    // Make it dead.
    dead.resolve(m);
}

async function startEffectsImpl(contexts) {
    for(let m of contexts) {
        await startEffectImpl(m);
    }
}

async function startEffectImpl(m) {
    let effects = m[INTERNAL];
    let prevBefore = effects.before;
    let nextAfter = effects.after;
    effects.before = {};

    for (let key of Object.keys(prevBefore)) {
        let beforeEffect = prevBefore[key];
        try {
            let result = await beforeEffect();
            if (typeof result === 'function') {
                nextAfter[key] = result;
            }
        } catch (e) {
            console.error(e);
        }
    }
}

async function stopEffectsImpl(contexts) {
    let reversed = Array.from(contexts.values()).reverse();
    for(let m of reversed) {
        await stopEffectImpl(m);
    }
}

async function stopEffectImpl(m) {
    let effects = m[INTERNAL];
    let prevAfter = effects.after;
    effects.after = {};
    effects.before = {};

    let reversed = Object.values(prevAfter).reverse();
    for (let afterEffect of reversed) {
        try {
            await afterEffect();
        } catch (e) {
            console.error(e);
        }
    }
}

/**
 * @param {SystemContext} m 
 * @param {Function} handler 
 */
export function useEffect(m, handler) {
    let internal = m[INTERNAL];
    internal.before[internal.handle++] = handler;
}

/**
 * @template T
 * @param {SystemContext} m 
 * @param {System<T>} system
 * @param {string} [name]
 * @returns {T}
 */
export function useSystem(m, system, name = system.name) {
    let manager = m[MANAGER];
    let context = manager.getSystemContext(system, name);
    if (!context || !context.state) {
        throw new Error('Cannot use system not loaded or exposed.');
    }
    return context.state;
}

/** @param {SystemContext} m */
export function useSystemManager(m) {
    return m[MANAGER];
}

/** @param {SystemContext} m */
export function useSystemInternal(m) {
    return m[INTERNAL];
}
