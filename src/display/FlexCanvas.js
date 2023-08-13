const INNER_HTML = /* html */ `<div class="container">
  <div class="padding"></div>
  <div class="innerContainer">
    <div class="padding"></div>
    <slot><canvas>Oh no! Your browser does not support canvas.</canvas></slot>
    <div class="padding"></div>
  </div>
  <div class="padding"></div>
</div>`;

const INNER_STYLE = /* css */ `
:host {
  display: inline-block;
  flex: 1;
  --width: 300px;
  --height: 150px;
}
:host([scaling="noscale"]) {
  width: var(--width);
  height: var(--height);
}
:host([sizing="viewport"]) {
    position: fixed;
    top: 0;
    left: 0;
}
.container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.innerContainer {
  display: flex;
  flex-direction: column;
}
.padding {
  flex: 1;
}`;

/**
 * No scaling is applied. The canvas size maintains a
 * 1:1 pixel ratio to the defined display dimensions.
 */
const SCALING_NOSCALE = 'noscale';
/**
 * Scales the canvas to fill the entire viewport and
 * maintains the same aspect ratio. This will adjust
 * canvas resolution to fit the viewport dimensions.
 * In other words, the canvas pixel size remains
 * constant, but the number of pixels in the canvas
 * will increase or decrease to compensate. This is
 * the default scaling mode.
 */
const SCALING_FIT = 'fit';
/**
 * Scales the canvas to fill the entire viewport and
 * maintains the same aspect ratio and pixel
 * resolution. This will upscale and downscale the
 * pixel size depending on the viewport dimentions
 * in order to preserve the canvas pixel count. In
 * other words, the number of pixels in the canvas
 * remain constant but appear larger or smaller to
 * compensate.
 */
const SCALING_SCALE = 'scale';
/**
 * Resizes the canvas to fill the entire viewport.
 * This does not maintain the aspect ratio nor pixel
 * count (adds and removes pixels to fill size). If you
 * care about aspect ratio but not pixel count, consider
 * using 'fit' mode instead.
 */
const SCALING_FILL = 'fill';
/**
 * Scales the canvas to fill the entire viewport.
 * This does not maintain the aspect ratio but
 * does preserve pixel count (by stretching the pixel
 * size). If you care about aspect ratio and pixel
 * count, consider using 'scale' mode instead.
 */
const SCALING_STRETCH = 'stretch';

/**
 * Sizes the canvas width and height.
 */
const SIZING_NONE = 'none';
/**
 * Sizes to 100% of parent container.
 */
const SIZING_CONTAINER = 'container';
/**
 * Sizes to 100% of viewport.
 */
const SIZING_VIEWPORT = 'viewport';

/**
 * The default display x dimensions. This is
 * the same as the canvas element default.
 */
const DEFAULT_WIDTH = 300;
/**
 * The default display y dimensions. This is
 * the same as the canvas element default.
 */
const DEFAULT_HEIGHT = 150;

/**
 * @typedef {SIZING_NONE|SIZING_CONTAINER|SIZING_VIEWPORT|string} SizingMode
 */

/**
 * @typedef {SCALING_NOSCALE|SCALING_SCALE|SCALING_FILL|SCALING_FIT|SCALING_STRETCH} ScalingMode
 */

/**
 * A canvas wrapper to scale and stretch with respect to the aspect ratio to fill the viewport or container.
 */
export class FlexCanvas extends HTMLElement {
  /**
   * @param {object} [opts]
   * @param {HTMLElement} [opts.root]
   * @param {string} [opts.id]
   * @param {ScalingMode} [opts.scaling]
   * @param {SizingMode} [opts.sizing]
   * @param {number} [opts.width]
   * @param {number} [opts.height]
   */
  static create(opts = {}) {
    const {
      root = document.body,
      id = undefined,
      scaling = SCALING_SCALE,
      sizing = SIZING_CONTAINER,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
    } = opts || {};
    if (!window.customElements.get('flex-canvas')) {
      window.customElements.define('flex-canvas', FlexCanvas);
    }
    let result = new FlexCanvas();
    if (typeof id !== 'undefined') {
      result.id = id;
    }
    result.scaling = scaling;
    result.sizing = sizing;
    result.width = width;
    result.height = height;
    root.appendChild(result);
    return result;
  }

