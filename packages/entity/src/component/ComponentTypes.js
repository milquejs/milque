import './ComponentFactory'; // This is necessary to include this file in js.

/**
 * @template T
 * @typedef {{ name: string, new (): T }} ComponentConstructor
 */

/**
 * @template T
 * @typedef {{ name: string, new: () => T, reset?: (instance: T) => void, delete?: (instance: T) => void }} ComponentFactory
 */

/**
 * @template T
 * @typedef {ComponentFactory<T>|ComponentConstructor<T>} ComponentClass
 */
