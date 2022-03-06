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
