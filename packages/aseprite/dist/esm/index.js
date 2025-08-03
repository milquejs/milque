class ByteReader {

  /**
   * @param {ArrayBuffer} arrayBuffer
   * @param {number} [byteOffset]
   * @param {number} [byteLength]
   * @param {boolean} [littleEndian]
   */
  constructor(arrayBuffer, byteOffset = 0, byteLength = arrayBuffer.byteLength, littleEndian = true) {
    /** @readonly */
    this.buffer = arrayBuffer;
    /** @readonly */
    this.view = new DataView(arrayBuffer, byteOffset, byteLength);
    /** @readonly */
    this.littleEndian = littleEndian;

    /** @protected */
    this.offset = 0;
  }

  /**
   * @param {number} numBytes 
   */
  skipBytes(numBytes) {
    this.offset += numBytes;
  }

  /**
   * The next 8-bit unsigned value.
   */
  nextByte() {
    let result = this.view.getUint8(this.offset);
    this.offset += 1;
    return result;
  }

  /**
   * The next 16-bit unsigned value.
   */
  nextWord() {
    let result = this.view.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return result;
  }

  /**
   * The next 16-bit signed value.
   */
  nextShort() {
    let result = this.view.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return result;
  }

  /**
   * The next 32-bit unsigned value.
   */
  nextDoubleWord() {
    let result = this.view.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return result;
  }

  /**
   * The next 32-bit signed value.
   */
  nextLong() {
    let result = this.view.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return result;
  }

  /**
   * The next 64-bit signed value.
   */
  nextDoubleLong() {
    let result = this.view.getBigInt64(this.offset, this.littleEndian);
    this.offset += 8;
    return result;
  }

  /**
   * The next 64-bit unsigned value.
   */
  nextQuadWord() {
    let result = this.view.getBigUint64(this.offset, this.littleEndian);
    this.offset += 8;
    return result;
  }

  /**
   * The next 32-bit fixed-point 16.16 value.
   */
  nextFixed() {
    // TODO: Today, this is the same as getting a float32.
    const fixed = this.view.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return fixed;
  }

  /**
   * The next 32-bit single-precision value.
   */
  nextFloat() {
    const result = this.view.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return result;
  }

  /**
   * The next 64-bit double-precision value.
   */
  nextDouble() {
    const result = this.view.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return result;
  }

  /**
   * A slice of the next N-bytes.
   * 
   * @param {number} numBytes 
   */
  nextBytes(numBytes) {
    let result = this.buffer.slice(this.offset, this.offset + numBytes);
    this.offset += numBytes;
    return result;
  }

  /**
   * A slice of all remaining bytes in view.
   */
  remainingBytes() {
    let numBytes = this.view.byteLength - this.offset;
    return this.nextBytes(numBytes);
  }
}

/**
 * @typedef {ReturnType<create>} RGBA
 */

function create$1() {
  return 0x0;
}

/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} [alpha]
 */
function fromBytes$1(red, green, blue, alpha = 0xff) {
  return (
    ((alpha & 0xff) << 24) | ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff)
  );
}

/**
 * @param {number} redf
 * @param {number} greenf
 * @param {number} bluef
 * @param {number} alphaf
 */
function fromFloats$1(redf, greenf, bluef, alphaf = 1.0) {
  let r = Math.floor(Math.max(Math.min(redf, 1), 0) * 255);
  let g = Math.floor(Math.max(Math.min(greenf, 1), 0) * 255);
  let b = Math.floor(Math.max(Math.min(bluef, 1), 0) * 255);
  let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
  return fromBytes$1(r, g, b, a);
}

/**
 * @param {RGBA} hexValue
 */
function red(hexValue) {
  return (hexValue >> 16) & 0xff;
}

/**
 * @param {RGBA} hexValue
 */
function redf(hexValue) {
  return ((hexValue >> 16) & 0xff) / 255.0;
}

/**
 * @param {RGBA} hexValue
 */
function green(hexValue) {
  return (hexValue >> 8) & 0xff;
}

/**
 * @param {RGBA} hexValue
 */
function greenf(hexValue) {
  return ((hexValue >> 8) & 0xff) / 255.0;
}

/**
 * @param {RGBA} hexValue
 */
function blue(hexValue) {
  return hexValue & 0xff;
}

/**
 * @param {RGBA} hexValue
 */
function bluef(hexValue) {
  return (hexValue & 0xff) / 255.0;
}

/**
 * @param {RGBA} hexValue
 */
function alpha$1(hexValue) {
  let result = (hexValue >> 24) & 0xff;
  if (result === 0x00) {
    return 0xff;
  }
  return result;
}

/**
 * @param {RGBA} hexValue
 */
function alphaf$1(hexValue) {
  return alpha$1(hexValue) / 255.0;
}

const OPACITY_EPSILON$1 = 0.01;

/**
 * @param {RGBA} from
 * @param {RGBA} to
 * @param {number} delta
 */
