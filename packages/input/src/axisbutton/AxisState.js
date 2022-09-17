import { InputState } from './InputState.js';

/**
 * @typedef {import('./InputState.js').BindingIndex} BindingIndex The binding index
 * @typedef {import('./InputState.js').BindingOptions} BindingOptions The binding options
 *
 * @typedef AxisBindingState
 * @property {number} value
 * @property {number} delta
 * @property {boolean} inverted
 *
 * @typedef AxisReadOnly
 * @property {number} value
 * @property {number} delta
 * @property {boolean} polling
 */

export class AxisState extends InputState {
  /** @returns {AxisBindingState} */
  static createAxisBindingState() {
    return {
      value: 0,
      delta: 0,
      inverted: false,
    };
  }

  /** @returns {number} */
  get delta() {
    return this._delta;
  }

  /**
   * @override
   * @returns {number}
   */
  get value() {
    return this._value;
  }

  /**
   * @param {number} [size]
   */
  constructor(size = 0) {
    super(size);
    let state = new Array();
    let c = /** @type {typeof AxisState} */ (this.constructor);
    for (let i = 0; i < size; ++i) {
      state.push(c.createAxisBindingState());
    }
    /**
     * @private
     * @type {Array<AxisBindingState>}
     */
    this._state = state;
    /** @private */
    this._value = 0;
    /** @private */
    this._delta = 0;
  }

  /**
   * @override
   * @protected
   */
  resize(newSize) {
    let oldState = this._state;
    let oldSize = oldState.length;
    let newState;
    if (newSize <= oldSize) {
      newState = oldState.slice(0, newSize);
    } else {
      newState = oldState;
      // Fill with new states
      let c = /** @type {typeof AxisState} */ (this.constructor);
      for (let i = oldSize; i < newSize; ++i) {
        newState.push(c.createAxisBindingState());
      }
    }
    this._state = newState;
    super.resize(newSize);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @returns {number}
   */
  getState(code) {
    return this._state[code].value;
  }

  /**
   * @override
   * @param {number} now
   */
  onPoll(now) {
    let state = this._state;
    let accumulatedValue = 0;
    let accumulatedDelta = 0;
    const len = state.length;
    for (let i = 0; i < len; ++i) {
      let value = state[i];
      accumulatedValue += value.value * (value.inverted ? -1 : 1);
      accumulatedDelta += value.delta;
      state[i].delta = 0;
    }
    this._value = accumulatedValue;
    this._delta = accumulatedDelta;
    super.onPoll(now);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {number} value
   * @param {number} delta
   */
  onUpdate(code, value, delta) {
    if (typeof value === 'undefined') {
      this.onAxisChange(code, delta);
    } else {
      this.onAxisMove(code, value, delta);
    }
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {number} value
   */
  onStatus(code, value) {
    this.onAxisStatus(code, value);
  }

  /**
   * @override
   * @param {BindingIndex} code
   * @param {BindingOptions} [opts]
   */
  onBind(code, opts = undefined) {
    super.onBind(code, opts);
    const { inverted = false } = opts || {};
    let state = this._state;
    state[code].inverted = inverted;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {number} x
   * @param {number} dx
   */
  onAxisMove(code, x, dx) {
    let state = this._state[code];
    state.value = x;
    state.delta += dx;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {number} dx
   */
  onAxisChange(code, dx) {
    let state = this._state[code];
    state.value += dx;
    state.delta += dx;
  }

  /**
   * @protected
   * @param {BindingIndex} code
   * @param {number} x
   */
  onAxisStatus(code, x) {
    let state = this._state[code];
    let prev = state.value;
    state.value = x;
    state.delta = x - prev;
  }
}
