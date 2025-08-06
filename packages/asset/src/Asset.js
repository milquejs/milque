import { AssetStore } from './AssetStore';
import { LocalAsset } from './local';

/**
 * @template T
 * @template {object} Options
 * 
 * A global reference to the resource by name and loader type.
 */
export class Asset {

  /** The default timeout for loading assets. */
  static DEFAULT_TIMEOUT = 5_000;
  /** The global asset store. */
  static globalCache = new AssetStore();

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
  static for(uri, loader, opts) {
    return new Asset(uri, loader, opts);
  }

  /**
   * @private
   * @param {string} uri 
   * @param {import('./AssetTypes').AssetLoader<T, Options>} loader 
   * @param {Options} opts 
   */
  constructor(uri, loader, opts) {
    /** @readonly */
    this.uri = uri;
    /** @readonly */
    this.loader = loader;
    /** @readonly */
    this.opts = opts;
  }

  /** Whether this asset has a loaded value in the global cache. */
  isCached() {
    return LocalAsset.isCached(Asset.globalCache, this);
  }

  /** Get the cached or default asset value. Returns null if not present. */
  get() {
    return LocalAsset.get(Asset.globalCache, this);
  }

  /** Get the cached or default asset value. Throws if not present. */
  getOrThrow() {
    return LocalAsset.getOrThrow(Asset.globalCache, this);
  }

  /** Try load and cache the result for this asset, only if not yet loaded. */
  async load(timeout = Asset.DEFAULT_TIMEOUT) {
    return await LocalAsset.load(Asset.globalCache, this, timeout);
  }

  /** Force load and cache the result for this asset, even if already exists. */
  async reload(timeout = Asset.DEFAULT_TIMEOUT) {
    return await LocalAsset.reload(Asset.globalCache, this, timeout);
  }

  /** Perform load and cache the result for this asset, throws if already exists. */
  async preload(timeout = Asset.DEFAULT_TIMEOUT) {
    return await LocalAsset.preload(Asset.globalCache, this, timeout);
  }

  /** Cancel any ongoing loading attempts for this asset. */
  async cancel() {
    return LocalAsset.cancel(Asset.globalCache, this);
  }

  /**
   * Put and override value in cache even if loaded already.
   * 
   * @param {T} value 
   */
  async cachePut(value) {
    LocalAsset.cachePut(Asset.globalCache, this, value);
  }

  /**
   * Put value in cache only if never loaded.
   * 
   * @param {T} value 
   */
  async cacheSafely(value) {
    LocalAsset.cacheSafely(Asset.globalCache, this, value);
  }

  /**
   * Delete the value in cache for this asset, if already loaded.
   */
  async dispose() {
    LocalAsset.dispose(Asset.globalCache, this);
  }
}
