declare class ByteReader {
    /**
     * @param {ArrayBuffer} arrayBuffer
     * @param {number} [byteOffset]
     * @param {number} [byteLength]
     * @param {boolean} [littleEndian]
     */
    constructor(arrayBuffer: ArrayBuffer, byteOffset?: number, byteLength?: number, littleEndian?: boolean);
    /** @readonly */
    readonly buffer: ArrayBuffer;
    /** @readonly */
    readonly view: DataView<ArrayBuffer>;
    /** @readonly */
    readonly littleEndian: boolean;
    /** @protected */
    protected offset: number;
    /**
     * @param {number} numBytes
     */
    skipBytes(numBytes: number): void;
    /**
     * The next 8-bit unsigned value.
     */
    nextByte(): number;
    /**
     * The next 16-bit unsigned value.
     */
    nextWord(): number;
    /**
     * The next 16-bit signed value.
     */
    nextShort(): number;
    /**
     * The next 32-bit unsigned value.
     */
    nextDoubleWord(): number;
    /**
     * The next 32-bit signed value.
     */
    nextLong(): number;
    /**
     * The next 64-bit signed value.
     */
    nextDoubleLong(): bigint;
    /**
     * The next 64-bit unsigned value.
     */
    nextQuadWord(): bigint;
    /**
     * The next 32-bit fixed-point 16.16 value.
     */
    nextFixed(): number;
    /**
     * The next 32-bit single-precision value.
     */
    nextFloat(): number;
    /**
     * The next 64-bit double-precision value.
     */
    nextDouble(): number;
    /**
     * A slice of the next N-bytes.
     *
     * @param {number} numBytes
     */
    nextBytes(numBytes: number): ArrayBuffer;
    /**
     * A slice of all remaining bytes in view.
     */
    remainingBytes(): ArrayBuffer;
}

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkExternalFiles(data: ByteReader, textDecoder: TextDecoder): {
    entries: {
        entryId: number;
        entryType: AsepriteExternalFileEntryType;
        extensionId: string;
    }[];
};
declare namespace AsepriteExternalFileEntryTypes {
    let EXTERNAL_PALETTE: 0;
    let EXTERNAL_TILESET: 1;
    let PROPERTIES_EXTENSION_NAME: 2;
    let TILE_MANAGER_EXTENSION_NAME: 3;
}
type AsepriteExternalFileEntry = ReturnType<typeof createAsepriteExternalFileEntry>;
type AsepriteExternalFileEntryType = 0 | 2 | 1 | 3;

/** @typedef {ReturnType<createAsepriteExternalFileEntry>} AsepriteExternalFileEntry */
/**
 * @param {number} entryId
 * @param {AsepriteExternalFileEntryType} entryType
 * @param {string} extensionId
 */
declare function createAsepriteExternalFileEntry(entryId: number, entryType: AsepriteExternalFileEntryType, extensionId: string): {
    entryId: number;
    entryType: AsepriteExternalFileEntryType;
    extensionId: string;
};

/**
 * @param {ByteReader} data
 */
declare function readAsepriteChunkColorProfile(data: ByteReader): {
    profileType: AsepriteColorProfile;
    flags: number;
    fixedGamma: number;
    iccProfile: ArrayBuffer | null;
};
declare namespace AsepriteColorProfiles {
    let NONE: 0;
    let SRGB: 1;
    let ICC: 2;
}
type AsepriteColorProfile = 0 | 2 | 1;

/**
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
declare function countPixelFormatBytesPerPixel(pixelFormat: AsepritePixelFormat): 2 | 1 | 4;
/**
 * @param {number} colorDepth
 */
declare function getPixelFormatFromColorDepth(colorDepth: number): 2 | 1 | 3;
declare namespace AsepritePixelFormats {
    let RGBA: 1;
    let GRAYSCALE: 2;
    let INDEXED: 3;
}
type AsepritePixelFormat = 2 | 1 | 3;

