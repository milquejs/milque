const DEFAULT_TIMEOUT_MILLIS = 5_000;

/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 */

/**
 * @param {import('@milque/asset').AssetPack} assetPack
 * @param {Array<AssetRef>} refs
 */
export function bindRefs(assetPack, refs) {
  for (let ref of refs) {
    if (ref instanceof AssetRef) {
      ref.register(assetPack);
    }
  }
}

export async function loadRefs(refs) {
  let promises = [];
  for (let ref of refs) {
    if (ref instanceof AssetRef) {
      promises.push(ref.load());
    }
  }
  await Promise.all(promises);
}

/**
 * @template T
 */
export class AssetRef {
  /**
   * @param {string} uri
   * @param {string|Uint8Array|(() => Promise<Uint8Array>)} [source]
   * @param {(src: string|Uint8Array) => Promise<T>} [loader]
   */
  constructor(uri, source = null, loader = null) {
    this.uri = uri;
    /** @protected */
    this.source = source;
    /** @protected */
    this.loader = loader;
    /**
     * @protected
     * @type {AssetPack}
     */
    this.parent = null;

    /** @private */
    this._cacheCurrent = null;
    /** @private */
    this._cacheOptions = undefined;
    /** @private */
    this._loadResolves = [];
    /** @private */
    this._loadRejects = [];
  }

  /** @returns {T} */
  get current() {
    if (!this.parent) {
      throw new Error(
        `Cannot resolve unregistered asset ref for '${this.uri}'.`
      );
    }
    return this.parent.getAsset(this.uri);
  }

  /**
   * @param {number} [timeout]
   * @returns {Promise<T>}
   */
  async load(timeout = DEFAULT_TIMEOUT_MILLIS) {
    const parent = this.parent;
    const uri = this.uri;
    if (!parent) {
      const result = await Promise.race([
        new Promise((resolve, reject) => {
          this._loadResolves.push(resolve);
          this._loadRejects.push(reject);
        }),
        new Promise((resolve, reject) =>
          setTimeout(() => {
            if (this._loadResolves.length > 0) {
              reject(
                new Error(
                  'Timeout reached while waiting for asset ref binding.'
                )
              );
            } else {
              resolve(this.current);
            }
          }, timeout)
        ),
      ]);
      return result;
    } else if (parent.isAssetLoading(uri)) {
      return await parent.loadAsset(uri, timeout);
    } else if (parent.isAssetCached(uri)) {
      return parent.getAsset(uri);
    } else {
      const loader = this.loader;
      const source = this.source;
      const [result, _] = await Promise.all([
        parent.loadAsset(uri, timeout),
        tryLoadFromSource(parent, uri, source, loader, timeout),
      ]);
      return result;
    }
  }

  /**
   * @param {T} asset
   * @param {object} [opts]
   */
  cache(asset, opts = undefined) {
    if (!this.parent) {
      this._cacheCurrent = asset;
      this._cacheOptions = opts;
      return;
    }
    this.parent.cacheAsset(this.uri, asset, opts);
  }

  /** @param {import('@milque/asset').AssetPack} assetPack */
  register(assetPack) {
    this.parent = assetPack;
    if (this._cacheCurrent) {
      let asset = this._cacheCurrent;
      let opts = this._cacheOptions;
      this._cacheCurrent = null;
      this._cacheOptions = null;
      this.cache(asset, opts);
    }
    if (this._loadResolves.length > 0) {
      const resolves = this._loadResolves;
      const rejects = this._loadRejects;
      this._loadResolves = [];
      this._loadRejects = [];
      this.load()
        .then((result) => {
          for (let resolve of resolves) {
            resolve(result);
          }
        })
        .catch((e) => {
          for (let reject of rejects) {
            reject(e);
          }
        });
    }
  }
}

/**
 * @template T
 * @param {AssetPack} assetPack
 * @param {string} uri
 * @param {string|Uint8Array|(() => Promise<any>)} source
 * @param {(src: string|Uint8Array) => Promise<T>} loader
 * @param {number} timeout
 */
async function tryLoadFromSource(assetPack, uri, source, loader, timeout) {
  let result = null;
  if (source) {
    if (typeof source === 'function') {
      result = await source();
    } else if (typeof source === 'string') {
      result = await assetPack.loadAsset(source, timeout);
    } else {
      result = source;
    }
  } else {
    result = uri;
  }
  if (loader) {
    if (typeof result !== 'string' && !(result instanceof Uint8Array)) {
      throw new Error(
        'Unable to load from source - must be either a string or Uint8Array.'
      );
    }
    result = await loader(result);
  }

  if (result && result !== uri) {
    assetPack.cacheAsset(uri, result);
  }
}