function mix$1(from = 0x000000, to = 0xffffff, delta = 0.5) {
  const rm = redf(from);
  const gm = greenf(from);
  const bm = bluef(from);
  const am = alphaf$1(from);
  const rf = (redf(to) - rm) * delta + rm;
  const gf = (greenf(to) - gm) * delta + gm;
  const bf = (bluef(to) - bm) * delta + bm;
  /** @type {number|undefined} */
  let af = (alphaf$1(to) - am) * delta + am;
  if (af < OPACITY_EPSILON$1) {
    af = undefined;
  }
  return fromFloats$1(rf, gf, bf, af);
}

/**
 * @param {RGBA} hexValue
 */
function toCSSColorString$1(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  let r = red(hexValue).toString(16).padStart(2, '0');
  let g = green(hexValue).toString(16).padStart(2, '0');
  let b = blue(hexValue).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * @param {RGBA} hexValue
 */
function toFloatVector$1(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  return [redf(hexValue), greenf(hexValue), bluef(hexValue), alphaf$1(hexValue)];
}

var rgba = /*#__PURE__*/Object.freeze({
  __proto__: null,
  alpha: alpha$1,
  alphaf: alphaf$1,
  blue: blue,
  bluef: bluef,
  create: create$1,
  fromBytes: fromBytes$1,
  fromFloats: fromFloats$1,
  green: green,
  greenf: greenf,
  mix: mix$1,
  red: red,
  redf: redf,
  toCSSColorString: toCSSColorString$1,
  toFloatVector: toFloatVector$1
});

/**
 * @typedef {ReturnType<create>} Grayscale
 */

function create() {
  return 0x0;
}

/**
 * @param {number} gray
 * @param {number} alpha
 */
function fromBytes(gray, alpha = 0xff) {
  return (
    ((alpha & 0xff) << 8) | (gray & 0xff)
  );
}

/**
 * @param {number} grayf
 * @param {number} alphaf
 */
function fromFloats(grayf, alphaf = 1.0) {
  let g = Math.floor(Math.max(Math.min(grayf, 1), 0) * 255);
  let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
  return fromBytes(g, a);
}

/**
 * @param {Grayscale} hexValue
 */
function gray(hexValue) {
  return hexValue & 0xff;
}

/**
 * @param {Grayscale} hexValue
 */
function grayf(hexValue) {
  return (hexValue & 0xff) / 255.0;
}

/**
 * @param {Grayscale} hexValue
 */
function alpha(hexValue) {
  let result = (hexValue >> 8) & 0xff;
  if (result === 0x00) {
    return 0xff;
  }
  return result;
}

/**
 * @param {Grayscale} hexValue
 */
function alphaf(hexValue) {
  return alpha(hexValue) / 255.0;
}

const OPACITY_EPSILON = 0.01;

/**
 * @param {Grayscale} from
 * @param {Grayscale} to
 * @param {number} delta
 */
function mix(from = 0x0000, to = 0xffff, delta = 0.5) {
  const gm = grayf(from);
  const am = alphaf(from);
  const gf = (grayf(to) - gm) * delta + gm;
  /** @type {number|undefined} */
  let af = (alphaf(to) - am) * delta + am;
  if (af < OPACITY_EPSILON) {
    af = undefined;
  }
  return fromFloats(gf, af);
}

/**
 * @param {Grayscale} hexValue
 */
function toCSSColorString(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  let g = gray(hexValue).toString(16).padStart(2, '0');
  return `#${g}${g}${g}`;
}

/**
 * @param {Grayscale} hexValue
 */
function toFloatVector(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  return [grayf(hexValue), alphaf(hexValue)];
}

var grayscale = /*#__PURE__*/Object.freeze({
  __proto__: null,
  alpha: alpha,
  alphaf: alphaf,
  create: create,
  fromBytes: fromBytes,
  fromFloats: fromFloats,
  gray: gray,
  grayf: grayf,
  mix: mix,
  toCSSColorString: toCSSColorString,
  toFloatVector: toFloatVector
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder 
 */
function readAsepriteStringBytes(data, textDecoder) {
  const numBytes = data.nextWord();
  const stringBuffer = data.nextBytes(numBytes);
  return textDecoder.decode(stringBuffer);
}

/**
 * @param {ByteReader} data
 */
function readAsepriteRGBAPixelBytes(data) {
  const red = data.nextByte();
  const green = data.nextByte();
  const blue = data.nextByte();
  const alpha = data.nextByte();
  return rgba.fromBytes(red, green, blue, alpha);
}

/**
 * @param {ByteReader} data
 */
function readAsepriteGrayscalePixelBytes(data) {
  const gray = data.nextByte();
  const alpha = data.nextByte();
  return grayscale.fromBytes(gray, alpha);
}

/**
 * @param {ByteReader} data
 */
function readAsepriteIndexedPixelBytes(data) {
  const index = data.nextByte();
  return index;
}

/**
 * @param {ByteReader} data 
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkPalette(data, textDecoder) {
  /** @type {Array<AsepritePaletteColor>} */
  let colors = [];
  const paletteSize = data.nextDoubleWord();
  const firstColor = data.nextDoubleWord();
  const lastColor = data.nextDoubleWord();
  data.skipBytes(8); // Zeroes (for future)
  for(let i = 0; i < paletteSize; ++i) {
    const flags = data.nextWord();
    const red = data.nextByte();
    const green = data.nextByte();
    const blue = data.nextByte();
    const alpha = data.nextByte();
    let name;
    if (flags === 1) {
      name = readAsepriteStringBytes(data, textDecoder);
    }
    let color = createAsepritePaletteColor(red, green, blue, alpha, name);
    colors.push(color);
  }
  return {
    /** Number of color entries. */
    paletteSize,
    /** Index of the first color to change. */
    firstColor,
    /** Index of the last color to change. */
    lastColor,
    colors,
  };
}

/** @typedef {ReturnType<createAsepritePaletteColor>} AsepritePaletteColor */

/**
 * @param {number} red
 * @param {number} green 
 * @param {number} blue
 * @param {number} alpha
 * @param {string} [name]
 */
function createAsepritePaletteColor(red, green, blue, alpha, name = 'none') {
  return {
    name,
    value: rgba.fromBytes(red, green, blue, alpha),
  };
}

/** @typedef {AsepriteBlendModes[keyof AsepriteBlendModes]} AsepriteBlendMode */

const AsepriteBlendModes = /** @type {const} */ ({
  NORMAL: 0,
  MULTIPLY: 1,
  SCREEN: 2,
  OVERLAY: 3,
  DARKEN: 4,
  LIGHTEN: 5,
  COLOR_DODGE: 6,
  COLOR_BURN: 7,
  HARD_LIGHT: 8,
  SOFT_LIGHT: 9,
  DIFFERENCE: 10,
  EXCLUSION: 11,
  HUE: 12,
  SATURATION: 13,
  COLOR: 14,
  LUMINOSITY: 15,
  ADDITION: 16,
  SUBTRACT: 17,
  DIVIDE: 18
});

const AsepriteLayerFlags = /** @type {const} */ ({
  VISIBLE: 1,
  EDITABLE: 2,
  LOCK_MOVEMENT: 4,
  BACKGROUND: 8,
  PREFER_LINKED_CELS: 16,
  COLLAPSED_LAYER_GROUP: 32,
  IS_REFERENCE_LAYER: 64
});

/**
 * @param {ByteReader} data 
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkLayer(data, textDecoder) {
  const flags = data.nextWord();
  const layerType = data.nextWord();
  const childLevel = data.nextWord();
  data.nextWord(); // Ignored (default layer width in pixels)
  data.nextWord(); // Ignored (default layer height in pixels)
  const blendMode = /** @type {AsepriteBlendMode} */ (data.nextWord());
  const opacity = data.nextByte();
  data.skipBytes(3); // Zeroes (for future)
  const layerName = readAsepriteStringBytes(data, textDecoder);
  let tilesetIndex = 0;
  if (layerType === 2) {
    tilesetIndex = data.nextDoubleWord();
  }
  return {
    flags,
    layerType,
    childLevel,
    blendMode,
    opacity,
    layerName,
    tilesetIndex,
  };
}

/** @typedef {AsepritePixelFormats[keyof AsepritePixelFormats]} AsepritePixelFormat */

const AsepritePixelFormats = /** @type {const} */ ({
  RGBA: 1,
  GRAYSCALE: 2,
  INDEXED: 3,
});

/**
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
function countPixelFormatBytesPerPixel(pixelFormat) {
  switch(pixelFormat) {
    case AsepritePixelFormats.RGBA:
      return 4;
    case AsepritePixelFormats.GRAYSCALE:
      return 2;
    case AsepritePixelFormats.INDEXED:
      return 1;
    default:
      throw new Error(`Unsupported image pixel format "${pixelFormat}".`);
  }
}

/**
 * @param {number} colorDepth
 */
function getPixelFormatFromColorDepth(colorDepth) {
  if (colorDepth === 32) return AsepritePixelFormats.RGBA;
  if (colorDepth === 16) return AsepritePixelFormats.GRAYSCALE;
  if (colorDepth === 8) return AsepritePixelFormats.INDEXED;
  throw new Error(`Unsupported color depth "${colorDepth}" for image pixel format.`);
}

/** @typedef {AsepriteCelTypes[keyof AsepriteCelTypes]} AsepriteCelType */

const AsepriteCelTypes = /** @type {const} */ ({
  RAW_IMAGE_DATA: 0,
  LINKED_CEL: 1,
  COMPRESSED_IMAGE: 2,
  COMPRESSED_TILEMAP: 3
});

/** @typedef {ReturnType<readAsepriteChunkCel>} AsepriteChunkCel */

/**
 * @param {ByteReader} data 
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
function readAsepriteChunkCel(data, pixelFormat) {
  const layerIndex = data.nextWord();
  const posX = data.nextShort();
  const posY = data.nextShort();
  const opacityLevel = data.nextByte();
  const celType = /** @type {AsepriteCelType} */ (data.nextWord());
  const zIndex = data.nextShort();
  data.skipBytes(5); // Zeroes (for future)
  /** @type {AsepriteRawImageData|AsepriteLinkedCel|AsepriteCompressedImage|AsepriteCompressedTilemap} */
  let celData;
  switch(celType) {
    case AsepriteCelTypes.RAW_IMAGE_DATA:
      celData = readAsepriteChunkCelRawImageData(data, pixelFormat);
      break;
    case AsepriteCelTypes.LINKED_CEL:
      celData = readAsepriteChunkCelLinkedCel(data);
      break;
    case AsepriteCelTypes.COMPRESSED_IMAGE:
      celData = readAsepriteChunkCelCompressedImage(data);
      break;
    case AsepriteCelTypes.COMPRESSED_TILEMAP:
      celData = readAsepriteChunkCelCompressedTilemap(data);
      break;
    default:
      throw new Error(`Unsupported cel type "${celType}".`);
  }
  return {
    layerIndex,
    posX,
    posY,
    opacityLevel,
    celType,
    zIndex,
    celData,
  };
}

