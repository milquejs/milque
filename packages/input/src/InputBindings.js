/**
 * @typedef {import('./axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('./axisbutton/InputBase.js').BindingOptions} BindingOptions
 *
 * @typedef {string} DeviceName
 * @typedef {string} KeyCode
 */

class Binding {
  /**
   * @param {DeviceName} device The name of the device
   * @param {KeyCode} code The key code for the device
   * @param {InputBase} input The parent input
   * @param {number} index The binding index for the input
   */
  constructor(device, code, input, index) {
    /** Name of the device */
    this.device = device;
    /** The key code for the device */
    this.code = code;
    /** The parent input */
    this.input = input;
    /** The binding index for the input */
    this.index = index;
  }
}

/**
 * A class that maps inputs to their respective key bindings.
 *
 * This does not handle input state (refer to InputBase.js) nor
 * input events (refer to InputDevice.js). It is only responsible
 * for the redirection of key codes to their bound input. Usually
 * this is used together with the interfaces referenced above.
 */
export class InputBindings {
  constructor() {
    /**
     * @private
     * @type {Record<DeviceName, Record<KeyCode, Array<Binding>>}
     */
    this.bindingMap = {};
    /**
     * @private
     * @type {Map<InputBase, Array<Binding>>}
     */
    this.inputMap = new Map();
  }

  clear() {
    for (let input of this.inputMap.keys()) {
      input.onUnbind();
    }
    this.inputMap.clear();
    this.bindingMap = {};
  }

  /**
   * @param {InputBase} input
   * @param {DeviceName} device
   * @param {KeyCode} code
   * @param {BindingOptions} [opts]
   */
  bind(input, device, code, opts = { inverted: false }) {
    let binding;

    let inputMap = this.inputMap;
    if (inputMap.has(input)) {
      let bindings = inputMap.get(input);
      let index = input.size;
      input.onBind(index, opts);
      binding = new Binding(device, code, input, index);
      bindings.push(binding);
    } else {
      let bindings = [];
      inputMap.set(input, bindings);
      let index = 0;
      input.onBind(index, opts);
      binding = new Binding(device, code, input, index);
      bindings.push(binding);
    }

    let bindingMap = this.bindingMap;
    if (device in bindingMap) {
      if (code in bindingMap[device]) {
        bindingMap[device][code].push(binding);
      } else {
        bindingMap[device][code] = [binding];
      }
    } else {
      bindingMap[device] = { [code]: [binding] };
    }
  }

  /**
   * @param {InputBase} input
   */
  unbind(input) {
    let inputMap = this.inputMap;
    if (inputMap.has(input)) {
      let bindingMap = this.bindingMap;
      let bindings = inputMap.get(input);
      for (let binding of bindings) {
        let { device, code } = binding;
        let boundList = bindingMap[device][code];
        let i = boundList.indexOf(binding);
        boundList.splice(i, 1);
      }
      bindings.length = 0;
      input.onUnbind();
      inputMap.delete(input);
    }
  }

  /**
   * @param {InputBase} input
   * @returns {boolean}
   */
  isBound(input) {
    return this.inputMap.has(input);
  }

  /** @returns {IterableIterator<InputBase>} */
  getInputs() {
    return this.inputMap.keys();
  }

  /** @returns {IterableIterator<Binding>} */
  getBindingsByInput(input) {
    return this.inputMap.get(input);
  }

  /**
   * @param {DeviceName} device
   * @param {KeyCode} code
   * @returns {IterableIterator<Binding>}
   */
  getBindings(device, code) {
    let deviceCodeBindings = this.bindingMap;
    if (device in deviceCodeBindings) {
      let codeBindings = deviceCodeBindings[device];
      if (code in codeBindings) {
        return codeBindings[code];
      }
    }
    return [];
  }
}
