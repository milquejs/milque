'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fflate = require('fflate');
var picomatch = require('picomatch');

class FileBufferMap
{
    constructor()
    {
        /**
         * @private
         * @type {Record<string, Uint8Array>}
         */
        this._buffers = {};
    }

    clear()
    {
        this._buffers = {};
    }

    /**
     * @param {string} filePath 
     * @param {Uint8Array} fileBuffer 
     */
    put(filePath, fileBuffer)
    {
        this._buffers[filePath] = fileBuffer;
    }

    /**
     * @param {string} filePath 
     * @returns {Uint8Array}
     */
    get(filePath)
    {
        return this._buffers[filePath];
    }

    /**
     * @returns {Array<string>}
     */
    keys()
    {
        return Object.keys(this._buffers);
    }
}

const INNER_HTML = '';
const INNER_STYLE = '';

const DEFAULT_TIMEOUT_MILLIS = 5_000;

class AssetPack extends HTMLElement
{
    /** @private */
    static get [Symbol.for('templateNode')]()
    {
        let t = document.createElement('template');
        t.innerHTML = INNER_HTML;
        Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
        return t;
    }

    /** @private */
    static get [Symbol.for('styleNode')]()
    {
        let t = document.createElement('style');
        t.innerHTML = INNER_STYLE;
        Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
        return t;
    }
    
