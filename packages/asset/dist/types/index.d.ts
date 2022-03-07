declare class FileBufferMap {
    /**
     * @private
     * @type {Record<string, Uint8Array>}
     */
    private _buffers;
    clear(): void;
    /**
     * @param {string} filePath
     * @param {Uint8Array} fileBuffer
     */
    put(filePath: string, fileBuffer: Uint8Array): void;
    /**
     * @param {string} filePath
     * @returns {Uint8Array}
     */
    get(filePath: string): Uint8Array;
    /**
     * @returns {Array<string>}
     */
    keys(): Array<string>;
}

declare class AssetPack extends HTMLElement {
    /**
     * @param {string|RegExp} filter
     * @returns {FileMatcher}
     */
    static createFileMatcher(filter: string | RegExp): FileMatcher;
    static define(customElements?: CustomElementRegistry): void;
    /**
     * @protected
     * Override for web component.
     */
    protected static get observedAttributes(): string[];
    /** @param {string} value */
    set src(arg: string);
    /** @returns {string} */
    get src(): string;
    /** @private */
    private _src;
    /** @private */
    private _files;
    /** @private */
    private _cache;
    /**
     * @private
     * @type {Record<string, Loading>}
     */
    private _loading;
    /**
     * @private
     * @param {Response} response
     */
    private onLoad;
    loaded: boolean;
    get files(): FileBufferMap;
    /**
     * @param {string} uri
     * @param {any} asset
     * @param {object} [opts]
     * @param {boolean} [opts.ephemeral]
     */
    cacheAsset(uri: string, asset: any, opts?: {
        ephemeral?: boolean;
    }): void;
    /**
     * @param {string} uri
     * @param {number} timeout
     */
    loadAsset(uri: string, timeout?: number): Promise<any>;
    clearAssets(): void;
    /**
     * @param {string} uri
     */
    deleteAsset(uri: string): void;
    /**
     * @param {string} uri
     */
    getAsset(uri: string): any;
    getAssetURIs(): string[];
    /**
     * @param {string} uri
     */
    hasAsset(uri: string): boolean;
    /**
     * Whether the asset has been cached (could still be null).
     *
     * @param {string} uri
     */
    isAssetCached(uri: string): boolean;
    /**
     * Whether the asset is still waiting to load.
     *
     * @param {string} uri
     */
    isAssetLoading(uri: string): boolean;
    /**
     * @protected
     * Override for web component.
     */
    protected connectedCallback(): void;
    /**
     * @protected
     * Override for web component.
     */
    protected attributeChangedCallback(attribute: any, prev: any, value: any): void;
}
type FileMatcher = (filePath: string) => boolean | {
    key: string;
};

export { AssetPack };
