import { useEffect } from './index.js';
import { ManagerBase } from './ManagerBase.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemEvent} SystemEvent
 */

/**
 * @param {SystemContext} m
 * @param {string} eventType
 * @param {Function} callback
 */
export function useEvent(m, eventType, callback) {
    useEffect(m, () => {
        let eventManager = m.__manager__.managers.events;
        eventManager.addEventListener(eventType, callback);
        return () => {
            eventManager.removeEventListener(eventType, callback);
        };
    });
}

/**
 * @param {SystemContext} m
 * @param {SystemEvent} event
 */
export function dispatchEvent(m, event) {
    let eventManager = m.__manager__.managers.events;
    eventManager.dispatchEvent(event);
}

const MAX_EVENTS_PROCESSED_PER_TICK = 1000;
const SYSTEM_UPDATE_EVENT = {
    type: 'systemUpdate',
};

export class EventManager extends ManagerBase {

    constructor() {
        super();

        /** @type {Record<string, Array<Function>>} */
        this.listeners = {};
        /** @type {Array<SystemEvent>} */
        this.eventQueue = [];
    }

    /**
     * @param {{ type: string }} event
     */
    dispatchEvent(event) {
        this.eventQueue.push(event);
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

    /**
     * @override
     */
    onPostUpdate() {
        this.dispatchEvent(SYSTEM_UPDATE_EVENT);
        this.pollEvents();
    }

    /** @private */
    pollEvents() {
        let i = MAX_EVENTS_PROCESSED_PER_TICK;
        let events = this.eventQueue;
        let listenerMap = this.listeners;
        while (events.length > 0 && i > 0) {
            i--;
            let event = events.shift();
            let type = event.type;
            if (type in listenerMap) {
                let listeners = listenerMap[type];
                for (let listener of listeners) {
                    try {
                        let result = listener(event);
                        if (result) {
                            break;
                        }
                    } catch (e) {
                        this.onError(e);
                    }
                }
            }
        }
    }

    /** @protected */
    onError(e) {
        console.error(e);
    }
}