  static define(customElements = window.customElements) {
    customElements.define('flex-canvas', this);
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

  /**
   * @protected
   * Override for web component.
   */
  static get observedAttributes() {
    return ['sizing', 'width', 'height', 'resize-delay'];
  }

  /**
   * The scaling mode.
   * - `noscale`: Do not perform scaling.
   * - `fit`: Resize resolution to fill the entire viewport and maintains the aspect
   * ratio. The pixel resolution is changed. This is the default behavior.
   * - `fill`: Resize resolution to fill the entire viewport but does not maintain
   * aspect ratio.
   * - `stretch`: Perform scaling to fill the entire viewport but does not maintain
   * aspect ratio.
   * - `scale`: Perform scaling to fill the entire viewport and maintains the
   * aspect ratio and resolution. The pixel resolution remains constant.
   */
  get scaling() {
    return /** @type {ScalingMode} */ (this.getAttribute('scaling'));
  }

  set scaling(value) {
    this.setAttribute('scaling', value);
  }

  /**
   * The sizing mode.
   * - `none`: Sizes to canvas.
   * - `container`: Sizes to 100% of parent container.
   * - `viewport`: Sizes to 100% of viewport.
   */
  get sizing() {
    return /** @type {SizingMode} */ (this._sizing);
  }

  set sizing(value) {
    this.setAttribute('sizing', String(value));
  }

  /**
   * @returns {number}
   */
  get resizeDelay() {
    return this._resizeDelay;
  }

  set resizeDelay(value) {
    this.setAttribute('resize-delay', String(value));
  }

  /**
   * The canvas width in pixels. This determines the aspect ratio and canvas buffer size.
   * @returns {number}
   */
  get width() {
    return this._width;
  }

  set width(value) {
    this.setAttribute('width', String(value));
  }

  /**
   * The canvas height in pixels. This determines the aspect ratio and canvas buffer size.
   */
  get height() {
    return this._height;
  }

  set height(value) {
    this.setAttribute('height', String(value));
  }

  get canvas() {
    return this.canvasElement;
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(
      this.constructor[Symbol.for('templateNode')].content.cloneNode(true),
    );
    shadowRoot.appendChild(
      this.constructor[Symbol.for('styleNode')].cloneNode(true),
    );

    /** @private */
    this._sizing = 'none';
    /** @private */
    this._width = DEFAULT_WIDTH;
    /** @private */
    this._height = DEFAULT_HEIGHT;
    /** @private */
    this._resizeDelay = 0;

    /** @private */
    this.animationFrameHandle = 0;

    /** @private */
    this.resizeTimeoutHandle = 0;
    /** @private */
    this.resizeCanvasWidth = 0;
    /** @private */
    this.resizeCanvasHeight = 0;

    /** @private */
    this.canvasSlotElement = shadowRoot.querySelector('slot');
    /** @private */
    this.canvasElement = null;

    /** @private */
    this.onResize = this.onResize.bind(this);
    /** @private */
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    /** @private */
    this.onSlotChange = this.onSlotChange.bind(this);
  }

  /**
   * @protected
   * Override for web component.
   */
  connectedCallback() {
    upgradeProperty(this, 'scaling');
    upgradeProperty(this, 'sizing');
    upgradeProperty(this, 'width');
    upgradeProperty(this, 'height');
    upgradeProperty(this, 'resize-delay');

    // Scaling mode
    if (!this.hasAttribute('scaling')) {
      this.setAttribute('scaling', SCALING_SCALE);
    }

    // Allows this element to be focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.canvasSlotElement.addEventListener('slotchange', this.onSlotChange);
    if (!this.canvasElement) {
      this.setCanvasElement(this.canvasSlotElement.querySelector('canvas'));
    }
  }

  /**
   * @protected
   * Override for web component.
   */
  disconnectedCallback() {
    cancelAnimationFrame(this.animationFrameHandle);
    this.animationFrameHandle = null;
    this.canvasSlotElement.removeEventListener('slotchange', this.onSlotChange);
  }

  /**
   * @protected
   * Override for web component.
   */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'sizing':
        {
          this._sizing = String(value);
          switch (this._sizing) {
            case 'none':
              this.style.removeProperty('width');
              this.style.removeProperty('height');
              break;
            case 'container':
              this.style.setProperty('width', '100%');
              this.style.setProperty('height', '100%');
              break;
            case 'viewport':
              this.style.setProperty('width', '100vw');
              this.style.setProperty('height', '100vh');
              break;
            default:
              let [x, y] = this._sizing.split(' ');
              if (x && y) {
                this.style.setProperty('width', x);
                this.style.setProperty('height', y);
              }
              break;
          }
        }
        break;
      case 'width':
        this._width = Number(value);
        if (this.canvasElement) {
          this.canvasElement.width = this._width;
        }
        break;
      case 'height':
        this._height = Number(value);
        if (this.canvasElement) {
          this.canvasElement.height = this._height;
        }
        break;
      case 'resize-delay':
        this._resizeDelay = Number(value);
        break;
    }
  }

  /**
   * @private
   * @param {number} now
   */
  onAnimationFrame(now) {
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);

    if (
      this.clientWidth === this.resizeCanvasWidth &&
      this.clientHeight === this.resizeCanvasHeight
    ) {
      // Only call onDebounceResize() if new canvas size actually changed since last time.
      return;
    }

    this.resizeCanvasWidth = this.clientWidth;
    this.resizeCanvasHeight = this.clientHeight;

    if (this._resizeDelay > 0) {
      if (!this.resizeTimeoutHandle) {
        this.resizeTimeoutHandle = window.setTimeout(
          this.onResize,
          this._resizeDelay,
        );
      }
    } else {
      this.onResize();
    }
  }

  /** @private */
  onResize() {
    window.clearTimeout(this.resizeTimeoutHandle);
    this.resizeTimeoutHandle = null;

    const canvas = this.canvasElement;
    if (!canvas) {
      return;
    }

    const scaling = this.scaling;
    const clientRect = this.getBoundingClientRect();
    const clientWidth = clientRect.width;
    const clientHeight = clientRect.height;

    let canvasWidth = this._width;
    let canvasHeight = this._height;
    let ratioX = clientWidth / canvasWidth;
    let ratioY = clientHeight / canvasHeight;

    // noscale
    if (scaling === 'noscale') {
      this.style.setProperty('--width', `${canvasWidth}px`);
      this.style.setProperty('--height', `${canvasHeight}px`);
    }

    // scale
    if (scaling === 'scale') {
      if (ratioX < ratioY) {
        canvas.style.setProperty('width', `${Math.floor(clientWidth)}px`);
        canvas.style.setProperty(
          'height',
          `${Math.floor(canvasHeight * ratioX)}px`,
        );
      } else {
        canvas.style.setProperty(
          'width',
          `${Math.floor(canvasWidth * ratioY)}px`,
        );
        canvas.style.setProperty('height', `${Math.floor(clientHeight)}px`);
      }
    }

    // stretch
    if (scaling === 'stretch') {
      canvas.style.setProperty('width', `${Math.floor(clientWidth)}px`);
      canvas.style.setProperty('height', `${Math.floor(clientHeight)}px`);
    }

    // fit
    if (scaling === 'fit') {
      if (ratioX < ratioY) {
        canvasWidth = Math.floor(clientWidth);
        canvasHeight = Math.floor(canvasHeight * ratioX);
        canvas.style.setProperty('width', `${canvasWidth}px`);
        canvas.style.setProperty('height', `${canvasHeight}px`);
      } else {
        canvasWidth = Math.floor(canvasWidth * ratioY);
        canvasHeight = Math.floor(clientHeight);
        canvas.style.setProperty('width', `${canvasWidth}px`);
        canvas.style.setProperty('height', `${canvasHeight}px`);
      }
      if (canvas.width !== canvasWidth) {
        canvas.width = canvasWidth;
      }
      if (canvas.height !== canvasHeight) {
        canvas.height = canvasHeight;
      }
    }

    // fill
    if (scaling === 'fill') {
      if (ratioX < ratioY) {
        canvasWidth = Math.floor(clientWidth);
        canvasHeight = Math.floor(clientHeight);
        canvas.style.setProperty('width', `${canvasWidth}px`);
        canvas.style.setProperty('height', `${canvasHeight}px`);
      } else {
        canvasWidth = Math.floor(clientWidth);
        canvasHeight = Math.floor(clientHeight);
        canvas.style.setProperty('width', `${canvasWidth}px`);
        canvas.style.setProperty('height', `${canvasHeight}px`);
      }
      if (canvas.width !== canvasWidth) {
        canvas.width = canvasWidth;
      }
      if (canvas.height !== canvasHeight) {
        canvas.height = canvasHeight;
      }
    }
  }

  /**
   * @private
   * @param {Event} e
   */
  onSlotChange(e) {
    const slot = /** @type {HTMLSlotElement} */ (e.target);
    let children = slot.assignedElements({ flatten: true });
    let canvas = /** @type {HTMLCanvasElement} */ (
      children.find((el) => el instanceof HTMLCanvasElement)
    );
    if (canvas) {
      this.setCanvasElement(canvas);
    }
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   */
  setCanvasElement(canvas) {
    canvas.width = this._width;
    canvas.height = this._height;
    canvas.style.imageRendering = 'pixelated';
    this.canvasElement = canvas;
  }

  /**
   * @param {'2d'|'webgl'|'webgl2'} [contextId]
   * @param {CanvasRenderingContext2DSettings} [options]
   */
  getContext(contextId = '2d', options = undefined) {
    return this.canvasElement.getContext(contextId, options);
  }
}

function upgradeProperty(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}
