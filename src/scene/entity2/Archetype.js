import { Query } from './Query';

/**
 * @template {import('./EntityManager').QueryComponentMap} T
 */
export class Archetype {
  /**
   * @param {T} mapping
   */
  constructor(mapping) {
    /** @readonly */
    this.Query = new Query(...Object.values(mapping));
    /** @readonly */
    this.ResultMap = mapping;
  }

  /**
   * @param {import('./EntityManager').EntityManager} ents
   * @returns {import('./EntityManager').QueryResult<T>}
   */
  create(ents) {
    let entityId = ents.create();
    return computeCreateResult({}, ents, entityId, this.ResultMap);
  }

  /**
   * @param {import('./EntityManager').EntityManager} ents
   * @param {number} entityId
   */
  destroy(ents, entityId) {
    for (let componentClass of Object.values(this.ResultMap)) {
      ents.detach(entityId, componentClass);
    }
  }

  /**
   * @param {import('./EntityManager').EntityManager} ents
   * @param {number} entityId
   */
  find(ents, entityId) {
    return ents.find(entityId, this.ResultMap);
  }

  /**
   * @param {import('./EntityManager').EntityManager} ents
   * @returns {import('./EntityManager').QueryResult<T>}
   */
  findAny(ents) {
    return ents.findAny(this.Query, this.ResultMap);
  }

  /**
   * @param {import('./EntityManager').EntityManager} ents
   * @returns {Generator<import('./EntityManager').QueryResult<T>>}
   */
  *findAll(ents) {
    return ents.findAll(this.Query, this.ResultMap);
  }
}

/**
 * @template {object} T
 * @param {Record<string, any>} out
 * @param {import('./EntityManager').EntityManager} ents
 * @param {number} entityId
 * @param {T} resultMap
 * @returns {import('./EntityManager').QueryResult<T>}
 */
function computeCreateResult(out, ents, entityId, resultMap) {
  for (let [key, selector] of Object.entries(resultMap)) {
    if (Query.isQuerySelectorNot(selector)) {
      out[key] = null;
    } else if (Query.isQuerySelectorEntityId(selector)) {
      out[key] = entityId;
    } else {
      out[key] = ents.attach(entityId, selector);
    }
  }
  return /** @type {import('./EntityManager').QueryResult<any>} */ (out);
}