/** @typedef {ReturnType<readAsepriteChunkCel>} AsepriteChunkCel */
/**
 * @param {ByteReader} data
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
declare function readAsepriteChunkCel(data: ByteReader, pixelFormat: AsepritePixelFormat): {
    layerIndex: number;
    posX: number;
    posY: number;
    opacityLevel: number;
    celType: AsepriteCelType;
    zIndex: number;
    celData: {
        width: number;
        height: number;
        length: number;
        pixelFormat: AsepritePixelFormat;
        pixelData: ArrayBuffer;
    } | {
        linkedFrame: number;
    } | {
        width: number;
        height: number;
        compressedPixels: ArrayBuffer;
    } | {
        width: number;
        height: number;
        bitsPerTile: number;
        bitmaskForTileId: number;
        bitmaskForFlipX: number;
        bitmaskForFlipY: number;
        bitmaskForDiagonalFlip: number;
        compressedTiles: ArrayBuffer;
    };
};
declare namespace AsepriteCelTypes {
    let RAW_IMAGE_DATA: 0;
    let LINKED_CEL: 1;
    let COMPRESSED_IMAGE: 2;
    let COMPRESSED_TILEMAP: 3;
}
type AsepriteChunkCel = ReturnType<typeof readAsepriteChunkCel>;
type AsepriteRawImageData = ReturnType<typeof readAsepriteChunkCelRawImageData>;
type AsepriteLinkedCel = ReturnType<typeof readAsepriteChunkCelLinkedCel>;
type AsepriteCompressedImage = Awaited<ReturnType<typeof readAsepriteChunkCelCompressedImage>>;
type AsepriteCompressedTilemap = ReturnType<typeof readAsepriteChunkCelCompressedTilemap>;
type AsepriteCelType = 0 | 2 | 1 | 3;

/** @typedef {ReturnType<readAsepriteChunkCelRawImageData>} AsepriteRawImageData */
/**
 * @param {ByteReader} data
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
declare function readAsepriteChunkCelRawImageData(data: ByteReader, pixelFormat: AsepritePixelFormat): {
    width: number;
    height: number;
    length: number;
    pixelFormat: AsepritePixelFormat;
    pixelData: ArrayBuffer;
};
/** @typedef {ReturnType<readAsepriteChunkCelLinkedCel>} AsepriteLinkedCel */
/**
 * @param {ByteReader} data
 */
declare function readAsepriteChunkCelLinkedCel(data: ByteReader): {
    linkedFrame: number;
};
/** @typedef {Awaited<ReturnType<readAsepriteChunkCelCompressedImage>>} AsepriteCompressedImage */
/**
 * @param {ByteReader} data
 */
declare function readAsepriteChunkCelCompressedImage(data: ByteReader): {
    width: number;
    height: number;
    compressedPixels: ArrayBuffer;
};
/** @typedef {ReturnType<readAsepriteChunkCelCompressedTilemap>} AsepriteCompressedTilemap */
/**
 * @param {ByteReader} data
 */
declare function readAsepriteChunkCelCompressedTilemap(data: ByteReader): {
    width: number;
    height: number;
    bitsPerTile: number;
    bitmaskForTileId: number;
    bitmaskForFlipX: number;
    bitmaskForFlipY: number;
    bitmaskForDiagonalFlip: number;
    compressedTiles: ArrayBuffer;
};

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkLayer(data: ByteReader, textDecoder: TextDecoder): {
    flags: number;
    layerType: number;
    childLevel: number;
    blendMode: AsepriteBlendMode;
    opacity: number;
    layerName: string;
    tilesetIndex: number;
};
declare namespace AsepriteBlendModes {
    let NORMAL: 0;
    let MULTIPLY: 1;
    let SCREEN: 2;
    let OVERLAY: 3;
    let DARKEN: 4;
    let LIGHTEN: 5;
    let COLOR_DODGE: 6;
    let COLOR_BURN: 7;
    let HARD_LIGHT: 8;
    let SOFT_LIGHT: 9;
    let DIFFERENCE: 10;
    let EXCLUSION: 11;
    let HUE: 12;
    let SATURATION: 13;
    let COLOR: 14;
    let LUMINOSITY: 15;
    let ADDITION: 16;
    let SUBTRACT: 17;
    let DIVIDE: 18;
}
declare namespace AsepriteLayerFlags {
    let VISIBLE: 1;
    let EDITABLE: 2;
    let LOCK_MOVEMENT: 4;
    let BACKGROUND: 8;
    let PREFER_LINKED_CELS: 16;
    let COLLAPSED_LAYER_GROUP: 32;
    let IS_REFERENCE_LAYER: 64;
}
type AsepriteBlendMode = 0 | 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

