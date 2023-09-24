/**
 * @template T
 * @typedef {QuerySelectorComponent<T>|QuerySelectorModifier<T>|QuerySelectorImplicit} QuerySelector<T>
 */
import { ComponentFactory } from './ComponentFactory';

/**
 * @template T
 * @typedef {import('./EntityManager').ComponentClass<T>} QuerySelectorComponent
 */

/**
 * @template T
 * @typedef {QuerySelectorModifierNot<T>} QuerySelectorModifier
 */

/**
 * @typedef {QuerySelectorImplicitEntityId} QuerySelectorImplicit
 */

/**
 * @template T
 * @typedef QuerySelectorModifierNot<T>
 * @property {'not'} type
 * @property {string} name
 * @property {import('./EntityManager').ComponentClass<T>} value
 */

/**
 * @typedef {EntityId} QuerySelectorImplicitEntityId
 */
const EntityId = new ComponentFactory('EntityId', () => 0);

export class Query {
  /**
   * @template T
   * @param {import('./EntityManager').ComponentClass<T>} componentClass
   * @returns {QuerySelectorModifierNot<T>}
   */
  static Not(componentClass) {
    return {
      type: 'not',
      name: componentClass.name,
      value: componentClass,
    };
  }

  /**
   * @returns {QuerySelectorImplicitEntityId}
   */
  static get EntityId() {
    return EntityId;
  }

  /**
   * @param {any} selector
   */
  static isQuerySelectorNot(selector) {
    return 'type' in selector && selector.type === 'not';
  }

  /**
   * @param {any} selector
   */
  static isQuerySelectorEntityId(selector) {
    return selector === EntityId;
  }

  /**
   * @param {any} selector
   */
  static isQuerySelectorComponent(selector) {
    return (
      !this.isQuerySelectorNot(selector) &&
      !this.isQuerySelectorEntityId(selector)
    );
  }

  /**
   * @param {...QuerySelector<any>} selectors
   */
  constructor(...selectors) {
    if (selectors.length <= 0) {
      throw new Error('Must have at least 1 selector for query.');
    }
    /** @readonly */
    this.selectors = selectors;
    /** @readonly */
    this.key = computeSelectorKey(selectors);
  }

  /**
   * @param {QuerySelector<any>} selector
   */
  hasSelector(selector) {
    if (Query.isQuerySelectorNot(selector)) {
      return (
        this.selectors.findIndex(
          (v) => Query.isQuerySelectorNot(v) && v.name === selector.name,
        ) >= 0
      );
    } else if (Query.isQuerySelectorEntityId(selector)) {
      return true;
    } else {
      return this.selectors.findIndex((v) => v.name === selector.name) >= 0;
    }
  }
}

/**
 * @param {Array<QuerySelector<any>>} selectors
 */
function computeSelectorKey(selectors) {
  return selectors
    .map((s) => (Query.isQuerySelectorNot(s) ? `!${s.name}` : s.name))
    .sort()
    .join('&');
}
