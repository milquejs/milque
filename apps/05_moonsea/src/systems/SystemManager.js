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
import { UpdateManager } from './core/UpdateManager.js';
import { useEvent } from './core/index.js';
import { RefManager } from './core/RefManager.js';

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

    this.onUpdate = this.onUpdate.bind(this);

    this.managers = {
      effects: new EffectManager(),
      events: new EventManager(),
      update: new UpdateManager(updatesPerSecond, this.onUpdate),
      refs: new RefManager(),
    };

    /** @type {Map<string, SystemContext>} */
    this.systems = new Map();

    /** @private */
    this._userState = {};

    /** @private */
    this.initialized = false;
    /** @private */
    this.terminated = true;
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
    this.onPostInitialize();
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
   * @param {SystemContext} m
   */
  onSystemReady(m) {
    for(let manager of Object.values(this.managers)) {
      manager.onSystemReady(m);
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
   * @param {SystemContext} m
   */
  onSystemUpdate(m) {
    for(let manager of Object.values(this.managers)) {
      manager.onSystemUpdate(m);
    }
  }

  /**
   * @param {SystemContext} m
   */
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
    for(let manager of Object.values(this.managers)) {
      manager.onSystemError(m, e);
    }
    console.error(e);
  }

  onPostInitialize() {
    for(let manager of Object.values(this.managers)) {
      manager.onPostInitialize();
    }
  }

  onPostUpdate() {
    for(let manager of Object.values(this.managers)) {
      manager.onPostUpdate();
    }
  }

  onPostTerminate() {
    for(let manager of Object.values(this.managers)) {
      manager.onPostTerminate();
    }
  }

  onUpdate() {
    for (let opts of this.systems.values()) {
      this.onSystemUpdate(opts);
    }
    this.onPostUpdate();
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
    this.onPostTerminate();
    return this;
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
