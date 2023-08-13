import { AssetManager } from './AssetManager';

const DEFAULT_TIMEOUT = 5000;

/** @template T, S */
export class AssetRef {
  /**
   * @param {string} uri
   * @param {import('./AssetStore').AssetLoader<T, S>} loader
   * @param {S} [opts]
   * @param {string} [filepath]
   * @param {T|AssetRef<T>} [initial]
   */
  constructor(uri, loader, opts = undefined, filepath = uri, initial = null) {
    this.uri = uri;
    this.loader = loader;
    this.opts = opts;

    /** @private */
    this.initial = initial;
    /** @private */
    this.filepath = filepath;

    /** @type {AssetManager} */
    this.source = null;
    /** @type {T} */
    this.current = null;
  }

  /**
   * @param {AssetManager} assetManager
   * @param {T} value
   */
  cache(assetManager, value) {
    assetManager.cache(this.uri, value);
    this.source = assetManager;
    this.current = value;
    return this;
  }

  /**
   * @param {AssetManager} assetManager
   * @returns {T}
   */
  get(assetManager) {
    let result;
    if (!assetManager.exists(this.uri)) {
      if (this.initial && this.initial instanceof AssetRef) {
        result = this.initial.get(assetManager);
      } else {
        result = this.initial;
      }
    } else {
      result = assetManager.current(this.uri);
    }
    this.source = assetManager;
    this.current = result;
    return result;
  }

  /**
   * @param {AssetManager} assetManager
   * @param {number} [timeout]
   */
  async load(assetManager, timeout = DEFAULT_TIMEOUT) {
    let result;
    if (!assetManager.exists(this.uri)) {
      result = await assetManager.load(
        this.uri,
        this.filepath,
        this.loader,
        this.opts,
        timeout,
      );
      if (!result) {
        if (this.initial && this.initial instanceof AssetRef) {
          let initial = this.initial;
          result = await assetManager.load(
            initial.uri,
            initial.filepath,
            initial.loader,
            initial.opts,
            timeout,
          );
        } else {
          result = this.initial;
        }
      }
    } else {
      result = assetManager.current(this.uri);
    }
    this.source = assetManager;
    this.current = result;
    return result;
  }

  /**
   * @param {AssetManager} assetManager
   * @param {number} [timeout]
   */
  async reload(assetManager, timeout = DEFAULT_TIMEOUT) {
    let result = await assetManager.reload(
      this.uri,
      this.filepath,
      this.loader,
      this.opts,
      timeout,
    );
    this.source = assetManager;
    this.current = result;
    return result;
  }
}