declare namespace AsepriteChunkTypes {
    let PALETTE_0004: 4;
    let PALETTE_0011: 17;
    let LAYER: 8196;
    let CEL: 8197;
    let CEL_EXTRA: 8198;
    let COLOR_PROFILE: 8199;
    let EXTERNAL_FILE: 8200;
    let MASK: 8214;
    let PATH: 8215;
    let TAGS: 8216;
    let PALETTE: 8217;
    let USER_DATA: 8224;
    let SLICE: 8226;
    let TILESET: 8227;
}
type AsepriteChunkType = 4 | 17 | 8196 | 8197 | 8198 | 8199 | 8200 | 8214 | 8215 | 8216 | 8217 | 8224 | 8226 | 8227;

/** @typedef {ReturnType<readAsepriteFileBytes>} AsepriteFile */
/**
 * @see https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md
 * @param {ByteReader} data
 */
declare function readAsepriteFileBytes(data: ByteReader): {
    header: {
        /** Bytes in this file. */
        fileSize: number;
        /** Number of frames in this file. */
        frames: number;
        width: number;
        height: number;
        colorDepth: number;
        paletteIndex: number;
        numColors: number;
        pixelWidth: number;
        pixelHeight: number;
        gridX: number;
        gridY: number;
        gridWidth: number;
        gridHeight: number;
    };
    frames: {
        frameHeader: {
            /** Bytes in this frame. */
            frameSize: number;
            /** Duration of this frame in milliseconds. */
            frameDuration: number;
            /** Number of chunks in this frame. */
            chunks: number;
        };
        chunks: ({
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            flags: number;
            posX: number;
            posY: number;
            celWidth: number;
            celHeight: number;
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            flags: number;
            layerType: number;
            childLevel: number;
            blendMode: AsepriteBlendMode;
            opacity: number;
            layerName: string;
            tilesetIndex: number;
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            layerIndex: number;
            posX: number;
            posY: number;
            opacityLevel: number;
            celType: AsepriteCelType;
            zIndex: number;
            celData: {
                width: number;
                height: number;
                length: number;
                pixelFormat: AsepritePixelFormat;
                pixelData: ArrayBuffer;
            } | {
                linkedFrame: number;
            } | {
                width: number;
                height: number;
                compressedPixels: ArrayBuffer;
            } | {
                width: number;
                height: number;
                bitsPerTile: number;
                bitmaskForTileId: number;
                bitmaskForFlipX: number;
                bitmaskForFlipY: number;
                bitmaskForDiagonalFlip: number;
                compressedTiles: ArrayBuffer;
            };
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            profileType: AsepriteColorProfile;
            flags: number;
            fixedGamma: number;
            iccProfile: ArrayBuffer | null;
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            entries: {
                entryId: number;
                entryType: AsepriteExternalFileEntryType;
                extensionId: string;
            }[];
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            tags: {
                fromFrame: number;
                toFrame: number;
                direction: number;
                nTimes: number;
                tagName: string;
            }[];
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            paletteSize: number;
            firstColor: number;
            lastColor: number;
            colors: {
                name: string;
                value: number;
            }[];
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            text: string | null;
            color: number | null;
            props: {
                mapSize: number;
                maps: {
                    mapKey: number;
                    values: Record<string, any>;
                }[];
            } | null;
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            name: string;
            keys: {
                frameNumber: number;
                originX: number;
                originY: number;
                sliceWidth: number;
                sliceHeight: number;
                ninePatch: {
                    centerX: number;
                    centerY: number;
                    centerWidth: number;
                    centerHeight: number;
                } | null;
                pivot: {
                    pivotX: number;
                    pivotY: number;
                } | null;
            }[];
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        } | {
            tilesetId: number;
            numTiles: number;
            tileWidth: number;
            tileHeight: number;
            baseIndex: number;
            name: string;
            externalTileset: {
                entryId: number;
                externalTilesetId: number;
            } | null;
            includedTileset: {
                compressedPixels: ArrayBuffer;
            } | null;
            chunkHeader: {
                chunkType: AsepriteChunkType;
                chunkSize: number;
            };
        })[];
    }[];
};
/**
 * @param {ByteReader} data
 */
