declare class GlobExp {
    /**
     * @param {string|GlobExp} pattern
     */
    constructor(pattern: string | GlobExp);
    /** @type {string} */
    source: string;
    /** @private */
    private re;
    /**
     * @param {string} string
     * @returns {boolean}
     */
    test(string: string): boolean;
}

declare function createStore(): {
    /** @type {Record<string, any>} */
    cached: Record<string, any>;
    /** @type {Record<string, Loading>} */
    loadings: Record<string, Loading>;
    /** @type {Array<Fallback>} */
    defaults: Array<Fallback>;
};
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
declare function loadThenCache<T, Options extends object>(assets: AssetStoreLike, uri: string, filePath: string, loader: AssetLoader$1<T, Options>, opts: Options, timeout: number): Promise<T>;
/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {Array<import('../AssetTypes').AssetLike<?, ?>>} targets
 * @param {number} timeout
 */
declare function loadAll(assets: AssetStoreLike, targets: Array<AssetLike$1<unknown, unknown>>, timeout: number): Promise<void>;
/**
 * @internal
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @param {T} value
 */
declare function cacheAndResolve<T>(assets: AssetStoreLike, uri: string, value: T): void;
/**
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string|GlobExp} glob
 * @param {T} value
 */
declare function fallbackFor<T>(assets: AssetStoreLike, glob: string | GlobExp, value: T): void;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 */
declare function deleteAndReject(assets: AssetStoreLike, uri: string): void;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string|GlobExp} glob
 */
declare function deleteAndRejectByGlob(assets: AssetStoreLike, glob: string | GlobExp): void;
/**
 * Cancel loading the uri, if loading. Otherwise, do nothing and return false.
 *
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @param {string} [rejectMessage]
 */
declare function cancelAndReject(assets: AssetStoreLike, uri: string, rejectMessage?: string): boolean;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @param {number} timeout
 * @returns {Promise<object>}
 */
declare function promiseWhenLoaded(assets: AssetStoreLike, uri: string, timeout: number): Promise<object>;
/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 */
declare function resetStore(assets: AssetStoreLike): void;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {Promise<object>}
 */
declare function currentLoading(assets: AssetStoreLike, uri: string): Promise<object>;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {object|null}
 */
declare function currentFallback(assets: AssetStoreLike, uri: string): object | null;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {object}
 */
declare function currentValue(assets: AssetStoreLike, uri: string): object;
/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @returns {Array<string>}
 */
declare function keys(assets: AssetStoreLike): Array<string>;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {boolean}
 */
declare function hasCurrentValue(assets: AssetStoreLike, uri: string): boolean;
/**
 * @internal
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {string} uri
 * @returns {boolean}
 */
declare function isCurrentLoading(assets: AssetStoreLike, uri: string): boolean;
declare class Fallback {
    /**
     * @param {GlobExp} glob
     * @param {string} uri
     */
    constructor(glob: GlobExp, uri: string);
    glob: GlobExp;
    uri: string;
}
declare class Loading {
    /**
     * @param {Loading} loading
     */
    static nextAttempt(loading: Loading): number;
    /**
     * @param {Loading} loading
     * @param {number} attempt
     */
    static isCurrentAttempt(loading: Loading, attempt: number): boolean;
    /**
     * @param {number} timeout
     */
    constructor(timeout: number);
    /**
     * @private
     * @type {((value: any) => void)|null}
     */
    private _resolve;
    /**
     * @private
     * @type {((reason?: any) => void)|null}
     */
    private _reject;
    /** @private */
    private _reason;
    /** @private */
    private _value;
    /** @private */
    private promiseHandle;
    /** @private */
    private timeoutHandle;
    /**
     * @readonly
     */
    readonly promise: Promise<any>;
    /**
     * @param {any} value
     */
    resolve(value: any): void;
    /**
     * @param {any} reason
     */
    reject(reason: any): void;
}

