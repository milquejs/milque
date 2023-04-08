/**
 * @typedef ProviderContext
 * @property {Array<string>} current
 * @property {Record<string, Provider<?>>} providers
 * @property {Record<string, object>} states
 * @property {{ install: Record<string, Array<ProviderInstallListener<?>>>, uninstall: Record<string, Array<ProviderUninstallListener<?>>> }} listeners
 */

/**
 * @template T
 * @typedef {{ target: Provider<T>, value: T }} ProviderInstallEvent
 */

/**
 * @template T
 * @typedef {(e: ProviderInstallEvent<T>) => void|Promise<void>} ProviderInstallListener
 */

/**
 * @template T
 * @typedef {{ target: Provider<T>, value: T }} ProviderUninstallEvent
 */

/**
 * @template T
 * @typedef {(e: ProviderUninstallEvent<T>) => void|Promise<void>} ProviderUninstallListener<T>
 */

/**
 * @typedef {{ [ROOT_KEY]: ProviderContext }} ProviderContextRoot
 */

/**
 * @template T
 * @typedef {(m: object) => T|Promise<T>} Provider<T>
 */

/**
 * @typedef {string} ProviderKey
 */

/** Secret key for all children. */
const ROOT_KEY = Symbol('root.providers');

/**
 * @param {object} m 
 */
function isContext(m) {
    return m && ROOT_KEY in m;
}

/**
 * @param {object} m 
 * @returns {ProviderContext}
 */
function getContext(m) {
    if (!isContext(m)) {
        throw new Error('Not in valid context.');
    }
    return m[ROOT_KEY];
}

/**
 * @param {object} m
 */
function initializeContext(m) {
    /** @type {ProviderContext} */
    let result = {
        current: [],
        providers: {},
        states: {},
        listeners: {
            install: {},
            uninstall: {},
        },
    };
    m[ROOT_KEY] = result;
}

/**
 * @param {object} m 
 * @returns {ProviderKey}
 */
function getCurrentProviderKey(m) {
    // TODO: Maybe merge this one to below.
    return getContext(m).current.at(-1);
}

export function useCurrentProvider(m) {
    const context = getContext(m);
    if (context.current.length <= 0) {
        throw new Error('Invalid context - not used in a provider.');
    }
    const key = context.current.at(-1);
    return context.providers[key];
}

/**
 * @param {object} m 
 * @param {...Provider<?>} providers
 */
export async function install(m, ...providers) {
    if (!isContext(m)) {
        initializeContext(m);
    }
    const context = getContext(m);
    for (let provider of providers) {
        const key = keyOf(provider);
        // If key exists but null, this provider has been installed but then uninstalled.
        // If key doesn't exist, this provider has never been installed before.
        if (key in context.providers && context.providers[key] !== null) {
            throw new Error(`Provider '${key}' already installed!`);
        }
        context.current.push(key);
        context.providers[key] = provider;
        let result = null;
        try {
            result = await provider(m);
        } catch (e) {
            result = e;
            throw e;
        } finally {
            context.states[key] = result;
            context.current.pop();
        }
        // TODO: What if [...] installs in any order, and [install(...), install(...)] is sync?
        // Dispatch if some listeners are waiting...
        if (key in context.listeners.install) {
            await dispatchInstalled(context, key, provider, result);
        }
    }
}

/**
 * @template T
 * @param {object} m 
 * @param {Provider<T>} provider 
 * @param {Provider<T>} replacement
 */
export async function installAs(m, provider, replacement) {
    await install(m, createOverride(provider, replacement));
}

/**
 * @template T
 * @param {object} m 
 * @param {T} value 
 */
export async function preinstall(m, value) {
    const context = getContext(m);
    const key = getCurrentProviderKey(m);
    context.states[key] = value;
    // Dispatch early if some listeners are waiting...
    if (key in context.listeners.install) {
        const provider = context.providers[key];
        await dispatchInstalled(context, key, provider, value);
    }
}

async function dispatchInstalled(context, key, provider, value) {
    let event = { target: provider, value };
    let listeners = context.listeners.install[key];
    while (listeners.length > 0) {
        let listener = listeners.shift();
        await listener(event);
    }
}

export async function whenInstalled(m, provider) {
    const context = getContext(m);
    const key = keyOf(provider);
    if (!(key in context.listeners.install)) {
        context.listeners.install[key] = [];
    }
    if (key in context.states) {
        return Promise.resolve({ target: provider, value: context.states[key] });
    }
    return new Promise((resolve, _) => {
        context.listeners.install[key].push(resolve);
    });
}

/**
 * Uninstall all providers in this context.
 * 
 * @param {object} m 
 */
export async function uninstall(m) {
    const context = getContext(m);
    let keys = Object.keys(context.providers).reverse();
    for (let key in keys) {
        let provider = context.providers[key];
        context.providers[key] = null;
        let result = context.states[key];
        delete context.states[key];
        if (key in context.listeners.uninstall) {
            await dispatchUninstalled(context, key, provider, result);
        }
    }
}

async function dispatchUninstalled(context, key, provider, value) {
    let event = { target: provider, value };
    let listeners = context.listeners.uninstall[key];
    while (listeners.length > 0) {
        let listener = listeners.shift();
        await listener(event);
    }
}

export async function whenUninstalled(m, provider) {
    const context = getContext(m);
    const key = keyOf(provider);
    if (!(key in context.listeners.uninstall)) {
        context.listeners.uninstall[key] = [];
    }
    // This provider has already been uninstalled (after installed).
    if (key in context.providers && context.providers[key] === null) {
        return Promise.resolve({ target: provider, value: null });
    }
    return new Promise((resolve, _) => {
        context.listeners.uninstall[key].push(resolve);
    });
}

/**
 * @template T
 * @param {Provider<T>} provider 
 * @param {Provider<T>} replacement
 * @returns {Provider<T>}
 */
function createOverride(provider, replacement) {
    let result = function (m) {
        return replacement(m);
    };
    Object.defineProperty(result, 'name', { value: keyOf(provider) });
    return result;
}

/**
 * @template T
 * @param {object} m 
 * @param {Provider<T>} provider
 * @returns {T}
 */
export function using(m, provider) {
    const key = keyOf(provider);
    const context = getContext(m);
    if (!(key in context.states)) {
        throw new Error(`No provider '${String(key)}' installed.`);
    }
    return context.states[key];
}

/**
 * @template T
 * @param {object} m 
 * @param {Provider<T>} provider
 * @returns {T|null}
 */
export function usingOptionally(m, provider) {
    const key = keyOf(provider);
    const context = getContext(m);
    if (!(key in context.states)) {
        return null;
    }
    return context.states[key];
}

/**
 * @template T
 * @param {Provider<T>} provider
 * @returns {ProviderKey}
 */
function keyOf(provider) {
    if (typeof provider !== 'function') {
        throw new Error(`Not valid provider '${provider}' - must be a named function.`);
    }
    let result = provider.name;
    if (!result) {
        throw new Error(`Not valid provider '${provider}' - must have non-null name.`);
    }
    return result;
}

/**
 * @param {object} m 
 * @param {Provider<?>} provider 
 */
export function isInstalled(m, provider) {
    return keyOf(provider) in getContext(m).providers;
}
