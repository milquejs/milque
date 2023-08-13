/**
 * @version 1.4.0
 * @description
 * # Changelog
 * ## 1.4.0
 * - Changed to use class statics
 * ## 1.3.0
 * - Return results for emit()
 * ## 1.2.0
 * - Added named exports
 * - Added custom this context
 * - Added some needed explanations for the functions
 * ## 1.1.0
 * - Started versioning
 */
export class Eventable {
  get INSTANCE() {
    let value = new Eventable();
    Object.defineProperty(this, 'INSTANCE', { value });
    return value;
  }

  /**
   * Mixins eventable properties into the passed-in class.
   *
   * @param {Class} targetClass The class to mixin eventable properties.
   * @return {Class<Eventable>} The resultant eventable-mixed-in class.
   */
  static mixin(targetClass) {
    const targetPrototype = targetClass.prototype;
    Object.assign(targetPrototype, this.INSTANCE);
    targetPrototype.__listeners = new Map();
    return targetPrototype;
  }

  /**
   * Assigns the passed-in object with eventable properties.
   *
   * @param {Object} dst The object to assign with eventable properties.
   * @return {Eventable} The resultant eventable object.
   */
  static assign(targetObject) {
    let result = Object.assign(targetObject, this.INSTANCE);
    result.__listeners = new Map();
    return result;
  }

  /**
   * Creates an eventable object.
   *
   * @return {Eventable} The created eventable object.
   */
  static create() {
    return new Eventable();
  }

  constructor() {
    this.__listeners = new Map();
  }

  /**
   * Registers an event handler to continually listen for the event.
   *
   * @param {string} event The name of the event to listen for.
   * @param {Function} callback The callback function to handle the event.
   * @param {any} [handle = callback] The handle to refer to this registered callback.
   * Used by off() to remove handlers. If none specified, it will use the callback
   * itself as the handle. This must be unique.
   */
  on(event, listener, handle = listener) {
    if (!this.__listeners.has(event)) {
      this.__listeners.set(event, new Map());
    }
    let listeners = this.__listeners.get(event);
    listeners.set(handle, listener);
  }

  /**
   * Unregisters an event handler to stop listening for the event.
   *
   * @param {string} event The name of the event listened for.
   * @param {any} handle The registered handle to refer to the registered
   * callback. If no handle was provided when calling on(), the callback
   * is used as the handle instead.
   */
  off(event, handle) {
    if (this.__listeners.has(event)) {
      let listeners = this.__listeners.get(event);
      listeners.delete(handle);
    }
  }

  /**
   * Registers a one-off event handler to start listening for the next,
   * and only the next, event.
   *
   * @param {string} event The name of the event to listen for.
   * @param {Function} callback The callback function to handle the event.
   * @param {any} [handle = callback] The handle to refer to this registered callback.
   * Used by off() to remove handlers. If none specified, it will use the callback
   * itself as the handle. This must be unique.
   */
  once(event, listener, handle = listener) {
    const func = (...args) => {
      this.off(event, handle);
      listener.apply(undefined, args);
    };
    this.on(event, func, handle);
  }

  /**
   * Emits the event with the arguments passed on to the registered handlers.
   *
   * @param {string} event The name of the event to emit.
   * @param  {...any} args Any arguments to pass to registered handlers.
   * @return {Array<any>} Array of any returned values of the callbacks.
   */
  emit(event, ...args) {
    if (this.__listeners.has(event)) {
      let listeners = this.__listeners.get(event);
      let results = [];
      for (let listener of listeners.values()) {
        let result = listener.apply(undefined, args);
        if (typeof result !== 'undefined') {
          results.push(result);
        }
      }
      return results;
    } else {
      return [];
    }
  }
}
