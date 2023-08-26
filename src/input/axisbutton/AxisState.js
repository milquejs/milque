export class AxisState {

  /**
   * @param {number} size
   */
  constructor(size) {
    /** @private */
    this.values = new Float32Array(size);
    /** @private */
    this.deltas = new Float32Array(size);
    /** @readonly */
    this.size = size;
    /** @readonly */
    this.timestamp = Number.MIN_VALUE;
  }

  /**
   * @param {number} axisIndex
   */
  valueOf(axisIndex) {
    return this.values[axisIndex];
  }

  /**
   * @param {number} axisIndex
   */
  deltaOf(axisIndex) {
    return this.deltas[axisIndex];
  }

  /**
   * @param {AxisState} out 
   * @param {number} [now]
   */
  next(out, now = performance.now()) {
    const len = this.size;
    if (len !== out.size) {
      out.resize(len);
    }
    for(let i = 0; i < len; ++i) {
      out.values[i] = this.values[i];
      out.deltas[i] = this.deltas[i];
      // NOTE: Delta should reset each frame
      this.deltas[i] = 0;
    }
    // @ts-ignore
    out.timestamp = now;
    return out;
  }

  /**
   * @param {number} [now]
   */
  clear(now = performance.now()) {
    this.values.fill(0);
    this.deltas.fill(0);
    // @ts-ignore
    this.timestamp = now;
    return this;
  }

  /**
   * @param {number} newSize 
   */
  resize(newSize) {
    if (newSize === this.size) {
      return;
    } else if (newSize <= this.size) {
      this.values = this.values.slice(0, newSize);
      this.deltas = this.deltas.slice(0, newSize);
    } else {
      const oldValues = this.values;
      const oldDeltas = this.deltas;
      this.values = new Float32Array(newSize);
      this.deltas = new Float32Array(newSize);
      this.values.set(oldValues);
      this.deltas.set(oldDeltas);
    }
    // @ts-ignore
    this.size = newSize;
  }

  /**
   * @param {number} axisIndex 
   * @param {number} x 
   * @param {number} dx 
   */
  applyMovement(axisIndex, x, dx) {
    this.values[axisIndex] = x;
    this.deltas[axisIndex] += dx;
  }

  /**
   * @param {number} axisIndex 
   * @param {number} dx 
   */
  applyChange(axisIndex, dx) {
    this.values[axisIndex] += dx;
    this.deltas[axisIndex] += dx;
  }

  /**
   * @param {number} axisIndex 
   * @param {number} x 
   */
  applyValue(axisIndex, x) {
    const prev = this.values[axisIndex];
    this.values[axisIndex] = x;
    this.deltas[axisIndex] += x - prev;
  }
}
