export * from './EntityManager';
export * from './ComponentClass';
export * from './Archetype';
export { QueryManager, Not, isSelectorNot } from './QueryManager';
export { Query } from './Query';

/**
 * @template T
 * @typedef {import('./QueryManager').Selector<T>} Selector<T>
 */

/**
 * @template T
 * @typedef {import('./QueryManager').SelectorNot<T>} SelectorNot<T>
 */

/**
 * @typedef {import('./EntityManager').EntityComponentChangedCallback} EntityComponentChangedCallback
 */
