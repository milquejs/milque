/**
 * @typedef {import('../../EntityManager.js').EntityId} EntityId
 */

/**
 * @interface
 * @template Component
 */
export class ComponentFactory
{
    /**
     * @abstract
     * @param {EntityId} entityId
     */
    create(entityId) {}

    /**
     * @abstract
     * @param {EntityId} entityId
     */
    delete(entityId) {}

    /**
     * @abstract
     * @param {EntityId} entityId
     * @returns {Component}
     */
    get(entityId) {}

    /**
     * @abstract
     * @param {EntityId} entityId
     * @returns {boolean}
     */
    has(entityId) {}

    /** @abstract */
    clear() {}
}
