import './MatchFinder'; // This is necessary to include this file in js.

/**
 * @template {abstract new (...args: any) => any} T
 * @typedef {T & { name: string }} MatchClass
 */

/**
 * @typedef {Record<string, MatchClass<any>|import('./MatchFilter').MatchFilter<any, any, any>>} MatchTemplate
 */

/**
 * @template {MatchTemplate} T
 * @typedef {{
 *  [K in keyof T]: T[K] extends import('../local').EntityId
 *    ? import('../local').EntityId
 *    : T[K] extends import('./MatchFilter').MatchFilter<any, any, any>
 *      ? T[K]['output']
 *      : T[K] extends MatchClass<infer V>
 *        ? InstanceType<V>
 *        : never
 * }} MatchTemplateInstancesOf<T>
 */

/**
 * @template {MatchTemplate} T
 * @typedef {MatchTemplateInstancesOf<T>} MatchResult
 */