type LocalAssetStore_Fallback = Fallback;
declare const LocalAssetStore_Fallback: typeof Fallback;
type LocalAssetStore_Loading = Loading;
declare const LocalAssetStore_Loading: typeof Loading;
declare const LocalAssetStore_cacheAndResolve: typeof cacheAndResolve;
declare const LocalAssetStore_cancelAndReject: typeof cancelAndReject;
declare const LocalAssetStore_createStore: typeof createStore;
declare const LocalAssetStore_currentFallback: typeof currentFallback;
declare const LocalAssetStore_currentLoading: typeof currentLoading;
declare const LocalAssetStore_currentValue: typeof currentValue;
declare const LocalAssetStore_deleteAndReject: typeof deleteAndReject;
declare const LocalAssetStore_deleteAndRejectByGlob: typeof deleteAndRejectByGlob;
declare const LocalAssetStore_fallbackFor: typeof fallbackFor;
declare const LocalAssetStore_hasCurrentValue: typeof hasCurrentValue;
declare const LocalAssetStore_isCurrentLoading: typeof isCurrentLoading;
declare const LocalAssetStore_keys: typeof keys;
declare const LocalAssetStore_loadAll: typeof loadAll;
declare const LocalAssetStore_loadThenCache: typeof loadThenCache;
declare const LocalAssetStore_promiseWhenLoaded: typeof promiseWhenLoaded;
declare const LocalAssetStore_resetStore: typeof resetStore;
declare namespace LocalAssetStore {
  export {
    LocalAssetStore_Fallback as Fallback,
    LocalAssetStore_Loading as Loading,
    LocalAssetStore_cacheAndResolve as cacheAndResolve,
    LocalAssetStore_cancelAndReject as cancelAndReject,
    LocalAssetStore_createStore as createStore,
    LocalAssetStore_currentFallback as currentFallback,
    LocalAssetStore_currentLoading as currentLoading,
    LocalAssetStore_currentValue as currentValue,
    LocalAssetStore_deleteAndReject as deleteAndReject,
    LocalAssetStore_deleteAndRejectByGlob as deleteAndRejectByGlob,
    LocalAssetStore_fallbackFor as fallbackFor,
    LocalAssetStore_hasCurrentValue as hasCurrentValue,
    LocalAssetStore_isCurrentLoading as isCurrentLoading,
    LocalAssetStore_keys as keys,
    LocalAssetStore_loadAll as loadAll,
    LocalAssetStore_loadThenCache as loadThenCache,
    LocalAssetStore_promiseWhenLoaded as promiseWhenLoaded,
    LocalAssetStore_resetStore as resetStore,
  };
}

type AssetStoreLike = {
    cached: Record<string, any>;
    loadings: Record<string, Loading>;
    defaults: Array<Fallback>;
};

/**
 * @template T
 * @template {object} Options
 * @param {string} uri
 * @param {import('../AssetTypes').AssetLoader<T, Options>} loader
 * @param {Options} [opts]
 */
declare function create<T, Options extends object>(uri: string, loader: AssetLoader$1<T, Options>, opts?: Options): {
    readonly uri: string;
    readonly loader: AssetLoader$1<T, Options>;
    readonly opts: Options;
};
/**
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<any, any>} target
 * @returns {boolean}
 */
declare function isCached(assets: AssetStoreLike, target: AssetLike$1<any, any>): boolean;
/**
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @returns {T|null}
 */
declare function getOrNull<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>): T | null;
/**
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @returns {T}
 */
declare function getOrThrow<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>): T;
/**
 * Pre-load target into cache ONLY if not yet loaded or loading. Otherwise, will throw.
 *
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {number} timeout
 * @returns {Promise<T>}
 */
declare function preload<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>, timeout: number): Promise<T>;
/**
 * Load target into cache if not yet loaded. Otherwise, return already cached value or loading promise.
 *
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {number} timeout
 * @returns {Promise<T>}
 */
declare function load<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>, timeout: number): Promise<T>;
/**
 * Re-load target into cache. Will always replace cached value.
 *
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {number} timeout
 * @returns {Promise<T>}
 */
declare function reload<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>, timeout: number): Promise<T>;
/**
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @returns {Promise<boolean>}
 */
declare function cancel<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>): Promise<boolean>;
/**
 * Cache target with value. Will always replace cached value.
 *
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {T} value
 */
declare function cachePut<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>, value: T): Promise<void>;
/**
 * Cache target with value ONLY if not yet loaded or loading. Otherwise, will throw.
 *
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {T} value
 */
