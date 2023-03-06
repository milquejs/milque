import { makeRe } from 'picomatch';
import { unzip } from 'fflate';

class GlobExp {
    /**
     * @param {string|GlobExp} pattern 
     */
    constructor(pattern) {
        let source;
        if (typeof pattern === 'object' && pattern instanceof GlobExp) {
            source = pattern.source;
        } else {
            source = String(pattern);
        }
        this.source = source;

        /** @private */
        this._re = makeRe(source);
    }

    /**
     * @param {string} string 
     * @returns {boolean}
     */
    test(string) {
        return this._re.test(string);
    }
}

/**
 * @typedef AssetStore
 * @property {Record<string, object>} store
 * @property {Record<string, Loading>} loadings
 * @property {Array<Fallback>} defaults
 */

/**
 * @template T
 * @template {object} S
 * @callback AssetLoader
 * @param {string|ArrayBuffer} src
 * @param {S} [opts]
 * @returns {Promise<T>}
 */

const FILE_URI_PREFIX_PATTERN = /^([_\w\d]+)\:\/\//;

/**
 * Load asset using a loader with the given src.
 * - If loading to transform a cached asset, the cached uri must start with `res://` (or equivalent).
 * - If loading to transform cached raw buffers from an asset pack, use `raw://`.
 * - Otherwise, it will call `fetch()` on src.
 * 
 * @template T, S
 * @param {AssetStore} assets
 * @param {string} uri 
 * @param {string} src
 * @param {AssetLoader<T, S>} loader
 * @param {S} opts
 * @param {number} timeout
 * @returns {Promise<T>}
 */
 async function loadInStore(assets, uri, src, loader, opts, timeout) {
    const { loadings } = assets;
    
    let loading;
    if (uri in loadings) {
        loading = loadings[uri];
    } else {
        loading = new Loading(timeout);
        loadings[uri] = loading;
    }

    const attempt = Loading.nextAttempt(loading);

    /** @type {Array<Promise<T>>} */
    let promises = [loading.promise];
    if (FILE_URI_PREFIX_PATTERN.test(src)) {
        // Loading from cached file
        promises.push(getLoadedInStore(assets, src, timeout)
            .then(cached => loader(cached, opts))
            .then(value => Loading.isCurrentAttempt(loading, attempt)
                ? cacheInStore(assets, uri, value)
                : undefined));
    } else {
        // Just load it
        promises.push(loader(src)
            .then(value => Loading.isCurrentAttempt(loading, attempt)
                ? cacheInStore(assets, uri, value)
                : undefined));
    }
    return await Promise.race(promises);
}

/**
 * @template T
 * @param {AssetStore} assets
 * @param {string} uri
 * @param {T} value
 * @returns {T}
 */
function cacheInStore(assets, uri, value) {
    const { store, loadings } = assets;
    store[uri] = value;
    // Send asset to awaiting loaders...
    if (uri in loadings) {
        loadings[uri].resolve(value);
        delete loadings[uri];
    }
    return value;
}

/**
 * @template T
 * @param {AssetStore} assets
 * @param {string|GlobExp} glob
 * @param {T} value
 * @returns {T}
 */
