import { InputKeyElement } from './InputKeyElement.js';

const TEMPLATE_KEY = Symbol('template');
const STYLE_KEY = Symbol('style');
function upgradeProperty(element, propertyName) {
  if (element.hasOwnProperty(propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

export class InputMapElement extends HTMLElement {
  static get [TEMPLATE_KEY]() {
    let template = document.createElement('template');
    template.innerHTML = `
        <table>
            <thead>
                <tr class="tableHeader">
                    <th id="title" colspan=4>input-context</th>
                </tr>
                <tr class="colHeader">
                    <th>name</th>
                    <th>key</th>
                    <th>mod</th>
                    <th>value</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <slot></slot>`;
    Object.defineProperty(this, TEMPLATE_KEY, { value: template });
    return template;
  }

  static get [STYLE_KEY]() {
    let style = document.createElement('style');
    style.innerHTML = `
        :host {
            display: block;
        }
        table {
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid gray;
        }
        .colHeader > th {
            font-size: 0.5em;
            font-family: monospace;
            padding: 0 10px;
            letter-spacing: 3px;
            background-color: #AAA;
            color: #666666;
        }
        th, td {
            padding: 5px 10px;
        }
        td {
            text-align: center;
        }
        output {
            font-family: monospace;
            border-radius: 0.3em;
            padding: 3px;
        }
        tr:not(.primary) .name, tr:not(.primary) .value {
            opacity: 0.3;
        }
        tr:nth-child(2n) {
            background-color: #EEE;
        }
        slot {
            display: none;
        }`;
    Object.defineProperty(this, STYLE_KEY, { value: style });
    return style;
  }

  /** @override */
  static get observedAttributes() {
    return [
      'src',
      // Listening for built-in attribs
      'id',
      'class',
    ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      this.constructor[TEMPLATE_KEY].content.cloneNode(true)
    );
    this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

    this._src = '';

    this._titleElement = this.shadowRoot.querySelector('#title');
    this._tableElements = {};
    this._bodyElement = this.shadowRoot.querySelector('tbody');

    this._children = this.shadowRoot.querySelector('slot');
  }

  /** @override */
  connectedCallback() {
    upgradeProperty(this, 'src');
  }

  /** @override */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'src':
        if (this._src !== value) {
          this._src = value;
          if (value.trim().startsWith('{')) {
            let jsonData = JSON.parse(value);
            this._setInputMap(jsonData);
          } else {
            fetch(value)
              .then((fileBlob) => fileBlob.json())
              .then((jsonData) => this._setInputMap(jsonData));
          }
        }
        break;
      // For debug info
      case 'id':
      case 'class':
        this._titleElement.innerHTML = `input-port${
          this.className ? '.' + this.className : ''
        }${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
        break;
    }
  }

  get src() {
    return this.getAttribute('src');
  }
  set src(value) {
    switch (typeof value) {
      case 'object':
        let src = JSON.stringify(value);
        this._src = src;
        this._setInputMap(value);
        this.setAttribute('src', src);
        break;
      case 'string':
        this.setAttribute('src', value);
        break;
      default:
        this.setAttribute('src', String(value));
        break;
    }
  }

  _setInputMap(inputMap) {
    let entries = [];
    for (let name in inputMap) {
      let input = inputMap[name];
      inputToTableEntries(entries, name, input);
    }
    this._bodyElement.innerHTML = '';
    for (let entry of entries) {
      this._bodyElement.appendChild(entry);
    }
  }
}
window.customElements.define('input-map', InputMapElement);

function inputToTableEntries(out, name, input) {
  if (Array.isArray(input)) {
    inputToTableEntries(out, name, input[0]);
    let length = input.length;
    for (let i = 1; i < length; ++i) {
      const { key, event, scale } = input[i];
      let entry = createInputTableEntry(name, key, event, scale, 0, false);
      out.push(entry);
    }
    return out;
  } else {
    const { key, event, scale } = input;
    let entry = createInputTableEntry(name, key, event, scale, 0);
    out.push(entry);
    return out;
  }
}

function createInputTableEntry(name, key, event, scale, value, primary = true) {
  let row = document.createElement('tr');
  if (primary) row.classList.add('primary');
  // Name
  {
    let data = document.createElement('td');
    data.textContent = name;
    data.classList.add('name');
    row.appendChild(data);
  }
  // Key
  {
    let data = document.createElement('td');
    data.classList.add('key');
    let kbd = new InputKeyElement();
    kbd.innerText = key;
    data.appendChild(kbd);
    row.appendChild(data);
  }
  // Modifiers
  {
    let data = document.createElement('td');
    let samp = document.createElement('samp');
    let modifiers = [];
    if (typeof event === 'string' && event !== 'null') {
      modifiers.push(event);
    }
    if (typeof scale === 'number' && scale !== 1) {
      modifiers.push(`\u00D7${scale.toFixed(2)}`);
    }
    samp.innerText = modifiers.join(' ');
    data.classList.add('mod');
    data.appendChild(samp);
    row.appendChild(data);
  }
  // Value
  {
    let data = document.createElement('td');
    let output = document.createElement('output');
    output.innerText = Number(value).toFixed(2);
    output.classList.add('value');
    data.appendChild(output);
    row.appendChild(data);
  }
  return row;
}
