import { uuid } from '@milque/util';

/**
 * @template M
 * @typedef Runner
 * @property {(m: M) => Promise<void>|void} [preload]
 * @property {(m: M) => Promise<void>|void} init
 * @property {(m: M) => Promise<void>|void} [main]
 * @property {(m: M) => void} [dead]
 * @property {(m: M) => void} [update]
 * @property {(m: M) => void} [draw]
 */

/**
 * @template M
 * @param {M} m
 */
export function getRunConfiguration(m) {
    let state = getStateIfExists(m);
    if (!state) {
        throw new Error('Missing assigned run configuration in context.');
    }
    return state;
}

/**
 * @template M
 * @param {M} m 
 * @param {Runner<M>} runner
 * @param {Array<import('./Provider').Provider<?, ?>>} providers
 * @returns {M}
 */
export function setRunConfiguration(m, runner, providers) {
    let state = resolveState(m);
    state.id = uuid();
    state.runner = runner;
    state.providers = providers;
    return m;
}

/**
 * @template M
 * @typedef RunConfiguration
 * @property {string} id
 * @property {Runner<M>} runner
 * @property {import('./Provider').Provider<?, ?>[]} providers
 */
const KEY = Symbol('runConfiguration');

/**
 * @template M
 * @param {M} target
 * @returns {RunConfiguration<M>}
 */
function createState(target) {
    return {
        id: null,
        runner: null,
        providers: [],
    };
}

/**
 * @template M
 * @param {M} target
 * @returns {RunConfiguration<M>}
 */
function resolveState(target) {
    if (typeof target !== 'object') {
        throw new Error('Context is not an object.');
    }
    if (KEY in target) {
        return /** @type {RunConfiguration<M>} */ (target[KEY]);
    }
    return target[KEY] = createState(target);
}

/**
 * @template M
 * @param {M} target
 * @returns {RunConfiguration<M>|null}
 */
function getStateIfExists(target) {
    if (typeof target === 'object' && KEY in target) {
        return /** @type {RunConfiguration<M>} */ (target[KEY]);
    }
    return null;
}
