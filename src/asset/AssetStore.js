import { GlobExp } from './GlobExp.js';

/**
 * @typedef AssetStore
 * @property {Record<string, object>} store
 * @property {Record<string, Loading>} loadings
 * @property {Array<Fallback>} defaults
 */

/**
 * @template T
 * @template {object} S
 * @callback AssetLoader
 * @param {string|ArrayBuffer} src
 * @param {S} [opts]
 * @returns {Promise<T>}
 */

const FILE_URI_PREFIX_PATTERN = /^([_\w\d]+)\:\/\//;

/**
 * Load asset using a loader with the given src.
 * - If loading to transform a cached asset, the cached uri must start with `res://` (or equivalent).
 * - If loading to transform cached raw buffers from an asset pack, use `raw://`.
 * - Otherwise, it will call `fetch()` on src.
 *
 * @template T, S
 * @param {AssetStore} assets
 * @param {string} uri
 * @param {string} src
 * @param {AssetLoader<T, S>} loader
 * @param {S} opts
 * @param {number} timeout
 * @returns {Promise<T>}
 */
export async function loadInStore(assets, uri, src, loader, opts, timeout) {
  const { loadings } = assets;

  let loading;
  if (uri in loadings) {
    loading = loadings[uri];
  } else {
    loading = new Loading(timeout);
    loadings[uri] = loading;
  }

  const attempt = Loading.nextAttempt(loading);

  /** @type {Array<Promise<T>>} */
  let promises = [loading.promise];
  if (FILE_URI_PREFIX_PATTERN.test(src)) {
    // Loading from cached file
    promises.push(
      getLoadedInStore(assets, src, timeout)
        .then((cached) => loader(cached, opts))
        .then((value) =>
          Loading.isCurrentAttempt(loading, attempt)
            ? cacheInStore(assets, uri, value)
            : undefined,
        ),
    );
  } else {
    // Just load it
    promises.push(
      loader(src).then((value) =>
        Loading.isCurrentAttempt(loading, attempt)
          ? cacheInStore(assets, uri, value)
          : undefined,
      ),
    );
  }
  return await Promise.race(promises);
}

/**
 * @template T
 * @param {AssetStore} assets
 * @param {string} uri
 * @param {T} value
 * @returns {T}
 */
export function cacheInStore(assets, uri, value) {
  const { store, loadings } = assets;
  store[uri] = value;
  // Send asset to awaiting loaders...
  if (uri in loadings) {
    loadings[uri].resolve(value);
    delete loadings[uri];
  }
  return value;
}

/**
 * @template T
 * @param {AssetStore} assets
 * @param {string|GlobExp} glob
 * @param {T} value
 * @returns {T}
 */
export function cacheDefaultInStore(assets, glob, value) {
  const { defaults } = assets;
  if (typeof glob === 'string') {
    glob = new GlobExp(glob);
  }
  const uri = `__default://[${defaults.length}]`;
  cacheInStore(assets, uri, value);
  defaults.push(new Fallback(glob, uri));
  return value;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 */
export function unloadInStore(assets, uri) {
  const { store, loadings } = assets;
  if (uri in loadings) {
    loadings[uri].reject(new Error('Stop loading to delete asset.'));
    delete loadings[uri];
  }
  if (uri in store) {
    delete store[uri];
  }
}

/**
 * @param {AssetStore} assets
 * @param {string|GlobExp} glob
 */
export function clearInStore(assets, glob) {
  if (typeof glob === 'string') {
    glob = new GlobExp(glob);
  }
  const { store, loadings } = assets;
  // Clear loadings
  for (let [uri, loading] of Object.entries(loadings)) {
    if (glob.test(uri)) {
      loading.reject(
        new Error(`Stop loading to clear assets matching ${glob}`),
      );
      delete loadings[uri];
    }
  }
  // Clear cache
  for (let uri of Object.keys(store)) {
    if (glob.test(uri)) {
      delete store[uri];
    }
  }
}

/**
 * @param {AssetStore} assets
 */
export function resetStore(assets) {
  const { store, loadings, defaults } = assets;
  // Clear loadings
  for (let [uri, loading] of Object.entries(loadings)) {
    loading.reject(new Error('Stop loading to clear all assets.'));
    delete loadings[uri];
  }
  // Clear cache
  for (let uri of Object.keys(store)) {
    delete store[uri];
  }
  // Clear defaults
  defaults.length = 0;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {Promise<object>}
 */
export function getLoadingInStore(assets, uri) {
  const { loadings } = assets;
  if (uri in loadings) {
    return loadings[uri].promise;
  } else {
    return null;
  }
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 */
export function cancelLoadingInStore(assets, uri) {
  const { loadings } = assets;
  for (let [uri, loading] of Object.entries(loadings)) {
    loading.reject(new Error('Stop loading to clear all assets.'));
    delete loadings[uri];
  }
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @param {number} timeout
 * @returns {Promise<object>}
 */
export async function getLoadedInStore(assets, uri, timeout) {
  const { store, loadings } = assets;
  if (uri in store) {
    return store[uri];
  } else if (uri in loadings) {
    return loadings[uri].promise;
  } else {
    let loading = new Loading(timeout);
    loadings[uri] = loading;
    return loading.promise;
  }
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {object}
 */
export function getDefaultInStore(assets, uri) {
  const { defaults } = assets;
  for (let def of defaults) {
    if (def.glob.test(uri)) {
      return getCurrentInStore(assets, def.uri);
    }
  }
  return null;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {object}
 */
export function getCurrentInStore(assets, uri) {
  return assets.store[uri];
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {boolean}
 */
export function hasInStore(assets, uri) {
  return Boolean(assets.store[uri]);
}

/**
 * @param {AssetStore} assets
 * @returns {Array<string>}
 */
export function keysInStore(assets) {
  return Object.keys(assets.store);
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {boolean}
 */
export function isAssetCachedInStore(assets, uri) {
  return uri in assets.store;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {boolean}
 */
export function isAssetLoadingInStore(assets, uri) {
  return uri in assets.loadings;
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
  /**
   * @param {Loading} loading
   */
  static nextAttempt(loading) {
    return ++loading._promiseHandle;
  }

  /**
   * @param {Loading} loading
   * @param {number} attempt
   */
  static isCurrentAttempt(loading, attempt) {
    return loading._promiseHandle === attempt;
  }

  constructor(timeout) {
    /** @private */
    this._promiseHandle = 0;
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
