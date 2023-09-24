import { ComponentFactory } from './ComponentFactory';
import { ComponentMap, getComponentName } from './ComponentMap';
import { Query } from './Query';
import { QueryManager } from './QueryManager';

/**
 * @template T
 * @typedef {{ new (): T }} ComponentConstructor
 */

/**
 * @template T
 * @typedef {ComponentFactory<T>|ComponentConstructor<T>} ComponentClass
 */

export class EntityManager {
  /**
   * @protected
   * @type {Record<string, ComponentMap<any>>}
   */
  components = {};
  /** @protected */
  nextAvailableEntityId = 1;
  /** @protected */
  queries = new QueryManager();

  /**
   * @param {number} entityId
   * @param {ComponentClass<any>|null} attached
   * @param {ComponentClass<any>|null} detached
   * @param {boolean} dead
   */
  dispatchEntityChanged(entityId, attached, detached, dead) {
    this.queries.onEntityChanged(this, entityId, attached, detached, dead);
  }

  /** @returns {number} */
  create() {
    const entityId = this.nextAvailableEntityId++;
    this.dispatchEntityChanged(entityId, null, null, false);
    return entityId;
  }

  /**
   * @param {number} entityId
   */
  destroy(entityId) {
    for (let map of Object.values(this.components)) {
      if (map.has(entityId)) {
        map.delete(entityId);
        this.dispatchEntityChanged(entityId, null, map.componentClass, false);
      }
    }
    this.dispatchEntityChanged(entityId, null, null, true);
  }

  /**
   * Whether the entity exists with all provided component classes.
   *
   * @param {number} entityId
   * @param {...ComponentClass<any>} componentClasses
   */
  exists(entityId, ...componentClasses) {
    if (componentClasses.length <= 0) {
      // Find in ANY componentClass...
      for (let map of Object.values(this.components)) {
        if (map.has(entityId)) {
          return true;
        }
      }
      return false;
    }

    // Find in ALL given componentClasses...
    for (const componentClass of componentClasses) {
      const componentName = getComponentName(componentClass);
      let map = this.components[componentName];
      if (!map.has(entityId)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @template T
   * @param {number} entityId
   * @param {ComponentClass<T>} componentClass
   * @param {T} [initialValue]
   * @returns {T}
   */
  attach(entityId, componentClass, initialValue = undefined) {
    let map = this.resolve(componentClass);
    if (map.has(entityId)) {
      throw new Error(
        `Cannot attach more than 1 of the same component class '${componentClass}' for entity '${entityId}'.`,
      );
    }
    let result = map.add(entityId, initialValue);
    this.dispatchEntityChanged(entityId, componentClass, null, false);
    return result;
  }

  /**
   * @template T
   * @param {number} entityId
   * @param {ComponentClass<T>} componentClass
   */
  detach(entityId, componentClass) {
    let map = this.resolve(componentClass);
    if (!map.has(entityId)) {
      throw new Error(
        `Cannot detach non-existant component class '${componentClass}' for entity '${entityId}'.`,
      );
    }
    map.delete(entityId);
    this.dispatchEntityChanged(entityId, null, componentClass, false);
  }

  /**
   * @template T
   * @param {number} entityId
   * @param {ComponentClass<T>} componentClass
   * @returns {T}
   */
  get(entityId, componentClass) {
    return this.resolve(componentClass).get(entityId);
  }

  /**
   * @param {ComponentClass<any>} componentClass
   * @returns {number}
   */
  count(componentClass) {
    return this.resolve(componentClass).size;
  }

  /**
   * @template T
   * @protected
   * @param {ComponentClass<T>} componentClass
   * @returns {ComponentMap<T>}
   */
  resolve(componentClass) {
    const componentName = getComponentName(componentClass);
    if (componentName in this.components) {
      return this.components[componentName];
    }
    let result = new ComponentMap(componentClass);
    this.components[componentName] = result;
    return result;
  }

  entityIds() {
    return new Set(
      Object.values(this.components)
        .map((map) => map.entityIds())
        .flat(),
    );
  }

  componentClasses() {
    return Object.values(this.components).map((map) => map.componentClass);
  }

  /**
   * @template {QueryComponentMap} T
   * @param {number} entityId
   * @param {T} resultMap
   * @returns {QueryResult<T>}
   */
  find(entityId, resultMap) {
    if (entityId <= 0) {
      return /** @type {QueryResult<T>} */ ({});
    }
    return computeResult({}, this, entityId, resultMap);
  }

  /**
   * @template {QueryComponentMap} T
   * @param {Query} query
   * @param {T} resultMap
   * @returns {QueryResult<T>}
   */
  findAny(query, resultMap) {
    let entityId = this.queries.findAny(this, query);
    if (!entityId) {
      return /** @type {QueryResult<T>} */ ({});
    }
    return computeResult({}, this, entityId, resultMap);
  }

  /**
   * @template {QueryComponentMap} T
   * @param {Query} query
   * @param {T} resultMap
   * @returns {Generator<QueryResult<T>>}
   */
  *findAll(query, resultMap) {
    let result = {};
    for (let entityId of this.queries.findAll(this, query)) {
      yield computeResult(result, this, entityId, resultMap);
    }
  }

  reset() {
    /** @type {Set<number>} */
    let entities = new Set();
    for (let map of Object.values(this.components)) {
      for (let entityId of map.entityIds()) {
        entities.add(entityId);
      }
    }
    for (let entityId of entities) {
      this.destroy(entityId);
    }
    entities.clear();
    this.queries.reset();
    this.components = {};
    this.nextAvailableEntityId = 1;
  }
}

/**
 * @typedef {Record<string, ComponentClass<any>>} QueryComponentMap
 */

/**
 * @template {QueryComponentMap} T
 * @typedef {{[K in keyof T]: T[K] extends ComponentClass<infer V> ? V : never}} QueryComponentInstancesOf<T>
 */

/**
 * @template {QueryComponentMap} T
 * @typedef {QueryComponentInstancesOf<T>} QueryResult
 */

/**
 * @template {object} T
 * @param {Record<string, any>} out
 * @param {EntityManager} ents
 * @param {number} entityId
 * @param {T} resultMap
 * @returns {QueryResult<T>}
 */
function computeResult(out, ents, entityId, resultMap) {
  for (let [key, selector] of Object.entries(resultMap)) {
    if (Query.isQuerySelectorNot(selector)) {
      out[key] = null;
    } else if (Query.isQuerySelectorEntityId(selector)) {
      out[key] = entityId;
    } else {
      out[key] = ents.get(entityId, selector);
    }
  }
  return /** @type {QueryResult<any>} */ (out);
}
