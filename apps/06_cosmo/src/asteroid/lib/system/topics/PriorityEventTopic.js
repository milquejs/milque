/**
 * @template T
 * @typedef {(t: T) => void|boolean} PriorityTopicCallback<T>
 */

/**
 * @template T
 * @typedef PriorityTopicOptions
 * @property {number} priority
 * @property {PriorityTopicCallback<T>} callback
 */

/**
 * @param {PriorityTopicOptions<?>} a 
 * @param {PriorityTopicOptions<?>} b 
 */
function comparator(a, b) {
    return a.priority - b.priority;
}

/**
 * @template T
 */
export class PriorityEventTopic {

    constructor() {
        /**
         * @private
         * @type {Array<PriorityTopicOptions<T>>}
         */
        this.listeners = [];

        /**
         * @private
         * @type {Array<T>}
         */
        this.queued = [];
    }

    /**
     * @param {number} priority 
     * @param {PriorityTopicCallback<T>} callback 
     */
    on(priority, callback) {
        this.listeners.push({ priority, callback });
        this.listeners.sort(comparator);
        return this;
    }

    /**
     * @param {PriorityTopicCallback<T>} callback 
     */
    off(callback) {
        for(let i = 0; i < this.listeners.length; ++i) {
            if (this.listeners.at(i).callback === callback) {
                this.listeners.splice(i, 1);
                break;
            }
        }
        return this;
    }

    /**
     * @param {number} priority 
     * @param {PriorityTopicCallback<T>} callback 
     */
    once(priority, callback) {
        let wrapper = (attachment) => {
            this.off(wrapper);
            return callback(attachment);
        };
        return this.on(priority, wrapper);
    }

    /**
     * @param {T} [attachment]
     */
    dispatch(attachment = null) {
        this.queued.push(attachment);
        return this;
    }

    /**
     * @param {T} [attachment] 
     */
    dispatchImmediately(attachment = null) {
        for(let listener of this.listeners) {
            let result = listener.callback(attachment);
            // Consume the event if return true.
            if (result === true) {
                break;
            }
        }
        return this;
    }

    flush(max = 1000) {
        let i = 0;
        while(this.queued.length > 0 && i++ < max) {
            let attachment = this.queued.shift();
            this.dispatchImmediately(attachment);
        }
        return this;
    }

    count() {
        return this.listeners.length;
    }
}
