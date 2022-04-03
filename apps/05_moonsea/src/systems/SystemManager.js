/**
 * @typedef {object} SystemState
 * @typedef {ReturnType<createSystemContext>} SystemContext
 * @typedef {(m: SystemContext, ...args) => SystemState} System
 * @typedef {(m: object, ...args) => object|Promise<object>} SystemLike
 * @typedef {{ type: string }} SystemEvent
 */

import { ControlledPromise } from '../util/ControlledPromise.js';
import { EffectManager } from './core/EffectManager.js';
import { EventManager } from './core/EventManager.js';
import { useEvent } from './core/index.js';
import { RefManager } from './core/RefManager.js';
import * as SystemEvents from './SystemEvents.js';

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
  };
}

export class SystemManager {
  constructor(updatesPerSecond = 60) {

    /** @type {Map<string, SystemContext>} */
    this.systems = new Map();

    /**
     * @private
     * @type {Record<string, Array<Function>>}
     */
    this.systemEventListeners = {};
    /** @private */
    this.userState = {};

    /** @private */
    this.initialized = false;
    /** @private */
    this.terminated = true;

    /** @private */
    this.intervalHandle = 0;

    this.updatesPerSecond = Math.max(0, updatesPerSecond);
    this.update = this.update.bind(this);

    this.effects = new EffectManager(this);
    this.events = new EventManager(this);
    this.refs = new RefManager(this);
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
    for (let m of systems.values()) {
      if (!m.__ready__.pending) {
        // Already completed.
        continue;
      }
      this.onSystemInitialize(m);
      promises.push(m.__ready__);
    }
    await Promise.all(promises);
    this.initialized = true;
    this.onPostInitialize();
    if (this.updatesPerSecond > 0) {
      this.intervalHandle = setInterval(
        this.update,
        1_000 / this.updatesPerSecond
      );
    }
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
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = 0;
    }
    let systems = this.systems;
    for (let m of systems.values()) {
      this.onSystemTerminate(m);
    }
    this.terminated = true;
    this.onPostTerminate();
    return this;
  }

  update() {
    for (let m of this.systems.values()) {
      this.onSystemUpdate(m);
    }
    this.onPostUpdate();
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
      let context = createSystemContext(name, this, system, [], this.userState);
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
      this.userState
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
    let m = this.systems.get(name);
    this.systems.delete(name);
    if (this.initialized) {
      this.onSystemTerminate(m);
    }
    return this;
  }

  /**
   * @param {System} system 
   * @param {string} [name] 
   */
  getSystemContext(system, name = system.name) {
    return this.systems.get(name);
  }

  /**
   * @param {string} eventType 
   * @param {Function} listener 
   */
  addSystemEventListener(eventType, listener) {
    if (!(eventType in this.systemEventListeners)) {
      this.systemEventListeners[eventType] = [listener];
      return;
    }
    this.systemEventListeners[eventType].push(listener);
  }

  /**
   * @param {string} eventType 
   * @param {Function} listener
   */
  removeSystemEventListener(eventType, listener) {
    if (!(eventType in this.systemEventListeners)) {
      return;
    }
    let l = this.systemEventListeners[eventType];
    let i = l.indexOf(listener);
    if (i < 0) {
      return;
    }
    l.splice(i, 1);
  }

  /**
   * @param {string} eventType 
   * @param  {...any} args 
   */
  dispatchSystemEvent(eventType, ...args) {
    if (!(eventType in this.systemEventListeners)) {
      return;
    }
    let listeners = this.systemEventListeners[eventType];
    for (let listener of listeners) {
      listener.apply(undefined, args);
    }
  }

  /**
   * @protected
   * @param {SystemContext} m
   */
  onSystemContextCreate(m) {
    this.dispatchSystemEvent(SystemEvents.CONTEXT_CREATE, m);
  }

  /**
   * @protected
   * @param {SystemContext} m
   */
  onSystemInitialize(m) {
    console.log(`...initializing ${m.name}...`);
    this.dispatchSystemEvent(SystemEvents.INITIALIZE, m);
    let result = m.current(m, ...m.args);
    let ready = m.__ready__;
    if (typeof result === 'object' && result instanceof Promise) {
      result
        .then((value) => {
          m.state = value;
          this.onSystemReady(m);
          ready.resolve(value);
        })
        .catch((reason) => {
          this.onSystemError(m, reason);
          ready.reject(reason);
        });
    } else {
      try {
        m.state = result;
      } catch (e) {
        this.onSystemError(m, e);
        ready.reject(e);
        return;
      }
      this.onSystemReady(m);
      ready.resolve(result);
    }
  }

  /**
   * @protected
   * @param {SystemContext} m
   */
  onSystemReady(m) {
    this.dispatchSystemEvent(SystemEvents.READY, m);
    console.log(`...${m.name} ready!`);
  }

  /**
   * @protected
   * @param {SystemContext} m
   */
  onSystemUpdate(m) {
    this.dispatchSystemEvent(SystemEvents.UPDATE, m);
  }

  /**
   * @protected
   * @param {SystemContext} m
   */
  onSystemTerminate(m) {
    console.log(`...terminating ${m.name}...`);
    this.dispatchSystemEvent(SystemEvents.TERMINATE, m);
    let ready = m.__ready__;
    if (ready.pending) {
      let error = new Error('Encountered early termination while initializing system.');
      this.onSystemError(m, error);
      ready.reject(error);
    }
    m.__ready__ = new ControlledPromise();
    m.__handle__ = 1;
  }

  /**
   * @protected
   * @param {SystemContext} m
   * @param {Error} e
   */
  onSystemError(m, e) {
    this.dispatchSystemEvent(SystemEvents.ERROR, m);
    console.error(e);
  }

  /** @protected */
  onPostInitialize() {
    this.dispatchSystemEvent(SystemEvents.MANAGER_POST_INITIALIZE);
  }

  /** @protected */
  onPostUpdate() {
    this.dispatchSystemEvent(SystemEvents.MANAGER_POST_UPDATE);
  }

  /** @protected */
  onPostTerminate() {
    this.dispatchSystemEvent(SystemEvents.MANAGER_POST_TERMINATE);
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
