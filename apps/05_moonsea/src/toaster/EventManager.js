export class EventManager {

  constructor() {
    /** @type {Record<string, Array<Function>>} */
    this.listeners = {};
    /** @type {Array<{ type: string }>} */
    this.eventQueue = [];

    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.flushEvents = this.flushEvents.bind(this);
  }

  /**
   * @param {string} eventType
   * @param {Function} callback
   * @returns {EventManager}
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
   * @returns {EventManager}
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

  clearEvents() {
    this.eventQueue.length = 0;
  }

  /**
   * @param {{ type: string }} event
   */
  dispatchEvent(event) {
    this.eventQueue.push(event);
  }

  /**
   * @param {number} [max]
   */
  flushEvents(max = 1_000) {
    let i = max;
    let events = this.eventQueue;
    let listenerMap = this.listeners;
    while (events.length > 0 && i > 0) {
      i--;
      let event = events.shift();
      let type = event.type;
      if (type in listenerMap) {
        let listeners = listenerMap[type];
        for (let listener of listeners) {
          let result = listener(event);
          if (result) {
            break;
          }
        }
      }
    }
  }
}
