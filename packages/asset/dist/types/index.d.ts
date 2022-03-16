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
    /** @returns {T} */
    get value(): T;
    /** @returns {T} */
    get current(): T;
    /** @returns {Promise<T>} */
    get loaded(): Promise<T>;
    /** @returns {T} */
    get default(): T;
    /** @param {number} [timeout] */
    load(timeout?: number): Promise<AssetRef<T>>;
    /**
     * @param {T} asset
     */
    cache(asset: T): AssetRef<T>;
}

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
declare function load<T>(uri: string, src: string, loader: (src: string | ArrayBuffer) => Promise<T>, timeout?: number): Promise<T>;
/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 *
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
declare function loadAssetPack(url: string, callback?: (src: Uint8Array, uri: string, path: string) => void): Promise<void>;
/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 *
 * @param {Array<import('./AssetRef.js').AssetRef>} refs
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
 * @param {string|GlobExp} glob
 * @param {object} asset
 */
declare function cacheDefault(glob: string | GlobExp, asset: object): void;
/**
 * @param {string} uri
 */
declare function unload(uri: string): void;
/**
 * @param {string|GlobExp} [glob]
 * @param {object} [opts]
 * @param {boolean} [opts.preserveDefault]
 */
declare function clear(glob?: string | GlobExp, opts?: {
    preserveDefault?: boolean;
}): void;
/**
 * @param {string} uri
 * @param {number} [timeout]
 * @returns {Promise<object>}
 */
declare function getLoaded(uri: string, timeout?: number): Promise<object>;
/**
 * @param {string} uri
 * @returns {object}
 */
declare function getDefault(uri: string): object;
/**
 * @param {string} uri
 * @returns {object}
 */
declare function getCurrent(uri: string): object;
/**
 * @param {string} uri
 * @returns {object}
 */
declare function get(uri: string): object;
/**
 * @param {string} uri
 * @returns {boolean}
 */
declare function has(uri: string): boolean;
/** @returns {Array<string>} */
declare function keys(): Array<string>;
/**
 * @param {string} uri
 * @returns {boolean}
 */
declare function isAssetCached(uri: string): boolean;
/**
 * @param {string} uri
 * @returns {boolean}
 */
declare function isAssetLoading(uri: string): boolean;
declare function on(event: any, listener: any): void;

declare const AssetManager_load: typeof load;
declare const AssetManager_loadAssetPack: typeof loadAssetPack;
declare const AssetManager_loadAssetRefs: typeof loadAssetRefs;
declare const AssetManager_cache: typeof cache;
declare const AssetManager_cacheDefault: typeof cacheDefault;
declare const AssetManager_unload: typeof unload;
declare const AssetManager_clear: typeof clear;
declare const AssetManager_getLoaded: typeof getLoaded;
declare const AssetManager_getDefault: typeof getDefault;
declare const AssetManager_getCurrent: typeof getCurrent;
declare const AssetManager_get: typeof get;
declare const AssetManager_has: typeof has;
declare const AssetManager_keys: typeof keys;
declare const AssetManager_isAssetCached: typeof isAssetCached;
declare const AssetManager_isAssetLoading: typeof isAssetLoading;
declare const AssetManager_on: typeof on;
declare namespace AssetManager {
  export {
    AssetManager_load as load,
    AssetManager_loadAssetPack as loadAssetPack,
    AssetManager_loadAssetRefs as loadAssetRefs,
    AssetManager_cache as cache,
    AssetManager_cacheDefault as cacheDefault,
    AssetManager_unload as unload,
    AssetManager_clear as clear,
    AssetManager_getLoaded as getLoaded,
    AssetManager_getDefault as getDefault,
    AssetManager_getCurrent as getCurrent,
    AssetManager_get as get,
    AssetManager_has as has,
    AssetManager_keys as keys,
    AssetManager_isAssetCached as isAssetCached,
    AssetManager_isAssetLoading as isAssetLoading,
    AssetManager_on as on,
  };
}

export { AssetManager, AssetRef, GlobExp };
