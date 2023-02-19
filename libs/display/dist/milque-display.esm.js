var INNER_HTML = "<div class=\"container\">\n  <label class=\"hidden\" id=\"title\">display-port</label>\n  <label class=\"hidden\" id=\"fps\">00</label>\n  <label class=\"hidden\" id=\"dimension\">0x0</label>\n  <div class=\"content\">\n    <canvas> Oh no! Your browser does not support canvas. </canvas>\n    <slot id=\"inner\"></slot>\n  </div>\n  <slot name=\"frame\"></slot>\n</div>\n";

var INNER_STYLE = ":host {\n  display: inline-block;\n  color: #555555;\n}\n\n.container {\n  display: flex;\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\n.content {\n  position: relative;\n  margin: auto;\n}\n\n.content > *:not(canvas) {\n  width: 100%;\n  height: 100%;\n}\n\ncanvas {\n  background: #000000;\n  image-rendering: pixelated;\n}\n\nlabel {\n  position: absolute;\n  font-family: monospace;\n  color: currentColor;\n}\n\n#inner {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n}\n\n#title {\n  left: 0.5rem;\n  top: 0.5rem;\n}\n\n#fps {\n  right: 0.5rem;\n  top: 0.5rem;\n}\n\n#dimension {\n  left: 0.5rem;\n  bottom: 0.5rem;\n}\n\n.hidden {\n  display: none;\n}\n\n:host([debug]) .container {\n  outline: 6px dashed rgba(0, 0, 0, 0.1);\n  outline-offset: -4px;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n:host([mode='noscale']) canvas {\n  margin: 0;\n  top: 0;\n  left: 0;\n}\n\n:host([mode='stretch']) canvas,\n:host([mode='scale']) canvas {\n  width: 100%;\n  height: 100%;\n}\n\n:host([mode='fit']),\n:host([mode='scale']),\n:host([mode='center']),\n:host([mode='stretch']),\n:host([mode='fill']) {\n  width: 100%;\n  height: 100%;\n}\n\n:host([full]) {\n  width: 100vw !important;\n  height: 100vh !important;\n}\n\n:host([disabled]) {\n  display: none;\n}\n\nslot {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n}\n\n::slotted(*) {\n  pointer-events: auto;\n}\n";

/**
 * No scaling is applied. The canvas size maintains a
 * 1:1 pixel ratio to the defined display dimensions.
 */
const MODE_NOSCALE = 'noscale';

/**
 * No scaling is applied, but the element fills the
 * entire viewport. The canvas size maintains a 1:1
 * pixel ratio to the defined display dimensions and
 * is centered inside the scaled element.
 */
const MODE_CENTER = 'center';

/**
 * Scales the canvas to fill the entire viewport and
 * maintains the same aspect ratio. This will adjust
 * canvas resolution to fit the viewport dimensions.
 * In other words, the canvas pixel size remains
 * constant, but the number of pixels in the canvas
 * will increase or decrease to compensate. This is
 * the default scaling mode.
 */
const MODE_FIT = 'fit';

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
const MODE_SCALE = 'scale';

/**
 * Resizes the canvas to fill the entire viewport.
 * This does not maintain the aspect ratio nor pixel
 * count (adds and removes pixels to fill size). If you
 * care about aspect ratio but not pixel count, consider
 * using 'fit' mode instead.
 */
const MODE_FILL = 'fill';

/**
 * Scales the canvas to fill the entire viewport.
 * This does not maintain the aspect ratio but
 * does preserve pixel count (by stretching the pixel
 * size). If you care about aspect ratio and pixel
 * count, consider using 'scale' mode instead.
 */
const MODE_STRETCH = 'stretch';

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

/** The default display scaling mode. */
const DEFAULT_MODE = MODE_FIT;

/** The default resize timeout */
const DELAYED_RESIZE_MILLIS = 200;

/**
 * @typedef {CustomEvent} FrameEvent
 * @property {number} detail.now
 * The current time in milliseconds.
 * @property {number} detail.prevTime
 * The previous frame time in milliseconds.
 * @property {number} detail.deltaTime
 * The time taken between the current and previous
 * frame in milliseconds.
 * @property {HTMLCanvasElement} detail.canvas
 * The canvas element.
 */

