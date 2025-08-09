import { GlobExp } from '../GlobExp';

export function createStore() {
  return {
    /** @type {Record<string, any>} */
    cached: {},
    /** @type {Record<string, Loading>} */
    loadings: {},
    /** @type {Array<Fallback>} */
    defaults: [],
  };
}

/**
 * Load asset using a loader with the given filePath.
 * 
 * @private
 * @template T
 * @template {object} Options
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @param {string} filePath
 * @param {import('../AssetTypes').AssetLoader<T, Options>} loader
 * @param {Options} opts
 * @param {number} timeout
 * @returns {Promise<T>}
 */
export async function loadThenCache(assets, uri, filePath, loader, opts, timeout) {
  const { loadings } = assets;

  /** @type {Loading} */
  let loading;
  if (uri in loadings) {
    loading = loadings[uri];
  } else {
    loading = new Loading(timeout);
    loadings[uri] = loading;
  }

  const attempt = Loading.nextAttempt(loading);

  /** @type {Array<Promise<T|undefined>>} */
  let promises = [loading.promise];
  // Just load it
  promises.push(
    loader(filePath, opts, assets).then((value) => {
      if (Loading.isCurrentAttempt(loading, attempt)) {
        cacheAndResolve(assets, uri, value);
        return value;
      } else {
        return undefined;
      }
    }),
  );
  let result = await Promise.race(promises);
  if (!result) {
    // It must be loading in a different attempt.
    throw new Error('Failed to load asset - already loaded!');
  }
  return result;
}

/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets 
 * @param {Array<import('../AssetTypes').AssetLike<?, ?>>} targets 
 * @param {number} timeout
 */
export async function loadAll(assets, targets, timeout) {
  await Promise.all(targets.map(target => loadThenCache(
    assets, target.uri, target.uri, target.loader, target.opts, timeout)));
}

/**
 * @internal
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @param {T} value
 */
export function cacheAndResolve(assets, uri, value) {
  const { cached, loadings } = assets;
  cached[uri] = value;
  // Send asset to awaiting loaders...
  if (uri in loadings) {
    loadings[uri].resolve(value);
    delete loadings[uri];
  }
}

/**
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string|GlobExp} glob
 * @param {T} value
 */
export function fallbackFor(assets, glob, value) {
  const { defaults } = assets;
  if (typeof glob === 'string') {
    glob = new GlobExp(glob);
  }
  const uri = `__default://[${defaults.length}]`;
  cacheAndResolve(assets, uri, value);
  defaults.push(new Fallback(glob, uri));
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 */
export function deleteAndReject(assets, uri) {
  const { cached } = assets;
  cancelAndReject(assets, uri, "Cancel loading since deleting asset.");
  if (uri in cached) {
    delete cached[uri];
  }
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string|GlobExp} glob
 */
export function deleteAndRejectByGlob(assets, glob) {
  if (typeof glob === 'string') {
    glob = new GlobExp(glob);
  }
  const { cached, loadings } = assets;
  // Clear loadings
  for (let uri of Object.keys(loadings)) {
    if (glob.test(uri)) {
      cancelAndReject(assets, uri, `Cancel loading since deleting all assets for "${glob}".`);
    }
  }
  // Clear cache
  for (let uri of Object.keys(cached)) {
    if (glob.test(uri)) {
      delete cached[uri];
    }
  }
}

/**
 * Cancel loading the uri, if loading. Otherwise, do nothing and return false.
 * 
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @param {string} [rejectMessage]
 */
export function cancelAndReject(assets, uri, rejectMessage = 'Cancel loading asset.') {
  const { loadings } = assets;
  if (uri in loadings) {
    const loading = loadings[uri];
    loading.reject(new Error(rejectMessage));
    delete loadings[uri];
    return true;
  }
  return false;
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets 
 * @param {string} uri 
 * @param {number} timeout
 * @returns {Promise<object>}
 */
export async function promiseWhenLoaded(assets, uri, timeout) {
  const { loadings } = assets;
  if (uri in loadings) {
    return loadings[uri].promise;
  } else {
    let loading = new Loading(timeout);
    loadings[uri] = loading;
    return loading.promise;
  }
}

/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 */
export function resetStore(assets) {
  const { cached, loadings, defaults } = assets;
  // Clear loadings
  for (let uri of Object.keys(loadings)) {
    cancelAndReject(assets, uri, "Cancel loading asset - clearing all.");
  }
  // Clear cache
  for (let uri of Object.keys(cached)) {
    delete cached[uri];
  }
  // Clear defaults
  defaults.length = 0;
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {Promise<object>}
 */
export function currentLoading(assets, uri) {
  const { loadings } = assets;
  if (uri in loadings) {
    return loadings[uri].promise;
  } else {
    throw new Error(`No loading promise in store for uri "${uri}".`);
  }
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {object|null}
 */
export function currentFallback(assets, uri) {
  const { defaults } = assets;
  for (let def of defaults) {
    if (def.glob.test(uri) && hasCurrentValue(assets, def.uri)) {
      return currentValue(assets, def.uri);
    }
  }
  return null;
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {object}
 */
export function currentValue(assets, uri) {
  if (uri in assets.cached) {
    return assets.cached[uri];
  } else {
    throw new Error(`No current asset cached for uri "${uri}".`);
  }
}

/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @returns {Array<string>}
 */
export function keys(assets) {
  return Object.keys(assets.cached);
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {boolean}
 */
export function hasCurrentValue(assets, uri) {
  return uri in assets.cached;
}

/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {boolean}
 */
export function isCurrentLoading(assets, uri) {
  return uri in assets.loadings;
}

export class Fallback {
  /**
   * @param {GlobExp} glob
   * @param {string} uri
   */
  constructor(glob, uri) {
    this.glob = glob;
    this.uri = uri;
  }
}

export class Loading {
  /**
   * @param {Loading} loading
   */
  static nextAttempt(loading) {
    return ++loading.promiseHandle;
  }

  /**
   * @param {Loading} loading
   * @param {number} attempt
   */
  static isCurrentAttempt(loading, attempt) {
    return loading.promiseHandle === attempt;
  }

  /**
   * @param {number} timeout
   */
  constructor(timeout) {
    /**
     * @private
     * @type {((value: any) => void)|null}
     */
    this._resolve = null;
    /**
     * @private
     * @type {((reason?: any) => void)|null}
     */
    this._reject = null;
    /** @private */
    this._reason = null;
    /** @private */
    this._value = null;

    /** @private */
    this.promiseHandle = 0;
    /** @private */
    this.timeoutHandle =
      Number.isFinite(timeout) && timeout > 0
        ? setTimeout(() => {
            this.reject(`Asset loading exceeded timeout of ${timeout} ms.`);
          }, timeout)
        : null;
    /**
     * @readonly
     */
    this.promise = new Promise((resolve, reject) => {
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

  /**
   * @param {any} value
   */
  resolve(value) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    if (this._resolve) {
      this._resolve(value);
    } else {
      this._value = value;
    }
  }

  /**
   * @param {any} reason
   */
  reject(reason) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    if (this._reject) {
      this._reject(reason);
    } else {
      this._reason = reason;
    }
  }
}
