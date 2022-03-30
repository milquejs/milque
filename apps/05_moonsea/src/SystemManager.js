/**
 * @typedef {ReturnType<createSystemContext>} SystemContext
 * @typedef {(m: SystemContext, ...args) => SystemContext|Promise<SystemContext>} System
 * @typedef {(m: object, ...args) => object|Promise<object>} SystemLike
 * @typedef {ReturnType<createSystemOptions>} SystemOptions
 * @typedef {() => Function|void|Promise<Function|void>} SystemHandler
 * @typedef {{ type: string }} SystemEvent
 */

import { ControlledPromise } from './util/ControlledPromise.js';

/**
 * @param {string} name
 * @param {SystemManager} manager
 * @param {System} system
 * @param {object} sharedState
 * @param {Array<?>} initArgs
 */
function createSystemOptions(name, manager, system, sharedState, initArgs) {
    return {
        initArgs,
        /** @type {Record<number, Function>} */
        handlers: {},
        /** @type {Record<number, Function>} */
        pendingHandlers: {},
        context: createSystemContext(name, manager, system, sharedState),
    };
}

/**
 * @param {string} name
 * @param {SystemManager} manager
 * @param {System} system
 * @param {object} sharedState
 */
 function createSystemContext(name, manager, system, sharedState) {
    return {
        /** Any user-defined game state goes here. */
        state: {},
        /** Any global state goes here. */
        global: sharedState,
        /** The current system */
        current: system,
        /** The unique system name */
        name,
        /** The owning manager */
        __manager__: manager,
        /** The next available handle */
        __handle__: 1,
        /** A promise that resolves when the system is ready. */
        __ready__: new ControlledPromise(),
    };
}

export class SystemManager {
    constructor(updatesPerSecond = 60) {
        if (updatesPerSecond <= 0) {
            throw new Error('System manager must have positive updates per second.')
        }

        /** @type {Map<string, SystemOptions>} */
        this.systems = new Map();

        /** @type {Record<string, Array<Function>>} */
        this.listeners = {};
        /** @type {Array<SystemEvent>} */
        this.eventQueue = [];

        /** @private */
        this._userState = {};

        /** @private */
        this.initialized = false;
        /** @private */
        this.terminated = true;

        /** @protected */
        this.update = this.update.bind(this);
        /** @private */
        this.updatesPerSecond = updatesPerSecond;
        /** @private */
        this.updateEvent = { type: 'systemUpdate' };
        /** @private */
        this.intervalHandle = null;
    }

    /**
     * @returns {Promise<SystemManager>}
     */
    async initialize() {
        if (!this.terminated) {
            throw new Error('Already initialized.');
        }
        this.terminated = false;
        let systems = this.systems;
        let promises = [];
        for(let opts of systems.values()) {
            let system = opts.context.current;
            initializeSystem(system, opts);
            promises.push(opts.context.__ready__);
        }
        await Promise.all(promises);
        this.initialized = true;
        this.intervalHandle = setInterval(this.update, 1_000 / this.updatesPerSecond);
        return this;
    }

    /**
     * @returns {SystemManager}
     */
    terminate() {
        if (!this.initialized) {
            throw new Error('Not yet initialized.');
        }
        this.initialized = false;
        let systems = this.systems;
        for(let opts of systems.values()) {
            terminateSystem(opts.context.current, opts);
        }
        this.terminated = true;
        return this;
    }

    /** @protected */
    update() {
        // Update systems
        for(let opts of this.systems.values()) {
            let name = opts.context.name;

            // Apply handlers
            let map = opts.pendingHandlers;
            opts.pendingHandlers = {};
            for(let handle of Object.keys(map)) {
                let handler = map[handle];
                applyHandler(this, name, handle, handler);
            }
        }
        // Dispatch update
        this.dispatchEvent(this.updateEvent);
        // Handle events
        this.pollEvents();
    }

    /**
     * @param {System} system 
     * @param {string} [name]
     * @param  {...any} [initArgs] 
     * @returns {SystemManager}
     */
    addSystem(system, name = system.name, ...initArgs) {
        if (this.systems.has(name)) {
            return this;
        }
        let opts = createSystemOptions(name, this, system, this._userState, initArgs);
        if (this.initialized) {
            initializeSystem(system, opts);
        }
        this.systems.set(name, opts);
        return this;
    }

    /**
     * @param {System} system
     * @returns {SystemManager}
     */
    removeSystem(system, name = system.name) {
        if (!this.systems.has(name)) {
            return this;
        }
        let opts = this.systems.get(name);
        this.systems.delete(name);
        if (this.initialized) {
            terminateSystem(system, opts);
        }
        return this;
    }

