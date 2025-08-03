import { rgba } from '@milquejs/color';
import { readAsepriteStringBytes } from './AsepriteBytesHelper';
import { ByteReader } from './ByteReader';

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
export function readAsepriteChunkUserData(data, textDecoder) {
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