import { EntityId, LocalEntityPool } from '../local';
import { MatchFactory, queryMatch, queryMatchAll } from '../match';

/**
 * @template {import('../match').MatchTemplate} T
 */
export class Archetype {

  /**
   * @template {import('../match').MatchTemplate} T
   * @param {T} components
   */
  static from(components) {
    return new Archetype(components);
  }

  /**
   * @private
   * @param {T} components
   */
  constructor(components) {
    /** @private */
    this.components = components;
    this.match = MatchFactory.createMatch(components);
  }

  /**
   * @param {import('../local').EntityPoolLike} entityPool
   * @returns {import('../match').MatchResult<T>}
   */
  newEntity(entityPool) {
    let entityId = LocalEntityPool.newEntity(entityPool);
    /** @type {any} */
    let result = {};
    for(let [key, componentClass] of Object.entries(this.components)) {
      const componentName = componentClass.name;
      if (componentName === EntityId.name) {
        result[key] = entityId;
        continue;
      }
      result[key] = LocalEntityPool.attachComponent(entityPool, entityId, componentClass);
    }
    return result;
  }

  /**
   * @param {import('../local').EntityPoolLike} entityPool
   * @param {EntityId} [entityId] 
   */
  query(entityPool, entityId = undefined) {
    return queryMatch(entityPool, this.match, entityId);
  }

  /**
   * @param {import('../local').EntityPoolLike} entityPool
   */
  queryAll(entityPool) {
    return queryMatchAll(entityPool, this.match);
  }

  asMatch() {
    return this.match;
  }
}
