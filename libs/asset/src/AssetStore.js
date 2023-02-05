import { GlobExp } from './GlobExp.js';

/**
 * @typedef AssetStore
 * @property {Record<string, object>} cache
 * @property {Record<string, Loading>} loadings
 * @property {Array<Fallback>} defaults
 */

const FILE_URI_PREFIX_PATTERN = /^([_\w\d]+)\:\/\//;
const DEFAULT_TIMEOUT = 5_000;

/**
 * Load asset using a loader with the given src.
 * - If loading to transform a cached asset, the cached uri must start with `res://` (or equivalent).
 * - If loading to transform cached raw buffers from an asset pack, use `raw://`.
 * - Otherwise, it will call `fetch()` on src.
 * 
 * @template T
 * @param {AssetStore} store
 * @param {string} uri 
 * @param {string} src
 * @param {(src: string|ArrayBuffer) => Promise<T>} loader
 * @param {number} [timeout]
 * @returns {Promise<T>}
 */
 export async function loadInStore(store, uri, src, loader, timeout = DEFAULT_TIMEOUT) {
    const { cache: globalCache, loadings } = store;
    if (uri in globalCache) {
        return globalCache[uri];
    }

    let loading;
    if (uri in loadings) {
        loading = loadings[uri];
        if (loading.active) {
            return loadings[uri].promise;
        }
    } else {
        loading = new Loading(timeout);
        loadings[uri] = loading;
    }

    /** @type {Array<Promise<T>>} */
    let promises = [loading.promise];
    if (FILE_URI_PREFIX_PATTERN.test(src)) {
        // Loading from cached file
        promises.push(getLoadedInStore(store, src, timeout)
            .then(cached => loader(cached))
            .then(value => cacheInStore(store, uri, value)));
    } else {
        // Fetching from network
        promises.push(fetch(src)
            .then(response => response.arrayBuffer())
            .then(arr => loader(arr))
            .then(value => cacheInStore(store, uri, value)));
    }
    return await Promise.race(promises);
}

/**
 * @template T
 * @param {AssetStore} store
 * @param {string} uri
 * @param {T} asset
 * @returns {T}
 */
export function cacheInStore(store, uri, asset) {
    const { cache, loadings } = store;
    cache[uri] = asset;
    // Send asset to awaiting loaders...
    if (uri in loadings) {
        loadings[uri].resolve(asset);
        delete loadings[uri];
    }
    return asset;
}

/**
 * @template T
 * @param {AssetStore} store
 * @param {string|GlobExp} glob
 * @param {T} asset
 * @returns {T}
 */
export function cacheDefaultInStore(store, glob, asset) {
    const { defaults } = store;
    if (typeof glob === 'string') {
        glob = new GlobExp(glob);
    }
    const uri = `__default://[${defaults.length}]`;
    cacheInStore(store, uri, asset);
    defaults.push(new Fallback(glob, uri));
    return asset;
}

/**
 * @param {AssetStore} store
 * @param {string} uri
 */
export function unloadInStore(store, uri) {
    const { cache, loadings } = store;
    if (uri in loadings) {
        loadings[uri].reject(new Error('Stop loading to delete asset.'));
        delete loadings[uri];
    }
    if (uri in cache) {
        delete cache[uri];
    }
}

/**
 * @param {AssetStore} store
 * @param {string|GlobExp} [glob]
 * @param {object} [opts] 
 * @param {boolean} [opts.preserveDefault]
 */
export function clearInStore(store, glob = undefined, opts = { preserveDefault: false }) {
    const { preserveDefault } = opts;
    if (typeof glob === 'string') {
        glob = new GlobExp(glob);
    }
    const { cache, loadings, defaults } = store;
    // Clear loadings
    for (let [uri, loading] of Object.entries(loadings)) {
        if (!glob || glob.test(uri)) {
            loading.reject(new Error('Stop loading to clear all assets.'));
            delete loadings[uri];
        }
    }
    // Clear cache
    for (let uri of Object.keys(cache)) {
        if (!glob || glob.test(uri)) {
            delete cache[uri];
        }
    }
    // Clear defaults
    if (!preserveDefault) {
        defaults.length = 0;
    }
}

/**
 * @param {AssetStore} store
 * @param {string} uri
 * @param {number} [timeout]
 * @returns {Promise<object>}
 */
export async function getLoadedInStore(store, uri, timeout = DEFAULT_TIMEOUT) {
    const { cache, loadings } = store;
    if (uri in cache) {
        return cache[uri];
    } else if (uri in loadings) {
        return loadings[uri].promise;
    } else {
        let loading = new Loading(timeout);
        loadings[uri] = loading;
        return loading.promise;
    }
}

/**
 * @param {AssetStore} store
 * @param {string} uri 
 * @returns {object}
 */
export function getDefaultInStore(store, uri) {
    const { defaults } = store;
    for (let def of defaults) {
        if (def.glob.test(uri)) {
            return getCurrentInStore(store, def.uri);
        }
    }
    return null;
}

/**
 * @param {AssetStore} store
 * @param {string} uri
 * @returns {object}
 */
export function getCurrentInStore(store, uri) {
    return store.cache[uri];
}

/**
 * @param {AssetStore} store
 * @param {string} uri 
 * @returns {boolean}
 */
export function hasInStore(store, uri) {
    return Boolean(store.cache[uri]);
}

/**
 * @param {AssetStore} store
 * @returns {Array<string>}
 */
export function keysInStore(store) {
    return Object.keys(store.cache);
}

/**
 * @param {AssetStore} store
 * @param {string} uri 
 * @returns {boolean}
 */
export function isAssetCachedInStore(store, uri) {
    return uri in store.cache;
}

/**
 * @param {AssetStore} store
 * @param {string} uri 
 * @returns {boolean}
 */
export function isAssetLoadingInStore(store, uri) {
    return uri in store.loadings;
}

class Fallback {
    /**
     * @param {GlobExp} glob 
     * @param {string} uri 
     */
    constructor(glob, uri) {
        this.glob = glob;
        this.uri = uri;
    }
}

class Loading {
    constructor(timeout) {
        this.active = false;

        /** @private */
        this._resolve = null;
        /** @private */
        this._reject = null;
        /** @private */
        this._reason = null;
        /** @private */
        this._value = null;
        /** @private */
        this._timeoutHandle =
            Number.isFinite(timeout) && timeout > 0
                ? setTimeout(() => {
                    this.reject(`Asset loading exceeded timeout of ${timeout} ms.`);
                }, timeout)
                : null;
        /** @private */
        this._promise = new Promise((resolve, reject) => {
            if (this._value) {
                resolve(this._value);
            } else {
                this._resolve = resolve;
            }
            if (this._reason) {
                reject(this._reason);
            } else {
                this._reject = reject;
            }
        });
    }

    get promise() {
        return this._promise;
    }

    resolve(value) {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
        }
        if (this._resolve) {
            this._resolve(value);
        } else {
            this._value = value;
        }
    }

    reject(reason) {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
        }
        if (this._reject) {
            this._reject(reason);
        } else {
            this._reason = reason;
        }
    }
}
