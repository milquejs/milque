import INNER_HTML from './InputPort.template.html';
import INNER_STYLE from './InputPort.module.css';

import { InputCode } from '../inputcode/InputCode.js';
import { InputContext } from '../InputContext';

/**
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('../device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('../axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('../InputBindings.js').DeviceName} DeviceName
 * @typedef {import('../InputBindings.js').KeyCode} KeyCode
 * @typedef {import('../InputBindings.js').BindingOptions} BindingOptions
 *
 * @typedef {string} InputName
 */

export class InputPort extends HTMLElement {
  /** @protected */
  static get [Symbol.for('templateNode')]() {
    let t = document.createElement('template');
    t.innerHTML = INNER_HTML;
    Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
    return t;
  }

  /** @protected */
  static get [Symbol.for('styleNode')]() {
    let t = document.createElement('style');
    t.innerHTML = INNER_STYLE;
    Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
    return t;
  }

  static define(customElements = window.customElements) {
    customElements.define('input-port', this);
  }

  /** @override */
  static get observedAttributes() {
    return ['autopoll', 'for'];
  }

  /** @returns {boolean} */
  get autopoll() {
    return this._autopoll;
  }

  set autopoll(value) {
    this.toggleAttribute('autopoll', value);
  }

  /** @returns {string} */
  get for() {
    return this._for;
  }

  set for(value) {
    this.setAttribute('for', value);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      this.constructor[Symbol.for('templateNode')].content.cloneNode(true)
    );
    this.shadowRoot.appendChild(
      this.constructor[Symbol.for('styleNode')].cloneNode(true)
    );

    /** @private */
    this._titleElement = this.shadowRoot.querySelector('#title');
    /** @private */
    this._pollElement = this.shadowRoot.querySelector('#poll');
    /** @private */
    this._focusElement = this.shadowRoot.querySelector('#focus');
    /** @private */
    this._bodyElement = this.shadowRoot.querySelector('tbody');
    /** @private */
    this._outputElements = {};

    /** @private */
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    /** @private */
    this.animationFrameHandle = null;

    const eventTarget = this;
    /** @private */
    this._for = '';
    /** @private */
    this._eventTarget = eventTarget;
    /** @private */
    this._autopoll = false;

