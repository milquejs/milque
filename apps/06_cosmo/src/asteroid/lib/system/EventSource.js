/**
 * @template T
 * @typedef {(t: T) => void|boolean} EventSourceCallback
 */

/** @template T */
export class EventSource {

    constructor() {
        /**
         * @private
         * @type {Array<EventSourceCallback<T>>}
         */
        this.listeners = [];
    }

    /**
     * @param {EventSourceCallback<T>} callback 
     */
    addEventListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * @param {EventSourceCallback<T>} callback
     */
    removeEventListener(callback) {
        let i = this.listeners.indexOf(callback);
        if (i >= 0) {
            this.listeners.splice(i, 1);
        }
    }

    /**
     * @returns {number}
     */
    countEventListeners() {
        return this.listeners.length;
    }

    /**
     * @protected
     */
    getEventListeners() {
        return this.listeners;
    }

    /**
     * @param {T} attachment
     */
    dispatchEvent(attachment) {
        for(let listener of this.listeners) {
            let result = listener(attachment);
            // Consume the event if return true.
            if (result === true) {
                break;
            }
        }
    }
}
