export class SystemManager {
    constructor(...systems) {
        this.systems = systems;
        this.callbacks = [];
    }

    async load(ctx) {
        for(let system of this.systems) {
            let callback = await system(ctx);
            this.callbacks.push(callback);
        }
        return this;
    }

    update(ctx) {
        for(let system of this.systems) {
            system(ctx);
        }
        return this;
    }
}

/**
 * @template T
 */
export class SystemTopic {
    constructor() {
        this.queued = [];
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