    /** @private */
    this._context = null;
    this.onInputContextBind = this.onInputContextBind.bind(this);
    this.onInputContextUnbind = this.onInputContextUnbind.bind(this);
    this.onInputContextFocus = this.onInputContextFocus.bind(this);
    this.onInputContextBlur = this.onInputContextBlur.bind(this);
  }

  /** @override */
  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, 'for')) {
      let value = this.for;
      delete this.for;
      this.for = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, 'autopoll')) {
      let value = this.autopoll;
      delete this.autopoll;
      this.autopoll = value;
    }

    // Make sure the table and values are up to date
    this.updateTable();
    this.updateTableValues();
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
  }

  /** @override */
  disconnectedCallback() {
    if (this._context) {
      this._context.removeEventListener('bind', this.onInputContextBind);
      this._context.removeEventListener('unbind', this.onInputContextUnbind);
      this._context.removeEventListener('blur', this.onInputContextBlur);
      this._context.removeEventListener('focus', this.onInputContextFocus);
      this._context.destroy();
      this._context = null;
    }
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'for':
        {
          this._for = value;
          let target;
          let name;
          if (value) {
            target = document.getElementById(value);
            name = `${target.tagName.toLowerCase()}#${value}`;
          } else {
            target = this;
            name = 'input-port';
          }
          this._eventTarget = target;
          if (this._context) {
            this._context.setEventTarget(this._eventTarget);
          }
          // For debug info
          this._titleElement.innerHTML = `for ${name}`;
        }
        break;
      case 'autopoll':
        this._autopoll = value !== null;
        if (this._context) {
          this._context.toggleAutoPoll(this._autopoll);
        }
        break;
    }
  }

  /** @private */
  onAnimationFrame() {
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.updateTableValues();
    this.updatePollStatus();
  }

  /** @private */
  onInputContextBind() {
    this.updateTable();
  }

  /** @private */
  onInputContextUnbind() {
    this.updateTable();
  }

  /** @private */
  onInputContextFocus() {
    this._focusElement.innerHTML = '✓';
  }

  /** @private */
  onInputContextBlur() {
    this._focusElement.innerHTML = '';
  }

  /**
   * @param {'axisbutton'} [contextId]
   * @param {object} [options]
   * @returns {InputContext}
   */
  getContext(contextId = 'axisbutton', options = undefined) {
    switch (contextId) {
      case 'axisbutton':
        if (!this._context) {
          this._context = new InputContext(this._eventTarget, options);
          this._context.addEventListener('bind', this.onInputContextBind);
          this._context.addEventListener('unbind', this.onInputContextUnbind);
          this._context.addEventListener('blur', this.onInputContextBlur);
          this._context.addEventListener('focus', this.onInputContextFocus);
          if (this._autopoll) {
            this._context.toggleAutoPoll(true);
          }
        }
        return this._context;
      default:
        throw new Error(`Input context id '${contextId}' is not supported.`);
    }
  }

  /** @private */
  updateTable() {
    if (!this.isConnected) {
      // Don't update the DOM if not connected to any :(
      return;
    } else if (!this._context) {
      // Clear all values if no context is available
      this._outputElements = {};
      this._bodyElement.innerHTML = '';
      return;
    } else {
      let context = this._context;
      let inputs = context.inputs;
      let bindings = context.bindings;
      let primaryElements = {};
      let entries = [];
      for (let name of Object.keys(inputs)) {
        let input = inputs[name];
        let primary = true;
        for (let binding of bindings.getBindingsByInput(input)) {
          let element = createInputTableEntry(
            `${input.constructor.name}.${name}`,
            `${binding.device}.${binding.code}`,
            0,
            primary
          );
          entries.push(element);
          if (primary) {
            primaryElements[name] = element.querySelector('output');
            primary = false;
          }
        }
      }
      this._outputElements = primaryElements;
      this._bodyElement.innerHTML = '';
      for (let entry of entries) {
        this._bodyElement.appendChild(entry);
      }
    }
  }

  /** @private */
  updateTableValues() {
    if (!this.isConnected) {
      // Don't update the DOM if not connected to any :(
      return;
    } else if (!this._context) {
      // Clear all values if no context is available
      for (let name of Object.keys(this._outputElements)) {
        let element = this._outputElements[name];
        element.innerText = '---';
      }
      return;
    } else {
      let context = this._context;
      let inputs = context.inputs;
      for (let name of Object.keys(this._outputElements)) {
        let element = this._outputElements[name];
        let value = inputs[name].value;
        element.innerText = Number(value).toFixed(2);
      }
    }
  }

  /** @private */
  updatePollStatus() {
    if (!this.isConnected) {
      // Don't update the DOM if not connected to any :(
      return;
    } else if (!this._context) {
      // Clear all values if no context is available
      this._pollElement.innerHTML = '-';
      return;
    } else {
      let context = this._context;
      let inputs = context.inputs;
      for (let input of Object.values(inputs)) {
        if (!input.polling) {
          this._pollElement.innerHTML = '';
          return;
        }
      }
      this._pollElement.innerHTML = '✓';
    }
  }
}
InputPort.define();

function createInputTableEntry(name, key, value, primary = true) {
  let row = document.createElement('tr');
  if (primary) {
    row.classList.add('primary');
  }
  // Name
  {
    let data = document.createElement('td');
    data.textContent = name;
    data.classList.add('name');
    row.appendChild(data);
  }
  // Value
  {
    let data = document.createElement('td');
    let output = document.createElement('output');
    if (primary) {
      output.innerText = Number(value).toFixed(2);
    } else {
      output.innerText = '---';
    }
    output.classList.add('value');
    data.appendChild(output);
    row.appendChild(data);
  }
  // Key
  {
    let data = document.createElement('td');
    data.classList.add('key');
    let kbd = new InputCode();
    kbd.innerText = key;
    data.appendChild(kbd);
    row.appendChild(data);
  }
  return row;
}
