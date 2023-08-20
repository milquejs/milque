import { ComponentClass } from './ComponentClass';

/** @typedef {import('./EntityManager').EntityManager} EntityManager */
/** @typedef {import('./EntityManager').EntityId} EntityId */
/** @typedef {import('./Query').Query} Query */

export class QueryManager {
  constructor() {
    /**
     * @protected
     * @type {Record<string, Array<EntityId>>}
     */
    this.cachedResults = {};
    /**
     * @private
     * @type {Record<string, Query>}
     */
    this.keyQueryMapping = {};

    this.onEntityComponentChanged = this.onEntityComponentChanged.bind(this);
  }

  /**
   * @param {EntityManager} entityManager
   * @param {EntityId} entityId
   * @param {ComponentClass<any>|null} added
   * @param {ComponentClass<any>|null} removed
   * @param {boolean} dead
   */
  onEntityComponentChanged(entityManager, entityId, added, removed, dead) {
    for (let query of Object.values(this.keyQueryMapping)) {
      let entities = this.cachedResults[query.key];
      if (dead) {
        let i = entities.indexOf(entityId);
        if (i >= 0) {
          entities.splice(i, 1);
        }
      } else if (added) {
        if (query.hasSelector(Not(added))) {
          let i = entities.indexOf(entityId);
          if (i >= 0) {
            entities.splice(i, 1);
          }
        } else if (
          query.hasSelector(added) &&
          this.test(entityManager, entityId, query.selectors)
        ) {
          let i = entities.indexOf(entityId);
          if (i < 0) {
            entities.push(entityId);
          }
        }
      } else if (removed) {
        if (
          query.hasSelector(Not(removed)) &&
          this.test(entityManager, entityId, query.selectors)
        ) {
          let i = entities.indexOf(entityId);
          if (i < 0) {
            entities.push(entityId);
          }
        } else if (
          query.hasSelector(removed) &&
          this.test(entityManager, entityId, query.selectors)
        ) {
          let i = entities.indexOf(entityId);
          if (i >= 0) {
            entities.splice(i, 1);
          }
        }
      }
    }
  }

  /**
   * @protected
   * @param {EntityManager} entityManager
   * @param {EntityId} entityId
   * @param {Array<ComponentClass<any>>} selectors
   */
  test(entityManager, entityId, selectors) {
    for (let selector of selectors) {
      if (isSelectorNot(selector)) {
        const componentClass = /** @type {SelectorNot<any>} */ (
          /** @type {unknown} */ (selector)
        ).value;
        if (entityManager.exists(entityId, componentClass)) {
          return false;
        }
      } else {
        const componentClass = /** @type {ComponentClass<any>} */ (
          /** @type {unknown} */ (selector)
        );
        if (!entityManager.exists(entityId, componentClass)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @protected
   * @param {Array<EntityId>} out
   * @param {EntityManager} entityManager
   * @param {Array<ComponentClass<any>>} selectors
   */
  hydrate(out, entityManager, selectors) {
    if (selectors.length <= 0) {
      out.length = 0;
      return out;
    }
    let entities = entityManager.entityIds();
    for (let entityId of entities) {
      if (this.test(entityManager, entityId, selectors)) {
        out.push(entityId);
      }
    }
    return out;
  }

  /**
   * @param {EntityManager} entityManager
   * @param {Query} query
   * @returns {Array<EntityId>}
   */
  findAll(entityManager, query) {
    const queryKey = query.key;
    /** @type {Array<EntityId>} */
    let result;
    if (!(queryKey in this.keyQueryMapping)) {
      result = [];
      this.keyQueryMapping[queryKey] = query;
      this.cachedResults[queryKey] = result;
      this.hydrate(result, entityManager, query.selectors);
    } else {
      result = this.cachedResults[queryKey];
    }
    return result;
  }

  /**
   * @param {EntityManager} entityManager
   * @param {Query} query
   */
  count(entityManager, query) {
    let result = this.findAll(entityManager, query);
    return result.length;
  }

  /**
   * @param {Query} query
   */
  clear(query) {
    const queryKey = query.key;
    if (!(queryKey in this.keyQueryMapping)) {
      return;
    }
    delete this.keyQueryMapping[queryKey];
    delete this.cachedResults[queryKey];
  }

  reset() {
    this.keyQueryMapping = {};
    this.cachedResults = {};
  }
}

/**
 * @template T
 * @typedef {SelectorNot<T>|ComponentClass<T>} Selector<T>
 */

/**
 * @template T
 * @typedef SelectorNot<T>
 * @property {'not'} type
 * @property {string} name
 * @property {ComponentClass<T>} value
 */

/**
 * @template T
 * @param {ComponentClass<T>} componentClass
 * @returns {ComponentClass<T>}
 */
export function Not(componentClass) {
  return {
    // @ts-ignore
    type: 'not',
    name: componentClass.name,
    value: componentClass,
  };
}

/**
 * @param {any} selector
 */
export function isSelectorNot(selector) {
  return 'type' in selector && selector.type === 'not';
}
