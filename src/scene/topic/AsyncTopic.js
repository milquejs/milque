import { Topic } from './Topic';

/** @typedef {import('./TopicManager').TopicManager} TopicManager */

/**
 * @template T
 * @typedef {(attachment: T) => Promise<void>} AsyncTopicCallback<T>
 */

/**
 * @template T
 * @extends Topic<T>
 */
export class AsyncTopic extends Topic {
  /**
   * @param {string} name
   */
  constructor(name) {
    super(name);
  }

  /**
   * @override
   * @param {TopicManager} topicManager
   * @param {T} attachment
   */
  async dispatch(topicManager, attachment) {
    // TODO: Topics don't really support async yet. 1. No result processing. 2. TopicManager doesn't really care.
    throw new Error('Not yet implemented');
  }

  /**
   * @override
   * @param {TopicManager} topicManager
   * @param {T} attachment
   */
  async dispatchImmediately(topicManager, attachment) {
    // @ts-ignore
    await topicManager.dispatchImmediatelyAndWait(this, attachment);
  }

  /**
   * @override
   * @param {TopicManager} topicManager
   * @param {number} priority
   * @param {AsyncTopicCallback<T>} callback
   */
  // @ts-ignore
  on(topicManager, priority, callback) {
    // @ts-ignore
    return super.on(topicManager, priority, callback);
  }

  /**
   * @override
   * @param {TopicManager} topicManager
   * @param {AsyncTopicCallback<T>} callback
   */
  // @ts-ignore
  off(topicManager, callback) {
    // @ts-ignore
    return super.off(topicManager, callback);
  }

  /**
   * @override
   * @param {TopicManager} topicManager
   * @param {number} priority
   * @param {AsyncTopicCallback<T>} callback
   */
  // @ts-ignore
  once(topicManager, priority, callback) {
    // @ts-ignore
    return super.once(topicManager, priority, callback);
  }
}