declare function readAsepriteHeaderBytes(data: ByteReader): {
    /** Bytes in this file. */
    fileSize: number;
    /** Number of frames in this file. */
    frames: number;
    width: number;
    height: number;
    colorDepth: number;
    paletteIndex: number;
    numColors: number;
    pixelWidth: number;
    pixelHeight: number;
    gridX: number;
    gridY: number;
    gridWidth: number;
    gridHeight: number;
};
/**
 * @param {ByteReader} data
 */
declare function readAsepriteFrameHeaderBytes(data: ByteReader): {
    /** Bytes in this frame. */
    frameSize: number;
    /** Duration of this frame in milliseconds. */
    frameDuration: number;
    /** Number of chunks in this frame. */
    chunks: number;
};
/** @typedef {ReturnType<readAsepriteChunkBytes>} AsepriteChunk */
/**
 * @param {ByteReader} data
 */
declare function readAsepriteChunkBytes(data: ByteReader): {
    /** Bytes in this chunk. */
    chunkSize: number;
    chunkType: AsepriteChunkType;
    chunkData: ArrayBuffer;
};
type AsepriteFile = ReturnType<typeof readAsepriteFileBytes>;
type AsepriteChunk = ReturnType<typeof readAsepriteChunkBytes>;

declare class Aseprite {
    /**
     * @param {ArrayBuffer} arrayBuffer
     */
    static fromArrayBuffer(arrayBuffer: ArrayBuffer): Aseprite;
    /**
     * @param {number} fileSize
     * @param {number} width
     * @param {number} height
     * @param {number} colorDepth
     * @param {string} pixelRatio
     * @param {import('./AsepriteFile').AsepriteFile} fileData
     */
    constructor(fileSize: number, width: number, height: number, colorDepth: number, pixelRatio: string, fileData: AsepriteFile);
    /** @readonly */
    readonly fileSize: number;
    /** @readonly */
    readonly fileData: {
        header: {
            fileSize: number;
            frames: number;
            width: number;
            height: number;
            colorDepth: number;
            paletteIndex: number;
            numColors: number;
            pixelWidth: number;
            pixelHeight: number;
            gridX: number;
            gridY: number;
            gridWidth: number;
            gridHeight: number;
        };
        frames: {
            frameHeader: {
                frameSize: number;
                frameDuration: number;
                chunks: number;
            };
            chunks: ({
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                flags: number;
                posX: number;
                posY: number;
                celWidth: number;
                celHeight: number;
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                flags: number;
                layerType: number;
                childLevel: number;
                blendMode: AsepriteBlendMode;
                opacity: number;
                layerName: string;
                tilesetIndex: number;
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                layerIndex: number;
                posX: number;
                posY: number;
                opacityLevel: number;
                celType: AsepriteCelType;
                zIndex: number;
                celData: {
                    width: number;
                    height: number;
                    length: number;
                    pixelFormat: AsepritePixelFormat;
                    pixelData: ArrayBuffer;
                } | {
                    linkedFrame: number;
                } | {
                    width: number;
                    height: number;
                    compressedPixels: ArrayBuffer;
                } | {
                    width: number;
                    height: number;
                    bitsPerTile: number;
                    bitmaskForTileId: number;
                    bitmaskForFlipX: number;
                    bitmaskForFlipY: number;
                    bitmaskForDiagonalFlip: number;
                    compressedTiles: ArrayBuffer;
                };
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                profileType: AsepriteColorProfile;
                flags: number;
                fixedGamma: number;
                iccProfile: ArrayBuffer | null;
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                entries: {
                    entryId: number;
                    entryType: AsepriteExternalFileEntryType;
                    extensionId: string;
                }[];
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                tags: {
                    fromFrame: number;
                    toFrame: number;
                    direction: number;
                    nTimes: number;
                    tagName: string;
                }[];
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                paletteSize: number;
                firstColor: number;
                lastColor: number;
                colors: {
                    name: string;
                    value: number;
                }[];
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                text: string | null;
                color: number | null;
                props: {
                    mapSize: number;
                    maps: {
                        mapKey: number;
                        values: Record<string, any>;
                    }[];
                } | null;
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                name: string;
                keys: {
                    frameNumber: number;
                    originX: number;
                    originY: number;
                    sliceWidth: number;
                    sliceHeight: number;
                    ninePatch: {
                        centerX: number;
                        centerY: number;
                        centerWidth: number;
                        centerHeight: number;
                    } | null;
                    pivot: {
                        pivotX: number;
                        pivotY: number;
                    } | null;
                }[];
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            } | {
                tilesetId: number;
                numTiles: number;
                tileWidth: number;
                tileHeight: number;
                baseIndex: number;
                name: string;
                externalTileset: {
                    entryId: number;
                    externalTilesetId: number;
                } | null;
                includedTileset: {
                    compressedPixels: ArrayBuffer;
                } | null;
                chunkHeader: {
                    chunkType: AsepriteChunkType;
                    chunkSize: number;
                };
            })[];
        }[];
    };
    frames: any[];
    layers: any[];
    slices: any[];
    tags: any[];
    tilesets: any[];
    /** @readonly */
    readonly width: number;
    /** @readonly */
    readonly height: number;
    /** @readonly */
    readonly colorDepth: number;
    /** @readonly */
    readonly pixelRatio: string;
    /** @readonly */
    readonly pixelFormat: 2 | 1 | 3;
}

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteStringBytes(data: ByteReader, textDecoder: TextDecoder): string;
/**
 * @param {ByteReader} data
 */