function cacheDefaultInStore(assets, glob, value) {
    const { defaults } = assets;
    if (typeof glob === 'string') {
        glob = new GlobExp(glob);
    }
    const uri = `__default://[${defaults.length}]`;
    cacheInStore(assets, uri, value);
    defaults.push(new Fallback(glob, uri));
    return value;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 */
function unloadInStore(assets, uri) {
    const { store, loadings } = assets;
    if (uri in loadings) {
        loadings[uri].reject(new Error('Stop loading to delete asset.'));
        delete loadings[uri];
    }
    if (uri in store) {
        delete store[uri];
    }
}

/**
 * @param {AssetStore} assets
 * @param {string|GlobExp} glob
 */
function clearInStore(assets, glob) {
    if (typeof glob === 'string') {
        glob = new GlobExp(glob);
    }
    const { store, loadings } = assets;
    // Clear loadings
    for (let [uri, loading] of Object.entries(loadings)) {
        if (glob.test(uri)) {
            loading.reject(new Error(`Stop loading to clear assets matching ${glob}`));
            delete loadings[uri];
        }
    }
    // Clear cache
    for (let uri of Object.keys(store)) {
        if (glob.test(uri)) {
            delete store[uri];
        }
    }
}

/**
 * @param {AssetStore} assets 
 */
function resetStore(assets) {
    const { store, loadings, defaults } = assets;
    // Clear loadings
    for (let [uri, loading] of Object.entries(loadings)) {
        loading.reject(new Error(`Stop loading to clear all assets.`));
        delete loadings[uri];
    }
    // Clear cache
    for (let uri of Object.keys(store)) {
        delete store[uri];
    }
    // Clear defaults
    defaults.length = 0;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {Promise<object>}
 */
function getLoadingInStore(assets, uri) {
    const { loadings } = assets;
    if (uri in loadings) {
        return loadings[uri].promise;
    } else {
        return null;
    }
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @param {number} timeout
 * @returns {Promise<object>}
 */
async function getLoadedInStore(assets, uri, timeout) {
    const { store, loadings } = assets;
    if (uri in store) {
        return store[uri];
    } else if (uri in loadings) {
        return loadings[uri].promise;
    } else {
        let loading = new Loading(timeout);
        loadings[uri] = loading;
        return loading.promise;
    }
}

/**
 * @param {AssetStore} assets
 * @param {string} uri 
 * @returns {object}
 */
function getDefaultInStore(assets, uri) {
    const { defaults } = assets;
    for (let def of defaults) {
        if (def.glob.test(uri)) {
            return getCurrentInStore(assets, def.uri);
        }
    }
    return null;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri
 * @returns {object}
 */
function getCurrentInStore(assets, uri) {
    return assets.store[uri];
}

/**
 * @param {AssetStore} assets
 * @param {string} uri 
 * @returns {boolean}
 */
function hasInStore(assets, uri) {
    return Boolean(assets.store[uri]);
}

/**
 * @param {AssetStore} assets
 * @returns {Array<string>}
 */
function keysInStore(assets) {
    return Object.keys(assets.store);
}

/**
 * @param {AssetStore} assets
 * @param {string} uri 
 * @returns {boolean}
 */
function isAssetCachedInStore(assets, uri) {
    return uri in assets.store;
}

/**
 * @param {AssetStore} assets
 * @param {string} uri 
 * @returns {boolean}
 */
function isAssetLoadingInStore(assets, uri) {
    return uri in assets.loadings;
}

class Fallback {
    /**
     * @param {GlobExp} glob 
     * @param {string} uri 
     */
    constructor(glob, uri) {
        this.glob = glob;
        this.uri = uri;
    }
}

class Loading {

    /**
     * @param {Loading} loading
     */
    static nextAttempt(loading) {
        return ++loading._promiseHandle;
    }

    /**
     * @param {Loading} loading 
     * @param {number} attempt
     */
    static isCurrentAttempt(loading, attempt) {
        return loading._promiseHandle === attempt;
    }

    constructor(timeout) {
        /** @private */
        this._promiseHandle = 0;
        /** @private */
        this._resolve = null;
        /** @private */
        this._reject = null;
        /** @private */
        this._reason = null;
        /** @private */
        this._value = null;
        /** @private */
        this._timeoutHandle =
            Number.isFinite(timeout) && timeout > 0
                ? setTimeout(() => {
                    this.reject(`Asset loading exceeded timeout of ${timeout} ms.`);
                }, timeout)
                : null;
        /** @private */
        this._promise = new Promise((resolve, reject) => {
            if (this._value) {
                resolve(this._value);
            } else {
                this._resolve = resolve;
            }
            if (this._reason) {
                reject(this._reason);
            } else {
                this._reject = reject;
            }
        });
    }

    get promise() {
        return this._promise;
    }

    resolve(value) {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
        }
        if (this._resolve) {
            this._resolve(value);
        } else {
            this._value = value;
        }
    }

    reject(reason) {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
        }
        if (this._reject) {
            this._reject(reason);
        } else {
            this._reason = reason;
        }
    }
}

class AssetManager {

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
     * @returns {object}
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
     * @param {import('./AssetStore').AssetLoader<T, S>} loader 
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
     * @param {import('./AssetStore').AssetLoader<T, S>} loader 
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
     * @param {import('./AssetStore').AssetLoader<T, S>} loader 
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

const DEFAULT_TIMEOUT = 5000;

/** @template T, S */
class AssetRef {

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
            result = await assetManager.load(this.uri, this.filepath, this.loader, this.opts, timeout);
            if (!result) {
                if (this.initial && this.initial instanceof AssetRef) {
                    let initial = this.initial;
                    result = await assetManager.load(initial.uri, initial.filepath, initial.loader, initial.opts, timeout);
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
        let result = await assetManager.reload(this.uri, this.filepath, this.loader, this.opts, timeout);
        this.source = assetManager;
        this.current = result;
        return result;
    }
}

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {string} url
 * @param {(src: Uint8Array, path: string) => void} callback
 */
async function loadAssetPack(url, callback) {
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    callback(buf, path);
                }
                resolve();
            }
        });
    });
}

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {AssetManager} assets
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
async function cacheAssetPackAsRaw(assets, url, callback = undefined) {
    const assetStore = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (assets));
    let rootPath = 'raw://';
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    // Remove the zip directory name
                    let i = path.indexOf('/');
                    if (i >= 0) {
                        path = path.substring(i + 1);
                    }
                    // Put the raw file in cache
                    let uri = rootPath + path;
                    cacheInStore(assetStore, uri, buf);
                    if (callback) {
                        callback(buf, uri, path);
                    }
                }
                resolve();
            }
        });
    });
}