/**
 * @typedef {MODE_CENTER
 *          |MODE_FIT
 *          |MODE_NOSCALE
 *          |MODE_SCALE
 *          |MODE_FILL
 *          |MODE_STRETCH} DisplayScaling
 */

/**
 * A canvas that can scale and stretch with respect to the aspect ratio to fill
 * the viewport size.
 *
 * To start drawing, you should get the canvas context like so:
 *
 * For Canvas2D:
 * ```
 * const display = document.querySelector('display-port');
 * const ctx = display.canvas.getContext('2d');
 * ctx.drawText(0, 0, 'Hello World!');
 * ```
 *
 * For WebGL:
 * ```
 * const display = document.querySelector('display-port');
 * const gl = display.canvas.getContext('webgl');
 * gl.clear(gl.COLOR_BUFFER_BIT);
 * ```
 *
 * Usually, you would want to set the `width` and `height` attributes to define
 * the canvas size and aspect ratio in pixels. You can also change the scaling
 * behavior by setting the `mode` attribute.
 *
 * And for convenience, this element also dispatches a `frame` event every animation
 * frame (60 fps). This is basically the same as calling `requestAnimationFrame()`.
 *
 * NOTE: The viewport size is usually the parent container size. However, in the
 * rare case the element must be nested in a child container, you can define the
 * boolean attribute `full` to force the dimensions to be the actual window size.
 */
class DisplayPort extends HTMLElement {

