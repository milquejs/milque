export class EventManager {
    constructor() {
        /**
         * @private
         * @type {Record<string, Array<Function>>}
         */
        this.listeners = {};
    }

    /**
     * @param {string} eventName 
     * @param {Function} callback 
     * @returns {EventManager}
     */
    on(eventName, callback) {
        this.addEventListener(eventName, callback);
        return this;
    }

    /**
     * @param {string} eventName 
     * @param {Function} callback 
     * @returns {EventManager}
     */
    off(eventName, callback) {
        this.removeEventListener(eventName, callback);
        return this;
    }

    /**
     * @param {string} eventName 
     * @param {Function} callback 
     * @returns {EventManager}
     */
    once(eventName, callback) {
        let wrapper = (...args) => {
            this.removeEventListener(eventName, wrapper);
            return callback(...args);
        };
        this.addEventListener(eventName, wrapper);
        return this;
    }

    /**
     * @param {string} eventName 
     * @param {Array<any>} eventArgs 
     * @returns {EventManager}
     */
    emit(eventName, ...eventArgs) {
        this.dispatchEvent(eventName, eventArgs);
        return this;
    }

    /**
     * @param {string} eventName 
     * @param {Function} callback 
     */
    addEventListener(eventName, callback) {
        if (eventName in this.listeners) {
            this.listeners[eventName].push(callback);
        } else {
            this.listeners[eventName] = [callback];
        }
    }

    /**
     * @param {string} eventName 
     * @param {Function} callback
     */
    removeEventListener(eventName, callback) {
        if (!(eventName in this.listeners)) {
            return;
        }
        let list = this.listeners[eventName];
        let i = list.indexOf(callback);
        if (i >= 0) {
            list.splice(i, 1);
        }
    }

    /**
     * @param {string} eventName 
     * @returns {number}
     */
    countEventListeners(eventName) {
        if (!(eventName in this.listeners)) {
            return 0;
        }
        return this.listeners[eventName].length;
    }

    /**
     * @protected
     * @param {string} eventName
     */
    getEventListeners(eventName) {
        if (!(eventName in this.listeners)) {
            return [];
        }
        return this.listeners[eventName];
    }

    /**
     * @param {string} eventName 
     * @param {Array<any>} eventArgs
     */
    dispatchEvent(eventName, ...eventArgs) {
        if (!(eventName in this.listeners)) {
            return;
        }
        for(let listener of this.listeners[eventName]) {
            let result = listener(...eventArgs);
            // Consume the event if return true.
            if (typeof result !== 'undefined' && result === true) {
                break;
            }
        }
    }
}