    pollEvents() {
        let max = 1_000;
        while(this.eventQueue.length > 0 && max > 0) {
            max--;
            let event = this.eventQueue.shift();
            let type = event.type;
            if (type in this.listeners) {
                let listeners = this.listeners[type];
                for(let listener of listeners) {
                    let result = listener(event);
                    if (result) {
                        break;
                    }
                }
            }
        }
    }

    /**
     * @param {string} eventType
     * @param {Function} callback
     * @returns {SystemManager}
     */
    addEventListener(eventType, callback) {
        let list;
        if (!(eventType in this.listeners)) {
            list = [];
            this.listeners[eventType] = list;
        } else {
            list = this.listeners[eventType];
        }
        list.push(callback);
        return this;
    }

    /**
     * @param {string} eventType
     * @param {Function} callback
     * @returns {SystemManager}
     */
    removeEventListener(eventType, callback) {
        if (!(eventType in this.listeners)) {
            return;
        }
        let list = this.listeners[eventType];
        let i = list.indexOf(callback);
        list.splice(i, 1);
        return this;
    }

    /**
     * @param {string} eventType
     */
    clearEventListeners(eventType) {
        this.listeners[eventType] = [];
    }

    /**
     * @param {SystemEvent} event
     * @returns {SystemManager}
     */
    dispatchEvent(event) {
        this.eventQueue.push(event);
        return this;
    }
}

/**
 * @param {System} system
 * @param {SystemOptions} opts
 */
function initializeSystem(system, opts) {
    let m = opts.context;
    // Do initialization...
    console.log(`Initializing '${m.name}' system...`);
    let result = system(m, ...opts.initArgs);
    let ready = m.__ready__;
    // ...validate result...
    if (typeof result === 'object' && result instanceof Promise) {
        result.then(value => {
            validateSystemReturn(m, value);
            ready.resolve(value);
        }).catch(reason => {
            ready.reject(reason);
        });
    } else {
        try {
            validateSystemReturn(m, result);
        } catch (e) {
            ready.reject(e);
            return;
        }
        ready.resolve(result);
    }
}

/**
 * @param {System} system
 * @param {SystemOptions} opts
 */
function terminateSystem(system, opts) {
    console.log(`Terminating '${opts.context.name}' system...`);
    // Clean-up handlers
    let handlers = opts.handlers;
    opts.handlers = {};
    for(let handler of Object.values(handlers)) {
        handler();
    }
    // Clean-up context
    let context = opts.context;
    let ready = context.__ready__;
    if (ready.pending) {
        ready.reject('Encountered early termination while initializing system.');
    }
    context.__ready__ = new ControlledPromise();
    context.__handle__ = 1;
}

function validateSystemReturn(m, result) {
    if (!result) {
        throw new Error('Missing return for system context.');
    }
    if (result !== m) {
        throw new Error('Passed in and returned system contexts do not match.');
    }
}

/**
 * @param {SystemContext} m
 */
export function nextAvailableHookHandle(m) {
    return m.__handle__++;
}

/**
 * @template {SystemLike} T
 * @param {SystemContext} m
 * @param {T} system
 * @param {string} name
 */
export function getSystemContext(m, system, name = system.name) {
    return /** @type {Awaited<ReturnType<T>>} */ (m.__manager__.systems.get(name).context);
}

/**
 * @param {SystemContext} m 
 * @param {System} system 
 * @param {string} name
 */
export function getSystemId(m, system, name = system.name) {
    return name;
}

/**
 * @param {SystemContext} m
 * @param {Function} callback
 */
export function useSystemUpdate(m, callback) {
    useEvent(m, 'systemUpdate', callback);
}

function applyHandler(manager, name, handle, handler) {
    let handlers = manager.systems.get(name).handlers;
    if (handle in handlers) {
        // End the previous handler.
        let prev = handlers[handle];
        prev();
        delete handlers[handle];
    }
    // Start the next handler.
    let result = handler();
    if (typeof result === 'function') {
        handlers[handle] = result;
    } else if (result && result instanceof Promise) {
        result.then(result => {
            if (typeof result === 'function') {
                handlers[handle] = result;
            }
        });
    }
}

/**
 * @param {SystemContext} m 
 * @param {SystemHandler} handler 
 */
export function useEffect(m, handler) {
    let handle = nextAvailableHookHandle(m);
    m.__manager__.systems.get(m.name).pendingHandlers[handle] = handler;
}

/**
 * @param {SystemContext} m 
 * @param {string} eventType
 * @param {Function} callback 
 */
export function useEvent(m, eventType, callback) {
    useEffect(m, () => {
        let manager = m.__manager__;
        manager.addEventListener(eventType, callback);
        return () => {
            manager.removeEventListener(eventType, callback);
        };
    });
}

/**
 * @param {SystemContext} m
 * @param {SystemEvent} event
 */
export function dispatchEvent(m, event) {
    let manager = m.__manager__;
    manager.dispatchEvent(event);
}
