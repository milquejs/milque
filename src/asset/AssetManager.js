import {
  cacheDefaultInStore,
  cacheInStore,
  clearInStore,
  getCurrentInStore,
  getDefaultInStore,
  getLoadedInStore,
  getLoadingInStore,
  hasInStore,
  isAssetCachedInStore,
  isAssetLoadingInStore,
  keysInStore,
  loadInStore,
  resetStore,
  unloadInStore,
} from './AssetStore.js';
import { GlobExp } from './GlobExp.js';

/**
 * @template T
 * @template {object} S
 * @typedef {import('./AssetStore.js').AssetLoader<T, S>} AssetLoader
 */

export class AssetManager {
  /**
   * @param {AssetManager} [parent]
   */
  constructor(parent) {
    this.parent = parent;
    /** @private */
    this.store = {};
    /** @private */
    this.loadings = {};
    /** @private */
    this.defaults = [];
  }

  /**
   * @param {string} uri
   * @returns {any}
   */
  get(uri) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    if (isAssetCachedInStore(assets, uri)) {
      return getCurrentInStore(assets, uri);
    }
    let def = getDefaultInStore(assets, uri);
    if (def) {
      return def;
    }
    throw new Error(`Asset '${uri}' not found.`);
  }

  /**
   * @template T
   * @template {object} S
   * @param {string} uri
   * @param {string} filepath
   * @param {AssetLoader<T, S>} loader
   * @param {S} opts
   * @param {number} timeout
   * @returns {Promise<T>}
   */
  async resolve(uri, filepath, loader, opts, timeout) {
    return (
      this.get(uri) || (await this.load(uri, filepath, loader, opts, timeout))
    );
  }

  /**
   * @template T
   * @param {string|GlobExp} uriGlob
   * @param {T} value
   * @returns {T}
   */
  fallback(uriGlob, value) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    return cacheDefaultInStore(assets, uriGlob, value);
  }

  /**
   * @template T
   * @param {string} uri
   * @param {T} value
   * @returns {T}
   */
  cache(uri, value) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    return cacheInStore(assets, uri, value);
  }

  /**
   * @template T
   * @template {object} S
   * @param {string} uri
   * @param {string} filepath
   * @param {AssetLoader<T, S>} loader
   * @param {S} opts
   * @param {number} timeout
   * @returns {Promise<T>}
   */
  async load(uri, filepath, loader, opts, timeout) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    if (isAssetCachedInStore(assets, uri)) {
      return /** @type {T} */ (getCurrentInStore(assets, uri));
    } else if (isAssetLoadingInStore(assets, uri)) {
      return /** @type {T} */ (await getLoadedInStore(assets, uri, timeout));
    }
    return await loadInStore(assets, uri, filepath, loader, opts, timeout);
  }

  /**
   * @template T
   * @template {object} S
   * @param {string} uri
   * @param {string} filepath
   * @param {AssetLoader<T, S>} loader
   * @param {S} opts
   * @param {number} timeout
   * @returns {Promise<T>}
   */
  async reload(uri, filepath, loader, opts, timeout) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    return await loadInStore(assets, uri, filepath, loader, opts, timeout);
  }

  /**
   * @param {string} uri
   */
  unload(uri) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    unloadInStore(assets, uri);
  }

  /**
   * @param {string|GlobExp} uriGlob
   */
  clear(uriGlob) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    clearInStore(assets, uriGlob);
  }

  /**
   * @template T
   * @param {string} uri
   * @returns {T}
   */
  current(uri) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    return /** @type {any} */ (getCurrentInStore(assets, uri));
  }

  /**
   * @param {string} uri
   */
  exists(uri) {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    return hasInStore(assets, uri);
  }

  /**
   * @param {string} uri
   */
  loading(uri) {
    // TODO: This can be whenLoaded().
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    if (isAssetLoadingInStore(assets, uri)) {
      return getLoadingInStore(assets, uri);
    } else {
      return null;
    }
  }

  keys() {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    return keysInStore(assets);
  }

  reset() {
    const assets = /** @type {import('./AssetStore.js').AssetStore} */ (
      /** @type {unknown} */ (this)
    );
    resetStore(assets);
  }
}
