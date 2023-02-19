/**
 * @template T
 * @typedef {(t: T) => void|boolean} EventTopicCallback
 */

/** @template T */
export class EventTopic {

    constructor() {
        /**
         * @private
         * @type {Array<EventTopicCallback<T>>}
         */
        this.listeners = [];

        /**
         * @private
         * @type {Array<T>}
         */
        this.queued = [];
    }

    /**
     * @param {EventTopicCallback<T>} callback 
     */
    on(callback) {
        this.listeners.push(callback);
        return this;
    }

    /**
     * @param {EventTopicCallback<T>} callback 
     */
    off(callback) {
        let i = this.listeners.indexOf(callback);
        if (i >= 0) {
            this.listeners.splice(i, 1);
        }
        return this;
    }

    /**
     * @param {EventTopicCallback<T>} callback 
     */
    once(callback) {
        let wrapper = (attachment) => {
            this.off(wrapper);
            return callback(attachment);
        };
        this.on(wrapper);
        return this;
    }

    /**
     * @param {T} [attachment]
     */
    dispatch(attachment = null) {
        this.queued.push(attachment);
    }

    /**
     * @param {T} [attachment] 
     */
    dispatchImmediately(attachment = null) {
        for(let listener of this.listeners) {
            let result = listener(attachment);
            // Consume the event if return true.
            if (result === true) {
                break;
            }
        }
    }

    flush(max = 1000) {
        let i = 0;
        while(this.queued.length > 0 && i++ < max) {
            let attachment = this.queued.shift();
            this.dispatchImmediately(attachment);
        }
    }

    count() {
        return this.listeners.length;
    }
}