  /**
   * @param {object} [opts]
   * @param {HTMLElement} [opts.root]
   * @param {string} [opts.id]
   * @param {DisplayScaling} [opts.mode]
   * @param {number} [opts.width]
   * @param {number} [opts.height]
   * @param {boolean} [opts.debug]
   */
  static create(opts = {}) {
    const {
      root = document.body,
      id = undefined,
      mode = DEFAULT_MODE,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      debug = false
    } = opts || {};
    let result = new DisplayPort();
    result.id = id;
    result.mode = mode;
    result.width = width;
    result.height = height;
    result.debug = debug;
    root.appendChild(result);
    return result;
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

  static define(customElements = window.customElements) {
    customElements.define('display-port', this);
  }

  /**
   * @protected
   * Override for web component.
   */
  static get observedAttributes() {
    return [
      'debug',
      'disabled',
      // 'mode',
      'width',
      'height',
      'onframe',
      // Built-in attributes
      'id',
      'class',
    ];
  }

  /**
   * The scaling mode.
   * - `noscale`: Do not perform scaling.
   * - `center`: Do not perform scaling but stretch the display to fill the entire
   * viewport. The unscaled canvas is centered.
   * - `fit`: Resize resolution to fill the entire viewport and maintains the aspect
   * ratio. The pixel resolution is changed. This is the default behavior.
   * - `fill`: Resize resolution to fill the entire viewport but does not maintain
   * aspect ratio.
   * - `stretch`: Perform scaling to fill the entire viewport but does not maintain
   * aspect ratio.
   * - `scale`: Perform scaling to fill the entire viewport and maintains the
   * aspect ratio and resolution. The pixel resolution remains constant.
   * @returns {DisplayScaling} The current scaling mode.
   */
  get mode() {
    return /** @type {DisplayScaling} */ (this.getAttribute('mode'));
  }

  set mode(value) {
    this.setAttribute('mode', value);
  }

  /**
   * Set to true for debug information.
   * @returns {boolean}
   */
  get debug() {
    return this._debug;
  }

  set debug(value) {
    this.toggleAttribute('debug', value);
  }

  /**
   * If disabled, animation frames will not fire.
   * @returns {boolean}
   */
  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this.toggleAttribute('disabled', value);
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

  /** Fired every animation frame. */
  get onframe() {
    return this._onframe;
  }

  set onframe(value) {
    if (this._onframe) this.removeEventListener('frame', this._onframe);
    this._onframe = value;
    if (this._onframe) this.addEventListener('frame', value);
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

    /** @private */
    this._canvasElement = shadowRoot.querySelector('canvas');
    /**
     * @private
     * @type {HTMLDivElement}
     */
    this._contentElement = shadowRoot.querySelector('.content');
    /**
     * @private
     * @type {HTMLSlotElement}
     */
    this._innerElement = shadowRoot.querySelector('#inner');

    /** @private */
    this._titleElement = shadowRoot.querySelector('#title');
    /** @private */
    this._fpsElement = shadowRoot.querySelector('#fps');
    /** @private */
    this._dimensionElement = shadowRoot.querySelector('#dimension');

    /** @private */
    this._debug = false;
    /** @private */
    this._disabled = false;
    /** @private */
    this._width = DEFAULT_WIDTH;
    /** @private */
    this._height = DEFAULT_HEIGHT;
    /** @private */
    this._onframe = undefined;

    /** @private */
    this._animationRequestHandle = 0;
    /** @private */
    this._prevAnimationFrameTime = 0;

    /** @private */
    this._resizeTimeoutHandle = 0;
    /** @private */
    this._resizeCanvasWidth = 0;
    /** @private */
    this._resizeCanvasHeight = 0;

    /** @private */
    this._frameEvent = new CustomEvent('frame', {
      composed: true,
      bubbles: false,
      detail: {
        now: 0,
        prevTime: 0,
        deltaTime: 0,
        canvas: this._canvasElement,
      },
    });
    /** @private */
    this._resizeEvent = new CustomEvent('resize', {
      composed: true,
      bubbles: false,
      detail: {
        width: 0,
        height: 0,
      },
    });

    /** @private */
    this.update = this.update.bind(this);
    /** @private */
    this.onDelayCanvasResize = this.onDelayCanvasResize.bind(this);
  }

  /** Get the canvas element. */
  get canvas() {
    return this._canvasElement;
  }

  /**
   * @protected
   * Override for web component.
   */
  connectedCallback() {
    upgradeProperty(this, 'mode');
    upgradeProperty(this, 'debug');
    upgradeProperty(this, 'disabled');
    upgradeProperty(this, 'width');
    upgradeProperty(this, 'height');
    upgradeProperty(this, 'onframe');

    if (!this.hasAttribute('mode')) {
      this.setAttribute('mode', DEFAULT_MODE);
    }

    // Allows this element to be focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.updateCanvasSize(true);
    this.resume();
  }

  /**
   * @protected
   * Override for web component.
   */
  disconnectedCallback() {
    this.pause();
  }

  /**
   * @protected
   * Override for web component.
   */
  attributeChangedCallback(attribute, prev, value) {
    switch (attribute) {
      case 'debug':
        {
          this._debug = value !== null;
        }
        break;
      case 'disabled':
        {
          this._disabled = value !== null;
        }
        break;
      case 'width':
        {
          this._width = Number(value);
        }
        break;
      case 'height':
        {
          this._height = Number(value);
        }
        break;
      case 'onframe':
        {
          this.onframe = new Function(
            'event',
            'with(document){with(this){' + value + '}}'
          ).bind(this);
        }
        break;
    }

    switch (attribute) {
      case 'disabled':
        if (value) {
          this.update(0);
          this.pause();
        } else {
          this.resume();
        }
        break;
      // NOTE: For debugging purposes...
      case 'id':
      case 'class':
        this._titleElement.innerHTML = `display-port${
          this.className ? '.' + this.className : ''
        }${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
        break;
      case 'debug':
        this._titleElement.classList.toggle('hidden', value);
        this._fpsElement.classList.toggle('hidden', value);
        this._dimensionElement.classList.toggle('hidden', value);
        break;
    }
  }

  /**
   * @param {'2d'|'webgl'|'webgl2'} [contextId]
   * @param {CanvasRenderingContext2DSettings} [options]
   */
  getContext(contextId = '2d', options = undefined) {
    return this._canvasElement.getContext(contextId, options);
  }

  /** Pause animation of the display frames. */
  pause() {
    window.cancelAnimationFrame(this._animationRequestHandle);
  }

  /** Resume animation of the display frames. */
  resume() {
    this._animationRequestHandle = window.requestAnimationFrame(this.update);
  }

  /** @private */
  update(now) {
    this._animationRequestHandle = window.requestAnimationFrame(this.update);
    this.updateCanvasSize(false);
    const deltaTime = now - this._prevAnimationFrameTime;
    this._prevAnimationFrameTime = now;

    // NOTE: For debugging purposes...
    if (this._debug) {
      // Update FPS...
      const frames =
        deltaTime <= 0
          ? '--'
          : String(Math.round(1000 / deltaTime)).padStart(2, '0');
      if (this._fpsElement.textContent !== frames) {
        this._fpsElement.textContent = frames;
      }

      // Update dimensions...
      const mode = this.mode;
      if (mode === MODE_NOSCALE) {
        let result = `${this._width}x${this._height}`;
        if (this._dimensionElement.textContent !== result) {
          this._dimensionElement.textContent = result;
        }
      } else {
        let result = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
        if (this._dimensionElement.textContent !== result) {
          this._dimensionElement.textContent = result;
        }
      }
    }

    let event = this._frameEvent;
    let detail = event.detail;
    detail.now = now;
    detail.prevTime = this._prevAnimationFrameTime;
    detail.deltaTime = deltaTime;
    this.dispatchEvent(this._frameEvent);
  }

  /** @private */
  onDelayCanvasResize() {
    this._resizeTimeoutHandle = null;
    this.updateCanvasSize(true);
  }

  delayCanvasResize(canvasWidth, canvasHeight) {
    if (
      canvasWidth !== this._resizeCanvasWidth ||
      canvasHeight !== this._resizeCanvasHeight
    ) {
      // Only call onDelayCanvasResize, if new canvas size actually changed since last time.
      this._resizeCanvasWidth = canvasWidth;
      this._resizeCanvasHeight = canvasHeight;
      if (this._resizeTimeoutHandle) {
        window.clearTimeout(this._resizeTimeoutHandle);
      }
      this._resizeTimeoutHandle = window.setTimeout(
        this.onDelayCanvasResize,
        DELAYED_RESIZE_MILLIS
      );
    }
  }

  /** @private */
  updateCanvasSize(force = true) {
    const clientRect = this.shadowRoot.host.getBoundingClientRect();
    const clientWidth = clientRect.width;
    const clientHeight = clientRect.height;

    let canvas = this._canvasElement;
    let canvasWidth = this._width;
    let canvasHeight = this._height;

    const mode = this.mode;
    if (mode === MODE_STRETCH || mode === MODE_FILL) {
      canvasWidth = clientWidth;
      canvasHeight = clientHeight;
    } else if (mode !== MODE_NOSCALE) {
      if (
        clientWidth < canvasWidth ||
        clientHeight < canvasHeight ||
        mode === MODE_FIT ||
        mode == MODE_SCALE
      ) {
        let ratioX = clientWidth / canvasWidth;
        let ratioY = clientHeight / canvasHeight;

        if (ratioX < ratioY) {
          canvasWidth = clientWidth;
          canvasHeight = canvasHeight * ratioX;
        } else {
          canvasWidth = canvasWidth * ratioY;
          canvasHeight = clientHeight;
        }
      }
    }

    canvasWidth = Math.floor(canvasWidth);
    canvasHeight = Math.floor(canvasHeight);

    if (typeof force === 'undefined') {
      force =
        canvas.clientWidth !== canvasWidth ||
        canvas.clientHeight !== canvasHeight;
    }

    if (!force) {
      this.delayCanvasResize(canvasWidth, canvasHeight);
      return;
    }

    let fontSize =
      Math.min(canvasWidth / this._width, canvasHeight / this._height) * 0.5;
    // NOTE: Update the inner container for the default slotted children.
    // To anchor children outside the canvas, use the slot named 'frame'.
    this._innerElement.style.fontSize = `font-size: ${fontSize}em`;
    if (force) {
      if (mode === MODE_SCALE) {
        canvas.width = this._width;
        canvas.height = this._height;
      } else if (mode !== MODE_STRETCH) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
      let contentStyle = this._contentElement.style;
      contentStyle.width = `${canvasWidth}px`;
      contentStyle.height = `${canvasHeight}px`;

      if (mode === MODE_FIT || mode === MODE_FILL) {
        this._width = canvasWidth;
        this._height = canvasHeight;
      }

      let event = this._resizeEvent;
      let detail = event.detail;
      detail.width = canvasWidth;
      detail.height = canvasHeight;
      this.dispatchEvent(this._resizeEvent);
    }
  }
}
DisplayPort.define();

function upgradeProperty(element, propertyName) {
  if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
    let value = element[propertyName];
    delete element[propertyName];
    element[propertyName] = value;
  }
}

export { DisplayPort, MODE_CENTER, MODE_FILL, MODE_FIT, MODE_NOSCALE, MODE_SCALE, MODE_STRETCH };
//# sourceMappingURL=milque-display.esm.js.map