/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 * 
 * @param {AssetManager} assets
 * @param {Array<AssetRef<?, ?>>} refs 
 * @param {number} [timeout] 
 */
async function preloadAssetRefs(assets, refs, timeout = 5000) {
    let promises = [];
    for (let ref of refs) {
        promises.push(ref.load(assets, timeout));
    }
    await Promise.allSettled(promises);
}

/**
 * @typedef {Record<string, AtlasSpriteData>} Atlas
 * 
 * @typedef AtlasSpriteData
 * @property {number} u
 * @property {number} v
 * @property {number} w
 * @property {number} h
 * @property {number} frames
 * @property {number} cols
 * @property {number} rows
 * @property {string} name
 */

/**
 * @param {string|ArrayBuffer} src
 * @param {{ onprogress: (value: number, loaded: number, total: number) => void }} opts
 * @returns {Promise<Atlas>}
 */
async function AtlasLoader(src, opts = { onprogress: undefined }) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return AtlasLoader(arrayBuffer, opts);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error('Cannot load from source - must be an array buffer or fetchable url.');
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  const string = new TextDecoder().decode(arrayBuffer);
  /** @type {Atlas} */
  let result = {};
  let lines = string.split('\n');
  let progressTotal = lines.length;
  let progressLoaded = 0;
  if (opts.onprogress) {
    opts.onprogress(0, 0, progressTotal);
  }
  for (let line of lines) {
    ++progressLoaded;
    line = line.trim();
    if (line.length <= 0) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('//')) continue;

    let args = [];
    let i = 0;
    let j = line.indexOf(' ');
    while (j >= 0) {
      args.push(line.substring(i, j));
      i = j + 1;
      j = line.indexOf(' ', i);
    }
    args.push(line.substring(i));

    let name = args[0];
    let u = Number.parseInt(args[1]);
    let v = Number.parseInt(args[2]);
    let w = Number.parseInt(args[3]);
    let h = Number.parseInt(args[4]);
    let frames =
      args.length >= 6
        ? Number.parseInt(args[5]) // User-defined
        : 1; // Default 1 frame
    let cols =
      args.length >= 7
        ? Number.parseInt(args[6]) // User-defined
        : frames; // Default same as frame count
    let rows =
      args.length >= 8
        ? Number.parseInt(args[7]) // User-defined
        : frames > cols // If more frames than cols...
        ? Math.ceil(frames / cols) // ...then expect more rows
        : 1; // Otherwise, default single row

    result[name] = {
      u,
      v,
      w,
      h,
      frames,
      cols,
      rows,
      name,
    };

    if (opts.onprogress) {
      opts.onprogress(progressLoaded / progressTotal, progressLoaded, progressTotal);
    }
  }
  if (opts.onprogress) {
    opts.onprogress(1, progressLoaded, progressLoaded);
  }
  return result;
}