declare function readAsepriteRGBAPixelBytes(data: ByteReader): number;
/**
 * @param {ByteReader} data
 */
declare function readAsepriteGrayscalePixelBytes(data: ByteReader): number;
/**
 * @param {ByteReader} data
 */
declare function readAsepriteIndexedPixelBytes(data: ByteReader): number;

/**
 * @param {ByteReader} data
 */
declare function readAsepriteChunkCelExtra(data: ByteReader): {
    flags: number;
    posX: number;
    posY: number;
    celWidth: number;
    celHeight: number;
};

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkPalette(data: ByteReader, textDecoder: TextDecoder): {
    /** Number of color entries. */
    paletteSize: number;
    /** Index of the first color to change. */
    firstColor: number;
    /** Index of the last color to change. */
    lastColor: number;
    colors: {
        name: string;
        value: number;
    }[];
};
type AsepritePaletteColor = ReturnType<typeof createAsepritePaletteColor>;

/** @typedef {ReturnType<createAsepritePaletteColor>} AsepritePaletteColor */
/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 * @param {string} [name]
 */
declare function createAsepritePaletteColor(red: number, green: number, blue: number, alpha: number, name?: string): {
    name: string;
    value: number;
};

/**
 * @param {import('./AsepriteChunkTypes').AsepriteChunkType} chunkType
 * @param {ArrayBuffer} chunkData
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
declare function parseAsepriteChunk(chunkType: AsepriteChunkType, chunkData: ArrayBuffer, pixelFormat: AsepritePixelFormat): {
    flags: number;
    posX: number;
    posY: number;
    celWidth: number;
    celHeight: number;
} | {
    flags: number;
    layerType: number;
    childLevel: number;
    blendMode: AsepriteBlendMode;
    opacity: number;
    layerName: string;
    tilesetIndex: number;
} | {
    layerIndex: number;
    posX: number;
    posY: number;
    opacityLevel: number;
    celType: AsepriteCelType;
    zIndex: number;
    celData: {
        width: number;
        height: number;
        length: number;
        pixelFormat: AsepritePixelFormat;
        pixelData: ArrayBuffer;
    } | {
        linkedFrame: number;
    } | {
        width: number;
        height: number;
        compressedPixels: ArrayBuffer;
    } | {
        width: number;
        height: number;
        bitsPerTile: number;
        bitmaskForTileId: number;
        bitmaskForFlipX: number;
        bitmaskForFlipY: number;
        bitmaskForDiagonalFlip: number;
        compressedTiles: ArrayBuffer;
    };
} | {
    profileType: AsepriteColorProfile;
    flags: number;
    fixedGamma: number;
    iccProfile: ArrayBuffer | null;
} | {
    entries: {
        entryId: number;
        entryType: AsepriteExternalFileEntryType;
        extensionId: string;
    }[];
} | {
    tags: {
        fromFrame: number;
        toFrame: number;
        direction: number;
        nTimes: number;
        tagName: string;
    }[];
} | {
    paletteSize: number;
    firstColor: number;
    lastColor: number;
    colors: {
        name: string;
        value: number;
    }[];
} | {
    text: string | null;
    color: number | null;
    props: {
        mapSize: number;
        maps: {
            mapKey: number;
            values: Record<string, any>;
        }[];
    } | null;
} | {
    name: string;
    keys: {
        frameNumber: number;
        originX: number;
        originY: number;
        sliceWidth: number;
        sliceHeight: number;
        ninePatch: {
            centerX: number;
            centerY: number;
            centerWidth: number;
            centerHeight: number;
        } | null;
        pivot: {
            pivotX: number;
            pivotY: number;
        } | null;
    }[];
} | {
    tilesetId: number;
    numTiles: number;
    tileWidth: number;
    tileHeight: number;
    baseIndex: number;
    name: string;
    externalTileset: {
        entryId: number;
        externalTilesetId: number;
    } | null;
    includedTileset: {
        compressedPixels: ArrayBuffer;
    } | null;
} | null;

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkSlice(data: ByteReader, textDecoder: TextDecoder): {
    name: string;
    keys: {
        frameNumber: number;
        originX: number;
        originY: number;
        sliceWidth: number;
        sliceHeight: number;
        ninePatch: {
            centerX: number;
            centerY: number;
            centerWidth: number;
            centerHeight: number;
        } | null;
        pivot: {
            pivotX: number;
            pivotY: number;
        } | null;
    }[];
};
type AsepriteSliceKey = ReturnType<typeof createAsepriteSliceKey>;

/** @typedef {ReturnType<createAsepriteSliceKey>} AsepriteSliceKey */
/**
 * @param {number} frameNumber
 * @param {number} originX
 * @param {number} originY
 * @param {number} sliceWidth
 * @param {number} sliceHeight
 * @param {{ centerX: number, centerY: number, centerWidth: number, centerHeight: number }|null} [ninePatch]
 * @param {{ pivotX: number, pivotY: number }|null} [pivot]
 */
