'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var picomatch = require('picomatch');
var fflate = require('fflate');

class GlobExp {
    /**
     * @param {string|GlobExp} pattern 
     */
    constructor(pattern) {
        let source;
        if (typeof pattern === 'object' && pattern instanceof GlobExp) {
            source = pattern.source;
        } else {
            source = String(pattern);
        }
        this.source = source;

        /** @private */
        this._re = picomatch.makeRe(source);
    }

    /**
     * @param {string} string 
     * @returns {boolean}
     */
    test(string) {
        return this._re.test(string);
    }
}

/**
 * @typedef AssetStore
 * @property {Record<string, object>} cache
 * @property {Record<string, Loading>} loadings
 * @property {Array<Fallback>} defaults
 */

const FILE_URI_PREFIX_PATTERN = /^([_\w\d]+)\:\/\//;
const DEFAULT_TIMEOUT$1 = 5_000;

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
 async function loadInStore(store, uri, src, loader, timeout = DEFAULT_TIMEOUT$1) {
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
function cacheInStore(store, uri, asset) {
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
 * @param {AssetStore} store
 * @param {string} uri
 */
function unloadInStore(store, uri) {
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
 * @param {string} uri
 * @param {number} [timeout]
 * @returns {Promise<object>}
 */
async function getLoadedInStore(store, uri, timeout = DEFAULT_TIMEOUT$1) {
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
function getDefaultInStore(store, uri) {
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
function getCurrentInStore(store, uri) {
    return store.cache[uri];
}

/**
 * @param {AssetStore} store
 * @returns {Array<string>}
 */
function keysInStore(store) {
    return Object.keys(store.cache);
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

/** @typedef {import('./AssetStore.js').AssetStore} AssetStore */

/**
 * @template T
 */
class AssetRef {
    /**
     * @param {string} uri 
     * @param {string} src 
     * @param {(src: Uint8Array) => Promise<T>} loader 
     */
    constructor(uri, src, loader) {
        this.uri = uri;
        /** @protected */
        this.source = src;
        /** @protected */
        this.loader = loader;
        /** @protected */
        this.store = null;
    }

    /** @returns {T} */
    get current() {
        return getCurrentInStore(this.store, this.uri);
    }

    /** @returns {T} */
    get default() {
        return getDefaultInStore(this.store, this.uri);
    }

    /** @returns {Promise<T>} */
    get loaded() {
        return getLoadedInStore(this.store, this.uri);
    }

    /**
     * @param {AssetStore} store
     * @param {number} [timeout]
     */
    async load(store, timeout = undefined) {
        this.store = store;
        
        await loadInStore(this.store, this.uri, this.source, this.loader, timeout);
        return this;
    }

    unload() {
        unloadInStore(this.store, this.uri);
        this.store = null;
        return this;
    }

    /**
     * @param {T} asset
     */
    cache(asset) {
        cacheInStore(this.store, this.uri, asset);
        return this;
    }
}

const DEFAULT_TIMEOUT = 5_000;
/** @type {import('./AssetStore.js').AssetStore} */
const GLOBAL = {
    cache: {},
    loadings: {},
    defaults: [],
};

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
async function loadAssetPackAsRaw(url, callback = undefined) {
    let rootPath = 'raw://';
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        fflate.unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    // Remove the zip directory name
                    let i = path.indexOf('/');
                    if (i >= 0) {
                        path = path.substring(i + 1);
                    }
                    // Put the raw file in cache
                    let uri = rootPath + path;
                    cacheInStore(GLOBAL, uri, buf);
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
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {string} url
 * @param {(src: Uint8Array, path: string) => void} callback
 */
 async function loadAssetPack(url, callback) {
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        fflate.unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    callback(buf, path);
                }
                resolve();
            }
        });
    });
}

/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 * 
 * @param {Array<AssetRef>} refs 
 * @param {number} [timeout] 
 */
async function loadAssetRefs(refs, timeout = DEFAULT_TIMEOUT) {
    let promises = [];
    for (let ref of refs) {
        promises.push(ref.load(GLOBAL, timeout));
    }
    await Promise.allSettled(promises);
}

/**
 * @template T
 * @param {string} uri
 * @param {T} asset
 * @returns {T}
 */
function cache(uri, asset) {
    return cacheInStore(GLOBAL, uri, asset);
}

/**
 * @returns {Array<string>}
 */
function keys() {
    return keysInStore(GLOBAL);
}

/**
 * @param {string} uri
 * @returns {object}
 */
function current(uri) {
    return getCurrentInStore(GLOBAL, uri);
}

var AssetManager = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loadAssetPackAsRaw: loadAssetPackAsRaw,
    loadAssetPack: loadAssetPack,
    loadAssetRefs: loadAssetRefs,
    cache: cache,
    keys: keys,
    current: current
});

exports.AssetManager = AssetManager;
exports.AssetRef = AssetRef;
exports.GlobExp = GlobExp;
