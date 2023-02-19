/**
 * @typedef {import('./EntityManager.js').EntityId} EntityId
 * @typedef {import('./EntityManager.js').EntityManager} EntityManager
 */

/**
 * @template T
 * @callback ComponentType<T>
 * @param {Object} props
 * @param {EntityId} entityId
 * @returns {T}
 */

/**
 * A utility class to help build entities more easily.
 */
export class EntityBuilder {
  /**
   * @param {EntityManager} entityManager
   * @param {EntityId} entityId
   * @returns {EntityId}
   */
  static bindEntity(entityManager, entityId) {
    this.entityManager = entityManager;
    this.entityId = entityId;
    return entityId;
  }

  /**
   * @template T
   * @param {ComponentType<T>} componentType
   * @param {Object} [props]
   * @returns {T}
   */
  static addComponent(componentType, props = undefined) {
    return this.entityManager.add(componentType, this.entityId, props);
  }

  /**
   * @param {ComponentType<?>} componentType
   * @returns {Boolean}
   */
  static removeComponent(componentType) {
    return this.entityManager.remove(componentType, this.entityId);
  }
}
/** @type {EntityManager} */
EntityBuilder.entityManager = null;
/** @type {EntityId} */
EntityBuilder.entityId = null;
