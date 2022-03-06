/**
 * @template T
 */
export class AssetRef {

    /**
     * @param {string} uri 
     * @param {string} [filePath] 
     * @param {() => T} [loader] 
     */
    constructor(uri, filePath = uri, loader = null) {
        this.uri = uri;
        this.path = filePath;
        /** @private */
        this.loader = loader;
        /**
         * @private
         * @type {import('@milque/asset').AssetPack}
         */
        this.parent = null;
    }

    /** @returns {T} */
    get() {
        return this.parent.getAsset(this.uri);
    }

    /**
     * @param {number} [timeout]
     * @returns {Promise<T>}
     */
    async load(timeout = undefined) {
        return await this.parent.loadAsset(this.uri, timeout);
    }

    /**
     * @param {T} asset
     * @param {object} [opts]
     */
    cache(asset, opts = undefined) {
        this.parent.cacheAsset(this.uri, asset, opts);
    }

    /** @param {import('@milque/asset').AssetPack} assetPack */
    async register(assetPack) {
        let result = assetPack.files.get(this.path);
        if (this.loader) {
            result = await this.loader(result);
        }
        if (this.uri !== this.path) {
            assetPack.cacheAsset(this.uri, result);
        }
        this.parent = assetPack;
    }
}
