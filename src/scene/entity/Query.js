import { ComponentClass } from './ComponentClass';
import { EntityManager } from './EntityManager';
import { isSelectorNot } from './QueryManager';

/** @typedef {import('./EntityManager').EntityId} EntityId */

/**
 * @template T
 * @typedef {import('./QueryManager').Selector<T>} Selector<T>
 */

/**
 * @template T
 * @typedef {import('./QueryManager').SelectorNot<T>} SelectorNot<T>
 */

export class Query {
  /**
   * @param {...ComponentClass<?>} selectors
   */
  constructor(...selectors) {
    if (selectors.length <= 0) {
      throw new Error('Must have at least 1 selector for query.');
    }
    this.selectors = selectors;
    this.key = computeSelectorKey(selectors);
  }

  /**
   * @param {Selector<?>} selector
   */
  hasSelector(selector) {
    if (isSelectorNot(selector)) {
      return (
        this.selectors.findIndex(
          (v) => isSelectorNot(v) && v.name === selector.name,
        ) >= 0
      );
    } else {
      return this.selectors.findIndex((v) => v.name === selector.name) >= 0;
    }
  }

  /**
   * @param {EntityManager} entityManager
   * @returns {number}
   */
  count(entityManager) {
    return entityManager.queries.count(entityManager, this);
  }

  /**
   * @param {EntityManager} entityManager
   * @returns {Generator<EntityId>}
   */
  *findEntityIds(entityManager) {
    const queryManager = entityManager.queries;
    for (let entityId of queryManager.findAll(entityManager, this)) {
      yield entityId;
    }
  }

  /**
   * @template T
   * @param {EntityManager} entityManager
   * @param {ComponentClass<T>} componentClass
   * @returns {Generator<T>}
   */
  *findComponents(entityManager, componentClass) {
    if (this.selectors.indexOf(componentClass) < 0) {
      throw new Error(
        `Cannot find component for class '${componentClass.name}' not in query.`,
      );
    }
    const queryManager = entityManager.queries;
    for (let entityId of queryManager.findAll(entityManager, this)) {
      yield entityManager.get(entityId, componentClass);
    }
  }
}

/**
 * @param {Array<ComponentClass<?>>} selectors
 */
function computeSelectorKey(selectors) {
  return selectors
    .map((s) => (isSelectorNot(s) ? `!${s.name}` : s.name))
    .sort()
    .join('&');
}
