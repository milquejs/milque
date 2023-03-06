/**
 * @template M, T
 * @typedef {(m: M, [opts]: object) => T} Provider
 */

/**
 * @template M, T
 * @typedef ProviderContext
 * @property {Provider<M, T>} handle
 * @property {T} value
 */

/**
 * @template M, T
 * @param {M} m 
 * @param {Provider<M, T>} provider 
 * @returns {T}
 */
export function useProvider(m, provider) {
    let state = resolveState(m);
    let handle = provider.name;
    if (handle in state.contexts) {
        /** @type {ProviderContext<M, T>} */
        let { value } = state.contexts[handle];
        if (value) {
            return value;
        } else {
            let current = getCurrentProvider(m);
            if (current.name === provider.name) {
                throw new Error(`Cannot useProvider() on self during initialization!`);
            } else {
                throw new Error('This is not a provider.');
            }
        }
    }
    throw new Error(`Missing assigned dependent provider '${handle}' in context.`);
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<Provider<?, ?>>} providers
 * @returns {M}
 */
export function injectProviders(m, providers) {
    let state = resolveState(m);
    for(let provider of providers) {
        /** @type {ProviderContext<?, ?>} */
        let context = {
            handle: provider,
            value: null,
        };
        state.contexts[provider.name] = context;
        state.current = provider;
        context.value = provider(m);
    }
    return m;
}

/**
 * @template M
 * @param {M} m 
 * @param {Array<Provider<?, ?>>} providers
 * @returns {M}
 */
export function ejectProviders(m, providers) {
    let state = getStateIfExists(m);
    if (!state) {
        return m;
    }
    for(let provider of providers.slice().reverse()) {
        let context = state.contexts[provider.name];
        context.value = null;
        delete state.contexts[provider.name];
    }
    return m;
}

/**
 * @template M
 * @param {M} m
 */
export function getProviders(m) {
    let state = getStateIfExists(m);
    if (!state) {
        return [];
    }
    return Object.values(state.contexts).map(ctx => ctx.handle);
}

/**
 * @template M
 * @param {M} m
 */
export function getCurrentProvider(m) {
    let state = getStateIfExists(m);
    if (!state) {
        throw new Error('This is not a provider.');
    }
    return state.current;
}

const KEY = Symbol('providers');

function createState() {
    return {
        /** @type {Record<string, ProviderContext<?, ?>>} */
        contexts: {},
        /** @type {Provider<?, ?>} */
        current: null,
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
