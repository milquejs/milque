import { ComponentInstanceMap } from './ComponentInstanceMap';

/** @returns {import('./EntityTypes').EntityPoolLike} */
export function createPool() {
  return {
    components: {},
    nextAvailableEntityId: 1,
    unclaimedEntityIds: [],
    deadEntityIds: [],
  };
}

/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 */
export function resetPool(entityPool) {
  for(let instanceMap of Object.values(entityPool.components)) {
    instanceMap.clear();
  }
  entityPool.nextAvailableEntityId = 1;
  entityPool.unclaimedEntityIds.length = 0;
  entityPool.deadEntityIds.length = 0;
}

/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool
 * @returns {import('./EntityId').EntityId}
 */
export function newEntity(entityPool) {
  let result = entityPool.unclaimedEntityIds.pop();
  if (typeof result === 'undefined') {
    result = entityPool.nextAvailableEntityId;
    entityPool.nextAvailableEntityId += 1;
  }
  return result;
}

/**
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId 
 */
export function deleteEntity(entityPool, entityId) {
  entityPool.deadEntityIds.push(entityId);
  for (let instanceMap of Object.values(entityPool.components)) {
    instanceMap.delete(entityId);
  }
  entityPool.deadEntityIds.splice(entityPool.deadEntityIds.indexOf(entityId), 1);
  entityPool.unclaimedEntityIds.push(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {T}
 */
export function attachComponent(entityPool, entityId, componentClass) {
  if (entityPool.deadEntityIds.includes(entityId)) {
    // NOTE: This makes sure that when executing clean-up code, we don't re-add anything back in.
    throw new Error('Cannot attach components to a dead entity.');
  }
  if (!(componentClass.name in entityPool.components)) {
    let result = new ComponentInstanceMap(componentClass);
    entityPool.components[componentClass.name] = /** @type {any} */ (result);
  }
  return entityPool.components[componentClass.name].insert(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 */
export function detachComponent(entityPool, entityId, componentClass) {
  if (!(componentClass.name in entityPool.components)) {
    throw new Error(`Cannot detach component - no mapping exists for component class "${componentClass.name}".`);
  }
  return entityPool.components[componentClass.name].delete(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('./EntityId').EntityId} entityId
 * @param {import('../component').ComponentClass<T>} componentClass
 * @returns {T|null}
 */
export function lookupComponent(entityPool, entityId, componentClass) {
  let instanceMap = entityPool.components[componentClass.name];
  if (!instanceMap?.has(entityId)) {
    return null;
  }
  return instanceMap.lookup(entityId);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('../component').ComponentClass<T>} componentClass
 * @param {T} componentInstance
 * @returns {import('./EntityId').EntityId}
 */
export function lookupEntity(entityPool, componentClass, componentInstance) {
  let instanceMap = entityPool.components[componentClass.name];
  return instanceMap.keyOf(componentInstance);
}

/**
 * @template T
 * @param {import('./EntityTypes').EntityPoolLike} entityPool 
 * @param {import('../component').ComponentClass<T>} componentClass 
 * @returns {Iterable<T>}
 */
export function values(entityPool, componentClass) {
  return entityPool.components[componentClass.name]?.values() ?? [];
}
