/**
 * @template T
 * @typedef {import('./Topic').Topic<T>} Topic<T>
 */

/**
 * @template T
 * @typedef {(attachment: T) => void|boolean} TopicCallback<T>
 */

/**
 * @template T
 * @typedef TopicCallbackEntry
 * @property {TopicCallback<T>} callback
 * @property {number} priority
 */

/**
 * @template T
 * @param {TopicCallbackEntry<T>} a
 * @param {TopicCallbackEntry<T>} b
 */
function comparator(a, b) {
  return a.priority - b.priority;
}

/**
 * A manager for topic states. You should call `flush()` regularly to
 * process dispatched events or use `dispatchImmediately()`.
 */
export class TopicManager {
  constructor() {
    /**
     * @protected
     * @type {Record<string, Array<object>>}
     */
    this.cachedIn = {};
    /**
     * @protected
     * @type {Record<string, Array<object>>}
     */
    this.cachedOut = {};
    /**
     * @protected
     * @type {Record<string, Array<TopicCallbackEntry<?>>>}
     */
    this.callbacks = {};
    /**
     * @protected
     * @type {Record<string, number>}
     */
    this.maxRetains = {};
    /**
     * @private
     * @type {Record<string, Topic<?>>}
     */
    this.nameTopicMapping = {};
  }

  /**
   * @template T
   * @param {Topic<T>} topic
   * @param {TopicCallback<T>} callback
   * @param {object} [opts]
   * @param {number} [opts.priority]
   */
  addEventListener(topic, callback, opts = {}) {
    const { priority = 0 } = opts;
    let callbacks = this.callbacksOf(topic);
    callbacks.push({
      callback,
      priority,
    });
    callbacks.sort(comparator);
  }

  /**
   * @template T
   * @param {Topic<T>} topic
   * @param {TopicCallback<T>} callback
   */
  removeEventListener(topic, callback) {
    let callbacks = this.callbacksOf(topic);
    let i = callbacks.findIndex((v) => v.callback === callback);
    if (i >= 0) {
      callbacks.splice(i, 1);
    }
  }

  /**
   * @param {Topic<?>} topic
   */
  countEventListeners(topic) {
    return this.callbacksOf(topic).length;
  }

  /**
   * @template T
   * @param {Topic<T>} topic
   * @param {T} attachment
   */
  dispatch(topic, attachment) {
    let incoming = this.incomingOf(topic);
    incoming.push(attachment);
  }

  /**
   * @template T
   * @param {Topic<T>} topic
   * @param {T} attachment
   */
  dispatchImmediately(topic, attachment) {
    let callbacks = this.callbacksOf(topic);
    for (let { callback } of callbacks) {
      let result = callback(attachment);
      if (result === true) {
        return;
      }
    }
    let outgoing = this.outgoingOf(topic);
    outgoing.push(attachment);
  }

  /**
   * @template T
   * @param {Topic<T>} topic
   * @param {T} attachment
   */
  async dispatchImmediatelyAndWait(topic, attachment) {
    let callbacks = this.callbacksOf(topic);
    for (let { callback } of callbacks) {
      let result = await callback(attachment);
      if (result === true) {
        return;
      }
    }
    let outgoing = this.outgoingOf(topic);
    outgoing.push(attachment);
  }

  /**
   * @param {Topic<?>} topic
   */
  count(topic) {
    let outgoing = this.outgoingOf(topic);
    return outgoing.length;
  }

  /**
   * @template T
   * @param {Topic<T>} topic
   */
  poll(topic) {
    let outgoing = this.outgoingOf(topic);
    if (outgoing.length <= 0) {
      return null;
    }
    let result = outgoing.shift();
    return result;
  }

  /**
   * @param {Topic<?>} topic
   * @param {number} amount
   */
  retain(topic, amount) {
    const topicName = topic.name;
    let max = Math.max(amount, this.maxRetains[topicName] || 0);
    this.maxRetains[topicName] = max;
  }

  /**
   * @param {number} [maxPerTopic]
   */
  flush(maxPerTopic = 100) {
    for (const topicName of Object.keys(this.cachedIn)) {
      const topic = this.nameTopicMapping[topicName];
      const incoming = this.cachedIn[topicName];
      const outgoing = this.cachedOut[topicName];
      const retain = this.maxRetains[topicName] || 0;
      if (retain < outgoing.length) {
        outgoing.splice(0, outgoing.length - retain);
      }
      let max = Math.min(maxPerTopic, incoming.length);
      for (let i = 0; i < max; ++i) {
        let attachment = incoming.shift();
        if (typeof attachment === 'object' && attachment instanceof Promise) {
          this.dispatchImmediately(topic, attachment);
        } else {
          this.dispatchImmediately(topic, attachment);
        }
      }
    }
  }

  /**
   * @param {Topic<?>} topic
   */
  getPendingRetainCount(topic) {
    return this.maxRetains[topic.name] || 0;
  }

  /**
   * @param {Topic<?>} topic
   */
  getPendingFlushCount(topic) {
    let incoming = this.incomingOf(topic);
    return incoming.length;
  }

  reset() {
    this.cachedIn = {};
    this.cachedOut = {};
    this.callbacks = {};
    this.maxRetains = {};
    this.nameTopicMapping = {};
  }

  /**
   * @protected
   * @template T
   * @param {Topic<T>} topic
   * @returns {Array<T>}
   */
  incomingOf(topic) {
    const topicName = topic.name;
    if (topicName in this.cachedIn) {
      return this.cachedIn[topicName];
    } else {
      let result = [];
      this.cachedIn[topicName] = result;
      this.cachedOut[topicName] = [];
      this.nameTopicMapping[topicName] = topic;
      return result;
    }
  }

  /**
   * @protected
   * @template T
   * @param {Topic<T>} topic
   * @returns {Array<T>}
   */
  outgoingOf(topic) {
    const topicName = topic.name;
    if (topicName in this.cachedOut) {
      return this.cachedOut[topicName];
    } else {
      let result = [];
      this.cachedIn[topicName] = [];
      this.cachedOut[topicName] = result;
      this.nameTopicMapping[topicName] = topic;
      return result;
    }
  }

  /**
   * @protected
   * @template T
   * @param {Topic<T>} topic
   * @returns {Array<TopicCallbackEntry<T>>}
   */
  callbacksOf(topic) {
    const topicName = topic.name;
    if (topicName in this.callbacks) {
      return this.callbacks[topicName];
    } else {
      let result = [];
      this.callbacks[topicName] = result;
      return result;
    }
  }
}
