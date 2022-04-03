/**
 * @typedef {object} SystemState
 * @typedef {ReturnType<createSystemContext>} SystemContext
 * @typedef {(m: SystemContext, ...args) => SystemState} System
 * @typedef {(m: object, ...args) => object|Promise<object>} SystemLike
 * @typedef {ReturnType<createSystemOptions>} SystemOptions
 * @typedef {() => Function|void|Promise<Function|void>} SystemHandler
 * @typedef {{ type: string }} SystemEvent
 * @typedef {{ current: any }} Ref
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
    handlers: {
      /** @type {Record<number, Function>} */
      pending: {},
      /** @type {Record<number, Function>} */
      active: {},
    },
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
    state: null,
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
    /** @type {Record<number, Ref>} */
    __refs__: {},
  };
}

export class SystemManager {
  constructor(updatesPerSecond = 60) {
    if (updatesPerSecond <= 0) {
      throw new Error('System manager must have positive updates per second.');
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
    /** @protected */
    this.pollEvents = this.pollEvents.bind(this);
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
    for (let opts of systems.values()) {
      let system = opts.context.current;
      initializeSystem(system, opts);
      promises.push(opts.context.__ready__);
    }
    await Promise.all(promises);
    this.initialized = true;
    this.intervalHandle = setInterval(
      this.update,
      1_000 / this.updatesPerSecond
    );
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
    for (let opts of systems.values()) {
      terminateSystem(opts.context.current, opts);
    }
    this.terminated = true;
    return this;
  }

  /** @protected */
  update() {
    // Update systems
    for (let opts of this.systems.values()) {
      let name = opts.context.name;

      // Apply handlers
      let map = opts.handlers.pending;
      opts.handlers.pending = {};
      for (let handle of Object.keys(map)) {
        let handler = map[handle];
        try {
          applyHandler(this, name, handle, handler);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Dispatch update
    this.dispatchEvent(this.updateEvent);
    // Handle events
    this.pollEvents();
  }

  /**
   * @param {Array<System>} systems
   */
  async preloadSystems(systems) {
    let promises = [];
    for (let system of systems) {
      let name = system.name;
      if (this.systems.has(name)) {
        continue;
      }
      let opts = createSystemOptions(name, this, system, this._userState, []);
      this.systems.set(name, opts);
      initializeSystem(system, opts);
      promises.push(opts.context.__ready__);
    }
    await Promise.all(promises);
    return this;
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
    let opts = createSystemOptions(
      name,
      this,
      system,
      this._userState,
      initArgs
    );
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
    while (this.eventQueue.length > 0 && max > 0) {
      max--;
      let event = this.eventQueue.shift();
      let type = event.type;
      if (type in this.listeners) {
        let listeners = this.listeners[type];
        for (let listener of listeners) {
          try {
            let result = listener(event);
            if (result) {
              break;
            }
          } catch (e) {
            console.error(e);
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
    result
      .then((value) => {
        m.state = value;
        ready.resolve(value);
      })
      .catch((reason) => {
        ready.reject(reason);
      });
  } else {
    try {
      m.state = result;
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
  let handlers = opts.handlers.active;
  opts.handlers.active = {};
  opts.handlers.pending = {};
  for (let handler of Object.values(handlers)) {
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

/**
 * @param {SystemContext} m
 */
export function nextAvailableHookHandle(m) {
  return m.__handle__++;
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
  let handlers = manager.systems.get(name).handlers.active;
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
    result.then((result) => {
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
  m.__manager__.systems.get(m.name).handlers.pending[handle] = handler;
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

/**
 * @param {SystemContext} m
 * @returns {{ current: any }}
 */
export function useRef(m) {
  const handle = nextAvailableHookHandle(m);
  const ref = {
    __ready: false,
    __current: null,
    get current() {
      if (!this.__ready) {
        throw new Error(
          'Ref is not yet ready. Try awaiting on owning system before access.'
        );
      }
      return this.__current;
    },
    set current(value) {
      this.__ready = true;
      this.__current = value;
    },
  };
  m.__refs__[handle] = ref;
  return ref;
}

/**
 * @template {SystemLike} T
 * @param {SystemContext} m
 * @param {T} system
 * @param {string} [name]
 * @returns {{ current: Awaited<ReturnType<T>> }}
 */
export function useSystemState(m, system, name = system.name) {
  if (!m || !m.__manager__.systems.has(name)) {
    throw new Error('System not yet registered. Try preloading the system.');
  }
  const ref = useRef(m);
  m.__manager__.systems.get(name).context.__ready__.then((state) => {
    ref.current = state;
  });
  return ref;
}

/**
 * @template {SystemLike} T
 * @param {SystemContext} m
 * @param {T} system
 * @param {string} [name]
 * @returns {Awaited<ReturnType<T>>}
 */
export function usePreloadedSystemState(m, system, name = system.name) {
  if (!m || !m.__manager__.systems.has(name)) {
    throw new Error(
      'System not yet loaded. Try await on system before access.'
    );
  }
  return m.__manager__.systems.get(name).context.state;
}
