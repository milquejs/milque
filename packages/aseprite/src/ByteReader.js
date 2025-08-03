export class ByteReader {

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
