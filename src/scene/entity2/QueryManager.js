import { Query } from './Query';

export class QueryManager {
  /**
   * @protected
   * @type {Record<string, Array<number>>}
   */
  cachedResults = {};

  /**
   * @private
   * @type {Record<string, Query>}
   */
  keyQueryMapping = {};

  /**
   * @param {import('./EntityManager').EntityManager} entityManager
   * @param {number} entityId
   * @param {import('./EntityManager').ComponentClass<any>|null} attached
   * @param {import('./EntityManager').ComponentClass<any>|null} detached
   * @param {boolean} dead
   */
  onEntityChanged(entityManager, entityId, attached, detached, dead) {
    for (let query of Object.values(this.keyQueryMapping)) {
      let entities = this.cachedResults[query.key];
      if (dead) {
        let i = entities.indexOf(entityId);
        if (i >= 0) {
          entities.splice(i, 1);
        }
      } else if (attached) {
        if (query.hasSelector(Query.Not(attached))) {
          let i = entities.indexOf(entityId);
          if (i >= 0) {
            entities.splice(i, 1);
          }
        } else if (
          query.hasSelector(attached) &&
          this.test(entityManager, entityId, query.selectors)
        ) {
          let i = entities.indexOf(entityId);
          if (i < 0) {
            entities.push(entityId);
          }
        }
      } else if (detached) {
        if (
          query.hasSelector(Query.Not(detached)) &&
          this.test(entityManager, entityId, query.selectors)
        ) {
          let i = entities.indexOf(entityId);
          if (i < 0) {
            entities.push(entityId);
          }
        } else if (
          query.hasSelector(detached) &&
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
   * @param {import('./EntityManager').EntityManager} entityManager
   * @param {number} entityId
   * @param {Array<import('./Query').QuerySelector<any>>} selectors
   */
  test(entityManager, entityId, selectors) {
    for (let selector of selectors) {
      if (Query.isQuerySelectorNot(selector)) {
        const componentClass =
          /** @type {import('./Query').QuerySelectorModifierNot<any>} */ (
            /** @type {unknown} */ (selector)
          ).value;
        if (entityManager.exists(entityId, componentClass)) {
          return false;
        }
      } else {
        const componentClass =
          /** @type {import('./EntityManager').ComponentClass<any>} */ (
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
   * @param {Array<number>} out
   * @param {import('./EntityManager').EntityManager} entityManager
   * @param {Array<import('./Query').QuerySelector<any>>} selectors
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
   * @param {import('./EntityManager').EntityManager} entityManager
   * @param {Query} query
   * @returns {number}
   */
  findAny(entityManager, query) {
    let result = this.findAll(entityManager, query);
    if (result.length > 0) {
      return result[Math.floor(Math.random() * result.length)];
    } else {
      return 0;
    }
  }

  /**
   * @param {import('./EntityManager').EntityManager} entityManager
   * @param {Query} query
   * @returns {Array<number>}
   */
  findAll(entityManager, query) {
    const queryKey = query.key;
    /** @type {Array<number>} */
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
   * @param {import('./EntityManager').EntityManager} entityManager
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
