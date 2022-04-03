import {
  cache,
  get,
  getCurrent,
  getDefault,
  getLoaded,
  load,
} from './AssetManager.js';

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
  }

  /** @returns {T} */
  get value() {
    return get(this.uri);
  }

  /** @returns {T} */
  get current() {
    return getCurrent(this.uri);
  }

  /** @returns {Promise<T>} */
  get loaded() {
    return getLoaded(this.uri);
  }

  /** @returns {T} */
  get default() {
    return getDefault(this.uri);
  }

  /** @param {number} [timeout] */
  async load(timeout = undefined) {
    await load(this.uri, this.source, this.loader, timeout);
    return this;
  }

  /**
   * @param {T} asset
   */
  cache(asset) {
    cache(this.uri, asset);
    return this;
  }
}
