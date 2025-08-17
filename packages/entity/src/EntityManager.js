import { EntityId, LocalEntityPool } from './local';

export class EntityManager {

  /** @type {import('./local').EntityPoolLike['components']} */
  components = {};
  /** @type {import('./local').EntityPoolLike['nextAvailableEntityId']} */
  nextAvailableEntityId = 1;
  /** @type {import('./local').EntityPoolLike['unclaimedEntityIds']} */
  unclaimedEntityIds = [];
  /** @type {import('./local').EntityPoolLike['deadEntityIds']} */
  deadEntityIds = [];

  newEntity() {
    return LocalEntityPool.newEntity(this);
  }

  /**
   * @param {EntityId} entityId
   */
  deleteEntity(entityId) {
    LocalEntityPool.deleteEntity(this, entityId);
  }

  /**
   * @template T
   * @param {EntityId} entityId 
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  attachComponent(entityId, componentClass) {
    return LocalEntityPool.attachComponent(this, entityId, componentClass);
  }

  /**
   * @template T
   * @param {EntityId} entityId 
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  detachComponent(entityId, componentClass) {
    return LocalEntityPool.detachComponent(this, entityId, componentClass);
  }

  /**
   * @template T
   * @param {EntityId} entityId 
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  lookupComponent(entityId, componentClass) {
    return LocalEntityPool.lookupComponent(this, entityId, componentClass);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componetClass 
   * @param {T} instance 
   */
  lookupEntity(componetClass, instance) {
    return LocalEntityPool.lookupEntity(this, componetClass, instance);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass 
   */
  countComponents(componentClass) {
    return LocalEntityPool.countComponents(this, componentClass);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass
   */
  keysOf(componentClass) {
    return LocalEntityPool.keysOf(this, componentClass);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass
   */
  instancesOf(componentClass) {
    return LocalEntityPool.instancesOf(this, componentClass);
  }

  /**
   * @template {import('./match').MatchTemplate} T
   * @param {T} selector 
   * @param {EntityId} [entityId]
   */
  find(selector, entityId) {
    return LocalEntityPool.find(this, selector, entityId);
  }

  /**
   * @template T
   * @param {import('./component').ComponentClass<T>} componentClass 
   * @param {EntityId} [entityId]
   */
  findOne(componentClass, entityId) {
    return LocalEntityPool.findOne(this, componentClass, entityId);
  }

  /**
   * @template {import('./match').MatchTemplate} T
   * @param {T} selector 
   */
  *findAll(selector) {
    yield* LocalEntityPool.findAll(this, selector);
  }

  resetPool() {
    LocalEntityPool.resetPool(this);
  }
}