/**
 * @typedef BMFontChar
 * @property {number} id The character id.
 * @property {number} x The left position of the character image in the texture.
 * @property {number} y The top position of the character image in the texture.
 * @property {number} width The width of the character image in the texture.
 * @property {number} height The height of the character image in the texture.
 * @property {number} xoffset How much the current position should be offset when
 *                            copying the image from the texture to the screen.
 * @property {number} yoffset How much the current position should be offset when
 *                            copying the image from the texture to the screen.
 * @property {number} xadvance How much the current position should be advanced
 *                             after drawing the character.
 * @property {number} page The texture page where the character image is found.
 * @property {number} chnl The texture channel where the character image is
 *                         found (1 = blue, 2 = green, 4 = red, 8 = alpha,
 *                         15 = all channels).
 *
 * @typedef BMFontKerning
 * @property {number} first The first character id.
 * @property {number} second The second character id.
 * @property {number} amount How much the x position should be adjusted when
 *                           drawing the second character immediately following
 *                           the first.
 *
 * @typedef BMFontData
 * @property {object} info              This tag holds information on how the
 *                                      font was generated.
 * @property {string} info.face         This is the name of the true type font.
 * @property {number} info.size         The size of the true type font.
 * @property {number} info.bold         The font is bold.
 * @property {number} info.italic	    The font is italic.
 * @property {string} info.charset	    The name of the OEM charset used (when
 *                                      not unicode).
 * @property {number} info.unicode	    Set to 1 if it is the unicode charset.
 * @property {number} info.stretchH	    The font height stretch in percentage.
 *                                      100% means no stretch.
 * @property {number} info.smooth	    Set to 1 if smoothing was turned on.
 * @property {number} info.aa	        The supersampling level used. 1 means no
 *                                      supersampling was used.
 * @property {number} info.padding	    The padding for each character
 *                                      (up, right, down, left).
 * @property {number} info.spacing	    The spacing for each character
 *                                      (horizontal, vertical).
 * @property {number} info.outline	    The outline thickness for the characters.
 * @property {object} common            This tag holds information common to all
 *                                      characters.
 * @property {number} common.lineHeight This is the distance in pixels between
 *                                      each line of text.
 * @property {number} common.base	    The number of pixels from the absolute
 *                                      top of the line to the base of the characters.
 * @property {number} common.scaleW	    The width of the texture, normally used
 *                                      to scale the x pos of the character image.
 * @property {number} common.scaleH	    The height of the texture, normally used
 *                                      to scale the y pos of the character image.
 * @property {number} common.pages	    The number of texture pages included in
 *                                      the font.
 * @property {number} common.packed	    Set to 1 if the monochrome characters
 *                                      have been packed into each of the texture
 *                                      channels. In this case alphaChnl describes
 *                                      what is stored in each channel.
 * @property {number} common.alphaChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {number} common.redChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {number} common.greenChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {number} common.blueChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {object} page              This tag gives the name of a texture
 *                                      file. There is one for each page in the font.
 * @property {number} page.id	        The page id.
 * @property {number} page.file	        The texture file name.
 * @property {Array<BMFontChar>} chars  This tag describes characters in the font.
 *                                      There is one for each included character
 *                                      in the font.
 * @property {Array<BMFontKerning>} kernings The kerning information is used to adjust
 *                                           the distance between certain characters,
 *                                           e.g. some characters should be placed
 *                                           closer to each other than others.
 */

/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<BMFontData>}
 */
async function BMFontLoader(src) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return BMFontLoader(arrayBuffer);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  return parse$1(new TextDecoder().decode(arrayBuffer));
}

const TAG_PATTERN = /(.+?)\s+(.*)/;
const LINE_PATTERN = /(.+)=(.+)/;

/**
 * @param {string} string
 * @returns {BMFontData}
 */
function parse$1(string) {
  let lines = string.split('\n');
  let info = {};
  let common = {};
  let page = {};
  let chars = [];
  let kernings = [];
  for (let line of lines) {
    let array = TAG_PATTERN.exec(line);
    if (!array) {
      continue;
    }
    let [_, tag, props] = array;
    switch (tag) {
      case 'info':
        parseBMLine(info, props);
        break;
      case 'common':
        parseBMLine(common, props);
        break;
      case 'page':
        parseBMLine(page, props);
        break;
      case 'chars':
        // This only has count info. Ignore it.
        break;
      case 'char':
        let char = {};
        parseBMLine(char, props);
        if ('id' in char) {
          chars.push(char);
        }
        break;
      case 'kerning':
        let kerning = {};
        parseBMLine(kerning, props);
        if ('first' in kerning) {
          kernings.push(kerning);
        }
        break;
      // Unknown tag.
    }
  }
  let data = /** @type {BMFontData} */ ({
    info,
    common,
    page,
    chars,
    kernings,
  });
  return data;
}

