import { unzip } from 'fflate';
import { GlobExp } from './GlobExp.js';

const FILE_URI_PREFIX_PATTERN = /^([_\w\d]+)\:\/\//;
const DEFAULT_TIMEOUT = 5_000;
const GLOBAL = {
    /** @type {Record<string, object>} */
    cache: {},
    /** @type {Record<string, Loading>} */
    loadings: {},
    /** @type {Array<Fallback>} */
    defaults: [],
};

/**
 * Load asset using a loader with the given src.
 * - If loading to transform a cached asset, the cached uri must start with `res://` (or equivalent).
 * - If loading to transform cached raw buffers from an asset pack, use `raw://`.
 * - Otherwise, it will call `fetch()` on src.
 * 
 * @template T
 * @param {string} uri 
 * @param {string} src
 * @param {(src: string|ArrayBuffer) => Promise<T>} loader
 * @param {number} [timeout]
 * @returns {Promise<T>}
 */
export async function load(uri, src, loader, timeout = DEFAULT_TIMEOUT) {
    const { cache: globalCache, loadings } = GLOBAL;
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
        promises.push(getLoaded(src, timeout)
            .then(cached => loader(cached))
            .then(value => cache(uri, value)));
    } else {
        // Fetching from network
        promises.push(fetch(src)
            .then(response => response.arrayBuffer())
            .then(arr => loader(arr))
            .then(value => cache(uri, value)));
    }
    return await Promise.race(promises);
}

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
export async function loadAssetPack(url, callback = undefined) {
    let rootPath = 'raw://';
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for(let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    // Remove the zip directory name
                    let i = path.indexOf('/');
                    if (i >= 0) {
                        path = path.substring(i + 1);
                    }
                    // Put the raw file in cache
                    let uri = rootPath + path;
                    cache(uri, buf);
                    if (callback) {
                        callback(buf, uri, path);
                    }
                }
                resolve();
            }
        });
    });
}

/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 * 
 * @param {Array<import('./AssetRef.js').AssetRef>} refs 
 * @param {number} [timeout] 
 */
export async function loadAssetRefs(refs, timeout = DEFAULT_TIMEOUT) {
    let promises = [];
    for(let ref of refs) {
        promises.push(ref.load(timeout));
    }
    await Promise.allSettled(promises);
}

/**
 * @template T
 * @param {string} uri
 * @param {T} asset
 * @returns {T}
 */
export function cache(uri, asset) {
    const { cache, loadings } = GLOBAL;
    cache[uri] = asset;
    // Send asset to awaiting loaders...
    if (uri in loadings) {
        loadings[uri].resolve(asset);
        delete loadings[uri];
    }
    return asset;
}

/**
 * @param {string|GlobExp} glob
 * @param {object} asset
 */
export function cacheDefault(glob, asset) {
    const { defaults } = GLOBAL;
    if (typeof glob === 'string') {
        glob = new GlobExp(glob);
    }
    const uri = `__default://[${defaults.length}]`;
    cache(uri, asset);
    defaults.push(new Fallback(glob, uri));
}

/**
 * @param {string} uri
 */
export function unload(uri) {
    const { cache, loadings } = GLOBAL;
    if (uri in loadings) {
        loadings[uri].reject(new Error('Stop loading to delete asset.'));
        delete loadings[uri];
    }
    if (uri in cache) {
        delete cache[uri];
    }
}

/**
 * @param {string|GlobExp} [glob]
 * @param {object} [opts] 
 * @param {boolean} [opts.preserveDefault]
 */
export function clear(glob = undefined, opts = { preserveDefault: false }) {
    const { preserveDefault } = opts;
    if (typeof glob === 'string') {
        glob = new GlobExp(glob);
    }
    const { cache, loadings, defaults } = GLOBAL;
    // Clear loadings
    for (let [uri, loading] of Object.entries(loadings)) {
        if (!glob || glob.test(uri)) {
            loading.reject(new Error('Stop loading to clear all assets.'));
            delete loadings[uri];
        }
    }
    // Clear cache
    for(let uri of Object.keys(cache)) {
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
 * @param {string} uri
 * @param {number} [timeout]
 * @returns {Promise<object>}
 */
export async function getLoaded(uri, timeout = DEFAULT_TIMEOUT) {
    const { cache, loadings } = GLOBAL;
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
 * @param {string} uri 
 * @returns {object}
 */
export function getDefault(uri) {
    const { defaults } = GLOBAL;
    for (let def of defaults) {
        if (def.glob.test(uri)) {
            return getCurrent(def.uri);
        }
    }
    return null;
}

/**
 * @param {string} uri
 * @returns {object}
 */
export function getCurrent(uri) {
    return GLOBAL.cache[uri];
}

/**
 * @param {string} uri 
 * @returns {object}
 */
export function get(uri) {
    return getCurrent(uri) || getDefault(uri);
}

/**
 * @param {string} uri 
 * @returns {boolean}
 */
export function has(uri) {
    return Boolean(GLOBAL.cache[uri]);
}

/** @returns {Array<string>} */
export function keys() {
    return Object.keys(GLOBAL.cache);
}

/**
 * @param {string} uri 
 * @returns {boolean}
 */
export function isAssetCached(uri) {
    return uri in GLOBAL.cache;
}

/**
 * @param {string} uri 
 * @returns {boolean}
 */
export function isAssetLoading(uri) {
    return uri in GLOBAL.loadings;
}

export function on(event, listener) {

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
