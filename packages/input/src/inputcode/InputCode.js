import INNER_HTML from './InputCode.template.html';
import INNER_STYLE from './InputCode.module.css';

export class InputCode extends HTMLElement {
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
    customElements.define('input-code', this);
  }

  /** @override */
  static get observedAttributes() {
    return ['name', 'value', 'disabled'];
  }

  /** @returns {boolean} */
  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggleAttribute('disabled', value);
  }

  /** @returns {string} */
  get value() {
    return this._value;
  }

  set value(value) {
    this.setAttribute('value', value);
  }

  /** @returns {string} */
  get name() {
    return this._name;
  }

  set name(value) {
    this.setAttribute('name', value);
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
    this._name = '';
    /** @private */
    this._value = '';
    /** @private */
    this._disabled = false;

    /** @private */
    this._kbdElement = this.shadowRoot.querySelector('kbd');
    /** @private */
    this._nameElement = this.shadowRoot.querySelector('#name');
    /** @private */
    this._valueElement = this.shadowRoot.querySelector('#value');
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'name':
        this._name = value;
        this._nameElement.textContent = value;
        break;
      case 'value':
        this._value = value;
        if (value !== null) {
          this._valueElement.classList.toggle('hidden', false);
          this._valueElement.textContent = value;
          this._kbdElement.style.paddingRight = `${
            this._valueElement.clientWidth + 4
          }px`;
        } else {
          this._valueElement.classList.toggle('hidden', true);
        }
        break;
      case 'disabled':
        this._disabled = value !== null;
        this._kbdElement.classList.toggle('disabled', value !== null);
        break;
    }
  }

  /** @override */
  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, 'name')) {
      let value = this.name;
      delete this.name;
      this.name = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      let value = this.value;
      delete this.value;
      this.value = value;
    }

    if (Object.prototype.hasOwnProperty.call(this, 'disabled')) {
      let value = this.disabled;
      delete this.disabled;
      this.disabled = value;
    }
  }
}
InputCode.define();
