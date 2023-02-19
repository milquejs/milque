import { Topic } from './Topic.js';

/**
 * @template T
 */
export class CommandTopic extends Topic {
    
    constructor() {
        super();

        /**
         * @private
         * @type {Array<T>}
         */
        this.messages = [];
        
        /**
         * @private
         * @type {Array<T>}
         */
        this.queued = [];
    }

    /**
     * @override
     * @param {T} message 
     */
    dispatch(message) {
        this.queued.push(message);
    }

    /**
     * @override
     * @param {T} message 
     */
    dispatchImmediately(message) {
        this.messages.push(message);
    }

    /** @override */
    flush(max = 1000) {
        let result = this.queued.splice(0, Math.min(max, this.queued.length));
        this.messages.push(...result);
    }

    /**
     * @param {number} [max]
     * @return {Iterable<T>}
     */
    *poll(max = 1000) {
        let iterations = 0;
        while(iterations < max && this.messages.length > 0) {
            let message = this.messages.shift();
            yield message;
            ++iterations;
        }
    }
}
