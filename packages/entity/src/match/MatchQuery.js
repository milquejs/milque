import { EntityId } from '../local';

/**
 * @template {object} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {import('./MatchTypes').Match<T>} match
 * @param {EntityId} [entityId]
 * @returns {import('./MatchTypes').MatchResult<T>|null}
 */
export function queryMatch(entityPool, match, entityId = undefined) {
  const template = match.template;
  const templateEntries = Object.entries(template);
  const templateValues = Object.values(template);
  if (templateValues.length <= 0) {
    return null;
  }
  const smallest = findSmallestComponentClassByMapSize(
    entityPool,
    templateValues
  );
  if (!smallest) {
    return null;
  }
  if (typeof entityId === 'undefined') {
    entityId = entityPool.components[smallest.name]?.keys()[0];
  }
  /** @type {any} */
  let result = {};
  for (let [key, componentClass] of templateEntries) {
    const componentName = componentClass.name;
    if (componentName === EntityId.name) {
      result[key] = entityId;
      continue;
    }
    const instanceMap = entityPool.components[componentName];
    if (!instanceMap.has(entityId)) {
      // This is not a matching entity :(
      return null;
    }
    result[key] = instanceMap.lookup(entityId);
  }
  return asMatchResult(result);
}

/**
 * @template {object} T
 * @param {import('../local').EntityPoolLike} entityPool
 * @param {import('./MatchTypes').Match<T>} match
 * @returns {Generator<import('./MatchTypes').MatchResult<T>>}
 */
export function* queryMatchAll(entityPool, match) {
  const template = match.template;
  const templateEntries = Object.entries(template);
  const templateValues = Object.values(template);
  if (templateValues.length <= 0) {
    return;
  }
  const smallest = findSmallestComponentClassByMapSize(
    entityPool,
    templateValues
  );
  if (!smallest) {
    return;
  }
  for (let entityId of entityPool.components[smallest.name]?.keys()) {
    /** @type {any} */
    let result = {};
    for (let [key, componentClass] of templateEntries) {
      const componentName = componentClass.name;
      if (componentName === EntityId.name) {
        result[key] = entityId;
        continue;
      }
      const instanceMap = entityPool.components[componentName];
      if (!instanceMap.has(entityId)) {
        // This is not a matching entity :(
        continue;
      }
      result[key] = instanceMap.lookup(entityId);
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
 * @template {object} T
 * @param {Record<string, any>} out
 * @returns {import('./MatchTypes').MatchResult<T>}
 */
function asMatchResult(out) {
  return /** @type {import('./MatchTypes').MatchResult<any>} */ (out);
}
