import { cacheDefaultInStore, cacheInStore, clearInStore, getCurrentInStore, getDefaultInStore, getLoadedInStore, getLoadingInStore, hasInStore, isAssetCachedInStore, isAssetLoadingInStore, keysInStore, loadInStore, resetStore, unloadInStore } from './AssetStore.js';
import { GlobExp } from './GlobExp.js';

/**
 * @template T, S
 * @typedef {import('./AssetStore').AssetLoader<T, S>} AssetLoader
 */

export class AssetManager {

    /**
     * @param {AssetManager} [parent] 
     */
    constructor(parent = null) {
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
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        if (isAssetCachedInStore(assets, uri)) {
            return getCurrentInStore(assets, uri);
        }
        let def = getDefaultInStore(assets, uri);
        if (def) {
            return def;
        }
        return null;
    }

    /**
     * @template T, S
     * @param {string} uri 
     * @param {string} filepath
     * @param {AssetLoader<T, S>} loader 
     * @param {S} opts 
     * @param {number} timeout 
     * @returns {Promise<T>}
     */
    async resolve(uri, filepath, loader, opts, timeout) {
        return this.get(uri) || await this.load(uri, filepath, loader, opts, timeout);
    }

    /**
     * @template T
     * @param {string|GlobExp} uriGlob 
     * @param {T} value 
     * @returns {T}
     */
    fallback(uriGlob, value) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        return cacheDefaultInStore(assets, uriGlob, value);
    }

    /**
     * @template T
     * @param {string} uri 
     * @param {T} value 
     * @returns {T}
     */
    cache(uri, value) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        return cacheInStore(assets, uri, value);
    }

    /**
     * @template T, S
     * @param {string} uri 
     * @param {string} filepath
     * @param {AssetLoader<T, S>} loader 
     * @param {S} opts 
     * @param {number} timeout
     * @returns {Promise<T>}
     */
    async load(uri, filepath, loader, opts, timeout) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        if (isAssetCachedInStore(assets, uri)) {
            return getCurrentInStore(assets, uri);
        } else if (isAssetLoadingInStore(assets, uri)) {
            return await getLoadedInStore(assets, uri, timeout);
        }
        return await loadInStore(assets, uri, filepath, loader, opts, timeout);
    }

    /**
     * @template T, S
     * @param {string} uri 
     * @param {string} filepath
     * @param {AssetLoader<T, S>} loader 
     * @param {S} opts 
     * @param {number} timeout
     * @returns {Promise<T>}
     */
    async reload(uri, filepath, loader, opts, timeout) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        return await loadInStore(assets, uri, filepath, loader, opts, timeout);
    }

    /**
     * @param {string} uri 
     */
    unload(uri) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        unloadInStore(assets, uri);
    }

    /**
     * @param {string|GlobExp} uriGlob 
     */
    clear(uriGlob) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        clearInStore(assets, uriGlob);
    }

    /**
     * @param {string} uri
     */
    current(uri) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        return getCurrentInStore(assets, uri);
    }

    /**
     * @param {string} uri 
     */
    exists(uri) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        return hasInStore(assets, uri);
    }

    /**
     * @param {string} uri 
     */
    loading(uri) {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        if (isAssetLoadingInStore(assets, uri)) {
            return getLoadingInStore(assets, uri);
        } else {
            return null;
        }
    }

    keys() {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        return keysInStore(assets);
    }

    reset() {
        const assets = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (this));
        resetStore(assets);
    }
}