    static define(customElements = window.customElements)
    {
        customElements.define('asset-pack', AssetPack);
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'src'
        ];
    }

    /** @param {string} value */
    set src(value)
    {
        this.setAttribute('src', value);
    }

    /** @returns {string} */
    get src()
    {
        return this._src;
    }

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor[Symbol.for('templateNode')].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[Symbol.for('styleNode')].cloneNode(true));

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
        /**
         * @private
         * @type {Record<string, PipelineStage>}
         */
        this._pipeline = {};

        /** @private */
        this.onLoad = this.onLoad.bind(this);
    }

    get files()
    {
        return this._files;
    }

    /**
     * @param {string|RegExp} filter 
     * @param {(assetData, uri) => Promise<any>} handler
     */
    async pipe(filter, handler)
    {
        let filterKey;
        if (typeof filter === 'string')
        {
            filterKey = filter;
            if (!(filterKey in this._pipeline))
            {
                filter = picomatch.makeRe(filter);
            }
        }
        else if (filter instanceof RegExp)
        {
            filterKey = filter.source;
        }
        else
        {
            throw new Error('Filter must be either a RegExp or glob string.');
        }

        /** @type {PipelineStage} */
        let stage;
        if (filterKey in this._pipeline)
        {
            stage = this._pipeline[filterKey];
        }
        else
        {
            stage = new PipelineStage(filter);
            this._pipeline[filterKey] = stage;
        }
        stage.addHandler(handler);
        
        // Process old assets with new handler...
        await Promise.all(Object.entries(this._cache).map(([key, value]) => {
            if (stage.matches(key))
            {
                return handler(value, key);
            }
            else
            {
                return null;
            }
        }));
    }

    /**
     * @param {string} uri 
     * @param {any} asset 
     * @param {object} [opts]
     * @param {boolean} [opts.ephemeral]
     */
    async cache(uri, asset, opts = {})
    {
        const { ephemeral } = opts;
        const prevValue = this._cache[uri];
        const loading = this._loading[uri];
        this._cache[uri] = asset;
        // Process the asset...
        await Promise.all(Object.values(this._pipeline).map(stage => {
            if (stage.matches(uri))
            {
                return stage.process(uri, asset);
            }
            else
            {
                return null;
            }
        }));
        // Send asset to awaiting loaders...
        if (loading)
        {
            loading.resolve(asset);
            delete this._loading[asset];
        }
        // Delete asset if ephemeral (and not yet replaced)...
        if (ephemeral && this._cache[asset] === asset)
        {
            if (prevValue)
            {
                this._cache[asset] = prevValue;
            }
            else
            {
                delete this._cache[asset];
            }
        }
    }

    async loadAsset(uri, timeout = DEFAULT_TIMEOUT_MILLIS)
    {
        let value = this._cache[uri];
        if (value)
        {
            return value;
        }
        else if (uri in this._loading)
        {
            return this._loading[uri].promise;
        }
        else
        {
            let loading = new Loading(timeout);
            this._loading[uri] = loading;
            return loading.promise;
        }
    }

    clearAssets()
    {
        for(let loading of Object.values(this._loading))
        {
            loading.reject(new Error('Stop loading to clear all assets.'));
        }
        this._loading = {};
        this._cache = {};
    }

    deleteAsset(uri)
    {
        if (uri in this._loading)
        {
            this._loading[uri].reject(new Error('Stop loading to delete asset.'));
            delete this._loading[uri];
        }
        if (uri in this._cache)
        {
            delete this._cache[uri];
        }
    }

    getAsset(uri)
    {
        return this._cache[uri];
    }

    hasAsset(uri)
    {
        let value = this._cache[uri];
        if (value)
        {
            return value;
        }
        else
        {
            return false;
        }
    }

    /** @override */
    connectedCallback()
    {
        upgradeProperty(this, 'src');
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'src':
                this._src = value;
                if (value)
                {
                    fetch(value)
                        .then(this.onLoad)
                        .catch(e => console.error(
                            `Failed to load asset pack: ${e}`));
                }
                break;
        }
    }

    /**
     * @private
     * @param {Response} response
     */
    async onLoad(response)
    {
        let arrayBuffer = await response.arrayBuffer();
        await new Promise((resolve, reject) => {
            fflate.unzip(new Uint8Array(arrayBuffer), (err, data) => {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    // TODO: These files should be ephemeral to save memory
                    let result = this._files;
                    Promise.all(Object.entries(data)
                        .map(([path, data]) => {
                            // Remove the zip directory name
                            // let i = path.indexOf('/');
                            // path = path.substring(i + 1);
                            // Put the file in cache
                            result.put(path, data);
                            return this.cache(path, data);
                        }))
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        });
        this.dispatchEvent(new CustomEvent('load', {
            composed: true,
        }));
    }
}
AssetPack.define();

function upgradeProperty(element, propertyName)
{
    if (Object.prototype.hasOwnProperty.call(element, propertyName))
    {
        let value = element[propertyName];
        delete element[propertyName];
        element[propertyName] = value;
    }
}

class PipelineStage
{
    constructor(filter)
    {
        /** @type {RegExp} */
        this.filter = filter;
        this.handlers = [];
    }

    matches(string)
    {
        return this.filter.test(string);
    }

    async process(uri, asset)
    {
        return Promise.all(this.handlers.map(value => value(uri, asset)));
    }

    addHandler(handler)
    {
        this.handlers.push(handler);
    }
}

class Loading
{
    constructor(timeout)
    {
        /** @private */
        this._resolve = null;
        /** @private */
        this._reject = null;
        /** @private */
        this._reason = null;
        /** @private */
        this._value = null;
        /** @private */
        this._timeoutHandle = timeout > 0
            ? setTimeout(() => {
                this.reject(`Asset loading exceeded timeout of ${timeout} ms.`);
            }, timeout)
            : null;
        /** @private */
        this._promise = new Promise((resolve, reject) => {
            if (this._value)
            {
                resolve(this._value);
            }
            else
            {
                this._resolve = resolve;
            }
            if (this._reason)
            {
                reject(this._reason);
            }
            else
            {
                this._reject = reject;
            }
        });
    }

    get promise()
    {
        return this._promise;
    }

    resolve(value)
    {
        if (this._timeoutHandle)
        {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
        }
        if (this._resolve)
        {
            this._resolve(value);
        }
        else
        {
            this._value = value;
        }
    }

    reject(reason)
    {
        if (this._timeoutHandle)
        {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null;
        }
        if (this._reject)
        {
            this._reject(reason);
        }
        else
        {
            this._reason = reason;
        }
    }
}

exports.AssetPack = AssetPack;
