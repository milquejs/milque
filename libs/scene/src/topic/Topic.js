/** @typedef {import('./TopicManager').TopicManager} TopicManager */

/**
 * @template T
 * @typedef {import('./TopicManager').TopicCallback<T>} TopicCallback<T>
 */

/**
 * @template T
 */
export class Topic {

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatch(topicManager, attachment) {
        topicManager.dispatch(this, attachment);
    }

    /**
     * @param {TopicManager} topicManager
     * @param {T} attachment
     */
    dispatchImmediately(topicManager, attachment) {
        topicManager.dispatchImmediately(this, attachment);
    }

    /**
     * @param {TopicManager} topicManager
     * @param {number} priority
     * @param {TopicCallback<T>} callback
     */
    on(topicManager, priority, callback) {
        topicManager.addEventListener(this, callback, { priority });
        return this;
    }

    /**
     * @param {TopicManager} topicManager
     * @param {TopicCallback<T>} callback
     */
    off(topicManager, callback) {
        topicManager.removeEventListener(this, callback);
        return this;
    }

    /**
     * @param {TopicManager} topicManager
     * @param {number} priority
     * @param {TopicCallback<T>} callback
     */
    once(topicManager, priority, callback) {
        let wrapper = (attachment) => {
            this.off(topicManager, wrapper);
            return callback(attachment);
        };
        return this.on(topicManager, priority, wrapper);
    }

    /**
     * @param {TopicManager} topicManager 
     * @param {number} amount 
     */
    *poll(topicManager, amount) {
        amount = Math.min(amount, topicManager.count(this));
        for(let i = 0; i < amount; ++i) {
            yield topicManager.poll(this);
        }
    }

    /**
     * @param {TopicManager} topicManager 
     * @param {number} amount 
     */
    retain(topicManager, amount) {
        topicManager.retain(this, amount);
    }

    /**
     * @param {TopicManager} topicManager 
     * @param {number} amount 
     */
    *pollAndRetain(topicManager, amount) {
        this.retain(topicManager, amount);
        for(let result of this.poll(topicManager, amount)) {
            yield result;
        }
    }
}
