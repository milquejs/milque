import { cacheInStore, getCurrentInStore, getDefaultInStore, getLoadedInStore, loadInStore, unloadInStore } from './AssetStore.js';

/** @typedef {import('./AssetStore.js').AssetStore} AssetStore */

/**
 * @template T
 */
export class AssetRef {
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

    /** @param {T} value */
    set current(value) {
        cacheInStore(this.store, this.uri, value);
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
     * @param {number} [timeout] The time to wait until error for loader.
     * @param {T} [cached] If defined, will cache this value instead of fetch and loading from source.
     * @returns {Promise<AssetRef<T>>}
     */
    async preload(store, timeout = undefined, cached = undefined) {
        this.store = store;
        if (typeof cached !== 'undefined') {
            cacheInStore(store, this.uri, cached);
        } else {
            await loadInStore(this.store, this.uri, this.source, this.loader, timeout);
        }
        return this;
    }

    /**
     * @returns {Promise<AssetRef<T>>}
     */
    async unload() {
        unloadInStore(this.store, this.uri);
        this.store = null;
        return this;
    }
}
