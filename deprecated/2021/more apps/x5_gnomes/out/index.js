
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (glMatrix) {
  'use strict';

  var INNER_HTML = "<div class=\"container\">\n    <label class=\"hidden\" id=\"title\">display-port</label>\n    <label class=\"hidden\" id=\"fps\">00</label>\n    <label class=\"hidden\" id=\"dimension\">0x0</label>\n    <div class=\"content\">\n        <canvas>\n            Oh no! Your browser does not support canvas.\n        </canvas>\n        <slot id=\"inner\"></slot>\n    </div>\n    <slot name=\"frame\"></slot>\n</div>";
  var INNER_STYLE = ":host{display:inline-block;color:#555}.container{display:flex;position:relative;width:100%;height:100%}.content{position:relative;margin:auto}.content>*{width:100%;height:100%}canvas{background:#000;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated}label{font-family:monospace;color:currentColor}#inner,label{position:absolute}#inner{display:flex;flex-direction:column;align-items:center;justify-content:center;top:0;left:0;pointer-events:none}#title{left:.5rem;top:.5rem}#fps{right:.5rem;top:.5rem}#dimension{left:.5rem;bottom:.5rem}.hidden{display:none}:host([debug]) .container{outline:6px dashed rgba(0,0,0,.1);outline-offset:-4px;background-color:rgba(0,0,0,.1)}:host([mode=noscale]) canvas{margin:0;top:0;left:0}:host([mode=center]),:host([mode=fit]),:host([mode=pixelfit]),:host([mode=stretch]){width:100%;height:100%}:host([full]){width:100vw!important;height:100vh!important}:host([disabled]){display:none}slot{display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}::slotted(*){pointer-events:auto}";
  /**
   * No scaling is applied. The canvas size maintains a 1:1 pixel ratio to the defined
   * display dimensions.
   */

  const MODE_NOSCALE = 'noscale';
  /**
   * Scales the canvas to fill the entire viewport and maintains the same aspect ratio.
   * This will adjust canvas resolution to fit the viewport dimensions. In other words,
   * the canvas pixel size remains constant, but the number of pixels in the canvas will
   * increase or decrease to compensate. This is the default scaling mode.
   */

  const MODE_FIT = 'fit';
  /**
   * Scales the canvas to fill the entire viewport and maintains the same aspect ratio
   * and pixel resolution. This will upscale and downscale the pixel size depending on
   * the viewport dimentions in order to preserve the canvas pixel count. In other words,
   * the number of pixels in the canvas remain constant but appear larger or smaller to
   * compensate.
   */

  const MODE_PIXELFIT = 'pixelfit';
  /**
   * Scales the canvas to fill the entire viewport. This does not maintain the aspect
   * ratio. If you care about aspect ratio, consider using 'fit' mode instead.
   */

  const MODE_STRETCH = 'stretch'; // The default display dimensions. This is the same as the canvas element default.

  const DEFAULT_WIDTH = 300;
  const DEFAULT_HEIGHT = 150; // The default display scaling mode.

  const DEFAULT_MODE = MODE_FIT;
  /**
   * @typedef {CustomEvent} FrameEvent
   * @property {number} detail.now The current time in milliseconds.
   * @property {number} detail.prevTime The previous frame time in milliseconds.
   * @property {number} detail.deltaTime The time taken between the current and previous frame in milliseconds.
   * @property {HTMLCanvasElement} detail.canvas The canvas element.
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
    /** Generated by cuttle.js */
    static get [Symbol.for("cuttleTemplate")]() {
      let t = document.createElement("template");
      t.innerHTML = INNER_HTML;
      Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
        value: t
      });
      return t;
    }
    /** Generated by cuttle.js */


    static get [Symbol.for("cuttleStyle")]() {
      let s = document.createElement("style");
      s.innerHTML = INNER_STYLE;
      Object.defineProperty(this, Symbol.for("cuttleStyle"), {
        value: s
      });
      return s;
    }
    /** @override */


    static get observedAttributes() {
      return ["onframe", "width", "height", "disabled", "debug", 'id', 'class'];
    }

    static get properties() {
      return {
        /** The canvas width in pixels. This determines the aspect ratio and canvas buffer size. */
        width: Number,

        /** The canvas height in pixels. This determines the aspect ratio and canvas buffer size. */
        height: Number,

        /** If disabled, animation frames will not fire. */
        disabled: Boolean,

        /** Enable for debug information. */
        debug: Boolean,

        /**
         * The scaling mode.
         * - `noscale`: Does not perform scaling. This is effectively the same as a regular
         * canvas.
         * - `center`: Does not perform scaling but stretches the display to fill the entire
         * viewport. The unscaled canvas is centered.
         * - `fit`: Performs scaling to fill the entire viewport and maintains the aspect
         * ratio. The pixel resolution changes to match. This is the default behavior.
         * - `stretch`: Performs scaling to fill the entire viewport but does not maintain
         * aspect ratio.
         * - `pixelfit`: Performs scaling to fill the entire viewport and maintains the
         * aspect ratio and resolution. The pixel resolution remains constant.
         */
        mode: {
          type: String,
          value: DEFAULT_MODE,
          observed: false
        }
      };
    }
    /**
                 * The scaling mode.
                 * - `noscale`: Does not perform scaling. This is effectively the same as a regular
                 * canvas.
                 * - `center`: Does not perform scaling but stretches the display to fill the entire
                 * viewport. The unscaled canvas is centered.
                 * - `fit`: Performs scaling to fill the entire viewport and maintains the aspect
                 * ratio. The pixel resolution changes to match. This is the default behavior.
                 * - `stretch`: Performs scaling to fill the entire viewport but does not maintain
                 * aspect ratio.
                 * - `pixelfit`: Performs scaling to fill the entire viewport and maintains the
                 * aspect ratio and resolution. The pixel resolution remains constant.
                 */


    get mode() {
      return this.getAttribute("mode");
    }

    set mode(value) {
      this.setAttribute("mode", value);
    }
    /** Enable for debug information. */


    get debug() {
      return this._debug;
    }

    set debug(value) {
      this.toggleAttribute("debug", value);
    }
    /** If disabled, animation frames will not fire. */


    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this.toggleAttribute("disabled", value);
    }
    /** The canvas height in pixels. This determines the aspect ratio and canvas buffer size. */


    get height() {
      return this._height;
    }

    set height(value) {
      this.setAttribute("height", String(value));
    }
    /** The canvas width in pixels. This determines the aspect ratio and canvas buffer size. */


    get width() {
      return this._width;
    }

    set width(value) {
      this.setAttribute("width", String(value));
    }

    static get customEvents() {
      return [
      /** Fired every animation frame. */
      'frame'];
    }
    /** Fired every animation frame. */


    get onframe() {
      return this._onframe;
    }

    set onframe(value) {
      if (this._onframe) this.removeEventListener("frame", this._onframe);
      this._onframe = value;
      if (this._onframe) this.addEventListener("frame", value);
    }

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
      /** @private */

      this._canvasElement = this.shadowRoot.querySelector('canvas');
      /** @private */

      this._contentElement = this.shadowRoot.querySelector('.content');
      /** @private */

      this._innerElement = this.shadowRoot.querySelector('#inner');
      /** @private */

      this._titleElement = this.shadowRoot.querySelector('#title');
      /** @private */

      this._fpsElement = this.shadowRoot.querySelector('#fps');
      /** @private */

      this._dimensionElement = this.shadowRoot.querySelector('#dimension');
      /** @private */

      this._animationRequestHandle = 0;
      /** @private */

      this._prevAnimationFrameTime = 0;
      /** @private */

      this._width = DEFAULT_WIDTH;
      /** @private */

      this._height = DEFAULT_HEIGHT;
      /** @private */

      this.update = this.update.bind(this);
    }
    /** Get the canvas element. */


    get canvas() {
      return this._canvasElement;
    }
    /** @override */


    connectedCallback() {
      if (Object.prototype.hasOwnProperty.call(this, "onframe")) {
        let value = this.onframe;
        delete this.onframe;
        this.onframe = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "width")) {
        let value = this.width;
        delete this.width;
        this.width = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "height")) {
        let value = this.height;
        delete this.height;
        this.height = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "disabled")) {
        let value = this.disabled;
        delete this.disabled;
        this.disabled = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "debug")) {
        let value = this.debug;
        delete this.debug;
        this.debug = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "mode")) {
        let value = this.mode;
        delete this.mode;
        this.mode = value;
      }

      if (!this.hasAttribute("mode")) {
        this.setAttribute("mode", DEFAULT_MODE);
      } // Allows this element to be focusable


      if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
      this.updateCanvasSize();
      this.resume();
    }
    /** @override */


    disconnectedCallback() {
      this.pause();
    }
    /** @override */


    attributeChangedCallback(attribute, prev, value) {
      /** Generated by cuttle.js */
      switch (attribute) {
        case "width":
          {
            this._width = Number(value);
          }
          break;

        case "height":
          {
            this._height = Number(value);
          }
          break;

        case "disabled":
          {
            this._disabled = value !== null;
          }
          break;

        case "debug":
          {
            this._debug = value !== null;
          }
          break;

        case "onframe":
          {
            this.onframe = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
          }
          break;
      }

      ((attribute, prev, value) => {
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
            this._titleElement.innerHTML = `display-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
            break;

          case 'debug':
            this._titleElement.classList.toggle('hidden', value);

            this._fpsElement.classList.toggle('hidden', value);

            this._dimensionElement.classList.toggle('hidden', value);

            break;
        }
      })(attribute, prev, value);
    }
    /** Pause animation of the display frames. */


    pause() {
      cancelAnimationFrame(this._animationRequestHandle);
    }
    /** Resume animation of the display frames. */


    resume() {
      this._animationRequestHandle = requestAnimationFrame(this.update);
    }
    /** @private */


    update(now) {
      this._animationRequestHandle = requestAnimationFrame(this.update);
      this.updateCanvasSize();
      const deltaTime = now - this._prevAnimationFrameTime;
      this._prevAnimationFrameTime = now; // NOTE: For debugging purposes...

      if (this.debug) {
        // Update FPS...
        const frames = deltaTime <= 0 ? '--' : String(Math.round(1000 / deltaTime)).padStart(2, '0');

        if (this._fpsElement.textContent !== frames) {
          this._fpsElement.textContent = frames;
        } // Update dimensions...


        if (this.mode === MODE_NOSCALE) {
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

      this.dispatchEvent(new CustomEvent('frame', {
        detail: {
          now,
          prevTime: this._prevAnimationFrameTime,
          deltaTime: deltaTime,
          canvas: this._canvasElement
        },
        bubbles: false,
        composed: true
      }));
    }
    /** @private */


    updateCanvasSize() {
      let clientRect = this.shadowRoot.host.getBoundingClientRect();
      const clientWidth = clientRect.width;
      const clientHeight = clientRect.height;
      let canvas = this._canvasElement;
      let canvasWidth = this._width;
      let canvasHeight = this._height;
      const mode = this.mode;

      if (mode === MODE_STRETCH) {
        canvasWidth = clientWidth;
        canvasHeight = clientHeight;
      } else if (mode !== MODE_NOSCALE) {
        let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT || mode == MODE_PIXELFIT;

        if (flag) {
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
      let fontSize = Math.min(canvasWidth / this._width, canvasHeight / this._height) * 0.5; // NOTE: Update the inner container for the default slotted children.
      // To anchor children outside the canvas, use the slot named 'frame'.

      this._innerElement.style = `font-size: ${fontSize}em`;

      if (canvas.clientWidth !== canvasWidth || canvas.clientHeight !== canvasHeight) {
        if (mode === MODE_PIXELFIT) {
          canvas.width = this._width;
          canvas.height = this._height;
        } else {
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
        }

        this._contentElement.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;
        this.dispatchEvent(new CustomEvent('resize', {
          detail: {
            width: canvasWidth,
            height: canvasHeight
          },
          bubbles: false,
          composed: true
        }));
      }
    }

  }

  window.customElements.define('display-port', DisplayPort);

  /**
   * An enum for input types.
   * 
   * @readonly
   * @enum {number}
   */
  const InputType = {
    NULL: 0,
    KEY: 1,
    POS: 2,
    WHEEL: 3
  };
  /**
   * An enum for input events.
   * 
   * @readonly
   * @enum {number}
   */

  const InputEventCode = {
    NULL: 0,
    DOWN: 1,
    UP: 2,
    MOVE: 3,

    parse(string) {
      if (typeof string === 'string') {
        switch (string.toLowerCase()) {
          case 'down':
            return InputEventCode.DOWN;

          case 'up':
            return InputEventCode.UP;

          case 'move':
            return InputEventCode.MOVE;

          default:
            return InputEventCode.NULL;
        }
      } else {
        return InputEventCode.NULL;
      }
    }

  };
  const WILDCARD_KEY_MATCHER = '*';
  /**
   * @typedef InputEvent
   * @property {EventTarget} target
   * @property {string} deviceName
   * @property {string} keyCode
   * @property {InputEventCode} event
   * @property {InputType} type
   * @property {number} [value] If type is `key`, it is defined to be the input
   * value of the triggered event (usually this is 1). Otherwise, it is undefined.
   * @property {boolean} [control] If type is `key`, it is defined to be true if
   * any control key is down (false if up). Otherwise, it is undefined.
   * @property {boolean} [shift] If type is `key`, it is defined to be true if
   * any shift key is down (false if up). Otherwise, it is undefined.
   * @property {boolean} [alt] If type is `key`, it is defined to be true if any
   * alt key is down (false if up). Otherwise, it is undefined.
   * @property {number} [x] If type is `pos`, it is defined to be the x value
   * of the position event. Otherwise, it is undefined.
   * @property {number} [y] If type is `pos`, it is defined to be the y value
   * of the position event. Otherwise, it is undefined.
   * @property {number} [dx] If type is `pos` or `wheel`, it is defined to be
   * the change in the x value from the previous to the current position.
   * Otherwise, it is undefined.
   * @property {number} [dy] If type is `pos` or `wheel`, it is defined to be
   * the change in the y value from the previous to the current position.
   * Otherwise, it is undefined.
   * @property {number} [dz] If type is `wheel`, it is defined to be the change
   * in the z value from the previous to the current position. Otherwise, it
   * is undefined.
   * 
   * @callback InputDeviceListener
   * @param {InputEvent} e
   * @returns {boolean} Whether to consume the input after all other
   * listeners had a chance to handle the event.
   */

  /** Represents an input device. */

  class InputDevice {
    /** @abstract */
    static isAxis(keyCode) {
      return false;
    }
    /** @abstract */


    static isButton(keyCode) {
      return false;
    }

    constructor(deviceName, eventTarget) {
      this.deviceName = deviceName;
      this.eventTarget = eventTarget;
      /** @private */

      this.listeners = {};
    }

    destroy() {
      /** @private */
      this.listeners = {};
    }
    /**
     * @param {string} keyMatcher
     * @param {InputDeviceListener} listener
     */


    addInputListener(keyMatcher, listener) {
      let inputListeners = this.listeners[keyMatcher];

      if (!inputListeners) {
        inputListeners = [listener];
        this.listeners[keyMatcher] = inputListeners;
      } else {
        inputListeners.push(listener);
      }
    }
    /**
     * @param {string} keyMatcher
     * @param {InputDeviceListener} listener
     */


    removeInputListener(keyMatcher, listener) {
      let inputListeners = this.listeners[keyMatcher];

      if (inputListeners) {
        inputListeners.indexOf(listener);
        inputListeners.splice(listener, 1);
      }
    }
    /**
     * @param {InputEvent} e
     * @returns {boolean} Whether the input event should be consumed.
     */


    dispatchInput(e) {
      const {
        keyCode
      } = e;
      const listeners = this.listeners[keyCode];
      let flag = 0;

      if (listeners) {
        // KeyCode listeners
        for (let listener of listeners) {
          flag |= listener(e);
        }

        return Boolean(flag);
      } // Wildcard listeners


      for (let listener of this.listeners[WILDCARD_KEY_MATCHER]) {
        flag |= listener(e);
      }

      return Boolean(flag);
    }

  }
  /**
   * @typedef AdapterInput
   * @property {Function} update
   * @property {Function} poll
   * @property {Function} reset
   * 
   * @typedef Adapter
   * @property {AdapterInput} target
   * @property {Number} adapterId
   * @property {String} deviceName
   * @property {String} keyCode
   * @property {Number} scale
   * @property {Number} eventCode
   */


  const WILDCARD_DEVICE_MATCHER = '*';

  class AdapterManager {
    /**
     * Creates a new adapter for the given values.
     * 
     * @param {AdapterInput} target The target callback to update the value.
     * @param {Number} adapterId The adapter id (unique within the target).
     * @param {String} deviceName The name of the device to listen to.
     * @param {String} keyCode The key code to listen to.
     * @param {Number} scale The input value multiplier.
     * @param {Number} eventCode The event code to listen for.
     * @returns {Adapter} The new adapter.
     */
    static createAdapter(target, adapterId, deviceName, keyCode, scale, eventCode) {
      return {
        target,
        adapterId,
        deviceName,
        keyCode,
        scale,
        eventCode
      };
    }

    constructor() {
      /** @private */
      this.adapters = {
        [WILDCARD_DEVICE_MATCHER]: createKeyCodeMap()
      };
    }
    /**
     * @param {Array<Adapter>} adapters 
     */


    add(adapters) {
      for (let adapter of adapters) {
        const {
          deviceName,
          keyCode
        } = adapter;
        let adapterMap;

        if (!(deviceName in this.adapters)) {
          adapterMap = createKeyCodeMap();
          this.adapters[deviceName] = adapterMap;
        } else {
          adapterMap = this.adapters[deviceName];
        }

        if (keyCode in adapterMap) {
          adapterMap[keyCode].push(adapter);
        } else {
          adapterMap[keyCode] = [adapter];
        }
      }
    }
    /**
     * @param {Array<Adapter>} adapters
     */


    delete(adapters) {
      for (let adapter of adapters) {
        const {
          deviceName,
          keyCode
        } = adapter;

        if (deviceName in this.adapters) {
          let adapterMap = this.adapters[deviceName];

          if (keyCode in adapterMap) {
            let list = adapterMap[keyCode];
            let index = list.indexOf(adapter);

            if (index >= 0) {
              list.splice(index, 1);
            }
          }
        }
      }
    }

    clear() {
      for (let deviceName in this.adapters) {
        this.adapters[deviceName] = createKeyCodeMap();
      }
    }

    poll(deviceName, keyCode, input) {
      const adapters = this.findAdapters(deviceName, keyCode);

      for (let adapter of adapters) {
        const eventCode = adapter.eventCode;

        if (eventCode === InputEventCode.NULL) {
          const {
            target,
            scale
          } = adapter;
          const nextValue = input.value * scale;
          target.poll(nextValue, adapter);
        } else {
          const {
            target,
            scale
          } = adapter;
          const nextValue = input.getEvent(eventCode) * scale;
          target.poll(nextValue, adapter);
        }
      }

      return adapters.length > 0;
    }

    update(deviceName, keyCode, input) {
      let flag = false;

      for (let adapter of this.findAdapters(deviceName, keyCode)) {
        const eventCode = adapter.eventCode;

        if (eventCode !== InputEventCode.NULL) {
          const {
            target,
            scale
          } = adapter;
          const nextValue = input.getEvent(eventCode) * scale;
          target.update(nextValue, adapter);
          flag = true;
        }
      }

      return flag;
    }

    reset(deviceName, keyCode, input) {
      let flag = false;

      for (let adapter of this.findAdapters(deviceName, keyCode)) {
        adapter.target.reset();
        flag = true;
      }

      return flag;
    }
    /**
     * Find all adapters for the given device and key code.
     * 
     * @param {String} deviceName The name of the target device.
     * @param {String} keyCode The target key code.
     * @returns {Array<Adapter>} The associated adapters for the device and key code.
     */


    findAdapters(deviceName, keyCode) {
      let result = [];

      if (deviceName in this.adapters) {
        let adapterMap = this.adapters[deviceName];
        if (keyCode in adapterMap) result.push(...adapterMap[keyCode]);
        result.push(...adapterMap[WILDCARD_KEY_MATCHER]);
      }

      let wildMap = this.adapters[WILDCARD_DEVICE_MATCHER];
      if (keyCode in wildMap) result.push(...wildMap[keyCode]);
      result.push(...wildMap[WILDCARD_KEY_MATCHER]);
      return result;
    }

  }

  function createKeyCodeMap() {
    return {
      [WILDCARD_KEY_MATCHER]: []
    };
  }
  /**
   * @typedef {import('../device/InputDevice.js').InputEventCode} InputEventCode
   */

  /**
   * A class to represent the basic input interface.
   */


  class Input {
    constructor() {
      /** The current state of the input. */
      this.value = 0;
      /** The previous state (after poll) of the input. */

      this.prev = 0; // TODO: Do we need a next? How do you tell if the update is a PRESS vs a HOLD?
    }

    update(value) {
      this.value = value;
    }

    poll() {
      this.prev = this.value;
      this.value = 0;
    }
    /**
     * @param {InputEventCode} eventCode
     * @returns {number} The event state.
     */


    getEvent(eventCode) {
      return 0;
    }

    getState() {
      return this.value;
    }

    getPrevState() {
      return this.prev;
    }

  }
  /**
   * A stateful input for axis input interfaces, such as mouse positions,
   * scrolling, joysticks, etc. The unscaled `value` is a floating point
   * in a 1-dimensional range of [-1, 1]. It also keeps track of the
   * accumulated delta since last poll with `delta`.
   */


  class Axis extends Input {
    constructor() {
      super();
      this.delta = 0;
      /** @private */

      this.next = {
        delta: 0
      };
    }
    /** @override */


    update(value, delta) {
      this.value = value;
      this.next.delta += delta;
    }
    /** @override */


    poll() {
      // Update previous state.
      this.prev = this.value; // Update current state.

      this.delta = this.next.delta;
      this.next.delta = 0;
    }
    /** @override */


    getEvent(eventCode) {
      switch (eventCode) {
        case InputEventCode.MOVE:
          return this.delta;

        default:
          return super.getEvent(eventCode);
      }
    }

  }
  /**
   * A stateful input for button input interfaces, such as keyboard
   * buttons, mouse buttons, etc. The unscaled `value` is either
   * 1 or 0. If truthy, this indicates that it is currently
   * being held down, and 0 indicates the opposite. It also keeps
   * track of this state as a boolean with `down` and `up`.
   */


  class Button extends Input {
    constructor() {
      super();
      /** Whether the button is just pressed. Is updated on poll(). */

      this.down = false;
      /** Whether the button is just released. Is updated on poll(). */

      this.up = false;
      /** @private */

      this.next = {
        down: false,
        up: false
      };
    }
    /** @override */


    update(value) {
      if (value) {
        this.next.down = true;
      } else {
        this.next.up = true;
      }
    }
    /** @override */


    poll() {
      // Update previous state.
      this.prev = this.value; // Poll current state.

      const {
        up: nextUp,
        down: nextDown
      } = this.next;

      if (this.value) {
        if (this.up && !nextUp) {
          this.value = 0;
        }
      } else if (nextDown) {
        this.value = 1;
      }

      this.down = nextDown;
      this.up = nextUp;
      this.next.down = false;
      this.next.up = false;
    }
    /** @override */


    getEvent(eventCode) {
      switch (eventCode) {
        case InputEventCode.DOWN:
          return this.down & 1;

        case InputEventCode.UP:
          return this.up & 1;

        default:
          return super.getEvent(eventCode);
      }
    }

  }
  /**
   * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
   * @typedef {import('../input/Input.js').Input} Input
   */

  /**
   * @typedef {'update'|'poll'|'input'} InputSourceEventTypes
   * 
   * @typedef InputSourceInputEvent
   * @property {InputSourceEventStage} stage
   * @property {string} deviceName
   * @property {string} keyCode
   * @property {Axis|Button|Input} input
   * 
   * @typedef InputSourcePollEvent
   * @property {number} now
   * 
   * @callback InputSourceEventListener
   * @param {InputSourceInputEvent|InputSourcePollEvent} e
   * 
   * @typedef KeyMapEntry
   * @property {number} refs The number of active references to this key.
   * @property {Axis|Button|Input} input The input object.
   */

  /**
   * @readonly
   * @enum {number}
   */


  const InputSourceEventStage = {
    NULL: 0,
    UPDATE: 1,
    POLL: 2
  };
  /**
   * A class to model the current input state with buttons and axes for devices.
   */

  class InputSourceState {
    constructor(deviceList = []) {
      /** @private */
      this.onInputEvent = this.onInputEvent.bind(this);
      /** @private */

      this.onAnimationFrame = this.onAnimationFrame.bind(this);
      /** @type {Record<string, InputDevice>} */

      let deviceMap = {};
      /** @type {Record<string, Record<string, KeyMapEntry>>} */

      let keyMap = {};

      for (let device of deviceList) {
        const deviceName = device.deviceName;

        if (deviceName in deviceMap) {
          throw new Error(`Another device with name '${deviceName}' already exists.`);
        }

        deviceMap[deviceName] = device;
        keyMap[deviceName] = {};
        device.addInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
      }
      /**
       * @type {Record<string, InputDevice>}
       */


      this.devices = deviceMap;
      /**
       * @private
       * @type {Record<string, Record<string, KeyMapEntry>>}
       */

      this.keyMap = keyMap;
      /** @private */

      this.listeners = {
        poll: [],
        update: []
      };
      /** @private */

      this._lastPollTime = -1;
      /** @private */

      this._autopoll = false;
      /** @private */

      this._animationFrameHandle = null;
    }
    /**
     * @returns {boolean} Whether in the last second this input source was polled.
     */


    get polling() {
      return performance.now() - this._lastPollTime < 1000;
    }
    /**
     * Destroys this source's devices and keys.
     */


    destroy() {
      this.clearKeys();

      for (let deviceName in this.devices) {
        let device = this.devices[deviceName];
        device.removeInputListener(WILDCARD_KEY_MATCHER, this.onInputEvent);
        device.destroy();
      }

      this.devices = {};
    }
    /**
     * Poll the devices and update the input state.
     */


    poll(now = performance.now()) {
      for (const deviceName in this.keyMap) {
        let deviceKeyMap = this.keyMap[deviceName];

        for (const keyCode in deviceKeyMap) {
          let input = getKeyMapEntryInput(deviceKeyMap[keyCode]);
          input.poll();
          this.dispatchInputEvent(InputSourceEventStage.POLL, deviceName, keyCode, input);
        }
      }

      this.dispatchPollEvent(now);
      this._lastPollTime = now;
    }
    /**
     * Add listener to listen for event, in order by most
     * recently added. In other words, this listener will
     * be called BEFORE the previously added listener (if
     * there exists one) and so on.
     * 
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceEventListener} listener The listener callback.
     */


    addEventListener(event, listener) {
      if (event in this.listeners) {
        this.listeners[event].unshift(listener);
      } else {
        this.listeners[event] = [listener];
      }
    }
    /**
     * Removes the listener from listening to the event.
     * 
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceEventListener} listener The listener callback.
     */


    removeEventListener(event, listener) {
      if (event in this.listeners) {
        let list = this.listeners[event];
        let i = list.indexOf(listener);
        list.splice(i, 1);
      }
    }
    /**
     * @param {InputSourceEventTypes} event The name of the event.
     * @returns {number} The number of active listeners for the event.
     */


    countEventListeners(event) {
      if (!(event in this.listeners)) {
        throw new Error(`Cannot count listeners for unknown event '${event}'.`);
      }

      return this.listeners[event].length;
    }
    /**
     * Dispatches an event to the listeners.
     * 
     * @protected
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceInputEvent|InputSourcePollEvent} eventOpts The event object to pass to listeners.
     */


    dispatchEvent(event, eventOpts) {
      for (let listener of this.listeners[event]) {
        listener(eventOpts);
      }
    }
    /**
     * @protected
     * @param {InputSourceEventStage} stage The current input event stage.
     * @param {string} deviceName The device from which the input event was fired.
     * @param {string} keyCode The triggered key code for this input event.
     * @param {Axis|Button|Input} input The triggered input.
     */


    dispatchInputEvent(stage, deviceName, keyCode, input) {
      this.dispatchEvent('input', {
        stage,
        deviceName,
        keyCode,
        input
      });
    }
    /**
     * @protected
     * @param {number} now The currrent time in milliseconds.
     */


    dispatchPollEvent(now) {
      this.dispatchEvent('poll', {
        now
      });
    }
    /** @private */


    onInputEvent(e) {
      const deviceName = e.deviceName;
      const deviceKeyMap = this.keyMap[deviceName];

      switch (e.type) {
        case InputType.KEY:
          {
            const keyCode = e.keyCode;
            let button = getKeyMapEntryInput(deviceKeyMap[keyCode]);

            if (button) {
              button.update(e.event === InputEventCode.DOWN);
              this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, keyCode, button);
              return true;
            }
          }
          break;

        case InputType.POS:
          {
            let xAxis = getKeyMapEntryInput(deviceKeyMap.PosX);

            if (xAxis) {
              xAxis.update(e.x, e.dx);
              this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosX', xAxis);
            }

            let yAxis = getKeyMapEntryInput(deviceKeyMap.PosY);

            if (yAxis) {
              yAxis.update(e.y, e.dy);
              this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'PosY', yAxis);
            }
          }
          break;

        case InputType.WHEEL:
          {
            let xAxis = getKeyMapEntryInput(deviceKeyMap.WheelX);

            if (xAxis) {
              xAxis.update(e.dx, e.dx);
              this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelX', xAxis);
            }

            let yAxis = getKeyMapEntryInput(deviceKeyMap.WheelY);

            if (yAxis) {
              yAxis.update(e.dy, e.dy);
              this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelY', yAxis);
            }

            let zAxis = getKeyMapEntryInput(deviceKeyMap.WheelZ);

            if (zAxis) {
              zAxis.update(e.dz, e.dz);
              this.dispatchInputEvent(InputSourceEventStage.UPDATE, deviceName, 'WheelZ', zAxis);
            }
          }
          break;
      }
    }
    /** @private */


    onAnimationFrame(now) {
      if (!this._autopoll) return;
      this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
      this.poll(now);
    }

    set autopoll(value) {
      this._autopoll = value;

      if (this._animationFrameHandle) {
        // Stop animation frame loop
        cancelAnimationFrame(this._animationFrameHandle);
        this._animationFrameHandle = null;
      }

      if (value) {
        // Start animation frame loop
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
      }
    }
    /**
     * If true, polling will be handled automatically through requestAnimationFrame().
     * 
     * @returns {boolean} Whether to automatically poll on animation frame.
     */


    get autopoll() {
      return this._autopoll;
    }
    /**
     * Register and enable the source input to listen to for the given device
     * and key code. Can be registered more than once to obtain active lease
     * on the input, which guarantees it will be unregistered the same number
     * of times before removal.
     * 
     * @param {string} deviceName The name of the device (case-sensitive).
     * @param {string} keyCode The key code for the given key in the device.
     */


    registerKey(deviceName, keyCode) {
      if (!(deviceName in this.devices)) {
        throw new Error(`Invalid device name - missing device with name '${deviceName}' in source.`);
      }

      let deviceKeyMap = this.keyMap[deviceName];

      if (keyCode in deviceKeyMap) {
        incrementKeyMapEntryRef(deviceKeyMap[keyCode]);
      } else {
        let device = this.devices[deviceName];
        let deviceClass = device.constructor;
        let result;

        if (deviceClass.isAxis(keyCode)) {
          result = new Axis();
        } else if (deviceClass.isButton(keyCode)) {
          result = new Button();
        } else {
          throw new Error(`Unknown key code '${keyCode}' for device ${deviceName}.`);
        }

        deviceKeyMap[keyCode] = createKeyMapEntry(result);
      }

      return this;
    }
    /**
     * Remove and disable the registered source for the given device and key code.
     * 
     * @param {string} deviceName The name of the device (case-sensitive).
     * @param {string} keyCode The key code for the given key in the device.
     */


    unregisterKey(deviceName, keyCode) {
      let deviceKeyMap = this.keyMap[deviceName];

      if (deviceKeyMap) {
        let keyMapEntry = deviceKeyMap[keyCode];

        if (keyMapEntry) {
          decrementKeyMapEntryRef(keyMapEntry);

          if (keyMapEntry.refs <= 0) {
            delete deviceKeyMap[keyCode];
          }
        }
      }
    }
    /**
     * @param {string} deviceName The name of the device.
     * @param {string} keyCode The key code in the device.
     * @returns {boolean} Whether the device and key code has been registered.
     */


    hasKey(deviceName, keyCode) {
      return deviceName in this.keyMap && keyCode in this.keyMap[deviceName];
    }
    /**
     * Removes all registered inputs from all devices.
     */


    clearKeys() {
      for (let deviceName in this.devices) {
        let deviceKeyMap = this.keyMap[deviceName]; // Clean-up device key map.

        for (let keyCode in deviceKeyMap) {
          clearKeyMapEntryRef(deviceKeyMap[keyCode]);
        } // Actually clear it from future references.


        this.keyMap[deviceName] = {};
      }
    }
    /**
     * @returns {Button|Axis|Input}
     */


    getInputByKey(deviceName, keyCode) {
      return getKeyMapEntryInput(this.keyMap[deviceName][keyCode]);
    }

  }
  /**
   * @param {Input} [input]
   * @returns {KeyMapEntry}
   */


  function createKeyMapEntry(input = null) {
    return {
      refs: 1,
      input: input
    };
  }
  /**
   * @param {KeyMapEntry} keyMapEntry 
   */


  function getKeyMapEntryInput(keyMapEntry) {
    return keyMapEntry ? keyMapEntry.input : null;
  }
  /**
   * @param {KeyMapEntry} keyMapEntry 
   */


  function incrementKeyMapEntryRef(keyMapEntry) {
    keyMapEntry.refs += 1;
  }
  /**
   * @param {KeyMapEntry} keyMapEntry
   */


  function decrementKeyMapEntryRef(keyMapEntry) {
    keyMapEntry.refs -= 1;
  }
  /**
   * @param {KeyMapEntry} keyMapEntry 
   */


  function clearKeyMapEntryRef(keyMapEntry) {
    keyMapEntry.refs = 0;
  }

  const KEY_STRING_DEVICE_SEPARATOR = ':';

  class Synthetic extends Input {
    constructor() {
      super();
      this.update = this.update.bind(this);
      /** @private */

      this.adapters = [];
      /** @private */

      this.values = [];
      /** @private */

      this.next = {
        values: [],
        value: 0
      };
    }

    hydrate(adapterOptions) {
      if (!adapterOptions) return;

      if (!Array.isArray(adapterOptions)) {
        adapterOptions = [adapterOptions];
      }

      let adapterList = [];
      let adapterId = 0;

      for (let adapterOption of adapterOptions) {
        if (typeof adapterOption === 'string') {
          adapterOption = {
            key: adapterOption
          };
        }

        const {
          key,
          scale = 1,
          event = 'null'
        } = adapterOption;
        const {
          deviceName,
          keyCode
        } = parseKeyString(key);
        const eventCode = InputEventCode.parse(event);
        const scaleValue = Number(scale);
        let adapter = AdapterManager.createAdapter(this, adapterId, deviceName, keyCode, scaleValue, eventCode);
        adapterList.push(adapter);
        ++adapterId;
      }

      this.adapters = adapterList;
      this.values = new Array(adapterList.length).fill(0);
      this.next = {
        values: new Array(adapterList.length).fill(0),
        value: 0
      };
    }
    /** @override */


    poll(value, adapter) {
      // Update previous state.
      this.prev = this.value; // Poll current state.

      const adapterId = adapter.adapterId;
      let prevValue = this.values[adapterId];
      this.values[adapterId] = value;
      this.value = this.value - prevValue + value;
      this.next.values[adapterId] = 0;
      this.next.value += value - prevValue;
    }
    /** @override */


    update(value, adapter) {
      const adapterId = adapter.adapterId;
      let prevValue = this.next.values[adapterId];
      this.next.values[adapterId] = value;
      this.next.value += value - prevValue;
    }

    reset() {
      this.prev = 0;
      this.values.fill(0);
      this.value = 0;
      this.next.values.fill(0);
      this.next.value = 0;
    }

  }

  function parseKeyString(keyString) {
    let i = keyString.indexOf(KEY_STRING_DEVICE_SEPARATOR);

    if (i >= 0) {
      return {
        deviceName: keyString.substring(0, i),
        keyCode: keyString.substring(i + 1)
      };
    } else {
      throw new Error(`Invalid key string - missing device separator '${KEY_STRING_DEVICE_SEPARATOR}'.`);
    }
  }
  /**
   * @typedef {import('../source/InputSourceState.js').InputSourceInputEvent} InputSourceInputEvent
   * @typedef {import('../source/InputSourceState.js').InputSourcePollEvent} InputSourcePollEvent
   */

  /**
   * @typedef {string} InputEvent
   * @typedef {string} InputKeyString
   * 
   * @typedef InputKeyOption
   * @property {InputKeyString} key
   * @property {InputEvent} [event]
   * @property {number} [scale]
   * 
   * @typedef {InputKeyString|InputKeyOption} InputMappingEntryValue
   * @typedef {InputMappingEntryValue|Array<InputMappingEntryValue>} InputMappingEntry
   * @typedef {Record<string, InputMappingEntry>} InputMapping
   * 
   * @typedef {Record<string, Synthetic>} SyntheticMap 
   */

  /**
   * @typedef {'change'|'attach'|'detach'} InputContextEventTypes
   * 
   * @typedef {object} InputContextChangeEvent
   * @typedef {object} InputContextAttachEvent
   * @typedef {object} InputContextDetachEvent
   * 
   * @callback InputContextEventListener
   * @param {InputContextChangeEvent|InputContextAttachEvent|InputContextDetachEvent} e
   */


  class InputContext {
    /**
     * Constructs a disabled InputContext.
     */
    constructor() {
      /** @private */
      this._source = null;
      /** @private */

      this._mapping = null;
      /** @private */

      this._disabled = true;
      /** @private */

      this._ignoreInputs = this._disabled;
      /** @private */

      this.adapters = new AdapterManager();
      /**
       * @private
       * @type {SyntheticMap}
       */

      this.inputs = {};
      /** @private */

      this.listeners = {
        change: [],
        attach: [],
        detach: []
      };
      /** @private */

      this.onSourceInput = this.onSourceInput.bind(this);
      /** @private */

      this.onSourcePoll = this.onSourcePoll.bind(this);
    }

    get source() {
      return this._source;
    }

    get mapping() {
      return this._mapping;
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this.toggle(!value);
    }
    /**
     * @param {InputMapping} inputMapping
     * @returns {InputContext}
     */


    setInputMapping(inputMapping) {
      const prevDisabled = this.disabled;
      this.disabled = true;
      let prevSource = this.source;
      let prevInputs = this.inputs; // Clean up previous state.

      if (prevSource) {
        unregisterInputKeys(prevSource, prevInputs);
      }

      this.adapters.clear(); // Set up next state.

      let nextSource = this.source;
      let nextInputs = {};

      if (inputMapping) {
        for (let inputName in inputMapping) {
          let adapterOptions = inputMapping[inputName]; // NOTE: Preserve synthetics across restarts.

          let synthetic = prevInputs[inputName] || new Synthetic();
          synthetic.hydrate(adapterOptions);
          let syntheticAdapters = synthetic.adapters;
          this.adapters.add(syntheticAdapters);
          nextInputs[inputName] = synthetic;
        }

        if (nextSource) {
          registerInputKeys(nextSource, nextInputs);
        }
      }

      this.inputs = nextInputs;
      this._mapping = inputMapping;
      this.dispatchChangeEvent(); // Force disable if missing required components, otherwise return to previous operating state.

      this.disabled = this.source && this.inputs ? prevDisabled : true;
      return this;
    }

    attach(inputSource) {
      if (this.source) {
        throw new Error('Already attached to existing input source.');
      }

      if (!inputSource) {
        throw new Error('Missing input source to attach context.');
      }

      registerInputKeys(inputSource, this.inputs);
      inputSource.addEventListener('poll', this.onSourcePoll);
      inputSource.addEventListener('input', this.onSourceInput);
      this._source = inputSource;
      this.toggle(true);
      this.dispatchAttachEvent();
      return this;
    }

    detach() {
      let prevSource = this.source;
      let prevInputs = this.inputs;

      if (prevSource) {
        this.toggle(false);
        prevSource.removeEventListener('poll', this.onSourcePoll);
        prevSource.removeEventListener('input', this.onSourceInput);

        if (prevInputs) {
          unregisterInputKeys(prevSource, prevInputs);
        }

        this._source = null;
        this.dispatchDetachEvent();
      }

      return this;
    }
    /**
     * Add listener to listen for event, in order by most
     * recently added. In other words, this listener will
     * be called BEFORE the previously added listener (if
     * there exists one) and so on.
     * 
     * @param {InputContextEventTypes} event The name of the event.
     * @param {InputContextEventListener} listener The listener callback.
     */


    addEventListener(event, listener) {
      if (event in this.listeners) {
        this.listeners[event].unshift(listener);
      } else {
        this.listeners[event] = [listener];
      }
    }
    /**
     * Removes the listener from listening to the event.
     * 
     * @param {InputContextEventTypes} event The name of the event.
     * @param {InputContextEventListener} listener The listener callback.
     */


    removeEventListener(event, listener) {
      if (event in this.listeners) {
        let list = this.listeners[event];
        let i = list.indexOf(listener);
        list.splice(i, 1);
      }
    }
    /**
     * @param {InputContextEventTypes} event The name of the event.
     * @returns {number} The number of active listeners for the event.
     */


    countEventListeners(event) {
      if (!(event in this.listeners)) {
        throw new Error(`Cannot count listeners for unknown event '${event}'.`);
      }

      return this.listeners[event].length;
    }
    /**
     * Dispatches an event to the listeners.
     * 
     * @protected
     * @param {InputSourceEventTypes} event The name of the event.
     * @param {InputSourceInputEvent|InputSourcePollEvent} eventOpts The event object to pass to listeners.
     */


    dispatchEvent(event, eventOpts) {
      for (let listener of this.listeners[event]) {
        listener(eventOpts);
      }
    }
    /** @private */


    dispatchChangeEvent() {
      this.dispatchEvent('change', {});
    }
    /** @private */


    dispatchAttachEvent() {
      this.dispatchEvent('attach', {});
    }
    /** @private */


    dispatchDetachEvent() {
      this.dispatchEvent('detach', {});
    }
    /**
     * @private
     * @param {InputSourceInputEvent} e
     */


    onSourceInput(e) {
      if (!e.consumed && !this._ignoreInputs) {
        const {
          stage,
          deviceName,
          keyCode,
          input
        } = e;

        switch (stage) {
          case InputSourceEventStage.POLL:
            this.adapters.poll(deviceName, keyCode, input);
            break;

          case InputSourceEventStage.UPDATE:
            this.adapters.update(deviceName, keyCode, input);
            break;

          default:
            throw new Error('Unknown input source stage.');
        }

        e.consumed = true;
      } else {
        const {
          deviceName,
          keyCode,
          input
        } = e;
        this.adapters.reset(deviceName, keyCode, input);
      }
    }
    /**
     * @private
     * @param {InputSourcePollEvent} e
     */


    onSourcePoll(e) {
      if (this._ignoreInputs !== this.disabled) {
        this._ignoreInputs = this.disabled;
      }
    }
    /**
     * Set the context to enabled/disabled.
     * 
     * @param {Boolean} [force] If defined, the context is enabled if true,
     * disabled if false. If undefined, it will toggle the current value.
     * @returns {InputContext} Self for method chaining.
     */


    toggle(force = this._disabled) {
      let result = !force;

      if (!result) {
        if (!this.source) {
          throw new Error('Input source must be set before enabling input context.');
        }
      }

      this._disabled = result;
      return this;
    }
    /**
     * @param {string} inputName The name of the input.
     * @returns {boolean} Whether the input exists for the given name.
     */


    hasInput(inputName) {
      return inputName in this.inputs && this.inputs[inputName].adapters.length > 0;
    }
    /**
     * Get the synthetic input object by name.
     * 
     * @param {string} inputName The name of the input.
     * @returns {Synthetic} The synthetic input for the given input name.
     */


    getInput(inputName) {
      if (inputName in this.inputs) {
        return this.inputs[inputName];
      } else {
        let synthetic = new Synthetic();
        this.inputs[inputName] = synthetic;
        this._mapping[inputName] = '';
        this.dispatchChangeEvent();
        return synthetic;
      }
    }
    /**
     * Get the current value of the input by name.
     * 
     * @param {String} inputName The name of the input.
     * @returns {number} The input value.
     */


    getInputState(inputName) {
      if (inputName in this.inputs) {
        return this.inputs[inputName].value;
      } else {
        return 0;
      }
    }
    /**
     * Get the change in value of the input by name since last poll.
     * 
     * @param {String} inputName The name of the input.
     * @returns {number} The input value.
     */


    getInputChanged(inputName) {
      if (inputName in this.inputs) {
        let input = this.inputs[inputName];
        return input.value - input.prev;
      } else {
        return 0;
      }
    }

  }

  function registerInputKeys(inputSource, inputs) {
    for (let inputName in inputs) {
      let {
        adapters
      } = inputs[inputName];

      for (let adapter of adapters) {
        const {
          deviceName,
          keyCode
        } = adapter;
        inputSource.registerKey(deviceName, keyCode);
      }
    }
  }

  function unregisterInputKeys(inputSource, inputs) {
    for (let inputName in inputs) {
      let {
        adapters
      } = inputs[inputName];

      for (let adapter of adapters) {
        const {
          deviceName,
          keyCode
        } = adapter;
        inputSource.unregisterKey(deviceName, keyCode);
      }
    }
  }
  /**
   * Available Key Codes:
   * - This uses the `event.code` standard to reference each key.
   * - Use this to help you determine the code: https://keycode.info/
   */

  /**
   * A class that listens to the keyboard events from the event target and
   * transforms the events into a valid {@link InputEvent} for the added
   * listeners.
   */


  class Keyboard extends InputDevice {
    /** @override */
    static isAxis(keyCode) {
      return false;
    }
    /** @override */


    static isButton(keyCode) {
      return true;
    }
    /**
     * Constructs a listening keyboard with no listeners (yet).
     * 
     * @param {EventTarget} eventTarget 
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.repeat=false] Whether to accept repeated key
     * events.
     */


    constructor(eventTarget, opts = {}) {
      super('Keyboard', eventTarget);
      const {
        repeat = false
      } = opts;
      this.repeat = repeat;
      /** @private */

      this._eventObject = {
        target: eventTarget,
        deviceName: this.deviceName,
        keyCode: '',
        event: InputEventCode.NULL,
        type: InputType.KEY,
        // Key values
        value: 0,
        control: false,
        shift: false,
        alt: false
      };
      /** @private */

      this.onKeyDown = this.onKeyDown.bind(this);
      /** @private */

      this.onKeyUp = this.onKeyUp.bind(this);
      eventTarget.addEventListener('keydown', this.onKeyDown);
      eventTarget.addEventListener('keyup', this.onKeyUp);
    }
    /** @override */


    destroy() {
      let eventTarget = this.eventTarget;
      eventTarget.removeEventListener('keydown', this.onKeyDown);
      eventTarget.removeEventListener('keyup', this.onKeyUp);
      super.destroy();
    }
    /**
     * @private
     * @param {KeyboardEvent} e
     */


    onKeyDown(e) {
      if (e.repeat) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      let event = this._eventObject; // We care more about location (code) than print char (key).

      event.keyCode = e.code;
      event.event = InputEventCode.DOWN;
      event.value = 1;
      event.control = e.ctrlKey;
      event.shift = e.shiftKey;
      event.alt = e.altKey;
      let result = this.dispatchInput(event);

      if (result) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    /**
     * @private
     * @param {KeyboardEvent} e
     */


    onKeyUp(e) {
      let event = this._eventObject; // We care more about location (code) than print char (key).

      event.keyCode = e.code;
      event.event = InputEventCode.UP;
      event.value = 1;
      event.control = e.ctrlKey;
      event.shift = e.shiftKey;
      event.alt = e.altKey;
      let result = this.dispatchInput(event);

      if (result) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

  }
  /**
   * Available Key Codes:
   * - PosX
   * - PosY
   * - WheelX
   * - WheelY
   * - WheelZ
   * - Button0 (left button)
   * - Button1 (middle button)
   * - Button2 (right button)
   * - Button3 (next button)
   * - Button4 (back button)
   */


  const DEFAULT_LINE_PIXELS = 10;
  const DEFAULT_PAGE_PIXELS = 100;
  /**
   * A class that listens to the keyboard events from the event target and
   * transforms the events into a valid {@link InputEvent} for the added
   * listeners.
   */

  class Mouse extends InputDevice {
    /** @override */
    static isAxis(keyCode) {
      return keyCode === 'PosX' || keyCode === 'PosY' || keyCode === 'WheelX' || keyCode === 'WheelY' || keyCode === 'WheelZ';
    }
    /** @override */


    static isButton(keyCode) {
      return !this.isAxis(keyCode);
    }
    /**
     * Constructs a listening mouse with no listeners (yet).
     * 
     * @param {EventTarget} eventTarget
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.eventsOnFocus=true] Whether to capture events only when it has focus.
     */


    constructor(eventTarget, opts = {
      eventsOnFocus: true
    }) {
      super('Mouse', eventTarget);
      this.canvasTarget = eventTarget instanceof HTMLCanvasElement && eventTarget || eventTarget.canvas || eventTarget.querySelector('canvas') || eventTarget.shadowRoot && eventTarget.shadowRoot.querySelector('canvas') || eventTarget;
      this.eventsOnFocus = opts.eventsOnFocus;
      this._downHasFocus = false;
      /** @private */

      this._eventObject = {
        target: eventTarget,
        deviceName: this.deviceName,
        keyCode: '',
        event: InputEventCode.NULL,
        type: InputType.KEY,
        // Key values
        value: 0,
        control: false,
        shift: false,
        alt: false
      };
      /** @private */

      this._positionObject = {
        target: eventTarget,
        deviceName: this.deviceName,
        keyCode: 'Position',
        event: InputEventCode.MOVE,
        type: InputType.POS,
        // Pos values
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
      };
      /** @private */

      this._wheelObject = {
        target: eventTarget,
        deviceName: this.deviceName,
        keyCode: 'Wheel',
        event: InputEventCode.MOVE,
        type: InputType.WHEEL,
        // Wheel values
        dx: 0,
        dy: 0,
        dz: 0
      };
      /** @private */

      this.onMouseDown = this.onMouseDown.bind(this);
      /** @private */

      this.onMouseUp = this.onMouseUp.bind(this);
      /** @private */

      this.onMouseMove = this.onMouseMove.bind(this);
      /** @private */

      this.onContextMenu = this.onContextMenu.bind(this);
      /** @private */

      this.onWheel = this.onWheel.bind(this);
      eventTarget.addEventListener('mousedown', this.onMouseDown);
      eventTarget.addEventListener('contextmenu', this.onContextMenu);
      eventTarget.addEventListener('wheel', this.onWheel);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
    /** @override */


    destroy() {
      let eventTarget = this.eventTarget;
      eventTarget.removeEventListener('mousedown', this.onMouseDown);
      eventTarget.removeEventListener('contextmenu', this.onContextMenu);
      eventTarget.removeEventListener('wheel', this.onWheel);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      super.destroy();
    }

    setPointerLock(force = true) {
      if (force) {
        this.eventTarget.requestPointerLock();
      } else {
        this.eventTarget.exitPointerLock();
      }
    }

    hasPointerLock() {
      return document.pointerLockElement === this.eventTarget;
    }
    /**
     * @private
     * @param {MouseEvent} e
     */


    onMouseDown(e) {
      this._downHasFocus = true;
      let event = this._eventObject; // We care more about location (code) than print char (key).

      event.keyCode = 'Button' + e.button;
      event.event = InputEventCode.DOWN;
      event.value = 1;
      event.control = e.ctrlKey;
      event.shift = e.shiftKey;
      event.alt = e.altKey;
      let result = this.dispatchInput(event);

      if (result) {
        // Make sure it has focus first.
        if (document.activeElement === this.eventTarget) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */


    onContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    /**
     * @private
     * @param {WheelEvent} e
     */


    onWheel(e) {
      let event = this._wheelObject;

      switch (e.deltaMode) {
        case WheelEvent.DOM_DELTA_LINE:
          event.dx = e.deltaX * DEFAULT_LINE_PIXELS;
          event.dy = e.deltaY * DEFAULT_LINE_PIXELS;
          event.dz = e.deltaZ * DEFAULT_LINE_PIXELS;
          break;

        case WheelEvent.DOM_DELTA_PAGE:
          event.dx = e.deltaX * DEFAULT_PAGE_PIXELS;
          event.dy = e.deltaY * DEFAULT_PAGE_PIXELS;
          event.dz = e.deltaZ * DEFAULT_PAGE_PIXELS;
          break;

        case WheelEvent.DOM_DELTA_PIXEL:
        default:
          event.dx = e.deltaX;
          event.dy = e.deltaY;
          event.dz = e.deltaZ;
          break;
      }

      let result = this.dispatchInput(event);

      if (result) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */


    onMouseUp(e) {
      // Make sure mouse down was pressed before this (with focus).
      if (!this._downHasFocus) return;
      this._downHasFocus = false;
      let event = this._eventObject; // We care more about location (code) than print char (key).

      event.keyCode = 'Button' + e.button;
      event.event = InputEventCode.UP;
      event.value = 1;
      event.control = e.ctrlKey;
      event.shift = e.shiftKey;
      event.alt = e.altKey;
      let result = this.dispatchInput(event);

      if (result) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */


    onMouseMove(e) {
      if (this.eventsOnFocus && document.activeElement !== this.eventTarget) return;
      const element = this.canvasTarget;
      const {
        clientWidth,
        clientHeight
      } = element;
      const rect = element.getBoundingClientRect();
      let dx = e.movementX / clientWidth;
      let dy = e.movementY / clientHeight;
      let x = (e.clientX - rect.left) / clientWidth;
      let y = (e.clientY - rect.top) / clientHeight;
      let event = this._positionObject;
      event.x = x;
      event.y = y;
      event.dx = dx;
      event.dy = dy;
      this.dispatchInput(event);
    }

  }

  var INNER_HTML$1 = "<kbd>\n    <span id=\"key\"><slot></slot></span>\n    <span id=\"value\" class=\"hidden\"></span>\n</kbd>\n";
  var INNER_STYLE$1 = "kbd{position:relative;display:inline-block;border-radius:3px;border:1px solid #888;font-size:.85em;font-weight:700;text-rendering:optimizeLegibility;line-height:12px;height:14px;padding:2px 4px;color:#444;background-color:#eee;box-shadow:inset 0 -3px 0 #aaa;overflow:hidden}kbd:empty:after{content:\"<?>\";opacity:.6}.disabled{opacity:.6;box-shadow:none;background-color:#aaa}.hidden{display:none}#value{position:absolute;top:0;bottom:0;right:0;font-size:.85em;padding:2px 4px 0;color:#ccc;background-color:#333;box-shadow:inset 0 3px 0 #222}";

  class InputKeyElement extends HTMLElement {
    /** Generated by cuttle.js */
    static get [Symbol.for("cuttleTemplate")]() {
      let t = document.createElement("template");
      t.innerHTML = INNER_HTML$1;
      Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
        value: t
      });
      return t;
    }
    /** Generated by cuttle.js */


    static get [Symbol.for("cuttleStyle")]() {
      let s = document.createElement("style");
      s.innerHTML = INNER_STYLE$1;
      Object.defineProperty(this, Symbol.for("cuttleStyle"), {
        value: s
      });
      return s;
    }

    static get properties() {
      return {
        name: String,
        value: String,
        disabled: Boolean
      };
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this.toggleAttribute("disabled", value);
    }

    get value() {
      return this._value;
    }

    set value(value) {
      this.setAttribute("value", value);
    }

    get name() {
      return this._name;
    }

    set name(value) {
      this.setAttribute("name", value);
    }

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
      this._keyboardElement = this.shadowRoot.querySelector('kbd');
      this._keyElement = this.shadowRoot.querySelector('#key');
      this._valueElement = this.shadowRoot.querySelector('#value');
    }
    /** @override */


    attributeChangedCallback(attribute, prev, value) {
      /** Generated by cuttle.js */
      switch (attribute) {
        case "name":
          this._name = value;
          break;

        case "value":
          this._value = value;
          break;

        case "disabled":
          {
            this._disabled = value !== null;
          }
          break;
      }

      ((attribute, prev, value) => {
        switch (attribute) {
          case 'name':
            this._keyElement.textContent = value;
            break;

          case 'value':
            if (value !== null) {
              this._valueElement.classList.toggle('hidden', false);

              this._valueElement.textContent = value;
              this._keyboardElement.style.paddingRight = `${this._valueElement.clientWidth + 4}px`;
            } else {
              this._valueElement.classList.toggle('hidden', true);
            }

            break;

          case 'disabled':
            this._keyboardElement.classList.toggle('disabled', value !== null);

            break;
        }
      })(attribute, prev, value);
    }

    connectedCallback() {
      if (Object.prototype.hasOwnProperty.call(this, "name")) {
        let value = this.name;
        delete this.name;
        this.name = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "value")) {
        let value = this.value;
        delete this.value;
        this.value = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "disabled")) {
        let value = this.disabled;
        delete this.disabled;
        this.disabled = value;
      }
    }

    static get observedAttributes() {
      return ["name", "value", "disabled"];
    }

  }

  window.customElements.define('input-key', InputKeyElement);
  var INNER_HTML$1$1 = "<table>\n    <thead>\n        <tr class=\"tableHeader\">\n            <th colspan=4>\n                <slot></slot>\n            </th>\n        </tr>\n        <tr class=\"colHeader\">\n            <th>name</th>\n            <th>key</th>\n            <th>mod</th>\n            <th>value</th>\n        </tr>\n    </thead>\n    <tbody>\n    </tbody>\n</table>\n";
  var INNER_STYLE$1$1 = ":host{display:block}table{border-collapse:collapse}table,td,th{border:1px solid #666}td,th{padding:5px 10px}td{text-align:center}thead th{padding:0}.colHeader>th{font-size:.8em;padding:0 10px;letter-spacing:3px;background-color:#aaa;color:#666}.colHeader>th,output{font-family:monospace}output{border-radius:.3em;padding:3px}tr:not(.primary) .name,tr:not(.primary) .value{opacity:.3}tr:nth-child(2n){background-color:#eee}";

  function upgradeProperty(element, propertyName) {
    if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
      let value = element[propertyName];
      delete element[propertyName];
      element[propertyName] = value;
    }
  }

  class InputMapElement extends HTMLElement {
    /** Generated by cuttle.js */
    static get [Symbol.for("cuttleTemplate")]() {
      let t = document.createElement("template");
      t.innerHTML = INNER_HTML$1$1;
      Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
        value: t
      });
      return t;
    }
    /** Generated by cuttle.js */


    static get [Symbol.for("cuttleStyle")]() {
      let s = document.createElement("style");
      s.innerHTML = INNER_STYLE$1$1;
      Object.defineProperty(this, Symbol.for("cuttleStyle"), {
        value: s
      });
      return s;
    }

    static get customEvents() {
      return ['load'];
    }
    /** @override */


    get onload() {
      return this._onload;
    }

    set onload(value) {
      if (this._onload) this.removeEventListener("load", this._onload);
      this._onload = value;
      if (this._onload) this.addEventListener("load", value);
    }

    static get observedAttributes() {
      return ["onload", 'src'];
    }

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
      this._src = '';
      this._inputMap = null;
      this._tableElements = {};
      this._titleElement = this.shadowRoot.querySelector('#title');
      this._bodyElement = this.shadowRoot.querySelector('tbody');
      this._children = this.shadowRoot.querySelector('slot');
    }

    get map() {
      return this._inputMap;
    }

    get mapElements() {
      return this._tableElements;
    }
    /** @override */


    connectedCallback() {
      if (Object.prototype.hasOwnProperty.call(this, "onload")) {
        let value = this.onload;
        delete this.onload;
        this.onload = value;
      }

      upgradeProperty(this, 'src');
    }
    /** @override */


    attributeChangedCallback(attribute, prev, value) {
      /** Generated by cuttle.js */
      switch (attribute) {
        case "onload":
          {
            this.onload = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
          }
          break;
      }

      ((attribute, prev, value) => {
        switch (attribute) {
          case 'src':
            if (this._src !== value) {
              this._src = value;

              if (value.trim().startsWith('{')) {
                let jsonData = JSON.parse(value);

                this._setInputMap(jsonData);
              } else {
                fetch(value).then(fileBlob => fileBlob.json()).then(jsonData => this._setInputMap(jsonData));
              }
            }

            break;
        }
      })(attribute, prev, value);
    }

    get src() {
      return this.getAttribute('src');
    }

    set src(value) {
      switch (typeof value) {
        case 'object':
          {
            let src = JSON.stringify(value);
            this._src = src;

            this._setInputMap(value);

            this.setAttribute('src', src);
          }
          break;

        case 'string':
          this.setAttribute('src', value);
          break;

        default:
          this.setAttribute('src', JSON.stringify(value));
          break;
      }
    }

    _setInputMap(inputMap) {
      let entryMap = {};
      let entryList = [];

      for (let name in inputMap) {
        let input = inputMap[name];
        let entries = [];
        inputToTableEntries(entries, name, input);
        entryMap[name] = entries;
        entryList.push(...entries);
      }

      this._bodyElement.innerHTML = '';

      for (let entry of entryList) {
        this._bodyElement.appendChild(entry);
      }

      this._inputMap = inputMap;
      this._tableElements = entryMap;
      this.dispatchEvent(new CustomEvent('load', {
        bubbles: false,
        composed: true,
        detail: {
          map: inputMap
        }
      }));
    }

  }

  window.customElements.define('input-map', InputMapElement);

  function inputToTableEntries(out, name, input) {
    if (Array.isArray(input)) {
      inputToTableEntries(out, name, input[0]);
      let length = input.length;

      for (let i = 1; i < length; ++i) {
        out.push(parseInputOption(name, input[i], false));
      }
    } else {
      out.push(parseInputOption(name, input, true));
    }

    return out;
  }

  function parseInputOption(inputName, inputOption, inputPrimary = true) {
    if (typeof inputOption === 'object') {
      const {
        key,
        event,
        scale
      } = inputOption;
      return createInputTableEntry(inputName, key, event, scale, 0, inputPrimary);
    } else {
      return createInputTableEntry(inputName, inputOption, null, 1, 0, inputPrimary);
    }
  }

  function createInputTableEntry(name, key, event, scale, value, primary = true) {
    let row = document.createElement('tr');
    if (primary) row.classList.add('primary'); // Name

    {
      let data = document.createElement('td');
      data.textContent = name;
      data.classList.add('name');
      row.appendChild(data);
    } // Key

    {
      let data = document.createElement('td');
      data.classList.add('key');
      let kbd = new InputKeyElement();
      kbd.innerText = key;
      data.appendChild(kbd);
      row.appendChild(data);
    } // Modifiers

    {
      let data = document.createElement('td');
      let samp = document.createElement('samp');
      let modifiers = [];

      if (typeof event === 'string' && event !== 'null') {
        modifiers.push(event);
      }

      if (typeof scale === 'number' && scale !== 1) {
        modifiers.push(`\u00D7(${scale.toFixed(2)})`);
      }

      samp.innerText = modifiers.join(' ');
      data.classList.add('mod');
      data.appendChild(samp);
      row.appendChild(data);
    } // Value

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

  var INNER_HTML$2 = "<input-map>\n    <slot></slot>\n    <input-source></input-source>\n</input-map>\n";
  var INNER_STYLE$2 = ":host{display:inline-block}";
  var INNER_HTML$3 = "<div>\n    <label id=\"title\">\n        input-source\n    </label>\n    <span>|</span>\n    <p>\n        <label for=\"poll\">poll</label>\n        <output id=\"poll\"></output>\n    </p>\n    <p>\n        <label for=\"focus\">focus</label>\n        <output id=\"focus\"></output>\n    </p>\n</div>\n";
  var INNER_STYLE$3 = ":host{display:inline-block}div{font-family:monospace;color:#666;outline:1px solid #666;padding:4px}p{display:inline;margin:0;padding:0}#focus:empty:after,#poll:empty:after{content:\"✗\";color:red}";
  /** This determines whether an element has an associated input event source. */

  const INPUT_SOURCE_STATE_KEY = Symbol('inputSourceState');
  /**
   * This serves as a layer of abstraction to get unique sources of input events by target elements. Getting
   * the input source for the same event target will return the same input source instance. This allows
   * easier management of input source references without worrying about duplicates.
   * 
   * If you do not want this feature but still want the events managed, use `InputSourceState` directly instead.
   */

  class InputSource extends InputSourceState {
    /**
     * Get the associated input source for the given event target.
     * 
     * @param {EventTarget} eventTarget The target element to listen
     * for all input events.
     * @returns {InputSourceState} The input source for the given event target.
     */
    static for(eventTarget) {
      if (eventTarget) {
        return obtainInputSourceState(eventTarget);
      } else {
        throw new Error('Cannot get input source for null event target.');
      }
    }
    /**
     * Delete the associated input source for the given event target.
     * 
     * @param {EventTarget} eventTarget The target element being listened to.
     */


    static delete(eventTarget) {
      if (eventTarget) {
        releaseInputSourceState(eventTarget);
      }
    }
    /** @private */


    constructor() {
      super(); // NOTE: This is to enforce the for() and delete() structure.

      throw new Error('Cannot construct InputSource with new - use InputSourceState() instead.');
    }

  }
  /**
   * @param {EventTarget} eventTarget The target element to listen to.
   * @returns {boolean} Whether the event target has an associated input source.
   */


  function hasAttachedInputSourceState(eventTarget) {
    return Object.prototype.hasOwnProperty.call(eventTarget, INPUT_SOURCE_STATE_KEY) && Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY).value;
  }
  /**
   * Obtain a lease to the associated input source for the event target element.
   * 
   * @param {EventTarget} eventTarget The target element to listen to.
   */


  function obtainInputSourceState(eventTarget) {
    if (!hasAttachedInputSourceState(eventTarget)) {
      let state = new InputSourceState([new Keyboard(eventTarget), new Mouse(eventTarget)]);
      Object.defineProperty(eventTarget, INPUT_SOURCE_STATE_KEY, {
        value: {
          state: state,
          refs: 1
        },
        configurable: true
      });
      return state;
    } else {
      let descriptor = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY);
      descriptor.value.refs += 1;
      return descriptor.value.state;
    }
  }
  /**
   * Release a single lease on the input source for the event target element.
   * 
   * @param {EventTarget} eventTarget The target element.
   */


  function releaseInputSourceState(eventTarget) {
    if (hasAttachedInputSourceState(eventTarget)) {
      let descriptor = Object.getOwnPropertyDescriptor(eventTarget, INPUT_SOURCE_STATE_KEY);
      descriptor.value.refs -= 1;

      if (descriptor.value.refs <= 0) {
        let state = descriptor.value.state;
        delete eventTarget[INPUT_SOURCE_STATE_KEY];
        state.destroy();
      }
    }
  }
  /**
   * @typedef {import('./InputSourceState.js').InputSourceState} InputSourceState
   */

  /** Poll status check interval in milliseconds. */


  const INTERVAL_DURATION = 1000;

  class InputSourceElement extends HTMLElement {
    /** Generated by cuttle.js */
    static get [Symbol.for("cuttleTemplate")]() {
      let t = document.createElement("template");
      t.innerHTML = INNER_HTML$3;
      Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
        value: t
      });
      return t;
    }
    /** Generated by cuttle.js */


    static get [Symbol.for("cuttleStyle")]() {
      let s = document.createElement("style");
      s.innerHTML = INNER_STYLE$3;
      Object.defineProperty(this, Symbol.for("cuttleStyle"), {
        value: s
      });
      return s;
    }

    static get properties() {
      return {
        for: String,

        /**
         * Whether to automatically poll the state on each frame. This is a shared
         * state with all input sources that have the same event target. In other
         * words, all input sources with the same event target must have the
         * same autopoll value, otherwise behavior is undefined.
         * 
         * Implementation-wise, the closest and most recent autopoll value is used.
         * This follows the standard HTML loading order.
         */
        autopoll: Boolean
      };
    }
    /**
                 * Whether to automatically poll the state on each frame. This is a shared
                 * state with all input sources that have the same event target. In other
                 * words, all input sources with the same event target must have the
                 * same autopoll value, otherwise behavior is undefined.
                 * 
                 * Implementation-wise, the closest and most recent autopoll value is used.
                 * This follows the standard HTML loading order.
                 */


    get autopoll() {
      return this._autopoll;
    }

    set autopoll(value) {
      this.toggleAttribute("autopoll", value);
    }

    get for() {
      return this._for;
    }

    set for(value) {
      this.setAttribute("for", value);
    }

    static get customEvents() {
      return ['input', 'poll', 'change'];
    }

    get onchange() {
      return this._onchange;
    }

    set onchange(value) {
      if (this._onchange) this.removeEventListener("change", this._onchange);
      this._onchange = value;
      if (this._onchange) this.addEventListener("change", value);
    }

    get onpoll() {
      return this._onpoll;
    }

    set onpoll(value) {
      if (this._onpoll) this.removeEventListener("poll", this._onpoll);
      this._onpoll = value;
      if (this._onpoll) this.addEventListener("poll", value);
    }

    get oninput() {
      return this._oninput;
    }

    set oninput(value) {
      if (this._oninput) this.removeEventListener("input", this._oninput);
      this._oninput = value;
      if (this._oninput) this.addEventListener("input", value);
    }

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
      /** @private */

      this._containerElement = this.shadowRoot.querySelector('div');
      /** @private */

      this._titleElement = this.shadowRoot.querySelector('#title');
      /** @private */

      this._pollElement = this.shadowRoot.querySelector('#poll');
      /** @private */

      this._focusElement = this.shadowRoot.querySelector('#focus');
      /**
       * @private
       * @type {EventTarget}
       */

      this._eventTarget = null;
      /**
       * @private
       * @type {InputSource}
       */

      this._sourceState = null;
      /** @private */

      this.onSourcePoll = this.onSourcePoll.bind(this);
      /** @private */

      this.onSourceInput = this.onSourceInput.bind(this);
      /** @private */

      this.onTargetFocus = this.onTargetFocus.bind(this);
      /** @private */

      this.onTargetBlur = this.onTargetBlur.bind(this);
      /** @private */

      this.onPollStatusCheck = this.onPollStatusCheck.bind(this);
      /** @private */

      this._intervalHandle = null;
    }

    get eventTarget() {
      return this._eventTarget;
    }

    get source() {
      return this._sourceState;
    }
    /** @override */


    connectedCallback() {
      if (Object.prototype.hasOwnProperty.call(this, "oninput")) {
        let value = this.oninput;
        delete this.oninput;
        this.oninput = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "onpoll")) {
        let value = this.onpoll;
        delete this.onpoll;
        this.onpoll = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "onchange")) {
        let value = this.onchange;
        delete this.onchange;
        this.onchange = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "for")) {
        let value = this.for;
        delete this.for;
        this.for = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "autopoll")) {
        let value = this.autopoll;
        delete this.autopoll;
        this.autopoll = value;
      } // Allows this element to be focusable


      if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // Initialize input source event target as self, if unset

      if (!this.hasAttribute('for') && !this._eventTarget) {
        this.setEventTarget(this);
      }

      this._intervalHandle = setInterval(this.onPollStatusCheck, INTERVAL_DURATION);
    }
    /** @override */


    disconnectedCallback() {
      this.clearEventTarget();
      clearInterval(this._intervalHandle);
    }
    /** @override */


    attributeChangedCallback(attribute, prev, value) {
      /** Generated by cuttle.js */
      switch (attribute) {
        case "for":
          this._for = value;
          break;

        case "autopoll":
          {
            this._autopoll = value !== null;
          }
          break;

        case "oninput":
          {
            this.oninput = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
          }
          break;

        case "onpoll":
          {
            this.onpoll = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
          }
          break;

        case "onchange":
          {
            this.onchange = new Function('event', 'with(document){with(this){' + value + '}}').bind(this);
          }
          break;
      }

      ((attribute, prev, value) => {
        switch (attribute) {
          case 'for':
            {
              let target;
              let name;

              if (value) {
                target = document.getElementById(value);
                name = `${target.tagName.toLowerCase()}#${value}`;
              } else {
                target = this;
                name = 'input-source';
              }

              this.setEventTarget(value ? document.getElementById(value) : this); // For debug info

              this._titleElement.innerHTML = `for(${name})`;
            }
            break;

          case 'autopoll':
            {
              if (this._sourceState) {
                this._sourceState.autopoll = this._autopoll;
              }
            }
            break;
        }
      })(attribute, prev, value);
    }
    /**
     * Set event target to listen for input events.
     * 
     * @protected
     * @param {EventTarget} [eventTarget] The event target to listen for input events. If
     * falsey, no target will be listened to.
     */


    setEventTarget(eventTarget = undefined) {
      this.clearEventTarget();

      if (eventTarget) {
        let sourceState = InputSource.for(eventTarget);
        this._sourceState = sourceState;
        this._eventTarget = eventTarget;
        sourceState.autopoll = this.autopoll;
        sourceState.addEventListener('poll', this.onSourcePoll);
        sourceState.addEventListener('input', this.onSourceInput);
        eventTarget.addEventListener('focus', this.onTargetFocus);
        eventTarget.addEventListener('blur', this.onTargetBlur);
        this.dispatchEvent(new CustomEvent('change', {
          composed: true,
          bubbles: false
        }));
      }

      return this;
    }
    /**
     * Stop listening to the current target for input events.
     * 
     * @protected
     */


    clearEventTarget() {
      if (this._eventTarget) {
        let eventTarget = this._eventTarget;
        let sourceState = this._sourceState;
        this._eventTarget = null;
        this._sourceState = null;

        if (eventTarget) {
          eventTarget.removeEventListener('focus', this.onTargetFocus);
          eventTarget.removeEventListener('blur', this.onTargetBlur); // Event source also exists (and therefore should be removed) if event target was setup.

          sourceState.removeEventListener('poll', this.onSourcePoll);
          sourceState.removeEventListener('input', this.onSourceInput); // Clean up event source if no longer used.

          InputSource.delete(eventTarget);
        }
      }
    }
    /**
     * Poll input state from devices.
     * 
     * @param {number} now The current time in milliseconds.
     */


    poll(now) {
      this._sourceState.poll(now);
    }
    /** @private */


    onPollStatusCheck() {
      if (this._sourceState && this._sourceState.polling) {
        this._pollElement.innerHTML = '✓';
      } else {
        this._pollElement.innerHTML = '';
      }
    }
    /** @private */


    onSourceInput({
      stage,
      deviceName,
      keyCode,
      input
    }) {
      this.dispatchEvent(new CustomEvent('input', {
        composed: true,
        bubbles: false,
        detail: {
          stage,
          deviceName,
          keyCode,
          input
        }
      }));
    }
    /** @private */


    onSourcePoll({
      now
    }) {
      this.dispatchEvent(new CustomEvent('poll', {
        composed: true,
        bubbles: false,
        detail: {
          now
        }
      }));
    }
    /** @private */


    onTargetFocus() {
      this._focusElement.innerHTML = '✓';
    }
    /** @private */


    onTargetBlur() {
      this._focusElement.innerHTML = '';
    }

    static get observedAttributes() {
      return ["oninput", "onpoll", "onchange", "for", "autopoll"];
    }

  }

  window.customElements.define('input-source', InputSourceElement);
  /**
   * @typedef {import('./InputMapElement.js').InputMapElement} InputMapElement
   * @typedef {import('../source/InputSourceElement.js').InputSourceElement} InputSourceElement
   */

  /**
   * @param {HTMLElement} element The target element.
   * @param {string} propertyName The name of the property to upgrade.
   */

  function upgradeProperty$1(element, propertyName) {
    if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
      let value = element[propertyName];
      delete element[propertyName];
      element[propertyName] = value;
    }
  }

  class InputPort extends HTMLElement {
    /** Generated by cuttle.js */
    static get [Symbol.for("cuttleTemplate")]() {
      let t = document.createElement("template");
      t.innerHTML = INNER_HTML$2;
      Object.defineProperty(this, Symbol.for("cuttleTemplate"), {
        value: t
      });
      return t;
    }
    /** Generated by cuttle.js */


    static get [Symbol.for("cuttleStyle")]() {
      let s = document.createElement("style");
      s.innerHTML = INNER_STYLE$2;
      Object.defineProperty(this, Symbol.for("cuttleStyle"), {
        value: s
      });
      return s;
    }

    static get properties() {
      // src: A custom type,
      return {
        for: String,
        autopoll: Boolean,
        disabled: Boolean
      };
    }
    /** @override */


    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this.toggleAttribute("disabled", value);
    }

    get autopoll() {
      return this._autopoll;
    }

    set autopoll(value) {
      this.toggleAttribute("autopoll", value);
    }

    get for() {
      return this._for;
    }

    set for(value) {
      this.setAttribute("for", value);
    }

    static get observedAttributes() {
      return ["for", "autopoll", "disabled", 'src'];
    }

    constructor(inputContext = new InputContext()) {
      super();
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));
      this.shadowRoot.appendChild(this.constructor[Symbol.for("cuttleStyle")].cloneNode(true));
      /** @private */

      this._src = '';
      /**
       * @private
       * @type {InputMapElement}
       */

      this._mapElement = this.shadowRoot.querySelector('input-map');
      /**
       * @private
       * @type {InputSourceElement}
       */

      this._sourceElement = this.shadowRoot.querySelector('input-source');
      /** @private */

      this._context = inputContext;
      /** @private */

      this.onSourcePoll = this.onSourcePoll.bind(this);
      /** @private */

      this.onSourceChange = this.onSourceChange.bind(this);
      /** @private */

      this.onContextChange = this.onContextChange.bind(this);

      this._sourceElement.addEventListener('poll', this.onSourcePoll);

      this._sourceElement.addEventListener('change', this.onSourceChange);

      this._context.addEventListener('change', this.onContextChange);
    }

    get context() {
      return this._context;
    }

    get source() {
      return this._sourceElement.source;
    }

    get mapping() {
      return this._mapElement.map;
    }
    /**
     * @returns {string|object}
     */


    get src() {
      return this._src;
    }
    /**
     * @param {string|object} value
     */


    set src(value) {
      this.setAttribute('src', typeof value === 'string' ? value : JSON.stringify(value));
    }
    /** @override */


    connectedCallback() {
      if (Object.prototype.hasOwnProperty.call(this, "for")) {
        let value = this.for;
        delete this.for;
        this.for = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "autopoll")) {
        let value = this.autopoll;
        delete this.autopoll;
        this.autopoll = value;
      }

      if (Object.prototype.hasOwnProperty.call(this, "disabled")) {
        let value = this.disabled;
        delete this.disabled;
        this.disabled = value;
      }

      upgradeProperty$1(this, 'src');
    }
    /** @override */


    attributeChangedCallback(attribute, prev, value) {
      /** Generated by cuttle.js */
      switch (attribute) {
        case "for":
          this._for = value;
          break;

        case "autopoll":
          {
            this._autopoll = value !== null;
          }
          break;

        case "disabled":
          {
            this._disabled = value !== null;
          }
          break;
      }

      ((attribute, prev, value) => {
        switch (attribute) {
          case 'for':
            {
              this._sourceElement.for = value;
            }
            break;

          case 'src':
            if (this._src !== value) {
              this._src = value;

              if (value.trim().startsWith('{')) {
                let jsonData = JSON.parse(value);
                this.updateMapping(jsonData);
              } else {
                fetch(value).then(fileBlob => fileBlob.json()).then(jsonData => this.updateMapping(jsonData));
              }
            }

            break;

          case 'autopoll':
            this._sourceElement.autopoll = this._autopoll;
            break;

          case 'disabled':
            if (this._context.source) {
              this._context.disabled = this._disabled;
            }

            break;
        }
      })(attribute, prev, value);
    }
    /** @private */


    updateMapping(inputMapping) {
      this._context.setInputMapping(inputMapping);

      this._mapElement.src = inputMapping;
    }
    /** @private */


    onSourcePoll() {
      for (let [inputName, entries] of Object.entries(this._mapElement.mapElements)) {
        let value = this._context.getInputState(inputName);

        let primary = entries[0];
        let outputElement = primary.querySelector('output');
        outputElement.innerText = Number(value).toFixed(2);
      }
    }
    /** @private */


    onSourceChange() {
      if (this._context.source) this._context.detach();

      if (this._sourceElement.source) {
        this._context.attach(this._sourceElement.source);

        this._context.disabled = this._disabled;
      }
    }
    /** @private */


    onContextChange() {
      this._mapElement.src = this._context.mapping;
    }

    hasInput(inputName) {
      return this._context.hasInput(inputName);
    }

    getInput(inputName) {
      return this._context.getInput(inputName);
    }

    getInputState(inputName) {
      return this._context.getInputState(inputName);
    }

    getInputChanged(inputName) {
      return this._context.getInputChanged(inputName);
    }

  }

  window.customElements.define('input-port', InputPort);

  glMatrix.vec3.fromValues(0, 1, 0);

  class Camera {
    constructor(projectionMatrix, viewMatrix) {
      this.projectionMatrix = projectionMatrix;
      this.viewMatrix = viewMatrix;
    }
    /** @abstract */


    resize(viewportWidth, viewportHeight) {
      return this;
    }

  }

  class OrthographicCamera extends Camera {
    constructor(left, top, right, bottom, near, far) {
      super(glMatrix.mat4.create(), glMatrix.mat4.create());
      this.bounds = {
        left,
        top,
        right,
        bottom
      };
      this.clippingPlane = {
        near,
        far
      };
    }
    /** @override */


    resize(viewportWidth, viewportHeight) {
      const aspectRatio = viewportWidth / viewportHeight;
      const {
        near,
        far
      } = this.clippingPlane;
      const {
        left,
        top,
        right,
        bottom
      } = this.bounds;
      glMatrix.mat4.ortho(this.projectionMatrix, left * aspectRatio, right * aspectRatio, bottom, top, near, far);
      return this;
    }

  }

  window.addEventListener('error', error, true);
  window.addEventListener('unhandledrejection', error, true);
  function error(e) {
    if (e instanceof PromiseRejectionEvent) {
      window.alert(e.reason.stack);
    } else if (e instanceof ErrorEvent) {
      window.alert(e.error.stack);
    } else {
      window.alert(JSON.stringify(e));
    }
  }

  /**
   * Checks whether the context supports WebGL2 features.
   * 
   * @param {WebGLRenderingContextBase} gl The webgl context.
   * @returns {boolean} Whether WebGL2 is supported.
   */
  function isWebGL2Supported(gl) {
    return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  }

  class BufferDataContext {
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     */
    constructor(gl, target) {
      this.gl = gl;
      this.target = target;
    }
    /**
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferDataContext}
     */


    data(srcDataOrSize, usage = undefined) {
      const gl = this.gl;
      const target = this.target;

      if (typeof srcDataOrSize === 'number') {
        gl.bufferData(target, srcDataOrSize, usage || gl.STATIC_DRAW);
      } else {
        if (!ArrayBuffer.isView(srcDataOrSize)) throw new Error('Source data must be a typed array.');
        gl.bufferData(target, srcDataOrSize, usage || gl.STATIC_DRAW);
      }

      return this;
    }
    /**
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferDataContext}
     */


    subData(srcData, dstOffset = 0, srcOffset = undefined, srcLength = undefined) {
      const gl = this.gl;
      const target = this.target;
      if (!ArrayBuffer.isView(srcData)) throw new Error('Source data must be a typed array.');

      if (srcOffset) {
        if (isWebGL2Supported(gl)) {
          gl.bufferSubData(target, dstOffset, srcData, srcOffset, srcLength);
        } else {
          const srcSubData = srcLength ? srcData.subarray(srcOffset, srcOffset + srcLength) : srcData.subarray(srcOffset);
          gl.bufferSubData(target, dstOffset, srcSubData);
        }
      } else {
        gl.bufferSubData(target, dstOffset, srcData);
      }

      return this;
    }

  }

  class BufferBuilder extends BufferDataContext {
    /**
     * @param {WebGLRenderingContextBase} gl The webgl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {WebGLBuffer} [buffer] The buffer handle. If undefined, a
     * new buffer will be created.
     */
    constructor(gl, target, buffer = undefined) {
      super(gl, target);
      this.handle = buffer || gl.createBuffer();
      gl.bindBuffer(target, this.handle);
    }

    build() {
      return this.handle;
    }

  }
  /**
   * Creates a buffer source given the type and data.
   * 
   * @param {WebGLRenderingContextBase} gl The gl context.
   * @param {GLenum} type The data type of the elements in the buffer. Usually,
   * this is `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
   * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`,
   * `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT` for WebGL2.
   * @param {Array} data The buffer source data array.
   * @returns {BufferSource} The typed array buffer containing the given data.
   */


  function createBufferSource(gl, type, data) {
    const TypedArray = getBufferTypedArray(gl, type);
    return new TypedArray(data);
  }
  /**
   * Create a buffer with the given source.
   * 
   * @param {WebGLRenderingContextBase} gl The gl context.
   * @param {GLenum} target The buffer bind target. Usually, this is `gl.ARRAY_BUFFER` or
   * `gl.ELEMENT_ARRAY_BUFFER`.
   * @param {BufferSource} bufferSource The typed array buffer containing the given data.
   * For convenience, you can use `BufferHelper.createBufferSource()` to convert a data array
   * to the appropriate typed array.
   * @param {GLenum} usage The buffer usage hint. By default, this is `gl.STATIC_DRAW`.
   * @returns {WebGLBuffer} The created and bound data buffer.
   */


  function createBuffer(gl, target, bufferSource, usage = undefined) {
    let handle = gl.createBuffer();
    gl.bindBuffer(target, handle);
    if (!ArrayBuffer.isView(bufferSource)) throw new Error('Source data must be a typed array.');
    gl.bufferData(target, bufferSource, usage || gl.STATIC_DRAW);
    return handle;
  }

  function getBufferTypedArray(gl, bufferType) {
    // NOTE: For WebGL2, gl.HALF_FLOAT (float16) does not have an associated TypedArray.
    switch (bufferType) {
      case gl.BYTE:
        return Int8Array;

      case gl.UNSIGNED_BYTE:
        return Uint8Array;

      case gl.SHORT:
        return Int16Array;

      case gl.UNSIGNED_SHORT:
        return Uint16Array;

      case gl.INT:
        return Int32Array;

      case gl.UNSIGNED_INT:
        return Uint32Array;

      case gl.FLOAT:
        return Float32Array;

      default:
        throw new Error('Cannot find valid typed array for buffer type.');
    }
  }

  function getTypedArrayBufferType(gl, typedArray) {
    // NOTE: For WebGL2, gl.HALF_FLOAT (float16) does not have an associated TypedArray.
    switch (typedArray) {
      case Int8Array:
        return gl.BYTE;

      case Uint8Array:
        return gl.UNSIGNED_BYTE;

      case Int16Array:
        return gl.SHORT;

      case Uint16Array:
        return gl.UNSIGNED_SHORT;

      case Int32Array:
        return gl.INT;

      case Uint32Array:
        return gl.UNSIGNED_INT;

      case Float32Array:
        return gl.FLOAT;

      default:
        throw new Error('Cannot find valid buffer type for typed array.');
    }
  }

  function getBufferUsage(gl, target, buffer) {
    gl.bindBuffer(target, buffer);
    return gl.getBufferParameter(target, gl.BUFFER_USAGE);
  }

  var BufferHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createBufferSource: createBufferSource,
    createBuffer: createBuffer,
    getBufferTypedArray: getBufferTypedArray,
    getTypedArrayBufferType: getTypedArrayBufferType,
    getBufferUsage: getBufferUsage
  });

  class BufferInfo {
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     */
    static builder(gl, target) {
      return new BufferInfoBuilder(gl, target);
    }
    /**
     * @param {WebGLRenderingContextBase} gl The gl context.
     * @param {GLenum} target The buffer bind target. Usually, this is
     * `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`.
     * @param {GLenum} bufferType The buffer data type. Usually, this is
     * `gl.FLOAT` for array buffers or `gl.UNSIGNED_SHORT` for element
     * array buffers. It must be either `gl.BYTE`, `gl.UNSIGNED_BYTE`,
     * `gl.SHORT`, `gl.UNSIGNED_SHORT`, `gl.FLOAT`, or `gl.HALF_FLOAT`
     * for WebGL2.
     * @param {WebGLBuffer} buffer The buffer handle.
     */


    constructor(gl, target, bufferType, buffer) {
      this.gl = gl;
      this.target = target;
      this.handle = buffer;
      this.type = bufferType;
      /** @private */

      this.bindContext = new BufferInfoBindContext(gl, this);
    }

    bind(gl) {
      gl.bindBuffer(this.target, this.handle);
      this.bindContext.gl = gl;
      return this.bindContext;
    }

  }

  class BufferInfoBindContext extends BufferDataContext {
    constructor(gl, bufferInfo) {
      super(gl, bufferInfo.target);
      /** @private */

      this.parent = bufferInfo;
    }

  }

  class BufferInfoBuilder extends BufferBuilder {
    constructor(gl, target) {
      super(gl, target);
      /** @private */

      this.bufferType = gl.FLOAT;
    }
    /**
     * @override
     * @param {BufferSource|number} srcDataOrSize The buffer data source or the buffer size in bytes.
     * @param {GLenum} [usage] The buffer data usage. By default, this is `gl.STATIC_DRAW`.
     * @returns {BufferInfoBuilder}
     */


    data(srcDataOrSize, usage = undefined) {
      super.data(srcDataOrSize, usage);

      if (typeof srcDataOrSize !== 'number') {
        const typedArray = srcDataOrSize.constructor;
        this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
      }

      return this;
    }
    /**
     * @override
     * @param {BufferSource} srcData The buffer data source.
     * @param {number} [dstOffset] The destination byte offset to put the data.
     * @param {number} [srcOffset] The source array index offset to copy the data from.
     * @param {number} [srcLength] The source array count to copy the data until.
     * @returns {BufferInfoBuilder}
     */


    subData(srcData, dstOffset = undefined, srcOffset = undefined, srcLength = undefined) {
      super.subData(srcData, dstOffset, srcOffset, srcLength);
      const typedArray = srcData.constructor;
      this.bufferType = getTypedArrayBufferType(this.gl, typedArray);
      return this;
    }
    /** @override */


    build() {
      const handle = super.build();
      const gl = this.gl;
      const target = this.target;
      const type = this.bufferType;
      return new BufferInfo(gl, target, type, handle);
    }

  } // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
  /**
   * @callback UniformArrayFunction
   * @param {WebGLUniformLocation} location The uniform location.
   * @param {Float32List|Int32List} value The vector array.
   * @this {WebGLRenderingContext|WebGL2RenderingContext}
   * 
   * @callback UniformComponentFunction
   * @param {WebGLUniformLocation} location The uniform location.
   * @param {...Number} values The components of the vector.
   * @this {WebGLRenderingContext|WebGL2RenderingContext}
   * 
   * @typedef {UniformArrayFunction|UniformComponentFunction} UniformFunction
   */

  /**
   * Gets the uniform modifier function by uniform type. For uniform vectors
   * of size 1, it accepts a single number value. For vectors of greater
   * size, it takes an array of numbers.
   * 
   * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
   * @param {GLenum} uniformType The uniform data type.
   * @returns {UniformFunction} The uniform modifier function.
   */

  function getUniformFunction(gl, uniformType) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
    switch (uniformType) {
      // WebGL1
      case gl.FLOAT:
        return gl.uniform1f;

      case gl.FLOAT_VEC2:
        return gl.uniform2fv;

      case gl.FLOAT_VEC3:
        return gl.uniform3fv;

      case gl.FLOAT_VEC4:
        return gl.uniform4fv;

      case gl.INT:
        return gl.uniform1i;

      case gl.INT_VEC2:
        return gl.uniform2iv;

      case gl.INT_VEC3:
        return gl.uniform3iv;

      case gl.INT_VEC4:
        return gl.uniform4iv;

      case gl.BOOL:
        return gl.uniform1i;

      case gl.BOOL_VEC2:
        return gl.uniform2iv;

      case gl.BOOL_VEC3:
        return gl.uniform3iv;

      case gl.BOOL_VEC4:
        return gl.uniform4iv;

      case gl.FLOAT_MAT2:
        return uniformMatrix2fv;

      case gl.FLOAT_MAT3:
        return uniformMatrix3fv;

      case gl.FLOAT_MAT4:
        return uniformMatrix4fv;
      // WeblGL1 Samplers

      case gl.SAMPLER_2D:
      case gl.SAMPLER_CUBE:
        return gl.uniform1i;
    }

    if (isWebGL2Supported(gl)) {
      switch (uniformType) {
        // WebGL2
        case gl.UNSIGNED_INT:
          return gl.uniform1ui;

        case gl.UNSIGNED_INT_VEC2:
          return gl.uniform2uiv;

        case gl.UNSIGNED_INT_VEC3:
          return gl.uniform3uiv;

        case gl.UNSIGNED_INT_VEC4:
          return gl.uniform4uiv;

        case gl.FLOAT_MAT2x3:
          return uniformMatrix2x3fv;

        case gl.FLOAT_MAT2x4:
          return uniformMatrix2x4fv;

        case gl.FLOAT_MAT3x2:
          return uniformMatrix3x2fv;

        case gl.FLOAT_MAT3x4:
          return uniformMatrix3x4fv;

        case gl.FLOAT_MAT4x2:
          return uniformMatrix4x2fv;

        case gl.FLOAT_MAT4x3:
          return uniformMatrix4x3fv;
        // WeblGL2 Samplers

        case gl.SAMPLER_3D:
        case gl.SAMPLER_2D_SHADOW:
        case gl.SAMPLER_2D_ARRAY:
        case gl.SAMPLER_2D_ARRAY_SHADOW:
        case gl.SAMPLER_CUBE_SHADOW:
        case gl.INT_SAMPLER_2D:
        case gl.INT_SAMPLER_3D:
        case gl.INT_SAMPLER_CUBE:
        case gl.INT_SAMPLER_2D_ARRAY:
        case gl.UNSIGNED_INT_SAMPLER_2D:
        case gl.UNSIGNED_INT_SAMPLER_3D:
        case gl.UNSIGNED_INT_SAMPLER_CUBE:
        case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
          return gl.uniform1i;
      }
    }

    throw new Error('Cannot find uniform function for gl enum.');
  }
  /**
   * Get the array uniform modifier function by uniform type.
   * 
   * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The webgl context.
   * @param {GLenum} uniformType The uniform data type.
   * @returns {UniformArrayFunction} The array uniform modifier function.
   */


  function getUniformFunctionForArray(gl, uniformType) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
    switch (uniformType) {
      // WebGL1
      case gl.FLOAT:
        return gl.uniform1fv;

      case gl.FLOAT_VEC2:
        return gl.uniform2fv;

      case gl.FLOAT_VEC3:
        return gl.uniform3fv;

      case gl.FLOAT_VEC4:
        return gl.uniform4fv;

      case gl.INT:
        return gl.uniform1iv;

      case gl.INT_VEC2:
        return gl.uniform2iv;

      case gl.INT_VEC3:
        return gl.uniform3iv;

      case gl.INT_VEC4:
        return gl.uniform4iv;

      case gl.BOOL:
        return gl.uniform1iv;

      case gl.BOOL_VEC2:
        return gl.uniform2iv;

      case gl.BOOL_VEC3:
        return gl.uniform3iv;

      case gl.BOOL_VEC4:
        return gl.uniform4iv;

      case gl.FLOAT_MAT2:
        return uniformMatrix2fv;

      case gl.FLOAT_MAT3:
        return uniformMatrix3fv;

      case gl.FLOAT_MAT4:
        return uniformMatrix4fv;

      case gl.SAMPLER_2D:
      case gl.SAMPLER_CUBE:
        return gl.uniform1iv;
    }

    if (isWebGL2Supported(gl)) {
      switch (uniformType) {
        // WebGL2
        case gl.UNSIGNED_INT:
          return gl.uniform1uiv;

        case gl.UNSIGNED_INT_VEC2:
          return gl.uniform2uiv;

        case gl.UNSIGNED_INT_VEC3:
          return gl.uniform3uiv;

        case gl.UNSIGNED_INT_VEC4:
          return gl.uniform4uiv;

        case gl.FLOAT_MAT2x3:
          return uniformMatrix2x3fv;

        case gl.FLOAT_MAT2x4:
          return uniformMatrix2x4fv;

        case gl.FLOAT_MAT3x2:
          return uniformMatrix3x2fv;

        case gl.FLOAT_MAT3x4:
          return uniformMatrix3x4fv;

        case gl.FLOAT_MAT4x2:
          return uniformMatrix4x2fv;

        case gl.FLOAT_MAT4x3:
          return uniformMatrix4x3fv;
        // WebGL2 Samplers

        case gl.SAMPLER_3D:
        case gl.SAMPLER_2D_SHADOW:
        case gl.SAMPLER_2D_ARRAY:
        case gl.SAMPLER_2D_ARRAY_SHADOW:
        case gl.SAMPLER_CUBE_SHADOW:
        case gl.INT_SAMPLER_2D:
        case gl.INT_SAMPLER_3D:
        case gl.INT_SAMPLER_CUBE:
        case gl.INT_SAMPLER_2D_ARRAY:
        case gl.UNSIGNED_INT_SAMPLER_2D:
        case gl.UNSIGNED_INT_SAMPLER_3D:
        case gl.UNSIGNED_INT_SAMPLER_CUBE:
        case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
          return gl.uniform1iv;
      }
    }

    throw new Error('Cannot find array uniform function for gl enum.');
  }

  function uniformMatrix2fv(location, value) {
    this.uniformMatrix2fv(location, false, value);
  }

  function uniformMatrix3fv(location, value) {
    this.uniformMatrix3fv(location, false, value);
  }

  function uniformMatrix4fv(location, value) {
    this.uniformMatrix4fv(location, false, value);
  }

  function uniformMatrix2x3fv(location, value) {
    this.uniformMatrix2x3fv(location, false, value);
  }

  function uniformMatrix2x4fv(location, value) {
    this.uniformMatrix2x4fv(location, false, value);
  }

  function uniformMatrix3x2fv(location, value) {
    this.uniformMatrix3x2fv(location, false, value);
  }

  function uniformMatrix3x4fv(location, value) {
    this.uniformMatrix3x4fv(location, false, value);
  }

  function uniformMatrix4x2fv(location, value) {
    this.uniformMatrix4x2fv(location, false, value);
  }

  function uniformMatrix4x3fv(location, value) {
    this.uniformMatrix4x3fv(location, false, value);
  }
  /**
   * Get the number of expected elements in the attribute vertex type.
   * 
   * @param {WebGLRenderingContextBase} gl The gl context.
   * @param {GLenum} attribType The attribute gl type.
   * @returns {number} The number of expected elements in the attribute vertex type.
   */

  function getAttribVertexSize(gl, attribType) {
    // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glGetActiveAttrib.xml
    switch (attribType) {
      case gl.FLOAT:
        return 1;

      case gl.FLOAT_VEC2:
        return 2;

      case gl.FLOAT_VEC3:
        return 3;

      case gl.FLOAT_VEC4:
        return 4;

      case gl.FLOAT_MAT2:
        return 4;

      case gl.FLOAT_MAT3:
        return 9;

      case gl.FLOAT_MAT4:
        return 16;

      default:
        throw new Error('Invalid vertex attribute type.');
    }
  }
  /**
   * @typedef ActiveAttributeInfo
   * @property {GLenum} type
   * @property {Number} length
   * @property {Number} location
   */

  /**
   * Get map of all active uniforms to their info in the shader program.
   * 
   * @param {WebGLRenderingContext} gl The webgl context.
   * @param {WebGLProgram} program The program to get active attributes from.
   * @returns {Record<String, ActiveAttributeInfo>} An object mapping of attribute names to info.
   */


  function getActiveAttribsInfo(gl, program) {
    let result = {};
    const attributeInfos = getActiveAttribs(gl, program);

    for (let attributeInfo of attributeInfos) {
      const attributeName = attributeInfo.name;
      const attributeSize = attributeInfo.size;
      const attributeType = attributeInfo.type;
      const attributeLocation = gl.getAttribLocation(program, attributeName);
      const attributeComponents = getAttribVertexSize(gl, attributeType);
      result[attributeName] = {
        type: attributeType,
        length: attributeSize,
        location: attributeLocation,
        size: attributeComponents
      };
    }

    return result;
  }
  /**
   * Create and compile shader from source text.
   * 
   * @param {WebGLRenderingContextBase} gl The webgl context.
   * @param {GLenum} type The type of the shader. This is usually `gl.VERTEX_SHADER`
   * or `gl.FRAGMENT_SHADER`.
   * @param {string} shaderSource The shader source text.
   * @returns {WebGLShader} The compiled shader.
   */


  function createShader(gl, shaderType, shaderSource) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!status) {
      console.error(gl.getShaderInfoLog(shader) + `\nFailed to compile shader:\n${shaderSource}`);
      gl.deleteShader(shader);
    }

    return shader;
  }
  /**
   * Link the given shader program from list of compiled shaders.
   * 
   * @param {WebGLRenderingContextBase} gl The webgl context.
   * @param {WebGLProgram} program The type of the shader.
   * This is usually `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.
   * @param {Array<WebGLShader>} shaders The list of compiled shaders
   * to link in the program.
   * @returns {WebGLProgram} The linked shader program.
   */


  function createShaderProgram(gl, program, shaders) {
    // Attach to the program.
    for (let shader of shaders) {
      gl.attachShader(program, shader);
    } // Link'em!


    gl.linkProgram(program); // Don't forget to clean up the shaders! It's no longer needed.

    for (let shader of shaders) {
      gl.detachShader(program, shader);
      gl.deleteShader(shader);
    }

    let status = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!status) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }

    return program;
  }
  /**
   * Get list of parameter infos for all active uniforms in the shader program.
   * 
   * @param {WebGLRenderingContextBase} gl The webgl context.
   * @param {WebGLProgram} program The program to get the active uniforms from.
   * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
   */


  function getActiveUniforms(gl, program) {
    let result = [];
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; ++i) {
      let uniformInfo = gl.getActiveUniform(program, i);
      if (!uniformInfo) break;
      result.push(uniformInfo);
    }

    return result;
  }
  /**
   * Get list of parameter infos for all active attributes in the shader program.
   * 
   * @param {WebGLRenderingContextBase} gl The webgl context.
   * @param {WebGLProgram} program The program to get the active attributes from.
   * @returns {Array<WebGLActiveInfo>} An array of active attributes.
   */


  function getActiveAttribs(gl, program) {
    let result = [];
    const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < attributeCount; ++i) {
      let attributeInfo = gl.getActiveAttrib(program, i);
      if (!attributeInfo) continue;
      result.push(attributeInfo);
    }

    return result;
  }
  /**
   * Draw the currently bound render context.
   * 
   * @param {WebGLRenderingContextBase} gl 
   * @param {Number} mode 
   * @param {Number} offset 
   * @param {Number} count 
   * @param {WebGLBuffer} [elementBuffer]
   */


  function draw(gl, mode, offset, count, elementBuffer = undefined) {
    if (elementBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
      gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
    } else {
      gl.drawArrays(mode, offset, count);
    }
  }
  /**
   * @typedef {import('./UniformTypeInfo.js').UniformFunction} UniformFunction
   */

  /**
   * @typedef ActiveUniformInfo
   * @property {String} type
   * @property {Number} length
   * @property {Number} location
   * @property {UniformFunction} set
   */

  /**
   * Get map of all active uniforms to their info in the shader program.
   * 
   * @param {WebGLRenderingContext} gl The webgl context.
   * @param {WebGLProgram} program The program to get active uniforms from.
   * @returns {Record<String, ActiveUniformInfo>} An object mapping of uniform names to info.
   */

  function getActiveUniformsInfo(gl, program) {
    let result = {};
    const activeUniforms = getActiveUniforms(gl, program);

    for (let activeInfo of activeUniforms) {
      const uniformName = activeInfo.name;
      const uniformSize = activeInfo.size;
      const uniformType = activeInfo.type;
      const uniformLocation = gl.getUniformLocation(program, uniformName);
      let uniformSet;

      if (uniformSize <= 1) {
        // Is a single value uniform
        uniformSet = getUniformFunction(gl, uniformType);
      } else {
        // Is an array uniform
        uniformSet = getUniformFunctionForArray(gl, uniformType);
      }

      result[uniformName] = {
        type: uniformType,
        length: uniformSize,
        location: uniformLocation,
        set: uniformSet
      };
    }

    return result;
  }

  class ProgramBuilder {
    constructor(gl, program = undefined) {
      this.handle = program || gl.createProgram();
      this.shaders = [];
      this.gl = gl;
    }

    shader(shaderType, shaderSource) {
      const gl = this.gl;
      let shader = createShader(gl, shaderType, shaderSource);
      this.shaders.push(shader);
      return this;
    }

    link() {
      const gl = this.gl;
      createShaderProgram(gl, this.handle, this.shaders);
      this.shaders.length = 0;
      return this.handle;
    }

  }

  class ProgramInfo {
    static builder(gl) {
      return new ProgramInfoBuilder(gl);
    }

    constructor(gl, program) {
      this.handle = program;
      this.activeUniforms = getActiveUniformsInfo(gl, program);
      this.activeAttributes = getActiveAttribsInfo(gl, program);
      /** @private */

      this.drawContext = new ProgramInfoDrawContext(gl, this);
    }
    /**
     * Bind the program and prepare to draw. This returns the bound context
     * that can modify the draw state.
     * 
     * @param {WebGLRenderingContextBase} gl 
     * @returns {ProgramInfoDrawContext} The bound context to draw with.
     */


    bind(gl) {
      gl.useProgram(this.handle);
      this.drawContext.gl = gl;
      return this.drawContext;
    }

  }

  class ProgramInfoDrawContext {
    constructor(gl, programInfo) {
      this.gl = gl;
      /** @private */

      this.parent = programInfo;
    }

    uniform(uniformName, value) {
      const activeUniforms = this.parent.activeUniforms;

      if (uniformName in activeUniforms) {
        let uniform = activeUniforms[uniformName];
        let location = uniform.location;
        uniform.set.call(this.gl, location, value);
      }

      return this;
    }
    /**
     * @param {string} attributeName Name of the attribute.
     * @param {GLenum} bufferType The buffer data type. This is usually `gl.FLOAT`
     * but can also be one of `gl.BYTE`, `gl.UNSIGNED_BYTE`, `gl.SHORT`, `gl.UNSIGNED_SHORT`
     * or `gl.HALF_FLOAT` for WebGL2.
     * @param {WebGLBuffer} buffer The buffer handle.
     * @param {boolean} [normalize=false] Whether to normalize the vectors in the buffer.
     * @param {number} [stride=0] The stride for each vector in the buffer.
     * @param {number} [offset=0] The initial offset in the buffer.
     */


    attribute(attributeName, bufferType, buffer, normalize = false, stride = 0, offset = 0) {
      const gl = this.gl;
      const activeAttributes = this.parent.activeAttributes;

      if (attributeName in activeAttributes) {
        let attribute = activeAttributes[attributeName];
        let location = attribute.location;
        let size = attribute.size;

        if (buffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.vertexAttribPointer(location, size, bufferType, normalize, stride, offset);
          gl.enableVertexAttribArray(location);
        } else {
          gl.disableVertexAttribArray(location);
        }
      }

      return this;
    }
    /**
     * Draws using this program.
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {number} mode 
     * @param {number} offset 
     * @param {number} count 
     * @param {WebGLBuffer} elementBuffer 
     */


    draw(gl, mode, offset, count, elementBuffer = null) {
      draw(gl, mode, offset, count, elementBuffer);
      return this.parent;
    }

  }

  class ProgramInfoBuilder extends ProgramBuilder {
    constructor(gl) {
      super(gl);
    }
    /** @override */


    link() {
      const handle = super.link();
      return new ProgramInfo(this.gl, handle);
    }

  } // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

  class QuadRendererBase {
    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
      /** @protected */
      this.gl = gl;
      /** @private */

      this._transformMatrix = glMatrix.mat4.create();
      /** @private */

      this._projectionViewMatrix = glMatrix.mat4.create();
      /** @private */

      this._matrix = glMatrix.mat4.create();
      /** @private */

      this._vector = glMatrix.vec3.create();
    }

    setTransformationMatrix(matrix) {
      glMatrix.mat4.copy(this._transformMatrix, matrix);
      return this;
    }

    getTransformationMatrix() {
      return this._transformMatrix;
    }

    setProjectionViewMatrix(matrix) {
      glMatrix.mat4.copy(this._projectionViewMatrix, matrix);
      return this;
    }

    getProjectionViewMatrix() {
      return this._projectionViewMatrix;
    }
    /** @protected */


    updateModelMatrix(posX, posY, scaleX, scaleY) {
      let m = this._matrix;
      let v = this._vector;
      glMatrix.mat4.copy(m, this._transformMatrix);
      glMatrix.mat4.translate(m, m, glMatrix.vec3.set(v, posX, posY, 0));
      glMatrix.mat4.scale(m, m, glMatrix.vec3.set(v, scaleX, scaleY, 1));
      return m;
    }
    /** @abstract */


    draw(posX = 0, posY = 0, scaleX = 1, scaleY = 1) {}

  }

  const PROGRAM_INFO = Symbol('programInfo');
  const QUAD_POSITION_BUFFER_INFO = Symbol('quadPositionBufferInfo');
  const QUAD_TEXCOORD_BUFFER_INFO = Symbol('quadTexcoordBufferInfo');
  const WEBGL_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main()
{
    vec4 position = u_projection_view * u_model * vec4(a_position.xy, 0.0, 1.0);
    v_texcoord = a_texcoord;
    gl_Position = position;
}`;
  const WEBGL_FRAGMENT_SHADER_SOURCE = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform vec4 u_sprite;

void main()
{
    vec2 texcoord = vec2(
        (u_sprite.x / u_texture_size.x) + v_texcoord.x * (u_sprite.z / u_texture_size.x),
        (u_sprite.y / u_texture_size.y) + v_texcoord.y * (u_sprite.w / u_texture_size.y));
    gl_FragColor = texture2D(u_texture, texcoord);
}`;
  class TexturedQuadRenderer extends QuadRendererBase {
    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {BufferInfo}
     */
    static getQuadPositionBufferInfo(gl) {
      let bufferInfo = this[QUAD_POSITION_BUFFER_INFO];

      if (!bufferInfo) {
        bufferInfo = BufferInfo.builder(gl, gl.ARRAY_BUFFER).data(BufferHelper.createBufferSource(gl, gl.FLOAT, [// Top-Left
        0, 0, 1, 0, 0, 1, // Bottom-Right
        1, 1, 1, 0, 0, 1])).build();
        this[QUAD_POSITION_BUFFER_INFO] = bufferInfo;
      }

      return bufferInfo;
    }
    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {BufferInfo}
     */


    static getQuadTexcoordBufferInfo(gl) {
      let bufferInfo = this[QUAD_TEXCOORD_BUFFER_INFO];

      if (!bufferInfo) {
        bufferInfo = BufferInfo.builder(gl, gl.ARRAY_BUFFER).data(BufferHelper.createBufferSource(gl, gl.FLOAT, [// Top-Left
        0, 0, 1, 0, 0, 1, // Bottom-Right
        1, 1, 1, 0, 0, 1])).build();
        this[QUAD_TEXCOORD_BUFFER_INFO] = bufferInfo;
      }

      return bufferInfo;
    }
    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {ProgramInfo}
     */


    static getProgramInfo(gl) {
      let programInfo = this[PROGRAM_INFO];

      if (!programInfo) {
        programInfo = ProgramInfo.builder(gl).shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE).shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE).link();
        this[PROGRAM_INFO] = programInfo;
      }

      return programInfo;
    }
    /**
     * @param {WebGLRenderingContext} gl 
     */


    constructor(gl) {
      super(gl);
      this._texture = null;
      this._textureSize = glMatrix.vec2.fromValues(1, 1);
      this._spriteVector = glMatrix.vec4.fromValues(0, 0, 1, 1);
    }

    setTexture(texture, w, h) {
      this._texture = texture;
      glMatrix.vec2.set(this._textureSize, w, h);
      return this;
    }

    setSprite(u = 0, v = 0, s = 1, t = 1) {
      glMatrix.vec4.set(this._spriteVector, u, v, s, t);
      return this;
    }
    /** @override */


    draw(posX = 0, posY = 0, scaleX = 1, scaleY = 1) {
      let gl = this.gl;
      let constructor =
      /** @type {typeof TexturedQuadRenderer} */
      this.constructor;
      let programInfo = constructor.getProgramInfo(gl);
      let positionBufferInfo = constructor.getQuadPositionBufferInfo(gl);
      let texcoordBufferInfo = constructor.getQuadTexcoordBufferInfo(gl);
      let projectionView = this.getProjectionViewMatrix();
      let model = this.updateModelMatrix(posX, posY, scaleX, scaleY);
      let sprite = this._spriteVector;
      let textureSize = this._textureSize;

      if (this._texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
      }

      programInfo.bind(gl).attribute('a_position', gl.FLOAT, positionBufferInfo.handle).attribute('a_texcoord', gl.FLOAT, texcoordBufferInfo.handle).uniform('u_projection_view', projectionView).uniform('u_model', model).uniform('u_texture', 0).uniform('u_sprite', sprite).uniform('u_texture_size', textureSize).draw(gl, gl.TRIANGLES, 0, 6);
    }

  }

  const PROGRAM_INFO$1 = Symbol('programInfo');
  const QUAD_BUFFER_INFO = Symbol('quadBufferInfo');
  const WEBGL_VERTEX_SHADER_SOURCE$1 = `
attribute vec2 a_position;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main()
{
    gl_Position = u_projection_view * u_model * vec4(a_position.xy, 0.0, 1.0);
}`;
  const WEBGL_FRAGMENT_SHADER_SOURCE$1 = `
precision mediump float;

uniform vec3 u_color;

void main()
{
    gl_FragColor = vec4(u_color.rgb, 1.0);
}`;
  class ColoredQuadRenderer extends QuadRendererBase {
    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {BufferInfo}
     */
    static getQuadBufferInfo(gl) {
      let bufferInfo = this[QUAD_BUFFER_INFO];

      if (!bufferInfo) {
        bufferInfo = BufferInfo.builder(gl, gl.ARRAY_BUFFER).data(BufferHelper.createBufferSource(gl, gl.FLOAT, [// Top-Left
        0, 0, 1, 0, 0, 1, // Bottom-Right
        1, 1, 1, 0, 0, 1])).build();
        this[QUAD_BUFFER_INFO] = bufferInfo;
      }

      return bufferInfo;
    }
    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {ProgramInfo}
     */


    static getProgramInfo(gl) {
      let programInfo = this[PROGRAM_INFO$1];

      if (!programInfo) {
        programInfo = ProgramInfo.builder(gl).shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE$1).shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE$1).link();
        this[PROGRAM_INFO$1] = programInfo;
      }

      return programInfo;
    }
    /**
     * @param {WebGLRenderingContext} gl 
     */


    constructor(gl) {
      super(gl);
      /** @private */

      this._colorVector = glMatrix.vec3.fromValues(1, 1, 1);
    }

    setColor(r = 1, g = 1, b = 1) {
      glMatrix.vec3.set(this._colorVector, r, g, b);
      return this;
    }
    /** @override */


    draw(posX = 0, posY = 0, scaleX = 1, scaleY = 1) {
      let gl = this.gl;
      let constructor =
      /** @type {typeof ColoredQuadRenderer} */
      this.constructor;
      let programInfo = constructor.getProgramInfo(gl);
      let bufferInfo = constructor.getQuadBufferInfo(gl);
      let projectionView = this.getProjectionViewMatrix();
      let model = this.updateModelMatrix(posX, posY, scaleX, scaleY);
      let color = this._colorVector;
      programInfo.bind(gl).attribute('a_position', gl.FLOAT, bufferInfo.handle).uniform('u_projection_view', projectionView).uniform('u_model', model).uniform('u_color', color).draw(gl, gl.TRIANGLES, 0, 6);
    }

  }

  /* global process */
  class AssetManager {
    constructor() {
      /** @private */
      this.assetPath = '' ;
      /** @private */

      this.loaders = {};
      /** @private */

      this.assets = {};
      /** @private */

      this.loadingQueue = [];
    }

    registerLoader(loaderName, loader) {
      this.loaders[loaderName] = loader;
      return this;
    }

    registerAsset(loader, name, url, opts = null) {
      if (!(loader in this.assets)) {
        this.assets[loader] = {};
      }

      let assetMap = this.assets[loader];
      let asset = {
        value: null,
        url,
        opts
      };
      assetMap[name] = asset;
      this.loadingQueue.push(asset);
      return this;
    }

    async loadAssets() {
      let cache = {};
      let errors = [];

      for (let loaderName of Object.keys(this.assets)) {
        let assetMap = this.assets[loaderName];

        if (loaderName in this.loaders) {
          let loader = this.loaders[loaderName];

          for (let assetName of Object.keys(assetMap)) {
            const {
              url,
              opts
            } = assetMap[assetName];
            let assetValue;
            const cacheKey = url + '?opts=' + JSON.stringify(opts);

            if (cacheKey in cache) {
              assetValue = cache[cacheKey];
            } else {
              try {
                assetValue = await loader.call(undefined, this.assetPath + url, opts || {});
                cache[cacheKey] = assetValue;
              } catch (e) {
                errors.push(e);
                continue;
              }
            }

            let asset = assetMap[assetName];
            asset.value = assetValue;
          }
        } else {
          throw new Error(`Missing loader for '${loaderName}'.`);
        }
      }

      if (errors.length > 0) {
        throw new Error('Failed to load assets: ' + errors);
      }
    }

    getAsset(loader, name) {
      return this.assets[loader][name].value;
    }

  }

  const AUDIO_CONTEXT = new AudioContext();
  autoUnlock(AUDIO_CONTEXT);
  async function loadAudio(filepath, opts = {}) {
    const ctx = AUDIO_CONTEXT;
    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    let data = await ctx.decodeAudioData(buffer);
    return new Sound(ctx, data, Boolean(opts.loop));
  }
  const DEFAULT_SOURCE_PARAMS = {
    gain: 0,
    pitch: 0,
    pan: 0,
    loop: false
  };

  class Sound {
    constructor(ctx, audioBuffer, loop = false) {
      this.context = ctx;
      this.buffer = audioBuffer;
      this._source = null;
      this.playing = false;
      this.loop = loop;
      this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
    }

    onAudioSourceEnded() {
      this._playing = false;
    }

    play(opts = DEFAULT_SOURCE_PARAMS) {
      if (!this.buffer) return;
      if (this._source) this.destroy();
      const ctx = this.context;
      let source = ctx.createBufferSource();
      source.addEventListener('ended', this.onAudioSourceEnded);
      source.buffer = this.buffer;
      source.loop = opts.loop;
      let prevNode = source; // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
      // Add pitch

      if (opts.pitch) {
        source.detune.value = opts.pitch * 100;
      } // Add gain


      if (opts.gain) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = opts.gain;
        prevNode = prevNode.connect(gainNode);
      } // Add stereo pan


      if (opts.pan) {
        const pannerNode = ctx.createStereoPanner();
        pannerNode.pan.value = opts.pan;
        prevNode = prevNode.connect(pannerNode);
      }

      prevNode.connect(ctx.destination);
      source.start();
      this._source = source;
      this._playing = true;
    }

    pause() {
      this._source.stop();

      this._playing = false;
    }

    destroy() {
      if (this._source) this._source.disconnect();
      this._source = null;
    }

  }

  async function autoUnlock(ctx) {
    const callback = () => {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    };

    document.addEventListener('click', callback);
  }

  /**
   * @param {string} url The asset path.
   * @param {object} opts Additional options.
   * @param {WebGLRenderingContext} opts.gl The webgl context.
   * @returns {WebGLTexture}
   */
  function load(url, opts) {
    const {
      gl
    } = opts;

    if (!gl) {
      throw new Error('Missing webgl context for texture loader.');
    }

    let handle = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, handle);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    let image = new Image();

    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, handle);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }
    };

    image.src = url;
    return handle;
  }

  function isPowerOf2(value) {
    return (value & value - 1) == 0;
  }

  const ASSETS = new AssetManager().registerLoader('audio', loadAudio).registerLoader('texture', load);

  const PLAYER_SPEED = 1;
  const PLAYER_FRICTION = 0.1;
  const INV_PLAYER_FRICTION = 1 - PLAYER_FRICTION;
  function createPlayer(game) {
    let player = {
      x: 0,
      y: 0,
      motionX: 0,
      motionY: 0
    };
    return player;
  }
  function renderPlayer(player) {
    let renderInfo = {
      renderType: 'textured-quad',
      x: player.x,
      y: player.y,
      scaleX: 8,
      scaleY: 8,
      texture: {
        handle: ASSETS.getAsset('texture', 'font'),
        w: 64,
        h: 40
      },
      sprite: {
        u: 0,
        v: 0,
        s: 8,
        t: 8
      }
    };
    return renderInfo;
  }
  function updatePlayer(player, game, dt) {
    const input = game.input;
    let dx = input.getInputState('MoveRight') - input.getInputState('MoveLeft');
    let dy = input.getInputState('MoveDown') - input.getInputState('MoveUp');
    let mx, my;

    if (dx || dy) {
      let dr = Math.atan2(dy, dx);
      mx = (player.motionX + Math.cos(dr) * PLAYER_SPEED) * INV_PLAYER_FRICTION;
      my = (player.motionY + Math.sin(dr) * PLAYER_SPEED) * INV_PLAYER_FRICTION;
    } else {
      mx = player.motionX * INV_PLAYER_FRICTION;
      my = player.motionY * INV_PLAYER_FRICTION;
    }

    player.motionX = mx;
    player.motionY = my;
    player.x += mx * dt;
    player.y += my * dt;
  }

  /**
   * @typedef {import('@milque/display').DisplayPort} DisplayPort
   * @typedef {import('@milque/display').FrameEvent} FrameEvent
   * @typedef {import('@milque/input').InputPort} InputPort
   */

  window.addEventListener('DOMContentLoaded', main);

  async function main() {
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');
    /** @type {InputPort} */

    const input = document.querySelector('#input');
    input.src = {
      MoveLeft: ['Keyboard:ArrowLeft', 'Keyboard:KeyA'],
      MoveRight: ['Keyboard:ArrowRight', 'Keyboard:KeyD'],
      MoveUp: ['Keyboard:ArrowUp', 'Keyboard:KeyW'],
      MoveDown: ['Keyboard:ArrowDown', 'Keyboard:KeyS'],
      Interact: ['Keyboard:KeyE'],
      Evade: ['Keyboard:Space']
    };
    /**
     * @typedef Game
     * @property {DisplayPort} display
     * @property {number} frames
     * @property {InputPort} input
     * @property {object} world
     */

    /** @type {Game} */

    const game = {
      display,
      frames: 0,
      input,
      world: {}
    };
    await GameAssetLoader(game);
    const updater = GameUpdater(game);
    const renderer = GameRenderer(game);
    display.addEventListener('frame', e => {
      const frameEvent =
      /** @type {FrameEvent} */
      e;
      const dt = frameEvent.detail.deltaTime / 60;
      updater(dt);
      renderer();
    });
  }
  /**
   * @param {Game} game 
   */


  async function GameAssetLoader(game) {
    let gl = game.display.canvas.getContext('webgl');
    ASSETS.registerAsset('texture', 'font', 'webgl/font.png', {
      gl
    });
    await ASSETS.loadAssets();
  }
  /**
   * @param {Game} game 
   * @returns {Function}
   */


  function GameUpdater(game) {
    const world = game.world;
    let player = createPlayer();
    world.player = player;
    return function (dt) {
      updatePlayer(player, game, dt);
    };
  }
  /**
   * @param {Game} game 
   * @returns {Function}
   */


  function GameRenderer(game) {
    /** @type {DisplayPort} */
    const display = game.display;
    /** @type {WebGLRenderingContext} */

    let gl = display.canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 0);
    let camera = new OrthographicCamera(-100, -100, 100, 100, 0, 100);
    let projectionViewMatrix = glMatrix.mat4.create();
    let texturedRenderer = new TexturedQuadRenderer(gl);
    let coloredRenderer = new ColoredQuadRenderer(gl);
    return function () {
      game.frames += 1;
      let viewportWidth = gl.canvas.width;
      let viewportHeight = gl.canvas.height;
      gl.viewport(0, 0, viewportWidth, viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      camera.resize(viewportWidth, viewportHeight);
      glMatrix.mat4.multiply(projectionViewMatrix, camera.projectionMatrix, camera.viewMatrix);
      texturedRenderer.setProjectionViewMatrix(projectionViewMatrix);
      coloredRenderer.setProjectionViewMatrix(projectionViewMatrix);
      let renderables = [renderPlayer(game.world.player)];

      for (let renderable of renderables) {
        switch (renderable.renderType) {
          case 'textured-quad':
            {
              let {
                sprite = {
                  u: 0,
                  v: 0,
                  s: 0,
                  t: 0
                },
                texture = {
                  handle: null,
                  w: 0,
                  h: 0
                },
                transform = {
                  matrix: glMatrix.mat4.create()
                },
                x = 0,
                y = 0,
                scaleX = 1,
                scaleY = 1
              } = renderable;
              texturedRenderer.setSprite(sprite.u, sprite.v, sprite.s, sprite.t).setTexture(texture.handle, texture.w, texture.h).setTransformationMatrix(transform.matrix).draw(x, y, scaleX, scaleY);
            }
            break;

          case 'colored-quad':
            {
              let {
                color = {
                  r: 0,
                  g: 0,
                  b: 0
                },
                transform = {
                  matrix: glMatrix.mat4.create()
                },
                x = 0,
                y = 0,
                scaleX = 1,
                scaleY = 1
              } = renderable;
              coloredRenderer.setColor(color.r, color.g, color.b).setTransformationMatrix(transform.matrix).draw(x, y, scaleX, scaleY);
            }
            break;

          default:
            throw new Error('Unkown render type.');
        }
      }
    };
  }

}(glMatrix));
