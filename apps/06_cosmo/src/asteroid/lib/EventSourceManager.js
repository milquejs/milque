/**
 * @template T
 * @typedef {(attachment: T) => boolean|void} EventCallback
 */

export class EventSourceManager {

    constructor() {
        this.sources = [];
    }

    addEventSource(eventSource) {
        this.sources.push(eventSource);
    }

    removeEventSource(eventSource) {
        let i = this.sources.indexOf(eventSource);
        if (i < 0) {
            return;
        }
        this.sources.splice(i, 1);
    }

    reset() {
        for(let eventSource of this.sources) {
            eventSource.reset();
        }
    }

    flush() {
        for(let eventSource of this.sources) {
            eventSource.flush();
        }
    }
}

/**
 * @template T
 */
export class EventSource {

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
        
        /** @protected */
        this.parent = null;

        /**
         * @protected
         * @type {Array<EventCallback<T>>}
         */
        this.listeners = [];

        /** @protected */
        this.queue = [];
    }

    /** @protected */
    register(parent) {
        this.parent = parent;
    }

    /** @protected */
    unregister() {
        this.parent = null;
    }

    /**
     * @param {EventCallback<T>} callback
     */
    on(callback) {
        this.listeners.push(callback);
        return this;
    }

    /**
     * @param {EventCallback<T>} callback
     */
    off(callback) {
        let i = this.listeners.lastIndexOf(callback);
        if (i >= 0) {
            this.listeners.splice(i, 1);
        }
        return this;
    }

    /**
     * @param {EventCallback<T>} callback
     */
    once(callback) {
        let wrapper = (attachment) => {
            this.off(wrapper);
            return callback(attachment);
        };
        return this.on(wrapper);
    }

    /**
     * @param {T} attachment
     */
    send(attachment) {
        this.queue.push(attachment);
        return this;
    }

    /**
     * @param {T} attachment 
     */
    sendImmediately(attachment) {
        for(let listener of this.listeners) {
            let result = listener(attachment);
            if (result === true) {
                break;
            }
        }
    }

    reset() {
        this.listeners.length = 0;
        this.queue.length = 0;
    }

    flush(max = 1000) {
        let i = 0;
        while(this.queue.length > 0 && i++ < max) {
            let attachment = this.queue.shift();
            this.sendImmediately(attachment);
        }
    }
}
