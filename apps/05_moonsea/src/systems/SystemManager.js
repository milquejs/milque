/**
 * @typedef {object} SystemState
 * @typedef {ReturnType<createSystemContext>} SystemContext
 * @typedef {(m: SystemContext, ...args) => SystemState} System
 * @typedef {(m: object, ...args) => object|Promise<object>} SystemLike
 * @typedef {() => Function|void|Promise<Function|void>} SystemHandler
 * @typedef {{ type: string }} SystemEvent
 * @typedef {{ current: any }} Ref
 */

import { ControlledPromise } from '../util/ControlledPromise.js';
import { EffectManager } from './core/EffectManager.js';
import { useEvent } from './core/index.js';

/**
 * @param {string} name
 * @param {SystemManager} manager
 * @param {System} system
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

    this.managers = {
      effects: new EffectManager(this),
    };

    /** @type {Map<string, SystemContext>} */
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
      this.onSystemInitialize(opts);
      promises.push(opts.__ready__);
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
   * @param {SystemContext} m
   */
  onSystemInitialize(m) {
    console.log(`...initializing ${m.name}...`);
    for(let manager of Object.values(this.managers)) {
      manager.onSystemInitialize(m);
    }
    let result = m.current(m, ...m.args);
    let ready = m.__ready__;
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
   * @param {SystemContext} m
   */
  onSystemTerminate(m) {
    console.log(`...terminating ${m.name}...`);
    for(let manager of Object.values(this.managers)) {
      manager.onSystemTerminate(m);
    }
    // Clean-up context
    let context = m;
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
  onSystemUpdate(m) {
    for(let manager of Object.values(this.managers)) {
      manager.onSystemUpdate(m);
    }
  }

  onSystemContextCreate(m) {
    for(let manager of Object.values(this.managers)) {
      manager.onSystemContextCreate(m);
    }
  }

  /**
   * @param {SystemContext} m
   * @param {Error} e
   */
  onSystemError(m, e) {
    console.error(e);
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
      this.onSystemTerminate(opts);
    }
    this.terminated = true;
    return this;
  }

  /** @protected */
  update() {
    // Update systems
    for (let opts of this.systems.values()) {
      this.onSystemUpdate(opts);
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
      let context = createSystemContext(name, this, system, [], this._userState);
      this.onSystemContextCreate(context);
      this.systems.set(name, context);
      this.onSystemInitialize(context);
      promises.push(context.__ready__);
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
    let context = createSystemContext(
      name,
      this,
      system,
      initArgs,
      this._userState
    );
    this.onSystemContextCreate(context);
    if (this.initialized) {
      this.onSystemInitialize(context);
    }
    this.systems.set(name, context);
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
      this.onSystemTerminate(opts);
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
