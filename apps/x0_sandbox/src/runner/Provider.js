/**
 * @template M, T
 * @typedef {(m: M) => T} Provider
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
export function getProviderState(m, provider) {
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
                throw new Error(`Cannot get provider state on self during initialization!`);
            } else {
                throw new Error('This is not a provider.');
            }
        }
    }
    throw new Error(`Missing assigned dependent provider '${handle}' in context.`);
}

/**
 * @template M, T
 * @param {M} m 
 * @param {Provider<M, T>} provider 
 * @returns {boolean}
 */
export function hasProviderState(m, provider) {
    let state = resolveState(m);
    let handle = provider.name;
    if (handle in state.contexts) {
        /** @type {ProviderContext<M, T>} */
        let { value } = state.contexts[handle];
        if (value) {
            return true;
        } else {
            return false;
        }
    }
    return false;
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
    state.current = null;
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

/**
 * @template M
 * @param {M} m
 * @param {Provider<?, ?>} provider
 */
export function setCurrentProvider(m, provider) {
    let state = getStateIfExists(m);
    if (!state) {
        throw new Error('This is not a provider.');
    }
    state.current = provider;
}

/**
 * @template M, T
 * @param {import('./Provider').Provider<?, T>} target 
 * @param {import('./Provider').Provider<M, T>} replacement 
 * @returns {import('./Provider').Provider<M, T>}
 */
export function createOverrideProvider(target, replacement) {
    let override = function(m) {
        return replacement(m);
    };
    override.name = target.name;
    return override;
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
