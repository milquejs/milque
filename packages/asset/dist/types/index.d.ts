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
    static define(customElements?: CustomElementRegistry): void;
    /** @override */
    static get observedAttributes(): string[];
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
     * @type {Record<string, PipelineStage>}
     */
    private _pipeline;
    /**
     * @private
     * @param {Response} response
     */
    private onLoad;
    get files(): FileBufferMap;
    /**
     * @param {string|RegExp} filter
     * @param {(assetData, uri) => Promise<any>} handler
     */
    pipe(filter: string | RegExp, handler: (assetData: any, uri: any) => Promise<any>): Promise<void>;
    /**
     * @param {string} uri
     * @param {any} asset
     * @param {object} [opts]
     * @param {boolean} [opts.ephemeral]
     */
    cache(uri: string, asset: any, opts?: {
        ephemeral?: boolean;
    }): Promise<void>;
    loadAsset(uri: any, timeout?: number): Promise<any>;
    clearAssets(): void;
    deleteAsset(uri: any): void;
    getAsset(uri: any): any;
    hasAsset(uri: any): any;
    /** @override */
    connectedCallback(): void;
    /** @override */
    attributeChangedCallback(attribute: any, prev: any, value: any): void;
}

export { AssetPack };
