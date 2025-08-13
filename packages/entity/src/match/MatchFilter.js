/**
 * @template {import('./MatchTypes').MatchClass<any>[]} Components
 * @typedef {MatchFilter<'SomeOf', Components, InstanceType<Components[number]> | null>} MatchFilterSomeOf
 */

/**
 * @template {import('./MatchTypes').MatchClass<any>[]} Components
 * @typedef {MatchFilter<'NoneOf', Components, null>} MatchFilterNoneOf
 */

/**
 * @template {'SomeOf'|'NoneOf'} Name
 * @template {import('./MatchTypes').MatchClass<any>[]} Components
 * @template OutputType
 */
export class MatchFilter {

  /**
   * Match some or none of the matching components.
   * 
   * @template {import('./MatchTypes').MatchClass<any>[]} T
   * @param {T} componentClasses 
   * @returns {MatchFilterSomeOf<T>}
   */
  static SomeOf(...componentClasses) {
    return new MatchFilter('SomeOf', componentClasses, /** @type {InstanceType<T[number]> | null} */ (null));
  }

  /**
   * Match none of the matching components.
   * 
   * @template {import('./MatchTypes').MatchClass<any>[]} T
   * @param {T} componentClasses 
   * @returns {MatchFilterNoneOf<T>}
   */
  static NoneOf(...componentClasses) {
    return new MatchFilter('NoneOf', componentClasses, null);
  }

  /** @readonly */
  name;
  /** @readonly */
  keys;
  /** @readonly */
  output;

  /**
   * @param {Name} name 
   * @param {Components} keys
   * @param {OutputType} output
   */
  constructor(name, keys, output) {
    this.name = name;
    this.keys = keys;
    this.output = output;
  }
}
