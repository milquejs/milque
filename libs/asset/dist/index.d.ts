declare class GlobExp {
    /**
     * @param {string|GlobExp} pattern
     */
    constructor(pattern: string | GlobExp);
    source: string;
    /** @private */
    private _re;
    /**
     * @param {string} string
     * @returns {boolean}
     */
    test(string: string): boolean;
}

type AssetLoader$1<T, S extends unknown> = (src: string | ArrayBuffer, opts?: S) => Promise<T>;

/**
 * @template T, S
 * @typedef {import('./AssetStore').AssetLoader<T, S>} AssetLoader
 */
declare class AssetManager {
    /**
     * @param {AssetManager} [parent]
     */
    constructor(parent?: AssetManager);
    parent: AssetManager;
    /** @private */
    private store;
    /** @private */
    private loadings;
    /** @private */
    private defaults;
    /**
     * @param {string} uri
     * @returns {any}
     */
    get(uri: string): any;
    /**
     * @template T, S
     * @param {string} uri
     * @param {string} filepath
     * @param {AssetLoader<T, S>} loader
     * @param {S} opts
     * @param {number} timeout
     * @returns {Promise<T>}
     */
    resolve<T, S>(uri: string, filepath: string, loader: AssetLoader<T, S>, opts: S, timeout: number): Promise<T>;
    /**
     * @template T
     * @param {string|GlobExp} uriGlob
     * @param {T} value
     * @returns {T}
     */
    fallback<T_1>(uriGlob: string | GlobExp, value: T_1): T_1;
    /**
     * @template T
     * @param {string} uri
     * @param {T} value
     * @returns {T}
     */
    cache<T_2>(uri: string, value: T_2): T_2;
    /**
     * @template T, S
     * @param {string} uri
     * @param {string} filepath
     * @param {AssetLoader<T, S>} loader
     * @param {S} opts
     * @param {number} timeout
     * @returns {Promise<T>}
     */
    load<T_3, S_1>(uri: string, filepath: string, loader: AssetLoader<T_3, S_1>, opts: S_1, timeout: number): Promise<T_3>;
    /**
     * @template T, S
     * @param {string} uri
     * @param {string} filepath
     * @param {AssetLoader<T, S>} loader
     * @param {S} opts
     * @param {number} timeout
     * @returns {Promise<T>}
     */
    reload<T_4, S_2>(uri: string, filepath: string, loader: AssetLoader<T_4, S_2>, opts: S_2, timeout: number): Promise<T_4>;
    /**
     * @param {string} uri
     */
    unload(uri: string): void;
    /**
     * @param {string|GlobExp} uriGlob
     */
    clear(uriGlob: string | GlobExp): void;
    /**
     * @param {string} uri
     */
    current(uri: string): any;
    /**
     * @param {string} uri
     */
    exists(uri: string): boolean;
    /**
     * @param {string} uri
     */
    loading(uri: string): Promise<any>;
    keys(): string[];
    reset(): void;
}
type AssetLoader<T, S> = AssetLoader$1<T, S>;

/** @template T, S */
declare class AssetRef<T, S> {
    /**
     * @param {string} uri
     * @param {import('./AssetStore').AssetLoader<T, S>} loader
     * @param {S} [opts]
     * @param {string} [filepath]
     * @param {T|AssetRef<T>} [initial]
     */
    constructor(uri: string, loader: AssetLoader$1<T, S>, opts?: S, filepath?: string, initial?: T | AssetRef<T, any>);
    uri: string;
    loader: AssetLoader$1<T, S>;
    opts: S;
    /** @private */
    private initial;
    /** @private */
    private filepath;
    /** @type {AssetManager} */
    source: AssetManager;
    /** @type {T} */
    current: T;
    /**
     * @param {AssetManager} assetManager
     * @param {T} value
     */
    cache(assetManager: AssetManager, value: T): AssetRef<T, S>;
    /**
     * @param {AssetManager} assetManager
     * @returns {T}
     */
    get(assetManager: AssetManager): T;
    /**
     * @param {AssetManager} assetManager
     * @param {number} [timeout]
     */
    load(assetManager: AssetManager, timeout?: number): Promise<any>;
    /**
     * @param {AssetManager} assetManager
     * @param {number} [timeout]
     */
    reload(assetManager: AssetManager, timeout?: number): Promise<T>;
}

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 *
 * @param {string} url
 * @param {(src: Uint8Array, path: string) => void} callback
 */