function parseBMLine(out, line) {
  let props = line.split(/\s+/);
  for (let prop of props) {
    let array = LINE_PATTERN.exec(prop);
    if (!array) {
      continue;
    }
    let [_, key, value] = array;
    let result = JSON.parse(`[${value}]`);
    if (result.length === 1) {
      out[key] = result[0];
    } else {
      out[key] = result;
    }
  }
}

/**
 * @param {string|ArrayBuffer} src
 * @param {object} [opts]
 * @param {string} [opts.imageType]
 * @returns {Promise<HTMLImageElement>}
 */
async function ImageLoader(src, opts = undefined) {
  let { imageType = undefined } = opts || {};
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    if (typeof imageType === 'undefined') {
      let i = src.lastIndexOf('.');
      if (i < 0) {
        throw new Error('Cannot load from url - unknown image type.');
      } else {
        imageType = 'image/' + src.slice(i + 1);
      }
    }
    return ImageLoader(arrayBuffer, { ...opts, imageType });
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  if (typeof imageType === 'undefined') {
    imageType = 'image/png';
  }
  let blob = new Blob([arrayBuffer], { type: imageType });
  let imageUrl = URL.createObjectURL(blob);
  let image = new Image();
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.addEventListener('error', (e) => {
      reject(e);
    });
    image.src = imageUrl;
  });
}

/**
 * @typedef MeshData
 * @property {Float32Array} positions
 * @property {Float32Array} texcoords
 * @property {Float32Array} normals
 * @property {Uint16Array} indices
 */

/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<MeshData>}
 */
async function OBJLoader(src) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return OBJLoader(arrayBuffer);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  return parse(new TextDecoder().decode(arrayBuffer));
}

/**
 * @param {string} string
 * @returns {MeshData}
 */
