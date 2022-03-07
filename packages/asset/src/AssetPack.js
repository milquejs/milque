import { unzip } from 'fflate';
import { makeRe } from 'picomatch';

import { FileBufferMap } from './FileBufferMap.js';

const INNER_HTML = '';
const INNER_STYLE = '';

const DEFAULT_TIMEOUT_MILLIS = 5_000;

/**
 * @typedef {(filePath: string) => boolean|{ key: string }} FileMatcher
 */

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function fileMatcher(filePath) {
  return this.test(filePath);
}

function logError(message, e) {
  /* eslint-disable no-console */
  console.error(message, e);
}

export class AssetPack extends HTMLElement {
  /**
   * @param {string|RegExp} filter
   * @returns {FileMatcher}
   */
  static createFileMatcher(filter) {
    if (typeof filter === 'string') {
      let pattern = makeRe(filter);
      let matcher = fileMatcher.bind(pattern);
      matcher.key = filter;
      return matcher;
    } else if (filter instanceof RegExp) {
      /** @type {RegExp} */
      let pattern = filter;
      let matcher = fileMatcher.bind(pattern);
      matcher.key = filter.source;
      return matcher;
    } else {
      throw new Error('Filter must be either a RegExp or glob string.');
    }
  }

  /** @private */
  static get [Symbol.for('templateNode')]() {
    let t = document.createElement('template');
    t.innerHTML = INNER_HTML;
    Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
    return t;
  }

  /** @private */
  static get [Symbol.for('styleNode')]() {
    let t = document.createElement('style');
    t.innerHTML = INNER_STYLE;
    Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
    return t;
  }

  static define(customElements = window.customElements) {
    customElements.define('asset-pack', AssetPack);
  }

  /**
   * @protected
   * Override for web component.
   */
  static get observedAttributes() {
    return ['src'];
  }

  /** @param {string} value */
  set src(value) {
    this.setAttribute('src', value);
  }

  /** @returns {string} */
  get src() {
    return this._src;
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(
      this.constructor[Symbol.for('templateNode')].content.cloneNode(true)
    );
    shadowRoot.appendChild(
      this.constructor[Symbol.for('styleNode')].cloneNode(true)
    );

    /** @private */
    this._src = '';
    /** @private */
    this._files = new FileBufferMap();
    /** @private */
    this._cache = {};
    /**
     * @private
     * @type {Record<string, Loading>}
     */
    this._loading = {};

    /** @private */
    this.onLoad = this.onLoad.bind(this);

    this.loaded = false;
  }

  get files() {
    return this._files;
  }

  /**
   * @param {string} uri
   * @param {any} asset
   * @param {object} [opts]
   * @param {boolean} [opts.ephemeral]
   */
  cacheAsset(uri, asset, opts = {}) {
    const { ephemeral } = opts;
    const prevValue = this._cache[uri];
    const loading = this._loading[uri];
    this._cache[uri] = asset;
    // Notify others of a new asset...
    this.dispatchEvent(
      new CustomEvent('cache', {
        composed: true,
        bubbles: false,
        detail: {
          uri,
          current: asset,
        },
      })
    );
    // Send asset to awaiting loaders...
    if (loading) {
      loading.resolve(asset);
      delete this._loading[asset];
    }
    // Delete asset if ephemeral (and not yet replaced)...
    if (ephemeral && this._cache[asset] === asset) {
      if (prevValue) {
        this._cache[asset] = prevValue;
      } else {
        delete this._cache[asset];
      }
    }
  }

  /**
   * @param {string} uri
   * @param {number} timeout
   */
  async loadAsset(uri, timeout = DEFAULT_TIMEOUT_MILLIS) {
    let value = this._cache[uri];
    if (value) {
      return value;
    } else if (uri in this._loading) {
      return this._loading[uri].promise;
    } else {
      let loading = new Loading(timeout);
      this._loading[uri] = loading;
      return loading.promise;
    }
  }

  clearAssets() {
    for (let loading of Object.values(this._loading)) {
      loading.reject(new Error('Stop loading to clear all assets.'));
    }
    this._loading = {};
    this._cache = {};
  }

  /**
   * @param {string} uri
   */
  deleteAsset(uri) {
    if (uri in this._loading) {
      this._loading[uri].reject(new Error('Stop loading to delete asset.'));
      delete this._loading[uri];
    }
    if (uri in this._cache) {
      delete this._cache[uri];
    }
  }

  /**
   * @param {string} uri
   */
  getAsset(uri) {
    return this._cache[uri];
  }

  getAssetURIs() {
    return Object.keys(this._cache);
  }

  /**
   * @param {string} uri
   */
  hasAsset(uri) {
    let value = this._cache[uri];
    if (value) {
      return Boolean(value);
    } else {
      return false;
    }
  }

  /**
   * Whether the asset has been cached (could still be null).
   *
   * @param {string} uri
   */
  isAssetCached(uri) {
    return uri in this._cache;
  }

  /**
   * Whether the asset is still waiting to load.
   *
   * @param {string} uri
   */
  isAssetLoading(uri) {
    return uri in this._loading;
  }

  /**
   * @protected
   * Override for web component.
   */
  connectedCallback() {
    upgradeProperty(this, 'src');
  }

  /**
   * @protected
   * Override for web component.
   */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'src':
        this._src = value;
        if (value) {
          this.loaded = false;
          fetch(value)
            .then(this.onLoad)
            .catch((e) => logError('Failed to load asset pack:', e));
        }
        break;
    }
  }

  /**
   * @private
   * @param {Response} response
   */
  async onLoad(response) {
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
      unzip(new Uint8Array(arrayBuffer), (err, data) => {
        if (err) {
          reject(err);
        } else {
          // TODO: These files should be ephemeral to save memory
          let result = this._files;
          Promise.all(
            Object.entries(data).map(([path, data]) => {
              // Remove the zip directory name
              // let i = path.indexOf('/');
              // path = path.substring(i + 1);
              // Put the file in cache
              result.put(path, data);
              return this.cacheAsset(path, data);
            })
          )
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
    this.dispatchEvent(
      new CustomEvent('load', {
        composed: true,
      })
    );
    this.loaded = true;
  }
}
AssetPack.define();

function upgradeProperty(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

class Loading {
  constructor(timeout) {
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
      timeout > 0
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
