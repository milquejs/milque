export class FileBufferMap {
  constructor() {
    /**
     * @private
     * @type {Record<string, Uint8Array>}
     */
    this._buffers = {};
  }

  clear() {
    this._buffers = {};
  }

  /**
   * @param {string} filePath
   * @param {Uint8Array} fileBuffer
   */
  put(filePath, fileBuffer) {
    this._buffers[filePath] = fileBuffer;
  }

  /**
   * @param {string} filePath
   * @returns {Uint8Array}
   */
  get(filePath) {
    return this._buffers[filePath];
  }

  /**
   * @returns {Array<string>}
   */
  keys() {
    return Object.keys(this._buffers);
  }
}