declare function createAsepriteSliceKey(frameNumber: number, originX: number, originY: number, sliceWidth: number, sliceHeight: number, ninePatch?: {
    centerX: number;
    centerY: number;
    centerWidth: number;
    centerHeight: number;
} | null, pivot?: {
    pivotX: number;
    pivotY: number;
} | null): {
    frameNumber: number;
    originX: number;
    originY: number;
    sliceWidth: number;
    sliceHeight: number;
    ninePatch: {
        centerX: number;
        centerY: number;
        centerWidth: number;
        centerHeight: number;
    } | null;
    pivot: {
        pivotX: number;
        pivotY: number;
    } | null;
};

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkTags(data: ByteReader, textDecoder: TextDecoder): {
    tags: {
        fromFrame: number;
        toFrame: number;
        direction: number;
        nTimes: number;
        tagName: string;
    }[];
};
declare namespace AsepriteAnimationDirections {
    let FORWARD: 0;
    let REVERSE: 1;
    let PING_PONG: 2;
    let PING_PONG_REVERSE: 3;
}
type AsepriteTag = ReturnType<typeof createAsepriteTag>;
type AsepriteAnimationDirection = 0 | 2 | 1 | 3;

/** @typedef {ReturnType<createAsepriteTag>} AsepriteTag */
/**
 * @param {number} fromFrame
 * @param {number} toFrame
 * @param {number} direction
 * @param {number} nTimes
 * @param {string} tagName
 */
