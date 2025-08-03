var INNER_STYLE = /* css */ `
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

var INNER_HTML = /* html */ `
<div class="container">
  <div class="padding"></div>
  <div class="innerContainer">
    <div class="padding"></div>
    <slot><canvas>Oh no! Your browser does not support canvas.</canvas></slot>
    <div class="padding"></div>
  </div>
  <div class="padding"></div>
</div>`;

/**
 * @param {import('./FlexCanvas').ScalingMode} scalingMode
 * @param {HTMLElement} element
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function resizeFor(
  scalingMode,
  element,
  canvas,
  canvasWidth,
  canvasHeight
) {
  const clientRect = element.getBoundingClientRect();
  const clientWidth = clientRect.width;
  const clientHeight = clientRect.height;
  switch (scalingMode) {
    case 'fill':
      resizeForFill(
        canvas,
        canvasWidth,
        canvasHeight,
        clientWidth,
        clientHeight
      );
      return;
    case 'fit':
      resizeForFill(
        canvas,
        canvasWidth,
        canvasHeight,
        clientWidth,
        clientHeight
      );
      return;
    case 'scale':
      resizeForScale(
        canvas,
        canvasWidth,
        canvasHeight,
        clientWidth,
        clientHeight
      );
      return;
    case 'stretch':
      resizeForStretch(
        canvas,
        clientWidth,
        clientHeight
      );
      return;
    case 'noscale':
    default:
      resizeForNoScale(
        element,
        canvasWidth,
        canvasHeight
      );
      return;
  }
}

/**
 * @param {HTMLElement} element
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function resizeForNoScale(
  element,
  canvasWidth,
  canvasHeight,
) {
  element.style.setProperty('--width', `${canvasWidth}px`);
  element.style.setProperty('--height', `${canvasHeight}px`);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
function resizeForScale(
  canvas,
  canvasWidth,
  canvasHeight,
  clientWidth,
  clientHeight
) {
  const ratioX = clientWidth / canvasWidth;
  const ratioY = clientHeight / canvasHeight;
  if (ratioX < ratioY) {
    canvas.style.setProperty('width', `${Math.floor(clientWidth)}px`);
    canvas.style.setProperty(
      'height',
      `${Math.floor(canvasHeight * ratioX)}px`
    );
  } else {
    canvas.style.setProperty('width', `${Math.floor(canvasWidth * ratioY)}px`);
    canvas.style.setProperty('height', `${Math.floor(clientHeight)}px`);
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
function resizeForStretch(
  canvas,
  clientWidth,
  clientHeight
) {
  canvas.style.setProperty('width', `${Math.floor(clientWidth)}px`);
  canvas.style.setProperty('height', `${Math.floor(clientHeight)}px`);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} clientWidth
 * @param {number} clientHeight
 */
function resizeForFill(
  canvas,
  canvasWidth,
  canvasHeight,
  clientWidth,
  clientHeight
) {
  const ratioX = clientWidth / canvasWidth;
  const ratioY = clientHeight / canvasHeight;
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

/**
 * @param {import('./FlexCanvas').SizingMode} containerType 
 * @param {HTMLElement} element
 */
function matchDimensionTo(containerType, element) {
  switch(containerType) {
    case 'none':
      matchDimensionToNone(element);
      return;
    case 'container':
      matchDimensionToContainer(element);
      return;
    case 'viewport':
      matchDimensionToViewport(element);
      return;
      // NOTE: This is not a known sizing value, skip it.
  }
}

/**
 * @param {HTMLElement} element 
 */
function matchDimensionToNone(element) {
  element.style.removeProperty('width');
  element.style.removeProperty('height');
}

/**
 * @param {HTMLElement} element 
 */
function matchDimensionToContainer(element) {
  element.style.setProperty('width', '100%');
  element.style.setProperty('height', '100%');
}

/**
 * @param {HTMLElement} element 
 */
function matchDimensionToViewport(element) {
  element.style.setProperty('width', '100vw');
  element.style.setProperty('height', '100vh');
}

/** @typedef {ScalingModes[keyof ScalingModes]} ScalingMode */

/**
 * The supported ways to scale pixes when canvas resizes.
 */
const ScalingModes = /** @type {const} */ ({
  /**
   * Scales the canvas to fill the entire viewport and
   * maintains the same aspect ratio. This will adjust
   * canvas resolution to fit the viewport dimensions.
   * In other words, the canvas pixel size remains
   * constant, but the number of pixels in the canvas
   * will increase or decrease to compensate.
   */
  FIT: 'fit',
  /**
   * Scales the canvas to fill the entire viewport and
   * maintains the same aspect ratio and pixel
   * resolution. This will upscale and downscale the
   * pixel size depending on the viewport dimentions
   * in order to preserve the canvas pixel count. In
   * other words, the number of pixels in the canvas
   * remain constant but appear larger or smaller to
   * compensate. This is the default scaling mode.
   */
  SCALE: 'scale',
  /**
   * Resizes the canvas to fill the entire viewport.
   * This does not maintain the aspect ratio nor pixel
   * count (adds and removes pixels to fill size). If you
   * care about aspect ratio but not pixel count, consider
   * using 'fit' mode instead.
   */
  FILL: 'fill'});

/** @typedef {SizingModes[keyof SizingModes]} SizingMode */

/**
 * The supported containers to match to for canvas dimensions.
 */
const SizingModes = /** @type {const} */ ({
  /**
   * Sizes to the original canvas width and height.
   */
  NONE: 'none',
  /**
   * Sizes to 100% of parent container.
   */
  CONTAINER: 'container'});

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

const TEMPLATE_NODE = Symbol.for('templateNode');
const TEMPLATE_STYLE = Symbol.for('styleNode');

/**
 * A canvas wrapper to scale and stretch with respect to the aspect ratio to fill the viewport or container.
 */
class FlexCanvas extends HTMLElement {

  static define(name = 'flex-canvas') {
    window.customElements.define(name, this);
  }

  /** @private */
  static get [TEMPLATE_NODE]() {
    let t = document.createElement('template');
    t.innerHTML = INNER_HTML;
    Object.defineProperty(this, TEMPLATE_NODE, { value: t });
    return t;
  }

  /** @private */
  static get [TEMPLATE_STYLE]() {
    let t = document.createElement('style');
    t.innerHTML = INNER_STYLE;
    Object.defineProperty(this, TEMPLATE_STYLE, { value: t });
    return t;
  }

  /**
   * Override web component behavior.
   * @protected
   */
  static get observedAttributes() {
    return ['sizing', 'width', 'height'];
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
   * @returns {number}
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

  /**
   * @param {object} [opts]
   * @param {HTMLElement} [opts.root]
   * @param {SizingMode} [opts.sizing]
   * @param {number} [opts.width]
   * @param {number} [opts.height]
   * @param {number} [opts.aspectRatio]
   * @param {ScalingMode} [opts.forceScaling]
   */
  constructor(opts = undefined) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const constructor = /** @type {typeof FlexCanvas} */ (this.constructor);
    const templateNode = /** @type {HTMLTemplateElement} */ (
      // @ts-ignore
      constructor[TEMPLATE_NODE]
    );
    const styleNode = /** @type {HTMLStyleElement} */ (
      // @ts-ignore
      constructor[TEMPLATE_STYLE]
    );
    shadowRoot.appendChild(templateNode.content.cloneNode(true));
    shadowRoot.appendChild(styleNode.cloneNode(true));

    /**
     * @private
     * @type {SizingMode}
     */
    this._sizing = 'none';
    /** @private */
    this._width = DEFAULT_WIDTH;
    /** @private */
    this._height = DEFAULT_HEIGHT;

    /** @private */
    this.animationFrameHandle = 0;

    /**
     * @private
     * @readonly
     */
    this.resizeDelay = 0;
    /** @private */
    this.resizeTimeoutHandle = 0;
    /** @private */
    this.resizeCanvasWidth = 0;
    /** @private */
    this.resizeCanvasHeight = 0;

    /** @private */
    this.canvasSlotElement = /** @type {HTMLSlotElement} */ (
      shadowRoot.querySelector('slot')
    );
    /**
     * @private
     * @type {HTMLCanvasElement|null}
     */
    this.canvasElement = null;

    /** @private */
    this.onResize = this.onResize.bind(this);
    /** @private */
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    /** @private */
    this.onSlotChange = this.onSlotChange.bind(this);

    if (typeof opts !== 'undefined') {
      const hasFixedWidthOrHeight =
        typeof opts.width !== 'undefined' || typeof opts.height !== 'undefined';
      const hasFixedAspectRatio = typeof opts.aspectRatio !== 'undefined';
      if (hasFixedWidthOrHeight) {
        let width = Math.round(Number(opts.width));
        let height = Math.round(Number(opts.height));
        this.width = width;
        this.height = height;
        if (hasFixedAspectRatio) {
          // Verify the numbers match.
          let ar = Number(opts.aspectRatio);
          let expectedWidth = Math.round(height * ar);
          if (expectedWidth !== width) {
            throw new Error(
              'Flex canvas width and height dimensions did not match given' +
                ` aspect ratio '${ar}' - expected width to be ${expectedWidth} but was ${width}.`
            );
          }
        }
        if (!opts.forceScaling) {
          this.scaling = ScalingModes.SCALE;
        }
      } else if (hasFixedAspectRatio) {
        let ar = Number(opts.aspectRatio);
        let height = DEFAULT_HEIGHT;
        let expectedWidth = height * ar;
        this.width = expectedWidth;
        this.height = height;
        if (!opts.forceScaling) {
          this.scaling = ScalingModes.FIT;
        }
      } else if (!opts.forceScaling) {
        this.scaling = ScalingModes.FILL;
      }

      if (opts.forceScaling) {
        this.scaling = opts.forceScaling;
      }

      if (opts.sizing) {
        this.sizing = opts.sizing;
      } else if (!hasFixedAspectRatio) {
        this.sizing = SizingModes.NONE;
      } else {
        this.sizing = SizingModes.CONTAINER;
      }

      if (opts.root) {
        opts.root.appendChild(this);
      }
    }
  }

  /**
   * Override web component behavior.
   * @protected
   */
  connectedCallback() {
    upgradeProperty(this, 'scaling');
    upgradeProperty(this, 'sizing');
    upgradeProperty(this, 'width');
    upgradeProperty(this, 'height');

    // Scaling mode
    if (!this.hasAttribute('scaling')) {
      this.setAttribute('scaling', ScalingModes.SCALE);
    }

    // Allows this element to be focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.canvasSlotElement.addEventListener('slotchange', this.onSlotChange);
    if (!this.canvasElement) {
      let canvas = /** @type {HTMLCanvasElement} */ (
        this.canvasSlotElement.querySelector('canvas')
      );
      this.setCanvasElement(canvas);
    }
  }

  /**
   * Override web component behavior.
   * @protected
   */
  disconnectedCallback() {
    cancelAnimationFrame(this.animationFrameHandle);
    this.animationFrameHandle = 0;
    this.canvasSlotElement.removeEventListener('slotchange', this.onSlotChange);
  }

  /**
   * Override web component behavior.
   * @protected
   * @param {string} attribute
   * @param {string} _prev
   * @param {string} value
   */
  attributeChangedCallback(attribute, _prev, value) {
    switch (attribute) {
      case 'sizing':
        // @ts-ignore
        this._sizing = String(value);
        matchDimensionTo(this._sizing, this);
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
    }
  }

  /**
   * @private
   * @param {number} _now
   */
  onAnimationFrame(_now) {
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

    if (this.resizeDelay > 0) {
      if (!this.resizeTimeoutHandle) {
        this.resizeTimeoutHandle = window.setTimeout(
          this.onResize,
          this.resizeDelay
        );
      }
    } else {
      this.onResize();
    }
  }

  /** @private */
  onResize() {
    window.clearTimeout(this.resizeTimeoutHandle);
    this.resizeTimeoutHandle = 0;

    const canvas = this.canvasElement;
    if (!canvas) {
      return;
    }

    const scaling = this.scaling;
    resizeFor(scaling, this, canvas, this._width, this._height);
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
   * @template {keyof GetRenderingContext} T
   * @param {T} contextId
   * @param {GetRenderingContextOptions[T]} [options]
   * @returns {GetRenderingContext[T]}
   */
  getContext(contextId, options = undefined) {
    let result = this.canvasElement?.getContext(contextId, options);
    if (result && contextId === '2d') {
      // NOTE: Disable smoothing for pixel-perfect rendering.
      /** @type {CanvasRenderingContext2D} */ (result).imageSmoothingEnabled =
        false;
    }
    return /** @type {GetRenderingContext[T]} */ (result);
  }
}

/**
 * @typedef {'2d'|'webgl'|'webgl2'|'bitmaprenderer'} ContextId
 * @typedef {{
 *  '2d': CanvasRenderingContext2D,
 *  'webgl': WebGLRenderingContext,
 *  'webgl2': WebGL2RenderingContext,
 *  'bitmaprenderer': ImageBitmapRenderingContext
 * }} GetRenderingContext
 * @typedef {{
 *  '2d': CanvasRenderingContext2DSettings,
 *  'webgl': WebGLContextAttributes,
 *  'webgl2': WebGLContextAttributes,
 *  'bitmaprenderer': ImageBitmapRenderingContextSettings
 * }} GetRenderingContextOptions
 */

/**
 * @template {HTMLElement} T
 * @param {T} element
 * @param {keyof T} propertyName
 */
function upgradeProperty(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

FlexCanvas.define('flex-canvas');

export { FlexCanvas };
//# sourceMappingURL=index.js.map