/** @typedef {ReturnType<readAsepriteChunkCelRawImageData>} AsepriteRawImageData */

/**
 * @param {ByteReader} data 
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat 
 */
function readAsepriteChunkCelRawImageData(data, pixelFormat) {
  const width = data.nextWord();
  const height = data.nextWord();
  const length = width * height;
  const bytesPerPixel = countPixelFormatBytesPerPixel(pixelFormat);
  const numBytes = bytesPerPixel * length;
  const pixelData = data.nextBytes(numBytes);
  return {
    width,
    height,
    length,
    pixelFormat,
    pixelData,
  };
}

/** @typedef {ReturnType<readAsepriteChunkCelLinkedCel>} AsepriteLinkedCel */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelLinkedCel(data) {
  const linkedFrame = data.nextWord();
  return {
    linkedFrame
  };
}

/** @typedef {Awaited<ReturnType<readAsepriteChunkCelCompressedImage>>} AsepriteCompressedImage */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelCompressedImage(data) {
  const width = data.nextWord();
  const height = data.nextWord();
  const compressedPixels = data.remainingBytes(); // zlib compressed.
  return {
    width,
    height,
    compressedPixels,
  };
}

/** @typedef {ReturnType<readAsepriteChunkCelCompressedTilemap>} AsepriteCompressedTilemap */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelCompressedTilemap(data) {
  const width = data.nextWord();
  const height = data.nextWord();
  const bitsPerTile = data.nextWord(); // Always 32-bits, at the moment.
  const bitmaskForTileId = data.nextDoubleWord();
  const bitmaskForFlipX = data.nextDoubleWord();
  const bitmaskForFlipY = data.nextDoubleWord();
  const bitmaskForDiagonalFlip = data.nextDoubleWord();
  data.skipBytes(10); // Reserved bytes.
  const compressedTiles = data.remainingBytes(); // zlib compressed.
  return {
    width,
    height,
    bitsPerTile,
    bitmaskForTileId,
    bitmaskForFlipX,
    bitmaskForFlipY,
    bitmaskForDiagonalFlip,
    compressedTiles,
  };
}

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkCelExtra(data) {
  const flags = data.nextDoubleWord();
  const posX = data.nextFixed(); // precision float
  const posY = data.nextFixed(); // precision float
  const celWidth = data.nextFixed();
  const celHeight = data.nextFixed();
  data.skipBytes(16); // Zeroes (for future)
  return {
    flags,
    posX,
    posY,
    celWidth,
    celHeight,
  };
}