declare function createAsepriteTag(fromFrame: number, toFrame: number, direction: number, nTimes: number, tagName: string): {
    fromFrame: number;
    toFrame: number;
    direction: number;
    nTimes: number;
    tagName: string;
};

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkTileset(data: ByteReader, textDecoder: TextDecoder): {
    tilesetId: number;
    numTiles: number;
    tileWidth: number;
    tileHeight: number;
    baseIndex: number;
    name: string;
    externalTileset: {
        entryId: number;
        externalTilesetId: number;
    } | null;
    includedTileset: {
        compressedPixels: ArrayBuffer;
    } | null;
};

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
declare function readAsepriteChunkUserData(data: ByteReader, textDecoder: TextDecoder): {
    text: string | null;
    color: number | null;
    props: {
        mapSize: number;
        maps: {
            mapKey: number;
            values: Record<string, any>;
        }[];
    } | null;
};
type AsepriteValueType = 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

export { Aseprite, AsepriteAnimationDirections, AsepriteBlendModes, AsepriteCelTypes, AsepriteChunkTypes, AsepriteColorProfiles, AsepriteExternalFileEntryTypes, AsepriteLayerFlags, AsepritePixelFormats, ByteReader, countPixelFormatBytesPerPixel, getPixelFormatFromColorDepth, parseAsepriteChunk, readAsepriteChunkBytes, readAsepriteChunkCel, readAsepriteChunkCelExtra, readAsepriteChunkColorProfile, readAsepriteChunkExternalFiles, readAsepriteChunkLayer, readAsepriteChunkPalette, readAsepriteChunkSlice, readAsepriteChunkTags, readAsepriteChunkTileset, readAsepriteChunkUserData, readAsepriteFileBytes, readAsepriteFrameHeaderBytes, readAsepriteGrayscalePixelBytes, readAsepriteHeaderBytes, readAsepriteIndexedPixelBytes, readAsepriteRGBAPixelBytes, readAsepriteStringBytes };
export type { AsepriteAnimationDirection, AsepriteBlendMode, AsepriteCelType, AsepriteChunk, AsepriteChunkCel, AsepriteChunkType, AsepriteColorProfile, AsepriteCompressedImage, AsepriteCompressedTilemap, AsepriteExternalFileEntry, AsepriteExternalFileEntryType, AsepriteFile, AsepriteLinkedCel, AsepritePaletteColor, AsepritePixelFormat, AsepriteRawImageData, AsepriteSliceKey, AsepriteTag, AsepriteValueType };
