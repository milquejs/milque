import { EntityId } from '../local';

/**
 * @template {abstract new (...args: any) => any} T
 * @typedef {T & { name: string }} MatchClass
 */

/**
 * @template T
 * @typedef Match
 * @property {string} matchId
 * @property {T} template
 * @property {Array<MatchClass<any>>} all
 * @property {Array<MatchClass<any>>} any
 * @property {Array<MatchClass<any>>} none
 * @property {Array<MatchClass<any>>} maybe
 */

/**
 * @typedef {Record<string, MatchClass<any>>} MatchTemplate
 */

/**
 * @template {MatchTemplate} T
 * @typedef {{[K in keyof T]: T[K] extends EntityId ? EntityId : T[K] extends MatchClass<infer V> ? InstanceType<V> : never}} MatchTemplateInstancesOf<T>
 */

/**
 * @template {MatchTemplate} T
 * @typedef {MatchTemplateInstancesOf<T>} MatchResult
 */