function parse(string) {
  const vertexList = [];
  const texcoordList = [];
  const normalList = [];

  const vertexIndices = [];
  const texcoordIndices = [];
  const normalIndices = [];

  // # comments
  const commentPattern = /^#.*/g;
  // v float float float
  const vertexPattern = /v\s+(\S+)\s+(\S+)\s+(\S+)/g;
  // vn float float float
  const normalPattern = /vn\s+(\S+)\s+(\S+)\s+(\S+)/g;
  // vt float float float
  const texcoordPattern = /vt\s+(\S+)\s+(\S+)/g;
  // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
  const facePattern =
    /f\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))(\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*)))?/g;
  // f float float float
  const faceVertexPattern = /f\s+([^/\s]+)\s+([^/\s]+)\s+([^/\s]+)/g;

  let quad = false;
  let result = null;
  let x, y, z, w;

  // Remove all comments
  string = string.replace(commentPattern, '');

  // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
  while ((result = vertexPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    z = Number.parseFloat(result[3]);
    vertexList.push(x);
    vertexList.push(y);
    vertexList.push(z);
  }

  // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
  while ((result = normalPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    z = Number.parseFloat(result[3]);
    normalList.push(x);
    normalList.push(y);
    normalList.push(z);
  }

  // ["vt 1.0 2.0", "1.0", "2.0"]
  while ((result = texcoordPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    texcoordList.push(x);
    texcoordList.push(y);
  }

  // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
  while ((result = facePattern.exec(string)) != null) {
    // Vertex indices
    x = Number.parseInt(result[2]);
    if (Number.isNaN(x)) x = 1;
    y = Number.parseInt(result[6]);
    if (Number.isNaN(y)) y = 1;
    z = Number.parseInt(result[10]);
    if (Number.isNaN(z)) z = 1;
    vertexIndices.push(x);
    vertexIndices.push(y);
    vertexIndices.push(z);

    // Normal indices
    x = Number.parseInt(result[4]);
    if (Number.isNaN(x)) {
      // No UVs.
      x = Number.parseInt(result[3]);
      y = Number.parseInt(result[7]);
      z = Number.parseInt(result[11]);
      normalIndices.push(x);
      normalIndices.push(y);
      normalIndices.push(z);

      texcoordIndices.push(1);
      texcoordIndices.push(1);
      texcoordIndices.push(1);
    } else {
      // Maybe UVs.
      y = Number.parseInt(result[8]);
      if (Number.isNaN(y)) y = 1;
      z = Number.parseInt(result[12]);
      if (Number.isNaN(z)) z = 1;
      normalIndices.push(x);
      normalIndices.push(y);
      normalIndices.push(z);

      // UV indices
      x = Number.parseInt(result[3]);
      if (Number.isNaN(x)) x = 1;
      y = Number.parseInt(result[7]);
      if (Number.isNaN(y)) y = 1;
      z = Number.parseInt(result[11]);
      if (Number.isNaN(z)) z = 1;
      texcoordIndices.push(x);
      texcoordIndices.push(y);
      texcoordIndices.push(z);
    }

    // Quad face
    if (typeof result[13] !== 'undefined') {
      // Vertex indices
      w = Number.parseInt(result[15]);
      if (Number.isNaN(w)) w = 1;
      vertexIndices.push(w);

      // Normal indices
      w = Number.parseInt(result[17]);
      if (Number.isNaN(w)) {
        // No UVs.
        w = Number.parseInt(result[16]);
        normalIndices.push(w);
        texcoordIndices.push(1);
      } else {
        // Maybe UVs.
        normalIndices.push(w);

        w = Number.parseInt(result[16]);
        texcoordIndices.push(w);
      }

      quad = true;
    }
  }

  // ["f 1 2 3 4", "1", "2", "3", "4"]
  while ((result = faceVertexPattern.exec(string)) != null) {
    // Vertex indices
    x = Number.parseInt(result[2]);
    y = Number.parseInt(result[6]);
    z = Number.parseInt(result[10]);
    vertexIndices.push(x);
    vertexIndices.push(y);
    vertexIndices.push(z);

    // UV indices
    texcoordIndices.push(1);
    texcoordIndices.push(1);
    texcoordIndices.push(1);

    // Normal indices
    normalIndices.push(1);
    normalIndices.push(1);
    normalIndices.push(1);

    // Quad face
    if (typeof result[13] !== 'undefined') {
      // Vertex indices
      w = Number.parseInt(result[14]);
      vertexIndices.push(w);

      // UV indices
      texcoordIndices.push(1);
      // Normal indices
      normalIndices.push(1);

      quad = true;
    }
  }

  let index, size;

  size = vertexIndices.length;
  const positions = new Float32Array(size * 3);
  for (let i = 0; i < size; ++i) {
    index = vertexIndices[i] - 1;
    positions[i * 3 + 0] = vertexList[index * 3 + 0];
    positions[i * 3 + 1] = vertexList[index * 3 + 1];
    positions[i * 3 + 2] = vertexList[index * 3 + 2];
  }

  size = texcoordIndices.length;
  const texcoords = new Float32Array(size * 2);
  for (let i = 0; i < size; ++i) {
    index = texcoordIndices[i] - 1;
    texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
    texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
  }

  size = normalIndices.length;
  const normals = new Float32Array(size * 3);
  for (let i = 0; i < size; ++i) {
    index = normalIndices[i] - 1;
    normals[i * 3 + 0] = normalList[index * 3 + 0];
    normals[i * 3 + 1] = normalList[index * 3 + 1];
    normals[i * 3 + 2] = normalList[index * 3 + 2];
  }

  // Must be either unsigned short or unsigned byte.
  size = vertexIndices.length;
  const indices = new Uint16Array(size);
  for (let i = 0; i < size; ++i) {
    indices[i] = i;
  }

  if (quad) {
    console.warn('WebGL does not support quad faces, only triangles.');
  }

  return {
    positions,
    texcoords,
    normals,
    indices,
  };
}

/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<string>}
 */
async function TextLoader(src) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return TextLoader(arrayBuffer);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  return new TextDecoder().decode(arrayBuffer);
}

/**
 * @param {ArrayBuffer|Uint8Array|string} src
 * @param {object} opts
 * @param {AudioContext} opts.audioContext
 * @returns {Promise<AudioBuffer>}
 */
async function AudioBufferLoader(src, opts) {
  const { audioContext } = opts || {};
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return AudioBufferLoader(arrayBuffer, { audioContext });
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  let audioArrayBuffer = new ArrayBuffer(arrayBuffer.byteLength);
  new Uint8Array(audioArrayBuffer).set(arrayBuffer);
  let audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
  return audioBuffer;
}

export { AssetManager, AssetRef, AtlasLoader, AudioBufferLoader, BMFontLoader, GlobExp, ImageLoader, OBJLoader, TextLoader, cacheAssetPackAsRaw, loadAssetPack, preloadAssetRefs };
//# sourceMappingURL=milque-asset.esm.js.map
