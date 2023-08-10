/** @typedef {import('./InputBindings.js').InputBindings} InputBindings */

/**
 * A class to listen and transform device events through
 * each mapped bindings into an input state.
 *
 * It requires onPoll() to be called to keep the input
 * state up to date. This is usually called from
 * requestAnimationFrame() or using the AutoPoller.
 */
export class DeviceInputAdapter {
  /**
   * @param {InputBindings} bindings
   */
  constructor(bindings) {
    /** @private */
    this.onInput = this.onInput.bind(this);
    /** @private */
    this.onPoll = this.onPoll.bind(this);

    this.bindings = bindings;
  }

  /**
   * @param {number} now
   */
  onPoll(now) {
    for (let input of this.bindings.getInputs()) {
      input.onPoll(now);
    }
  }

  onInput(e) {
    const {
      device,
      code,
      event,
      value,
      movement,
      // eslint-disable-next-line no-unused-vars
      control,
      shift,
      alt,
    } = e;
    let bindings = this.bindings.getBindings(device, code);
    switch (event) {
      case 'pressed':
        for (let { input, index } of bindings) {
          input.onUpdate(index, 1, 1);
        }
        break;
      case 'released':
        for (let { input, index } of bindings) {
          input.onUpdate(index, 0, -1);
        }
        break;
      case 'move':
        for (let { input, index } of bindings) {
          input.onUpdate(index, value, movement);
        }
        break;
      case 'wheel':
        for (let { input, index } of bindings) {
          input.onUpdate(index, undefined, movement);
        }
        break;
    }
    return bindings.length > 0;
  }
}
