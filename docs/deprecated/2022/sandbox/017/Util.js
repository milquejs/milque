function kebabToCamelCase(str) {
  let result = str.replace(/-\w/g, (m) => m[1].toUpperCase());
  return result.charAt(0).toUpperCase() + result.substring(1);
}

function createShadowComponent(
  name,
  templateElement = document.querySelector('template#' + name),
  shadowOpts = { mode: 'open' }
) {
  class ShadowComponent extends HTMLElement {
    constructor() {
      super();

      this.attachShadow(shadowOpts);
      this.shadowRoot.appendChild(templateElement.content.cloneNode(true));
    }
  }
  window.customElements.define(name, ShadowComponent);
  return ShadowComponent;
}
