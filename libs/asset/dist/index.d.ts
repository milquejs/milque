declare class GlobExp {
    /**
     * @param {string|GlobExp} pattern
     */
    constructor(pattern: string | GlobExp);
    source: string;
    /** @private */
    private _re;
    /**
     * @param {string} string
     * @returns {boolean}
     */
    test(string: string): boolean;
}

type AssetStore$1 = {
    cache: Record<string, object>;
    loadings: Record<string, Loading>;
    defaults: Array<Fallback>;
};

/** @typedef {import('./AssetStore.js').AssetStore} AssetStore */
/**
 * @template T
 */
declare class AssetRef<T> {
    /**
     * @param {string} uri
     * @param {string} src
     * @param {(src: Uint8Array) => Promise<T>} loader
     */
    constructor(uri: string, src: string, loader: (src: Uint8Array) => Promise<T>);
    uri: string;
    /** @protected */
    protected source: string;
    /** @protected */
    protected loader: (src: Uint8Array) => Promise<T>;
    /** @protected */
    protected store: AssetStore$1;
    /** @param {T} value */
    set current(arg: T);
    /** @returns {T} */
    get current(): T;
    /** @returns {T} */
    get default(): T;
    /** @returns {Promise<T>} */
    get loaded(): Promise<T>;
    /**
     * @param {AssetStore} store
     * @param {number} [timeout] The time to wait until error for loader.
     * @param {T} [cached] If defined, will cache this value instead of fetch and loading from source.
     * @returns {Promise<AssetRef<T>>}
     */
    preload(store: AssetStore, timeout?: number, cached?: T): Promise<AssetRef<T>>;
    /**
     * @returns {Promise<AssetRef<T>>}
     */
    unload(): Promise<AssetRef<T>>;
}
type AssetStore = AssetStore$1;

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 *
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
declare function loadAssetPackAsRaw(url: string, callback?: (src: Uint8Array, uri: string, path: string) => void): Promise<void>;
/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 *
 * @param {string} url
 * @param {(src: Uint8Array, path: string) => void} callback
 */
declare function loadAssetPack(url: string, callback: (src: Uint8Array, path: string) => void): Promise<void>;
/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 *
 * @param {Array<AssetRef>} refs
 * @param {number} [timeout]
 */
declare function loadAssetRefs(refs: Array<AssetRef<any>>, timeout?: number): Promise<void>;
/**
 * @template T
 * @param {string} uri
 * @param {T} asset
 * @returns {T}
 */
declare function cache<T>(uri: string, asset: T): T;
/**
 * @returns {Array<string>}
 */
declare function keys(): Array<string>;
/**
 * @param {string} uri
 * @returns {object}
 */
declare function current(uri: string): object;
/**
 * @param {string} uri
 * @returns {object}
 */
declare function get(uri: string): object;

declare const AssetManager_cache: typeof cache;
declare const AssetManager_current: typeof current;
declare const AssetManager_get: typeof get;
declare const AssetManager_keys: typeof keys;
declare const AssetManager_loadAssetPack: typeof loadAssetPack;
declare const AssetManager_loadAssetPackAsRaw: typeof loadAssetPackAsRaw;
declare const AssetManager_loadAssetRefs: typeof loadAssetRefs;
declare namespace AssetManager {
  export {
    AssetManager_cache as cache,
    AssetManager_current as current,
    AssetManager_get as get,
    AssetManager_keys as keys,
    AssetManager_loadAssetPack as loadAssetPack,
    AssetManager_loadAssetPackAsRaw as loadAssetPackAsRaw,
    AssetManager_loadAssetRefs as loadAssetRefs,
  };
}

export { AssetManager, AssetRef, GlobExp };