declare function loadAssetPack(url: string, callback: (src: Uint8Array, path: string) => void): Promise<void>;
/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 *
 * @param {AssetManager} assets
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
declare function cacheAssetPackAsRaw(assets: AssetManager, url: string, callback?: (src: Uint8Array, uri: string, path: string) => void): Promise<void>;
/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 *
 * @param {AssetManager} assets
 * @param {Array<AssetRef<?, ?>>} refs
 * @param {number} [timeout]
 */
declare function preloadAssetRefs(assets: AssetManager, refs: Array<AssetRef<unknown, unknown>>, timeout?: number): Promise<void>;

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
declare function AtlasLoader(src: string | ArrayBuffer, opts?: {
    onprogress: (value: number, loaded: number, total: number) => void;
}): Promise<Atlas>;
type Atlas = Record<string, AtlasSpriteData>;
type AtlasSpriteData = {
    u: number;
    v: number;
    w: number;
    h: number;
    frames: number;
    cols: number;
    rows: number;
    name: string;
};

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
declare function BMFontLoader(src: string | ArrayBuffer): Promise<BMFontData>;
type BMFontChar = {
    /**
     * The character id.
     */
    id: number;
    /**
     * The left position of the character image in the texture.
     */
    x: number;
    /**
     * The top position of the character image in the texture.
     */
    y: number;
    /**
     * The width of the character image in the texture.
     */
    width: number;
    /**
     * The height of the character image in the texture.
     */
    height: number;
    /**
     * How much the current position should be offset when
     * copying the image from the texture to the screen.
     */
    xoffset: number;
    /**
     * How much the current position should be offset when
     * copying the image from the texture to the screen.
     */
    yoffset: number;
    /**
     * How much the current position should be advanced
     * after drawing the character.
     */
    xadvance: number;
    /**
     * The texture page where the character image is found.
     */
    page: number;
    /**
     * The texture channel where the character image is
     * found (1 = blue, 2 = green, 4 = red, 8 = alpha,
     * 15 = all channels).
     */
    chnl: number;
};
type BMFontKerning = {
    /**
     * The first character id.
     */
    first: number;
    /**
     * The second character id.
     */
    second: number;
    /**
     * How much the x position should be adjusted when
     * drawing the second character immediately following
     * the first.
     */
    amount: number;
};
type BMFontData = {
    /**
     * This tag holds information on how the
     * font was generated.
     */
    info: {
        face: string;
        size: number;
        bold: number;
        italic: number;
        charset: string;
        unicode: number;
        stretchH: number;
        smooth: number;
        aa: number;
        padding: number;
        spacing: number;
        outline: number;
    };
    /**
     * This tag holds information common to all
     * characters.
     */
    common: {
        lineHeight: number;
        base: number;
        scaleW: number;
        scaleH: number;
        pages: number;
        packed: number;
        alphaChnl: number;
        redChnl: number;
        greenChnl: number;
        blueChnl: number;
    };
    /**
     * This tag gives the name of a texture
     * file. There is one for each page in the font.
     */
    page: {
        id: number;
        file: number;
    };
    /**
     * This tag describes characters in the font.
     * There is one for each included character
     * in the font.
     */
    chars: Array<BMFontChar>;
    /**
     * The kerning information is used to adjust
     * the distance between certain characters,
     * e.g. some characters should be placed
     * closer to each other than others.
     */
    kernings: Array<BMFontKerning>;
};

/**
 * @param {string|ArrayBuffer} src
 * @param {object} [opts]
 * @param {string} [opts.imageType]
 * @returns {Promise<HTMLImageElement>}
 */
declare function ImageLoader(src: string | ArrayBuffer, opts?: {
    imageType?: string;
}): Promise<HTMLImageElement>;

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
declare function OBJLoader(src: string | ArrayBuffer): Promise<MeshData>;
type MeshData = {
    positions: Float32Array;
    texcoords: Float32Array;
    normals: Float32Array;
    indices: Uint16Array;
};

/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<string>}
 */
declare function TextLoader(src: string | ArrayBuffer): Promise<string>;

/**
 * @param {ArrayBuffer|Uint8Array|string} src
 * @param {object} opts
 * @param {AudioContext} opts.audioContext
 * @returns {Promise<AudioBuffer>}
 */
declare function AudioBufferLoader(src: ArrayBuffer | Uint8Array | string, opts: {
    audioContext: AudioContext;
}): Promise<AudioBuffer>;

export { AssetLoader, AssetManager, AssetRef, Atlas, AtlasLoader, AtlasSpriteData, AudioBufferLoader, BMFontChar, BMFontData, BMFontKerning, BMFontLoader, GlobExp, ImageLoader, MeshData, OBJLoader, TextLoader, cacheAssetPackAsRaw, loadAssetPack, preloadAssetRefs };
