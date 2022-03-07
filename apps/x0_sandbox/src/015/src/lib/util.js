(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = global || self), factory((global.Utils = {})));
})(this, function (exports) {
  'use strict';

  /**
   * Generates a uuid v4.
   *
   * @param {number} a The placeholder (serves for recursion within function).
   * @returns {string} The universally unique id.
   */
  function uuid(a = undefined) {
    // https://gist.github.com/jed/982883
    return a
      ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
      : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
  }

  const TOP_INDEX = 0;

  // NOTE: Uses a binary heap to sort.
  class PriorityQueue {
    constructor(comparator) {
      this._heap = [];
      this._comparator = comparator;
    }

    get size() {
      return this._heap.length;
    }

    clear() {
      this._heap.length = 0;
    }

    push(...values) {
      for (const value of values) {
        this._heap.push(value);
        this._shiftUp();
      }
    }

    pop() {
      const result = this.peek();
      let bottom = bottomIndex(this);
      if (bottom > TOP_INDEX) {
        this._swap(TOP_INDEX, bottom);
      }
      this._heap.pop();
      this._shiftDown();
      return result;
    }

    /** Replaces the top value with the new value. */
    replace(value) {
      const result = this.peek();
      this._heap[TOP_INDEX] = value;
      this._shiftDown();
      return result;
    }

    peek() {
      return this._heap[TOP_INDEX];
    }

    _compare(i, j) {
      return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j) {
      let result = this._heap[i];
      this._heap[i] = this._heap[j];
      this._heap[j] = result;
    }

    _shiftUp() {
      let node = this._heap.length - 1;
      let nodeParent;
      while (
        node > TOP_INDEX &&
        this._compare(node, (nodeParent = parentIndex(node)))
      ) {
        this._swap(node, nodeParent);
        node = nodeParent;
      }
    }

    _shiftDown() {
      const length = this._heap.length;
      let node = TOP_INDEX;
      let nodeMax;

      let nodeLeft = leftIndex(node);
      let flagLeft = nodeLeft < length;
      let nodeRight = rightIndex(node);
      let flagRight = nodeRight < length;

      while (
        (flagLeft && this._compare(nodeLeft, node)) ||
        (flagRight && this._compare(nodeRight, node))
      ) {
        nodeMax =
          flagRight && this._compare(nodeRight, nodeLeft)
            ? nodeRight
            : nodeLeft;
        this._swap(node, nodeMax);
        node = nodeMax;

        nodeLeft = leftIndex(node);
        flagLeft = nodeLeft < length;
        nodeRight = rightIndex(node);
        flagRight = nodeRight < length;
      }
    }

    values() {
      return this._heap;
    }

    [Symbol.iterator]() {
      return this._heap[Symbol.iterator]();
    }
  }

  function bottomIndex(queue) {
    return queue._heap.length - 1;
  }

  function parentIndex(i) {
    return ((i + 1) >>> 1) - 1;
  }

  function leftIndex(i) {
    return (i << 1) + 1;
  }

  function rightIndex(i) {
    return (i + 1) << 1;
  }

  /**
   * @typedef Eventable
   * @property {function} on
   * @property {function} off
   * @property {function} once
   * @property {function} emit
   */

  /**
   * @version 1.2
   *
   * # Changelog
   * ## 1.2
   * - Added named exports
   * - Added custom this context
   * - Added some needed explanations for the functions
   *
   * ## 1.1
   * - Started versioning
   */
  const EventableInstance = {
    /**
     * Registers an event handler to continually listen for the event.
     *
     * @param {string} event The name of the event to listen for.
     * @param {function} callback The callback function to handle the event.
     * @param {*} [handle = callback] The handle to refer to this registered callback.
     * Used by off() to remove handlers. If none specified, it will use the callback
     * itself as the handle. This must be unique.
     * @return {Eventable} Self for method-chaining.
     */
    on(event, callback, handle = callback) {
      let callbacks;
      if (!this.__events.has(event)) {
        callbacks = new Map();
        this.__events.set(event, callbacks);
      } else {
        callbacks = this.__events.get(event);
      }

      if (!callbacks.has(handle)) {
        callbacks.set(handle, callback);
      } else {
        throw new Error(
          `Found callback for event '${event}' with the same handle '${handle}'.`
        );
      }
      return this;
    },

    /**
     * Unregisters an event handler to stop listening for the event.
     *
     * @param {string} event The name of the event listened for.
     * @param {*} handle The registered handle to refer to the registered
     * callback. If no handle was provided when calling on(), the callback
     * is used as the handle instead.
     * @return {Eventable} Self for method-chaining.
     */
    off(event, handle) {
      if (this.__events.has(event)) {
        const callbacks = this.__events.get(event);
        if (callbacks.has(handle)) {
          callbacks.delete(handle);
        } else {
          throw new Error(
            `Unable to find callback for event '${event}' with handle '${handle}'.`
          );
        }
      } else {
        throw new Error(`Unable to find event '${event}'.`);
      }
      return this;
    },

    /**
     * Registers a one-off event handler to start listening for the next,
     * and only the next, event.
     *
     * @param {string} event The name of the event to listen for.
     * @param {function} callback The callback function to handle the event.
     * @param {*} [handle = callback] The handle to refer to this registered callback.
     * Used by off() to remove handlers. If none specified, it will use the callback
     * itself as the handle. This must be unique.
     * @return {Eventable} Self for method-chaining.
     */
    once(event, callback, handle = callback) {
      const func = (...args) => {
        this.off(event, handle);
        callback.apply(this.__context || this, args);
      };
      return this.on(event, func, handle);
    },

    /**
     * Emits the event with the arguments passed on to the registered handlers.
     * The context of the handlers, if none were initially bound, could be
     * defined upon calling the Eventable's creation function. Otherwise, the
     * handler is called with `this` context of the Eventable instance.
     *
     * @param {string} event The name of the event to emit.
     * @param  {...any} args Any arguments to pass to registered handlers.
     * @return {Array<any>} Array of any returned values of the callbacks.
     */
    emit(event, ...args) {
      if (this.__events.has(event)) {
        let results = [];
        const callbacks = Array.from(this.__events.get(event).values());
        for (const callback of callbacks) {
          let result = callback.apply(this.__context || this, args);
          if (result) results.push(result);
        }
        return results;
      } else {
        this.__events.set(event, new Map());
        return [];
      }
    },
  };

  /**
   * Creates an eventable object.
   *
   * @param {Object} [context] The context used for the event handlers.
   * @return {Eventable} The created eventable object.
   */
  function create(context = undefined) {
    const result = Object.create(EventableInstance);
    result.__events = new Map();
    result.__context = context;
    return result;
  }

  /**
   * Assigns the passed-in object with eventable properties.
   *
   * @param {Object} dst The object to assign with eventable properties.
   * @param {Object} [context] The context used for the event handlers.
   * @return {Eventable} The resultant eventable object.
   */
  function assign(dst, context = undefined) {
    const result = Object.assign(dst, EventableInstance);
    result.__events = new Map();
    result.__context = context;
    return result;
  }

  /**
   * Mixins eventable properties into the passed-in class.
   *
   * @param {Class} targetClass The class to mixin eventable properties.
   * @param {Object} [context] The context used for the event handlers.
   * @return {Class<Eventable>} The resultant eventable-mixed-in class.
   */
  function mixin(targetClass, context = undefined) {
    const targetPrototype = targetClass.prototype;
    Object.assign(targetPrototype, EventableInstance);
    targetPrototype.__events = new Map();
    targetPrototype.__context = context;
    return targetPrototype;
  }

  var Eventable = {
    create,
    assign,
    mixin,
  };

  var Eventable$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create,
    assign: assign,
    mixin: mixin,
    default: Eventable,
  });

  exports.Eventable = Eventable$1;
  exports.PriorityQueue = PriorityQueue;
  exports.uuid = uuid;

  Object.defineProperty(exports, '__esModule', { value: true });
});
