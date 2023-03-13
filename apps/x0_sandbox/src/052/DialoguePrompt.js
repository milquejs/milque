const INNER_HTML = /* html */`
<div class="container">
  <h3 class="title">Speaker</h3>
  <div class="content">
    <p>
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    Text of this cool things?
    </p>
  </div>
  <nav>
    <button id="next"><span class="arrow"></span></button>
  </nav>
</div>`;

const INNER_STYLE = /* css */`
:host {
  position: absolute;
  left: 2rem;
  right: 2rem;
  bottom: 1rem;
  font-size: 1.5rem;
  color: #000000;
}

.container {
  display: flex;
  padding: 1em;
  border: 0.5rem solid #FFFFFF;
  border-radius: 1rem;
  font-family: sans-serif;
  background: rgba(200, 200, 200, 0.8);
  height: 8rem;
}

.title {
  position: absolute;
  left: 1rem;
  top: -0.2rem;
  margin: 0;
  padding: 0.2rem 0.5rem;
  transform: translateY(-50%);
  background: white;
  border: 0.5rem inset gold;
  border-radius: 1rem;
}

.content {
  flex: 1;
  overflow-y: auto;
  margin-right: 1rem;
}

p {
  margin: 0;
}

nav {
  position: absolute;
  right: 0.5em;
  bottom: 0.5em;
}

button {
  position: relative;
  padding: 0;
  margin: 0;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  --color: black;
}

button:hover {
  --color: gray;
  cursor: pointer;
}

.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-top: 0.5rem solid var(--color);
}
`;

export class DialoguePrompt extends HTMLElement {

  static define(customElements = window.customElements) {
    customElements.define('dialogue-prompt', this);
  }

  /** @private */
  static get [Symbol.for('templateNode')]() {
    let t = document.createElement('template');
    t.innerHTML = INNER_HTML;
    Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
    return t;
  }

  /** @private */
  static get [Symbol.for('styleNode')]() {
    let t = document.createElement('style');
    t.innerHTML = INNER_STYLE;
    Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
    return t;
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(
      this.constructor[Symbol.for('templateNode')].content.cloneNode(true)
    );
    shadowRoot.appendChild(
      this.constructor[Symbol.for('styleNode')].cloneNode(true)
    );
  }
}

function upgradeProperty(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}