/** @typedef {AsepriteColorProfiles[keyof AsepriteColorProfiles]} AsepriteColorProfile */

const AsepriteColorProfiles = /** @type {const} */ ({
  NONE: 0,
  SRGB: 1,
  ICC: 2,
});

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkColorProfile(data) {
  const profileType = /** @type {AsepriteColorProfile} */ (data.nextWord());
  const flags = data.nextWord();
  const fixedGamma = data.nextFixed();
  data.skipBytes(8); // Zeroes (reserved)
  let iccProfile = null;
  if (profileType === AsepriteColorProfiles.ICC) {
    const iccProfileLength = data.nextDoubleWord();
    iccProfile = data.nextBytes(iccProfileLength); // http://www.color.org/ICC1V42.pdf
  }
  return {
    profileType,
    flags,
    fixedGamma,
    iccProfile,
  };
}

/** @typedef {AsepriteExternalFileEntryTypes[keyof AsepriteExternalFileEntryTypes]} AsepriteExternalFileEntryType */

const AsepriteExternalFileEntryTypes = /** @type {const} */ ({
  EXTERNAL_PALETTE: 0,
  EXTERNAL_TILESET: 1,
  PROPERTIES_EXTENSION_NAME: 2,
  TILE_MANAGER_EXTENSION_NAME: 3,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkExternalFiles(data, textDecoder) {
  /** @type {Array<AsepriteExternalFileEntry>} */
  let entries = [];
  const numEntries = data.nextDoubleWord();
  data.skipBytes(8); // Zeroes (reserved)
  for(let i = 0; i < numEntries; ++i) {
    const entryId = data.nextDoubleWord();
    const entryType = /** @type {AsepriteExternalFileEntryType} */ (data.nextByte());
    data.skipBytes(7); // Zeroes (reserved)
    const extensionId = readAsepriteStringBytes(data, textDecoder);
    entries.push(createAsepriteExternalFileEntry(entryId, entryType, extensionId));
  }
  return {
    entries
  };
}

/** @typedef {ReturnType<createAsepriteExternalFileEntry>} AsepriteExternalFileEntry */

/**
 * @param {number} entryId 
 * @param {AsepriteExternalFileEntryType} entryType 
 * @param {string} extensionId
 */
function createAsepriteExternalFileEntry(entryId, entryType, extensionId) {
  return {
    entryId,
    entryType,
    extensionId,
  };
}

/** @typedef {AsepriteAnimationDirections[keyof AsepriteAnimationDirections]} AsepriteAnimationDirection */

const AsepriteAnimationDirections = /** @type {const} */ ({
  FORWARD: 0,
  REVERSE: 1,
  PING_PONG: 2,
  PING_PONG_REVERSE: 3,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkTags(data, textDecoder) {
  /** @type {Array<AsepriteTag>} */
  let tags = [];
  const numTags = data.nextWord();
  data.skipBytes(8); // Zeroes (for future)
  for(let i = 0; i < numTags; ++i) {
    const fromFrame = data.nextWord();
    const toFrame = data.nextWord();
    const direction = /** @type {AsepriteAnimationDirection} */ (data.nextByte());
    const nTimes = data.nextWord();
    data.skipBytes(6); // Zeroes (for future)
    data.skipBytes(3); // Deprecated tag color
    data.skipBytes(1); // Zeroes (extra)
    const tagName = readAsepriteStringBytes(data, textDecoder);
    tags.push(createAsepriteTag(fromFrame, toFrame, direction, nTimes, tagName));
  }
  return {
    tags,
  };
}

/** @typedef {ReturnType<createAsepriteTag>} AsepriteTag */

/**
 * @param {number} fromFrame 
 * @param {number} toFrame 
 * @param {number} direction 
 * @param {number} nTimes 
 * @param {string} tagName
 */
function createAsepriteTag(fromFrame, toFrame, direction, nTimes, tagName) {
  return {
    fromFrame,
    toFrame,
    direction,
    nTimes,
    tagName,
  };
}

const AsepriteUserDataFlags = /** @type {const} */ ({
  HAS_TEXT: 1,
  HAS_COLOR: 2,
  HAS_PROPERTIES: 4,
});

/** @typedef {AsepriteValueTypes[keyof AsepriteValueTypes]} AsepriteValueType */

const AsepriteValueTypes = /** @type {const} */ ({
  BOOL: 0x0001,
  INT8: 0x0002,
  UINT8: 0x0003,
  INT16: 0x0004,
  UINT16: 0x0005,
  INT32: 0x0006,
  UINT32: 0x0007,
  INT64: 0x0008,
  UINT64: 0x0009,
  FIXED: 0x000A,
  FLOAT: 0x000B,
  DOUBLE: 0x000C,
  STRING: 0x000D,
  POINT: 0x000E,
  SIZE: 0x000F,
  RECT: 0x0010,
  VECTOR: 0x0011,
  NESTED: 0x0012,
  UUID: 0x0013,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkUserData(data, textDecoder) {
  const flags = data.nextDoubleWord();
  let text = null;
  if (flags & AsepriteUserDataFlags.HAS_TEXT) {
    text = readAsepriteStringBytes(data, textDecoder);
  }
  let color = null;
  if (flags & AsepriteUserDataFlags.HAS_COLOR) {
    const red = data.nextByte();
    const green = data.nextByte();
    const blue = data.nextByte();
    const alpha = data.nextByte();
    color = rgba.fromBytes(red, green, blue, alpha);
  }
  let props = null;
  if (flags & AsepriteUserDataFlags.HAS_PROPERTIES) {
    let maps = [];
    const mapSize = data.nextDoubleWord(); // Bytes in properties map.
    const numMaps = data.nextDoubleWord();
    for(let i = 0; i < numMaps; ++i) {
      const mapKey = data.nextDoubleWord();
      const numProps = data.nextDoubleWord();
      /** @type {Record<string, any>} */
      let values = {};
      for(let j = 0; j < numProps; ++j) {
        const name = readAsepriteStringBytes(data, textDecoder);
        const type = /** @type {AsepriteValueType} */ (data.nextWord());
        const value = readAsepriteValue(data, type, textDecoder);
        values[name] = value;
      }
      maps.push({
        mapKey,
        values,
      });
    }
    props = {
      mapSize,
      maps,
    };
  }
  return {
    text,
    color,
    props,
  };
}

/**
 * @param {ByteReader} data
 * @param {AsepriteValueType} type 
 * @param {TextDecoder} textDecoder
 */
function readAsepriteValue(data, type, textDecoder) {
  switch (type) {
    case AsepriteValueTypes.BOOL:
      return data.nextByte() === 0 ? false : true;
    case AsepriteValueTypes.INT8:
      return data.nextByte();
    case AsepriteValueTypes.UINT8:
      return data.nextByte();
    case AsepriteValueTypes.INT16:
      return data.nextShort();
    case AsepriteValueTypes.UINT16:
      return data.nextWord();
    case AsepriteValueTypes.INT32:
      return data.nextLong();
    case AsepriteValueTypes.UINT32:
      return data.nextDoubleWord();
    case AsepriteValueTypes.INT64:
      return data.nextDoubleLong();
    case AsepriteValueTypes.UINT64:
      return data.nextQuadWord();
    case AsepriteValueTypes.FIXED:
      return data.nextFixed();
    case AsepriteValueTypes.FLOAT:
      return data.nextFloat();
    case AsepriteValueTypes.DOUBLE:
      return data.nextDouble();
    case AsepriteValueTypes.STRING:
      return readAsepriteStringBytes(data, textDecoder);
    case AsepriteValueTypes.POINT: {
      const coordX = data.nextLong();
      const coordY = data.nextLong();
      return { coordX, coordY };
    }
    case AsepriteValueTypes.SIZE: {
      const width = data.nextLong();
      const height = data.nextLong();
      return { width, height };
    }
    case AsepriteValueTypes.RECT: {
      const originX = data.nextLong();
      const originY = data.nextLong();
      const width = data.nextLong();
      const height = data.nextLong();
      return {
        originX,
        originY,
        width,
        height,
      };
    }
    case AsepriteValueTypes.UUID: {
      const buf = data.nextBytes(16);
      return textDecoder.decode(buf);
    }
    case AsepriteValueTypes.VECTOR:
    case AsepriteValueTypes.NESTED:
    default:
      throw new Error(`Unsupported value type "${type}" for user data property.`);
  }
}

const AsepriteSliceFlags = /** @type {const} */ ({
  HAS_9_PATCHES: 1,
  HAS_PIVOT_INFO: 2,
});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkSlice(data, textDecoder) {
  const numKeys = data.nextDoubleWord();
  const flags = data.nextDoubleWord();
  data.nextDoubleWord(); // Reserved.
  const name = readAsepriteStringBytes(data, textDecoder);
  let keys = [];
  for(let i = 0; i < numKeys; ++i) {
    const frameNumber = data.nextDoubleWord();
    const originX = data.nextLong();
    const originY = data.nextLong();
    const sliceWidth = data.nextDoubleWord();
    const sliceHeight= data.nextDoubleWord();
    let ninePatch = null;
    if (flags & AsepriteSliceFlags.HAS_9_PATCHES) {
      const centerX = data.nextLong();
      const centerY = data.nextLong();
      const centerWidth = data.nextDoubleWord();
      const centerHeight = data.nextDoubleWord();
      ninePatch = {
        centerX,
        centerY,
        centerWidth,
        centerHeight,
      };
    }
    let pivot = null;
    if (flags & AsepriteSliceFlags.HAS_PIVOT_INFO) {
      const pivotX = data.nextLong();
      const pivotY = data.nextLong();
      pivot = {
        pivotX,
        pivotY,
      };
    }
    keys.push(createAsepriteSliceKey(frameNumber, originX, originY, sliceWidth, sliceHeight, ninePatch, pivot));
  }
  return {
    name,
    keys,
  };
}

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
function createAsepriteSliceKey(frameNumber, originX, originY, sliceWidth, sliceHeight, ninePatch = null, pivot = null) {
  return {
    frameNumber,
    originX,
    originY,
    sliceWidth,
    sliceHeight,
    ninePatch,
    pivot,
  };
}

const AsepriteTilesetFlags = /** @type {const} */ ({
  EXTERNAL_TILESET: 1,
  INCLUDED_TILESET: 2});

/**
 * @param {ByteReader} data
 * @param {TextDecoder} textDecoder
 */
function readAsepriteChunkTileset(data, textDecoder) {
  const tilesetId = data.nextDoubleWord();
  const flags = data.nextDoubleWord();
  const numTiles = data.nextDoubleWord();
  const tileWidth = data.nextWord();
  const tileHeight = data.nextWord();
  const baseIndex = data.nextShort();
  data.skipBytes(14); // Zeroes (for future)
  const name = readAsepriteStringBytes(data, textDecoder);
  let externalTileset = null;
  if (flags & AsepriteTilesetFlags.EXTERNAL_TILESET) {
    const entryId = data.nextDoubleWord();
    const externalTilesetId = data.nextDoubleWord();
    externalTileset = {
      entryId,
      externalTilesetId,
    };
  }
  let includedTileset = null;
  if (flags & AsepriteTilesetFlags.INCLUDED_TILESET) {
    const imageSize = data.nextDoubleWord();
    const compressedPixels = data.nextBytes(imageSize);
    includedTileset = {
      compressedPixels
    };
  }
  return {
    tilesetId,
    numTiles,
    tileWidth,
    tileHeight,
    baseIndex,
    name,
    externalTileset,
    includedTileset,
  };
}

/** @typedef {AsepriteChunkTypes[keyof AsepriteChunkTypes]} AsepriteChunkType */

const AsepriteChunkTypes = /** @type {const} */ ({
  PALETTE_0004: 0x0004,
  PALETTE_0011: 0x0011,
  LAYER: 0x2004,
  CEL: 0x2005,
  CEL_EXTRA: 0x2006,
  COLOR_PROFILE: 0x2007,
  EXTERNAL_FILE: 0x2008,
  MASK: 0x2016,
  PATH: 0x2017,
  TAGS: 0x2018,
  PALETTE: 0x2019,
  USER_DATA: 0x2020,
  SLICE: 0x2022,
  TILESET: 0x2023,
});

/**
 * @param {import('./AsepriteChunkTypes').AsepriteChunkType} chunkType 
 * @param {ArrayBuffer} chunkData
 * @param {import('./AsepritePixelFormats').AsepritePixelFormat} pixelFormat
 */
function parseAsepriteChunk(chunkType, chunkData, pixelFormat) {
  const data = new ByteReader(chunkData);
  switch(chunkType) {
    case AsepriteChunkTypes.PALETTE_0004: // Skip in favor of new palette chunk
    case AsepriteChunkTypes.PALETTE_0011: // Skip in favor of new palette chunk
      return null;
    case AsepriteChunkTypes.LAYER:
      return readAsepriteChunkLayer(data, new TextDecoder());
    case AsepriteChunkTypes.CEL:
      return readAsepriteChunkCel(data, pixelFormat);
    case AsepriteChunkTypes.CEL_EXTRA:
      return readAsepriteChunkCelExtra(data);
    case AsepriteChunkTypes.COLOR_PROFILE:
      return readAsepriteChunkColorProfile(data);
    case AsepriteChunkTypes.EXTERNAL_FILE:
      return readAsepriteChunkExternalFiles(data, new TextDecoder());
    case AsepriteChunkTypes.MASK: // Deprecated
      return null;
    case AsepriteChunkTypes.PATH: // Never used
      return null;
    case AsepriteChunkTypes.TAGS:
      return readAsepriteChunkTags(data, new TextDecoder());
    case AsepriteChunkTypes.PALETTE:
      return readAsepriteChunkPalette(data, new TextDecoder());
    case AsepriteChunkTypes.USER_DATA:
      return readAsepriteChunkUserData(data, new TextDecoder());
    case AsepriteChunkTypes.SLICE:
      return readAsepriteChunkSlice(data, new TextDecoder());
    case AsepriteChunkTypes.TILESET:
      return readAsepriteChunkTileset(data, new TextDecoder());
  }
}

const HEADER_MAGIC_NUMBER = 0xa5e0;
const FRAME_HEADER_MAGIC_NUMBER = 0xf1fa;

/** @typedef {ReturnType<readAsepriteFileBytes>} AsepriteFile */

/**
 * @see https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md
 * @param {ByteReader} data 
 */
function readAsepriteFileBytes(data) {
  const header = readAsepriteHeaderBytes(data);
  let frames = [];
  for(let i = 0; i < header.frames; ++i) {
    const frameHeader = readAsepriteFrameHeaderBytes(data);
    let chunks = [];
    for(let j = 0; j < frameHeader.chunks; ++j) {
      const chunk = readAsepriteChunkBytes(data);
      let result = parseAsepriteChunk(
        chunk.chunkType,
        chunk.chunkData,
        getPixelFormatFromColorDepth(header.colorDepth));
      chunks.push({
        chunkHeader: {
          chunkType: chunk.chunkType,
          chunkSize: chunk.chunkSize,
        },
        ...result,
      });
    }
    frames.push({
      frameHeader,
      chunks,
    });
  }
  return {
    header,
    frames,
  };
}

/**
 * @param {ByteReader} data
 */
function readAsepriteHeaderBytes(data) {
  const fileSize = data.nextDoubleWord();
  const magicNumber = data.nextWord();
  if (magicNumber !== HEADER_MAGIC_NUMBER) {
    throw new Error('Invalid Aseprite header byte format.');
  }
  const frames = data.nextWord();
  const width = data.nextWord();
  const height = data.nextWord();
  const colorDepth = data.nextWord();
  data.nextDoubleWord(); // Layer opacity flag
  data.nextWord(); // Deprecated speed (ms) between frames
  data.nextDoubleWord(); // Zeroes
  data.nextDoubleWord(); // Zeroes
  const paletteIndex = data.nextByte();
  data.skipBytes(3); // Zeroes (ignored bytes)
  const numColors = data.nextWord();
  const pixelWidth = data.nextByte();
  const pixelHeight = data.nextByte();
  const gridX = data.nextShort();
  const gridY = data.nextShort();
  const gridWidth = data.nextWord();
  const gridHeight = data.nextWord();
  data.skipBytes(84); // Zeroes (reserved for the future)
  return {
    /** Bytes in this file. */
    fileSize,
    /** Number of frames in this file. */
    frames,
    width,
    height,
    colorDepth,
    paletteIndex,
    numColors,
    pixelWidth,
    pixelHeight,
    gridX,
    gridY,
    gridWidth,
    gridHeight,
  };
}

/**
 * @param {ByteReader} data
 */
function readAsepriteFrameHeaderBytes(data) {
  const frameSize = data.nextDoubleWord();
  const magicNumber = data.nextWord();
  if (magicNumber !== FRAME_HEADER_MAGIC_NUMBER) {
    throw new Error('Invalid Aseprite frame header byte format.');
  }
  const oldChunks = data.nextWord(); // Old num chunks field
  const frameDuration = data.nextWord(); // In milliseconds
  data.skipBytes(2); // Zeroes (for future)
  const newChunks = data.nextDoubleWord(); // If 0, use old num chunks field
  return {
    /** Bytes in this frame. */
    frameSize,
    /** Duration of this frame in milliseconds. */
    frameDuration,
    /** Number of chunks in this frame. */
    chunks: newChunks > 0 ? newChunks : oldChunks,
  };
}

/** @typedef {ReturnType<readAsepriteChunkBytes>} AsepriteChunk */

/**
 * @param {ByteReader} data
 */
function readAsepriteChunkBytes(data) {
  const chunkSize = data.nextDoubleWord();
  const chunkType = /** @type {import('./AsepriteChunkTypes').AsepriteChunkType} */ (data.nextWord());
  const numBytes = chunkSize - 6;
  if (numBytes < 0) {
    throw new Error('Invalid Aseprite chunk size - must be at least 6 bytes (to include chunk size and type info).');
  }
  const chunkData = data.nextBytes(numBytes);
  return {
    /** Bytes in this chunk. */
    chunkSize,
    chunkType,
    chunkData,
  };
}

class Aseprite {

  /**
   * @param {ArrayBuffer} arrayBuffer
   */
  static fromArrayBuffer(arrayBuffer) {
    const data = new ByteReader(arrayBuffer);
    const file = readAsepriteFileBytes(data);
    let result = new Aseprite(
      file.header.fileSize,
      file.header.width,
      file.header.height,
      file.header.colorDepth,
      `${file.header.pixelWidth}:${file.header.pixelHeight}`,
      file);
    return result;
  }

  /**
   * @param {number} fileSize
   * @param {number} width
   * @param {number} height
   * @param {number} colorDepth
   * @param {string} pixelRatio
   * @param {import('./AsepriteFile').AsepriteFile} fileData
   */
  constructor(fileSize, width, height, colorDepth, pixelRatio, fileData) {
    /** @readonly */
    this.fileSize = fileSize;
    /** @readonly */
    this.fileData = fileData;

    this.frames = [];
    this.layers = [];
    this.slices = [];
    this.tags = [];
    this.tilesets = [];

    /** @readonly */
    this.width = width;
    /** @readonly */
    this.height = height;
    /** @readonly */
    this.colorDepth = colorDepth;
    /** @readonly */
    this.pixelRatio = pixelRatio;
    /** @readonly */
    this.pixelFormat = getPixelFormatFromColorDepth(this.colorDepth);
  }
}

export { Aseprite, AsepriteAnimationDirections, AsepriteBlendModes, AsepriteCelTypes, AsepriteChunkTypes, AsepriteColorProfiles, AsepriteExternalFileEntryTypes, AsepriteLayerFlags, AsepritePixelFormats, ByteReader, countPixelFormatBytesPerPixel, getPixelFormatFromColorDepth, parseAsepriteChunk, readAsepriteChunkBytes, readAsepriteChunkCel, readAsepriteChunkCelExtra, readAsepriteChunkColorProfile, readAsepriteChunkExternalFiles, readAsepriteChunkLayer, readAsepriteChunkPalette, readAsepriteChunkSlice, readAsepriteChunkTags, readAsepriteChunkTileset, readAsepriteChunkUserData, readAsepriteFileBytes, readAsepriteFrameHeaderBytes, readAsepriteGrayscalePixelBytes, readAsepriteHeaderBytes, readAsepriteIndexedPixelBytes, readAsepriteRGBAPixelBytes, readAsepriteStringBytes };
//# sourceMappingURL=index.js.map
