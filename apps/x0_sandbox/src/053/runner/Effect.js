import { getCurrentProvider } from './Provider';

/**
 * @callback EffectHandler
 * @returns {AfterEffectHandler|Promise<AfterEffectHandler>|Promise<void>|void}
 */

/**
 * @callback AfterEffectHandler
 * @returns {Promise<void>|void}
 */

/**
 * @typedef EffectorContext
 * @property {Array<EffectHandler>} befores
 * @property {Array<AfterEffectHandler|void>} afters
 */

/**
 * @template M
 * @param {M} m 
 * @param {EffectHandler} handler
 */
export function registerEffect(m, handler) {
    const provider = getCurrentProvider(m);
    if (!provider) {
        throw new Error('Not a provider.');
    }
    let state = resolveState(m);
    let context = resolveContext(provider, state.contexts);
    context.befores.push(handler);
}

/**
 * @template M
 * @param {M} m 
 * @param {AfterEffectHandler} handler
 */
export function registerAfterEffect(m, handler) {
    const provider = getCurrentProvider(m);
    if (!provider) {
        throw new Error('Not a provider.');
    }
    let state = resolveState(m);
    let context = resolveContext(provider, state.contexts);
    context.afters.push(handler);
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<import('./Provider').Provider<M, ?>>} providers 
 */
export async function applyEffects(m, providers) {
    let state = resolveState(m);
    for(let provider of providers) {
        let context = resolveContext(provider, state.contexts);
        let befores = context.befores.slice();
        context.befores.length = 0;
        let result = await Promise.all(befores.map(handler => handler && handler()));
        context.afters.push(...result);
    }
    return m;
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<import('./Provider').Provider<M, ?>>} providers 
 */
export async function revertEffects(m, providers) {
    let state = getStateIfExists(m);
    if (!state) {
        return m;
    }
    for(let provider of providers.slice().reverse()) {
        let context = getContextIfExists(provider, state.contexts);
        if (!context) {
            throw new Error('Cannot revert context for non-existent provider.');
        }
        let afters = context.afters.slice();
        context.afters.length = 0;
        await Promise.all(afters.map(handler => handler && handler()));
    }
    return m;
}

const KEY = Symbol('effectors');

function createState() {
    return {
        /** @type {Record<string, EffectorContext>} */
        contexts: {},
    };
}

/**
 * @param {object} target
 * @returns {ReturnType<createState>}
 */
function resolveState(target) {
    if (KEY in target) {
        return target[KEY];
    }
    return target[KEY] = createState();
}

/**
 * @param {object} target
 * @returns {ReturnType<createState>|null}
 */
function getStateIfExists(target) {
    if (KEY in target) {
        return target[KEY];
    }
    return null;
}

/**
 * @returns {EffectorContext}
 */
function createContext() {
    return {
        befores: [],
        afters: [],
    };
}

/**
 * @param {import('./Provider').Provider<?, ?>} provider
 * @param {ReturnType<createState>['contexts']} target
 * @returns {ReturnType<createContext>}
 */
function resolveContext(provider, target) {
    const key = provider.name;
    if (key in target) {
        return target[key];
    }
    return target[key] = createContext();
}

/**
 * @param {import('./Provider').Provider<?, ?>} provider
 * @param {ReturnType<createState>['contexts']} target
 * @returns {ReturnType<createContext>|null}
 */
function getContextIfExists(provider, target) {
    const key = provider.name;
    if (key in target) {
        return target[key];
    }
    return null;
}
