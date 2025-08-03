import { readAsepriteFileBytes } from './AsepriteFile';
import { getPixelFormatFromColorDepth } from './AsepritePixelFormats';
import { ByteReader } from './ByteReader';

export class Aseprite {

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
