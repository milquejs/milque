export const CLEAR_POLL_BITS = 0b1110_0001;
export const CLEAR_DOWN_STATE_BITS = 0b1111_1110;
export const CLEAR_TOUCHED_STATE_BIT = 0b1110_1111;

export const DOWN_STATE_BIT = 0b0000_0001;
export const PRESSED_STATE_BIT = 0b0000_0010;
export const REPEATED_STATE_BIT = 0b0000_0100;
export const RELEASED_STATE_BIT = 0b0000_1000;
export const TOUCHED_STATE_BIT = 0b0001_0000;
export const UNDEFINED_STATE_BITS = 0b1110_0000;

export class ButtonState {

  /**
   * @param {number} size 
   */
  constructor(size) {
    /** @private */
    this.states = new Uint8Array(size);
    /** @readonly */
    this.size = size;
    /** @readonly */
    this.timestamp = Number.MIN_VALUE;
  }

  /**
   * [`0`, `1`] whether the button is down and `0.1` when touched (if available).
   * 
   * @param {number} buttonIndex
   */
  valueOf(buttonIndex) {
    return this.downOf(buttonIndex) ? 1 : this.touchedOf(buttonIndex) ? 0.1 : 0;
  }

  /**
   * @param {number} buttonIndex
   */
  downOf(buttonIndex) {
    return (this.states[buttonIndex] & DOWN_STATE_BIT) !== 0;
  }

  /**
   * @param {number} buttonIndex
   */
  upOf(buttonIndex) {
    return (this.states[buttonIndex] & DOWN_STATE_BIT) === 0;
  }

  /**
   * @param {number} buttonIndex
   */
  pressedOf(buttonIndex) {
    return (this.states[buttonIndex] & PRESSED_STATE_BIT) !== 0;
  }

  /**
   * @param {number} buttonIndex
   */
  releasedOf(buttonIndex) {
    return (this.states[buttonIndex] & RELEASED_STATE_BIT) !== 0;
  }

  /**
   * @param {number} buttonIndex
   */
  repeatedOf(buttonIndex) {
    return (this.states[buttonIndex] & REPEATED_STATE_BIT) !== 0;
  }

  /**
   * @param {number} buttonIndex
   */
  touchedOf(buttonIndex) {
    return (this.states[buttonIndex] & TOUCHED_STATE_BIT) !== 0;
  }

  /**
   * @param {ButtonState} out 
   * @param {number} [now]
   */
  next(out, now = performance.now()) {
    const len = this.size;
    if (len !== out.size) {
      out.resize(len);
    }
    for(let i = 0; i < len; ++i) {
      out.states[i] = this.states[i];
      this.states[i] &= CLEAR_POLL_BITS;
    }
    // @ts-ignore
    out.timestamp = now;
    return out;
  }

  /**
   * @param {number} [now] 
   */
  clear(now = performance.now()) {
    this.states.fill(0);
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
      this.states = this.states.slice(0, newSize);
    } else {
      const oldStates = this.states;
      this.states = new Uint8Array(newSize);
      this.states.set(oldStates);
    }
    // @ts-ignore
    this.size = newSize;
  }

  /**
   * @param {number} buttonIndex
   * @param {boolean} repeated 
   */
  applyPressed(buttonIndex, repeated) {
    let bits = this.states[buttonIndex];
    if (!(bits & DOWN_STATE_BIT)) {
      bits |= PRESSED_STATE_BIT;
      bits |= DOWN_STATE_BIT;
    } else {
      bits |= REPEATED_STATE_BIT;
    }
    this.states[buttonIndex] = bits;
  }

  /**
   * @param {number} buttonIndex
   */
  applyReleased(buttonIndex) {
    let bits = this.states[buttonIndex];
    if (bits & DOWN_STATE_BIT) {
      bits |= RELEASED_STATE_BIT;
      bits &= CLEAR_DOWN_STATE_BITS;
    }
    this.states[buttonIndex] = bits;
  }

  /**
   * @param {number} buttonIndex
   * @param {boolean} touched
   */
  applyTouched(buttonIndex, touched) {
    let bits = this.states[buttonIndex];
    if (touched) {
      bits |= TOUCHED_STATE_BIT;
    } else {
      bits &= CLEAR_TOUCHED_STATE_BIT;
    }
    this.states[buttonIndex] = bits;
  }

  /**
   * @param {number} buttonIndex 
   * @param {boolean} down
   */
  applyDown(buttonIndex, down) {
    let bits = this.states[buttonIndex];
    const wasDown = (bits & DOWN_STATE_BIT) !== 0;
    if (down) {
      bits |= DOWN_STATE_BIT;
    } else {
      bits &= CLEAR_DOWN_STATE_BITS;
    }
    if (wasDown && !down) {
      bits |= RELEASED_STATE_BIT;
    } else if (!wasDown && down) {
      bits |= PRESSED_STATE_BIT;
    }
    this.states[buttonIndex] = bits;
  }
}
