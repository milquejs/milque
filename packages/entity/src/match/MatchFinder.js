import { EntityId } from '../local/EntityId';
import { MatchFilter } from './MatchFilter';

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {T} selector
 * @param {EntityId} [entityId]
 * @returns {import('./MatchTypes').MatchResult<T>|null}
 */
export function find(entityPool, selector, entityId = undefined) {
  const allKeys = Object.keys(selector);
  if (allKeys.length <= 0) {
    return null;
  }
  const allEntries = Object.entries(selector);
  const allValues = Object.values(selector);
  if (typeof entityId === 'undefined') {
    const smallest = findSmallestComponentClassByMapSize(
      entityPool,
      allValues
    );
    if (!smallest) {
      return null;
    }
    entityId = entityPool.components[smallest.name]?.keys()[0];
  }
  /** @type {any} */
  let result = {};
  // Prepare this early...
  for(let key of allKeys) {
    result[key] = null;
  }
  forComponents:
  for (let [key, componentClass] of allEntries) {
    const componentName = componentClass.name;
    switch(componentName) {
      case EntityId.name:
        result[key] = entityId;
        // This is processed now. Next component...
        continue forComponents;
      case MatchFilter.NoneOf.name:
        for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterNoneOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
          const matchedName = matchedKey.name;
          const instanceMap = entityPool.components[matchedName];
          if (instanceMap.has(entityId)) {
            // This is a none matcher! Exclude this entity...
            return null;
          }
        }
        break;
      case MatchFilter.SomeOf.name:
        for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterSomeOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
          const matchedName = matchedKey.name;
          const instanceMap = entityPool.components[matchedName];
          if (instanceMap.has(entityId)) {
            // This is an optional matcher and we found something! Next required component...
            result[key] = instanceMap.lookup(entityId);
            continue forComponents;
          }
        }
        // ...or we did not find anything, but okay since optional. Next component...
        result[key] = null;
        break;
      default:
        const instanceMap = entityPool.components[componentName];
        if (!instanceMap.has(entityId)) {
          // This is not a matching entity :( Skip this entity...
          return null;
        }
        result[key] = instanceMap.lookup(entityId);
    }
  }
  return asMatchResult(result);
}

/**
 * @template T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {import('../component').ComponentClass<T>} componentClass
 * @param {EntityId} [entityId]
 * @returns {T|null}
 */
export function findOne(entityPool, componentClass, entityId = undefined) {
  const map = entityPool.components[componentClass.name];
  if (!map) {
    return null;
  }
  const keys = map.keys();
  if (keys.length <= 0) {
    return null;
  }
  if (typeof entityId === 'undefined') {
    entityId = keys[0];
  }
  return map.lookup(entityId);
}

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {T} selector
 * @returns {Generator<import('./MatchTypes').MatchResult<T>>}
 */
export function* findAll(entityPool, selector) {
  const templateKeys = Object.keys(selector);
  if (templateKeys.length <= 0) {
    return;
  }
  const templateEntries = Object.entries(selector);
  const templateValues = Object.values(selector);
  const smallest = findSmallestComponentClassByMapSize(
    entityPool,
    templateValues
  );
  if (!smallest) {
    return;
  }
  /** @type {any} */
  let result = {};
  // Prepare this early...
  for(let key of templateKeys) {
    result[key] = null;
  }
  forEntityIds:
  for (let entityId of entityPool.components[smallest.name]?.keys()) {
    forComponents:
    for (let [key, componentClass] of templateEntries) {
      const componentName = componentClass.name;
      switch(componentName) {
        case EntityId.name:
          result[key] = entityId;
          // This is processed now. Next component...
          continue forComponents;
        case MatchFilter.NoneOf.name:
          for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterNoneOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
            const matchedName = matchedKey.name;
            const instanceMap = entityPool.components[matchedName];
            if (instanceMap.has(entityId)) {
              // This is a none matcher! Exclude this entity...
              continue forEntityIds;
            }
          }
          break;
        case MatchFilter.SomeOf.name:
          for (let matchedKey of /** @type {import('./MatchFilter').MatchFilterSomeOf<import('../component').ComponentClass<unknown>[]>} */ (componentClass).keys) {
            const matchedName = matchedKey.name;
            const instanceMap = entityPool.components[matchedName];
            if (instanceMap.has(entityId)) {
              // This is an optional matcher and we found something! Next required component...
              result[key] = instanceMap.lookup(entityId);
              continue forComponents;
            }
          }
          // ...or we did not find anything, but okay since optional. Next component...
          result[key] = null;
          break;
        default:
          const instanceMap = entityPool.components[componentName];
          if (!instanceMap.has(entityId)) {
            // This is not a matching entity :( Skip this entity...
            continue forEntityIds;
          }
          result[key] = instanceMap.lookup(entityId);
      }
    }
    yield asMatchResult(result);
  }
}

/**
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {Array<import('../component').ComponentClass<any>>} componentClasses
 */
function findSmallestComponentClassByMapSize(
  entityPool,
  componentClasses
) {
  let smallest = null;
  let smallestSize = Number.POSITIVE_INFINITY;
  for (let nextClass of componentClasses) {
    const nextClassName = nextClass.name;
    if (nextClassName === EntityId.name) {
      continue;
    }
    let instanceMap = entityPool.components[nextClassName];
    if (!instanceMap) {
      // NOTE: There's a component class with NO entities. This query will never succeed with results.
      return null;
    }
    let nextSize = instanceMap.size;
    if (nextSize < smallestSize) {
      smallest = nextClass;
      smallestSize = nextSize;
    }
  }
  if (!smallest) {
    // This was an empty or only-entity-id query. This should not happen since we checked during construction.
    throw new Error(
      'Cannot find any non-EntityId component class to match for query.'
    );
  }
  return smallest;
}

/**
 * @template {import('./MatchTypes').MatchTemplate} T
 * @param {Record<string, any>} out
 * @returns {import('./MatchTypes').MatchResult<T>}
 */
function asMatchResult(out) {
  return /** @type {import('./MatchTypes').MatchResult<any>} */ (out);
}