declare function cacheSafely<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>, value: T): Promise<void>;
/**
 * @template T
 * @param {import('./AssetStoreTypes').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 */
declare function dispose<T>(assets: AssetStoreLike, target: AssetLike$1<T, any>): Promise<void>;

declare const LocalAsset_cachePut: typeof cachePut;
declare const LocalAsset_cacheSafely: typeof cacheSafely;
declare const LocalAsset_cancel: typeof cancel;
declare const LocalAsset_create: typeof create;
declare const LocalAsset_dispose: typeof dispose;
declare const LocalAsset_getOrNull: typeof getOrNull;
declare const LocalAsset_getOrThrow: typeof getOrThrow;
declare const LocalAsset_isCached: typeof isCached;
declare const LocalAsset_load: typeof load;
declare const LocalAsset_preload: typeof preload;
declare const LocalAsset_reload: typeof reload;
declare namespace LocalAsset {
  export {
    LocalAsset_cachePut as cachePut,
    LocalAsset_cacheSafely as cacheSafely,
    LocalAsset_cancel as cancel,
    LocalAsset_create as create,
    LocalAsset_dispose as dispose,
    LocalAsset_getOrNull as getOrNull,
    LocalAsset_getOrThrow as getOrThrow,
    LocalAsset_isCached as isCached,
    LocalAsset_load as load,
    LocalAsset_preload as preload,
    LocalAsset_reload as reload,
  };
}

type AssetLoader$1<T, Options extends object> = (uri: string, opts: Options, assets: AssetStoreLike) => Promise<T>;
type AssetLike$1<T, Options extends object> = {
    uri: string;
    loader: AssetLoader$1<T, Options>;
    opts?: Options;
};

/**
 * @template T
 * @template {object} Options
 *
 * A global reference to the resource by name and loader type.
 */
declare class Asset<T, Options extends object> {
    /** The default timeout for loading assets. */
    static DEFAULT_TIMEOUT: number;
    /** The global asset store. */
    static globalCache: {
        cached: Record<string, any>;
        loadings: Record<string, Loading>;
        defaults: Array<Fallback>;
    };
    /**
     * Create an asset to load target resource from uri. Assets with
     * the same uri will share the same resource instance.
     *
     * @template T
     * @template {object} Options
     * @param {string} uri
     * @param {import('./AssetTypes').AssetLoader<T, Options>} loader
     * @param {Options} opts
     */
    static for<T_1, Options_1 extends object>(uri: string, loader: AssetLoader$1<T_1, Options_1>, opts: Options_1): Asset<T_1, Options_1>;
    /**
     * @private
     * @param {string} uri
     * @param {import('./AssetTypes').AssetLoader<T, Options>} loader
     * @param {Options} opts
     */
    private constructor();
    /** @readonly */
    readonly uri: string;
    /** @readonly */
    readonly loader: AssetLoader$1<T, Options>;
    /** @readonly */
    readonly opts: Options;
    /** Whether this asset has a loaded value in the global cache. */
    isCached(): boolean;
    /** Get the cached or default asset value. Returns null if not present. */
    getOrNull(): T | null;
    /** Get the cached or default asset value. Throws if not present. */
    getOrThrow(): T;
    /** Try load and cache the result for this asset, only if not yet loaded. */
    load(timeout?: number): Promise<T>;
    /** Force load and cache the result for this asset, even if already exists. */
    reload(timeout?: number): Promise<T>;
    /** Perform load and cache the result for this asset, throws if already exists. */
    preload(timeout?: number): Promise<T>;
    /** Cancel any ongoing loading attempts for this asset. */
    cancel(): Promise<boolean>;
    /**
     * Put and override value in cache even if loaded already.
     *
     * @param {T} value
     */
    cachePut(value: T): Promise<void>;
    /**
     * Put value in cache only if never loaded.
     *
     * @param {T} value
     */
    cacheSafely(value: T): Promise<void>;
    /**
     * Delete the value in cache for this asset, if already loaded.
     */
    dispose(): Promise<void>;
}

type AssetLike<T, Options extends object> = AssetLike$1<T, Options>;
type AssetLoader<T, Options extends object> = AssetLoader$1<T, Options>;

export { Asset, GlobExp, LocalAsset, LocalAssetStore };
export type { AssetLike, AssetLoader };
