import { LocalAssetStore } from './local';

export const URI_SCHEME_PREFIX_PATTERN = /^([_\w\d]+)\:\/\//;

export class AssetStore {
  /** @type {Record<string, any>} */
  cached = {};
  /** @type {Record<string, LocalAssetStore.Loading>} */
  loadings = {};
  /** @type {Array<LocalAssetStore.Fallback>} */
  defaults = [];

  /**
   * @param {Array<import('./AssetTypes').AssetLike<any, any>>} targets
   * @param {number} timeout
   */
  async loadAll(targets, timeout) {
    LocalAssetStore.loadAllThenCache(this, targets, timeout);
  }

  /**
   * Register a fallback value for any asset with uri matching the
   * glob pattern.
   * 
   * @param {string|import('./GlobExp').GlobExp} glob 
   * @param {any} value 
   */
  fallbackFor(glob, value) {
    LocalAssetStore.cacheAndResolveAsFallback(this, glob, value);
  }

  keys() {
    return LocalAssetStore.currentKeys(this);
  }

  async clear() {
    LocalAssetStore.clearStore(this);
  }
}
