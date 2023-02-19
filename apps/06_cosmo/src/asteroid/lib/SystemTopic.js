/**
 * @template T
 */
export class SystemTopic {
    
    constructor() {
        /** @private */
        this.queued = [];
        /** @private */
        this.messages = [];
    }

    /**
     * @param {T} message 
     */
    push(message) {
        this.queued.push(message);
    }

    /**
     * @param {T} message 
     */
    pushImmediately(message) {
        this.messages.push(message);
    }

    flush() {
        this.messages.push(...this.queued);
        this.queued.length = 0;
        return this;
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
