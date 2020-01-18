var self = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get Display () { return Display; },
  get Audio () { return Audio; },
  get Input () { return Input; },
  get Random () { return Random; },
  get Utils () { return Utils; },
  get default () { return self; },
  get MODE_NOSCALE () { return MODE_NOSCALE; },
  get MODE_CENTER () { return MODE_CENTER; },
  get MODE_FIT () { return MODE_FIT; },
  get MODE_STRETCH () { return MODE_STRETCH; },
  get DisplayPort () { return DisplayPort; },
  get EventKey () { return EventKey; },
  get MIN_CONTEXT_PRIORITY () { return MIN_CONTEXT_PRIORITY; },
  get MAX_CONTEXT_PRIORITY () { return MAX_CONTEXT_PRIORITY; },
  get createContext () { return createContext; },
  get createSource () { return createSource; },
  get AbstractInputAdapter () { return AbstractInputAdapter; },
  get ActionInputAdapter () { return ActionInputAdapter; },
  get DOUBLE_ACTION_TIME () { return DOUBLE_ACTION_TIME; },
  get DoubleActionInputAdapter () { return DoubleActionInputAdapter; },
  get RangeInputAdapter () { return RangeInputAdapter; },
  get StateInputAdapter () { return StateInputAdapter; },
  get Keyboard () { return Keyboard; },
  get Mouse () { return Mouse; },
  get RandomGenerator () { return RandomGenerator; },
  get SimpleRandomGenerator () { return SimpleRandomGenerator; },
  get Eventable () { return Eventable$1; },
  get View () { return View; },
  get ViewHelper () { return ViewHelper; },
  get ViewPort () { return ViewPort; },
  get AbstractCamera () { return AbstractCamera; },
  get GameLoop () { return GameLoop; },
  get QueryOperator () { return QueryOperator; },
  get ComponentFactory () { return ComponentFactory; },
  get Component () { return ComponentHelper; },
  get Entity () { return EntityHelper; },
  get EntityWorld () { return EntityWorld; },
  get EntityQuery () { return EntityQuery; },
  get ComponentBase () { return ComponentBase; },
  get TagComponent () { return TagComponent; },
  get EntityComponent () { return EntityComponent$1; },
  get EntityBase () { return EntityBase; },
  get HybridEntity () { return HybridEntity; }
});

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * @module DisplayPort
 * @version 1.4
 * 
 * # Changelog
 * ## 1.4
 * - Added "stretch" mode
 * 
 * ## 1.3
 * - Changed "topleft" to "noscale"
 * - Changed default size to 640 x 480
 * - Changed "center" and "fit" to fill container instead of viewport
 * - Added "full" property to override and fill viewport
 * 
 * ## 1.2
 * - Moved default values to the top
 * 
 * ## 1.1
 * - Fixed scaling issues when dimensions do not match
 * 
 * ## 1.0
 * - Created DisplayPort
 */
var MODE_NOSCALE = 'noscale';
var MODE_CENTER = 'center';
var MODE_FIT = 'fit';
var MODE_STRETCH = 'stretch';
var DEFAULT_MODE = MODE_CENTER;
var DEFAULT_WIDTH = 640;
var DEFAULT_HEIGHT = 480;
var INNER_HTML = "\n<label class=\"hidden\" id=\"title\">display-port</label>\n<label class=\"hidden\" id=\"fps\">00</label>\n<label class=\"hidden\" id=\"dimension\">0x0</label>\n<canvas></canvas>";
var INNER_STYLE = "\n<style>\n    :host {\n        display: inline-block;\n        color: #555555;\n    }\n    div {\n        display: flex;\n        position: relative;\n        width: 100%;\n        height: 100%;\n    }\n    canvas {\n        background: #000000;\n        margin: auto;\n    }\n    label {\n        font-family: monospace;\n        color: currentColor;\n        position: absolute;\n    }\n    #title {\n        left: 0.5rem;\n        top: 0.5rem;\n    }\n    #fps {\n        right: 0.5rem;\n        top: 0.5rem;\n    }\n    #dimension {\n        left: 0.5rem;\n        bottom: 0.5rem;\n    }\n    .hidden {\n        display: none;\n    }\n    :host([debug]) div {\n        outline: 8px dashed rgba(0, 0, 0, 0.4);\n        outline-offset: -4px;\n        background-color: rgba(0, 0, 0, 0.1);\n    }\n    :host([mode=\"".concat(MODE_NOSCALE, "\"]) canvas {\n        margin: 0;\n        top: 0;\n        left: 0;\n    }\n    :host([mode=\"").concat(MODE_FIT, "\"]), :host([mode=\"").concat(MODE_CENTER, "\"]), :host([mode=\"").concat(MODE_STRETCH, "\"]) {\n        width: 100%;\n        height: 100%;\n    }\n    :host([full]) {\n        width: 100vw!important;\n        height: 100vh!important;\n    }\n    :host([disabled]) {\n        display: none;\n    }\n</style>");
var DisplayPort =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(DisplayPort, _HTMLElement);

  _createClass(DisplayPort, null, [{
    key: "observedAttributes",

    /** @override */
    get: function get() {
      return ['width', 'height', 'disabled', // NOTE: For debuggin purposes...
      'debug', // ...listening for built-in attribs...
      'id', 'class'];
    }
  }]);

  function DisplayPort() {
    var _this;

    _classCallCheck(this, DisplayPort);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayPort).call(this));

    _this.attachShadow({
      mode: 'open'
    });

    _this.shadowRoot.innerHTML = "<div>".concat(INNER_STYLE).concat(INNER_HTML, "</div>");
    _this._canvasElement = _this.shadowRoot.querySelector('canvas');
    _this._canvasContext = _this._canvasElement.getContext('2d');
    _this._canvasContext.imageSmoothingEnabled = false;
    _this._titleElement = _this.shadowRoot.querySelector('#title');
    _this._fpsElement = _this.shadowRoot.querySelector('#fps');
    _this._dimensionElement = _this.shadowRoot.querySelector('#dimension');
    _this._animationRequestHandle = 0;
    _this._prevAnimationFrameTime = 0;
    _this._width = DEFAULT_WIDTH;
    _this._height = DEFAULT_HEIGHT;
    _this.update = _this.update.bind(_assertThisInitialized(_this));
    return _this;
  }
  /** @override */


  _createClass(DisplayPort, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;
      this.updateCanvasSize();
      this.resume();
    }
    /** @override */

  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.pause();
    }
    /** @override */

  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attribute, prev, value) {
      switch (attribute) {
        case 'width':
          this._width = value;
          break;

        case 'height':
          this._height = value;
          break;

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
          this._titleElement.innerHTML = "display-port".concat(this.className ? '.' + this.className : '').concat(this.hasAttribute('id') ? '#' + this.getAttribute('id') : '');
          break;

        case 'debug':
          this._titleElement.classList.toggle('hidden', value);

          this._fpsElement.classList.toggle('hidden', value);

          this._dimensionElement.classList.toggle('hidden', value);

          break;
      }
    }
  }, {
    key: "update",
    value: function update(now) {
      this._animationRequestHandle = requestAnimationFrame(this.update);
      this.updateCanvasSize(); // NOTE: For debugging purposes...

      if (this.debug) {
        // Update FPS...
        var dt = now - this._prevAnimationFrameTime;
        var frames = dt <= 0 ? '--' : String(Math.round(1000 / dt)).padStart(2, '0');
        this._prevAnimationFrameTime = now;

        if (this._fpsElement.innerText !== frames) {
          this._fpsElement.innerText = frames;
        } // Update dimensions...


        if (this.mode === MODE_NOSCALE) {
          var result = "".concat(this._width, "x").concat(this._height);

          if (this._dimensionElement.innerText !== result) {
            this._dimensionElement.innerText = result;
          }
        } else {
          var _result = "".concat(this._width, "x").concat(this._height, "|").concat(this.shadowRoot.host.clientWidth, "x").concat(this.shadowRoot.host.clientHeight);

          if (this._dimensionElement.innerText !== _result) {
            this._dimensionElement.innerText = _result;
          }
        }
      }

      this.dispatchEvent(new CustomEvent('frame', {
        detail: {
          now: now,
          context: this._canvasContext
        },
        bubbles: false,
        composed: true
      }));
    }
  }, {
    key: "pause",
    value: function pause() {
      cancelAnimationFrame(this._animationRequestHandle);
    }
  }, {
    key: "resume",
    value: function resume() {
      this._animationRequestHandle = requestAnimationFrame(this.update);
    }
  }, {
    key: "updateCanvasSize",
    value: function updateCanvasSize() {
      var clientRect = this.shadowRoot.host.getBoundingClientRect();
      var clientWidth = clientRect.width;
      var clientHeight = clientRect.height;
      var canvas = this._canvasElement;
      var canvasWidth = this._width;
      var canvasHeight = this._height;
      var mode = this.mode;

      if (mode === MODE_STRETCH) {
        canvasWidth = clientWidth;
        canvasHeight = clientHeight;
      } else if (mode !== MODE_NOSCALE) {
        var flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;

        if (flag) {
          var ratioX = clientWidth / canvasWidth;
          var ratioY = clientHeight / canvasHeight;

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

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style = "width: ".concat(canvasWidth, "px; height: ").concat(canvasHeight, "px");
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
  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this._canvasElement;
    }
  }, {
    key: "getContext",
    value: function getContext() {
      return this._canvasContext;
    }
  }, {
    key: "width",
    get: function get() {
      return this._width;
    },
    set: function set(value) {
      this.setAttribute('width', value);
    }
  }, {
    key: "height",
    get: function get() {
      return this._height;
    },
    set: function set(value) {
      this.setAttribute('height', value);
    }
  }, {
    key: "mode",
    get: function get() {
      return this.getAttribute('mode');
    },
    set: function set(value) {
      this.setAttribute('mode', value);
    }
  }, {
    key: "disabled",
    get: function get() {
      return this.hasAttribute('disabled');
    },
    set: function set(value) {
      if (value) this.setAttribute('disabled', '');else this.removeAttribute('disabled');
    } // NOTE: For debugging purposes...

  }, {
    key: "debug",
    get: function get() {
      return this.hasAttribute('debug');
    },
    set: function set(value) {
      if (value) this.setAttribute('debug', '');else this.removeAttribute('debug');
    }
  }]);

  return DisplayPort;
}(_wrapNativeSuper(HTMLElement));
window.customElements.define('display-port', DisplayPort);

var ANY = Symbol('any');
var EventKey =
/*#__PURE__*/
function () {
  _createClass(EventKey, null, [{
    key: "parse",
    value: function parse(eventKeyString) {
      var startCodeIndex = eventKeyString.indexOf('[');
      var endCodeIndex = eventKeyString.indexOf(']');
      var modeIndex = eventKeyString.indexOf('.');
      var source = null;
      var code = null;
      var mode = null; // For ANY source, use `[code].mode` or `.mode`
      // For ONLY codes and modes from source, use `source`

      if (startCodeIndex <= 0 || modeIndex === 0) source = ANY;else source = eventKeyString.substring(0, startCodeIndex); // For ANY code, use `source.mode` or `source[].mode`
      // For ONLY sources and modes for code, use `[code]`

      if (startCodeIndex < 0 || endCodeIndex < 0 || startCodeIndex + 1 === endCodeIndex) code = ANY;else code = eventKeyString.substring(startCodeIndex + 1, endCodeIndex); // For ANY mode, use `source[code]` or `source[code].`
      // For ONLY sources and codes for mode, use `.mode`

      if (modeIndex < 0 || eventKeyString.trim().endsWith('.')) mode = ANY;else mode = eventKeyString.substring(modeIndex + 1);
      return new EventKey(source, code, mode);
    }
  }]);

  function EventKey(source, code, mode) {
    _classCallCheck(this, EventKey);

    this.source = source;
    this.code = code;
    this.mode = mode;
    this.string = "".concat(this.source.toString(), "[").concat(this.code.toString(), "].").concat(this.mode.toString());
  }

  _createClass(EventKey, [{
    key: "matches",
    value: function matches(eventKey) {
      if (this.source === ANY || eventKey.source === ANY || this.source === eventKey.source) {
        if (this.code === ANY || eventKey.code === ANY || this.code === eventKey.code) {
          if (this.mode === ANY || eventKey.mode === ANY || this.mode === eventKey.mode) {
            return true;
          }
        }
      }

      return false;
    }
    /** @override */

  }, {
    key: "toString",
    value: function toString() {
      return this.string;
    }
  }]);

  return EventKey;
}();

EventKey.ANY = ANY;

var AbstractInputAdapter =
/*#__PURE__*/
function () {
  function AbstractInputAdapter(defaultValue) {
    _classCallCheck(this, AbstractInputAdapter);

    this.prev = defaultValue;
    this.value = defaultValue;
    this.next = defaultValue;
  }

  _createClass(AbstractInputAdapter, [{
    key: "update",
    value: function update(eventKey, value) {
      return false;
    }
  }, {
    key: "consume",
    value: function consume() {
      return this.next;
    }
  }, {
    key: "poll",
    value: function poll() {
      this.prev = this.value;
      this.value = this.next;
      this.next = this.consume();
      return this;
    }
  }]);

  return AbstractInputAdapter;
}();

var ActionInputAdapter =
/*#__PURE__*/
function (_AbstractInputAdapter) {
  _inherits(ActionInputAdapter, _AbstractInputAdapter);

  function ActionInputAdapter(eventKeyStrings) {
    var _this;

    _classCallCheck(this, ActionInputAdapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActionInputAdapter).call(this, false));
    _this.eventKeys = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = eventKeyStrings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var eventKeyString = _step.value;

        _this.eventKeys.push(EventKey.parse(eventKeyString));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _this;
  }
  /** @override */


  _createClass(ActionInputAdapter, [{
    key: "consume",
    value: function consume() {
      return false;
    }
    /** @override */

  }, {
    key: "update",
    value: function update(eventKey) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.eventKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var targetEventKey = _step2.value;

          if (targetEventKey.matches(eventKey)) {
            this.next = value;
            return true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return false;
    }
  }]);

  return ActionInputAdapter;
}(AbstractInputAdapter);

var RangeInputAdapter =
/*#__PURE__*/
function (_AbstractInputAdapter) {
  _inherits(RangeInputAdapter, _AbstractInputAdapter);

  function RangeInputAdapter(eventKeyString) {
    var _this;

    _classCallCheck(this, RangeInputAdapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RangeInputAdapter).call(this, 0));
    _this.eventKey = EventKey.parse(eventKeyString);
    return _this;
  }
  /** @override */


  _createClass(RangeInputAdapter, [{
    key: "consume",
    value: function consume() {
      switch (this.eventKey.string) {
        case 'mouse[pos].dx':
        case 'mouse[pos].dy':
          return 0;

        case 'mouse[pos].x':
        case 'mouse[pos].y':
        default:
          return this.next;
      }
    }
    /** @override */

  }, {
    key: "update",
    value: function update(eventKey) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.eventKey.matches(eventKey)) {
        this.next = value;
        return true;
      }

      return false;
    }
  }]);

  return RangeInputAdapter;
}(AbstractInputAdapter);

var StateInputAdapter =
/*#__PURE__*/
function (_AbstractInputAdapter) {
  _inherits(StateInputAdapter, _AbstractInputAdapter);

  function StateInputAdapter(eventKeyMap) {
    var _this;

    _classCallCheck(this, StateInputAdapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StateInputAdapter).call(this, 0));
    _this.eventKeyEntries = [];

    for (var _i = 0, _Object$keys = Object.keys(eventKeyMap); _i < _Object$keys.length; _i++) {
      var eventKey = _Object$keys[_i];

      _this.eventKeyEntries.push({
        key: EventKey.parse(eventKey),
        value: eventKeyMap[eventKey]
      });
    }

    return _this;
  }
  /** @override */


  _createClass(StateInputAdapter, [{
    key: "update",
    value: function update(eventKey) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (value) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.eventKeyEntries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var eventKeyEntry = _step.value;

            if (eventKeyEntry.key.matches(eventKey)) {
              this.next = eventKeyEntry.value;
              return true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return false;
    }
  }]);

  return StateInputAdapter;
}(AbstractInputAdapter);

var MIN_CONTEXT_PRIORITY = -100;
var MAX_CONTEXT_PRIORITY = 100;
function createContext() {
  return {
    _source: null,
    _priority: 0,
    _active: true,
    inputs: new Map(),

    get active() {
      return this._active;
    },

    get source() {
      return this._source;
    },

    get priority() {
      return this._priority;
    },

    attach: function attach(inputSource) {
      this._source = inputSource;

      this._source.addContext(this);

      return this;
    },
    detach: function detach() {
      this._source.removeContext(this);

      this._source = null;
      return this;
    },
    setPriority: function setPriority(priority) {
      if (priority > MAX_CONTEXT_PRIORITY || priority < MIN_CONTEXT_PRIORITY) {
        throw new Error("Context priority must be between [".concat(MIN_CONTEXT_PRIORITY, ", ").concat(MAX_CONTEXT_PRIORITY, "]."));
      }

      if (this._priority !== priority) {
        if (this._source) {
          this._source.removeContext(this);

          this._priority = priority;

          this._source.addContext(this);
        } else {
          this._priority = priority;
        }
      }

      return this;
    },
    registerInput: function registerInput(name, adapter) {
      this.inputs.set(name, adapter);
      return adapter;
    },
    registerAction: function registerAction(name) {
      for (var _len = arguments.length, eventKeyStrings = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        eventKeyStrings[_key - 1] = arguments[_key];
      }

      return this.registerInput(name, new ActionInputAdapter(eventKeyStrings));
    },
    registerRange: function registerRange(name, eventKeyString) {
      return this.registerInput(name, new RangeInputAdapter(eventKeyString));
    },
    registerState: function registerState(name, eventKeyMap) {
      return this.registerInput(name, new StateInputAdapter(eventKeyMap));
    },
    toggle: function toggle() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      if (typeof force === 'undefined') force = !this._active;
      this._active = force;
      return this;
    },
    enable: function enable() {
      return this.toggle(true);
    },
    disable: function disable() {
      return this.toggle(false);
    },
    poll: function poll() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.inputs.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var adapter = _step.value;
          adapter.poll();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    update: function update(eventKey, value) {
      var result;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.inputs.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var adapter = _step2.value;
          result |= adapter.update(eventKey, value);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return result;
    }
  };
}

var Mouse =
/*#__PURE__*/
function () {
  function Mouse() {
    _classCallCheck(this, Mouse);

    this.sourceElement = null;
    this.eventHandler = null;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  _createClass(Mouse, [{
    key: "attach",
    value: function attach() {
      var sourceElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      this.sourceElement = sourceElement;
      this.sourceElement.addEventListener('mousedown', this.onMouseDown);
      this.sourceElement.addEventListener('mouseup', this.onMouseUp);
      this.sourceElement.addEventListener('contextmenu', this.onContextMenu);
      document.addEventListener('mousemove', this.onMouseMove);
      return this;
    }
  }, {
    key: "detach",
    value: function detach() {
      this.sourceElement.removeEventListener('mousedown', this.onMouseDown);
      this.sourceElement.removeEventListener('mouseup', this.onMouseUp);
      this.sourceElement.removeEventListener('contextmenu', this.onContextMenu);
      document.removeEventListener('mousemove', this.onMouseMove);
      this.sourceElement = null;
      return this;
    }
  }, {
    key: "setEventHandler",
    value: function setEventHandler(eventHandler) {
      this.eventHandler = eventHandler;
      return this;
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      if (!this.eventHandler) return;
      var result;
      result = this.eventHandler.call(this, "mouse[".concat(e.button, "].down"), true);

      if (result) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      if (!this.eventHandler) return;
      e.preventDefault();
      e.stopPropagation();
      this.eventHandler.call(this, "mouse[".concat(e.button, "].up"), true);
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      if (!this.eventHandler) return;
      var clientCanvas = this.sourceElement;
      var clientWidth = clientCanvas.clientWidth;
      var clientHeight = clientCanvas.clientHeight;
      this.eventHandler.call(this, 'mouse[pos].x', (e.pageX - clientCanvas.offsetLeft) / clientWidth);
      this.eventHandler.call(this, 'mouse[pos].y', (e.pageY - clientCanvas.offsetTop) / clientHeight);
      this.eventHandler.call(this, 'mouse[pos].dx', e.movementX / clientWidth);
      this.eventHandler.call(this, 'mouse[pos].dy', e.movementY / clientHeight);
    }
  }, {
    key: "onContextMenu",
    value: function onContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }]);

  return Mouse;
}();

var Keyboard =
/*#__PURE__*/
function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);

    this.sourceElement = null;
    this.eventHandler = null;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  _createClass(Keyboard, [{
    key: "attach",
    value: function attach() {
      var sourceElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      this.sourceElement = sourceElement;
      this.sourceElement.addEventListener('keydown', this.onKeyDown);
      this.sourceElement.addEventListener('keyup', this.onKeyUp);
      return this;
    }
  }, {
    key: "detach",
    value: function detach() {
      this.sourceElement.removeEventListener('keydown', this.onKeyDown);
      this.sourceElement.removeEventListener('keyup', this.onKeyUp);
      this.sourceElement = null;
      return this;
    }
  }, {
    key: "setEventHandler",
    value: function setEventHandler(eventHandler) {
      this.eventHandler = eventHandler;
      return this;
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      if (!this.eventHandler) return;
      var result;

      if (e.repeat) {
        result = this.eventHandler.call(this, "key[".concat(e.key, "].repeat"), true);
      } else {
        result = this.eventHandler.call(this, "key[".concat(e.key, "].down"), true);
      }

      if (result) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      if (!this.eventHandler) return;
      var result;
      result = this.eventHandler.call(this, "key[".concat(e.key, "].up"), true);

      if (result) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }]);

  return Keyboard;
}();

/**
 * @module InputSource
 */
function createSource() {
  var result = {
    _contexts: new Array(MAX_CONTEXT_PRIORITY - MIN_CONTEXT_PRIORITY),
    element: null,
    keyboard: new Keyboard(),
    mouse: new Mouse(),
    attach: function attach(element) {
      this.element = element;
      this.keyboard.attach();
      this.mouse.attach(element);
      return this;
    },
    detach: function detach() {
      this.element = null;
      this.keyboard.detach();
      this.mouse.detach();
      return this;
    },
    addContext: function addContext(context) {
      var priority = context.priority - MIN_CONTEXT_PRIORITY;
      if (!this._contexts[priority]) this._contexts[priority] = [];

      this._contexts[priority].push(context);

      return this;
    },
    removeContext: function removeContext(context) {
      var priority = context.priority - MIN_CONTEXT_PRIORITY;
      var contexts = this._contexts[priority];

      if (contexts) {
        contexts.splice(contexts.indexOf(context), 1);
      }

      return this;
    },
    poll: function poll() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._contexts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var contexts = _step.value;

          if (contexts) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = contexts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var context = _step2.value;

                if (context.active) {
                  context.poll();
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    handleEvent: function handleEvent(eventKeyString, value) {
      var eventKey = EventKey.parse(eventKeyString);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this._contexts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var contexts = _step3.value;

          if (contexts) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = contexts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var context = _step4.value;

                if (context.active) {
                  var _result = void 0;

                  _result = context.update(eventKey, value);

                  if (_result) {
                    return true;
                  }
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                  _iterator4["return"]();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return false;
    }
  };
  result.handleEvent = result.handleEvent.bind(result);
  result.keyboard.setEventHandler(result.handleEvent);
  result.mouse.setEventHandler(result.handleEvent);
  return result;
}

var DOUBLE_ACTION_TIME = 300;
var DoubleActionInputAdapter =
/*#__PURE__*/
function (_ActionInputAdapter) {
  _inherits(DoubleActionInputAdapter, _ActionInputAdapter);

  function DoubleActionInputAdapter(eventKeyStrings) {
    var _this;

    _classCallCheck(this, DoubleActionInputAdapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DoubleActionInputAdapter).call(this, eventKeyStrings));
    _this.actionTime = 0;
    return _this;
  }
  /** @override */


  _createClass(DoubleActionInputAdapter, [{
    key: "update",
    value: function update(eventKey) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var currentTime = Date.now();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.eventKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var targetEventKey = _step.value;

          if (targetEventKey.matches(eventKey)) {
            if (value) {
              if (currentTime - this.actionTime <= DOUBLE_ACTION_TIME) {
                this.actionTime = 0;
                this.next = true;
                return true;
              } else {
                this.actionTime = currentTime;
                return false;
              }
            } else {
              this.next = false;
              return true;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
    }
  }]);

  return DoubleActionInputAdapter;
}(ActionInputAdapter);

var RandomGenerator =
/*#__PURE__*/
function () {
  function RandomGenerator(seed) {
    _classCallCheck(this, RandomGenerator);

    this._seed = seed;
  }

  _createClass(RandomGenerator, [{
    key: "random",
    value: function random() {
      return Math.random();
    }
  }, {
    key: "randomRange",
    value: function randomRange(min, max) {
      return this.random() * (max - min) + min;
    }
  }, {
    key: "randomChoose",
    value: function randomChoose(choices) {
      return choices[Math.floor(this.random() * choices.length)];
    }
  }, {
    key: "randomSign",
    value: function randomSign() {
      return this.random() < 0.5 ? -1 : 1;
    }
  }, {
    key: "seed",
    get: function get() {
      return this._seed;
    }
  }]);

  return RandomGenerator;
}();

var SimpleRandomGenerator =
/*#__PURE__*/
function (_RandomGenerator) {
  _inherits(SimpleRandomGenerator, _RandomGenerator);

  function SimpleRandomGenerator() {
    var _this;

    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    _classCallCheck(this, SimpleRandomGenerator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SimpleRandomGenerator).call(this, Math.abs(seed % 2147483647)));
    _this._next = _this.seed;
    return _this;
  }
  /** @override */


  _createClass(SimpleRandomGenerator, [{
    key: "random",
    value: function random() {
      this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
      return this._next / 2147483646;
    }
  }]);

  return SimpleRandomGenerator;
}(RandomGenerator);

/**
 * @typedef Eventable
 * @property {function} on
 * @property {function} off
 * @property {function} once
 * @property {function} emit
 */

/**
 * @version 1.2
 * 
 * # Changelog
 * ## 1.2
 * - Added named exports
 * - Added custom this context
 * - Added some needed explanations for the functions
 * 
 * ## 1.1
 * - Started versioning
 */
var EventableInstance = {
  /**
   * Registers an event handler to continually listen for the event.
   * 
   * @param {string} event The name of the event to listen for.
   * @param {function} callback The callback function to handle the event.
   * @param {*} [handle = callback] The handle to refer to this registered callback.
   * Used by off() to remove handlers. If none specified, it will use the callback
   * itself as the handle. This must be unique.
   * @return {Eventable} Self for method-chaining.
   */
  on: function on(event, callback) {
    var handle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : callback;
    var callbacks;

    if (!this.__events.has(event)) {
      callbacks = new Map();

      this.__events.set(event, callbacks);
    } else {
      callbacks = this.__events.get(event);
    }

    if (!callbacks.has(handle)) {
      callbacks.set(handle, callback);
    } else {
      throw new Error("Found callback for event '".concat(event, "' with the same handle '").concat(handle, "'."));
    }

    return this;
  },

  /**
   * Unregisters an event handler to stop listening for the event.
   * 
   * @param {string} event The name of the event listened for.
   * @param {*} handle The registered handle to refer to the registered
   * callback. If no handle was provided when calling on(), the callback
   * is used as the handle instead.
   * @return {Eventable} Self for method-chaining.
   */
  off: function off(event, handle) {
    if (this.__events.has(event)) {
      var callbacks = this.__events.get(event);

      if (callbacks.has(handle)) {
        callbacks["delete"](handle);
      } else {
        throw new Error("Unable to find callback for event '".concat(event, "' with handle '").concat(handle, "'."));
      }
    } else {
      throw new Error("Unable to find event '".concat(event, "'."));
    }

    return this;
  },

  /**
   * Registers a one-off event handler to start listening for the next,
   * and only the next, event.
   * 
   * @param {string} event The name of the event to listen for.
   * @param {function} callback The callback function to handle the event.
   * @param {*} [handle = callback] The handle to refer to this registered callback.
   * Used by off() to remove handlers. If none specified, it will use the callback
   * itself as the handle. This must be unique.
   * @return {Eventable} Self for method-chaining.
   */
  once: function once(event, callback) {
    var _this = this;

    var handle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : callback;

    var func = function func() {
      _this.off(event, handle);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      callback.apply(_this.__context || _this, args);
    };

    return this.on(event, func, handle);
  },

  /**
   * Emits the event with the arguments passed on to the registered handlers.
   * The context of the handlers, if none were initially bound, could be
   * defined upon calling the Eventable's creation function. Otherwise, the
   * handler is called with `this` context of the Eventable instance.
   * 
   * @param {string} event The name of the event to emit.
   * @param  {...any} args Any arguments to pass to registered handlers.
   * @return {Eventable} Self for method-chaining.
   */
  emit: function emit(event) {
    if (this.__events.has(event)) {
      var callbacks = Array.from(this.__events.get(event).values());

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      for (var _i = 0, _callbacks = callbacks; _i < _callbacks.length; _i++) {
        var callback = _callbacks[_i];
        callback.apply(this.__context || this, args);
      }
    } else {
      this.__events.set(event, new Map());
    }

    return this;
  }
};
/**
 * Creates an eventable object.
 * 
 * @param {Object} [context] The context used for the event handlers.
 * @return {Eventable} The created eventable object.
 */

function create() {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var result = Object.create(EventableInstance);
  result.__events = new Map();
  result.__context = context;
  return result;
}
/**
 * Assigns the passed-in object with eventable properties.
 * 
 * @param {Object} dst The object to assign with eventable properties.
 * @param {Object} [context] The context used for the event handlers.
 * @return {Eventable} The resultant eventable object.
 */

function assign(dst) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var result = Object.assign(dst, EventableInstance);
  result.__events = new Map();
  result.__context = context;
  return result;
}
/**
 * Mixins eventable properties into the passed-in class.
 * 
 * @param {Class} targetClass The class to mixin eventable properties.
 * @param {Object} [context] The context used for the event handlers.
 * @return {Class<Eventable>} The resultant eventable-mixed-in class.
 */

function mixin(targetClass) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var targetPrototype = targetClass.prototype;
  Object.assign(targetPrototype, EventableInstance);
  targetPrototype.__events = new Map();
  targetPrototype.__context = context;
  return targetPrototype;
}
var Eventable = {
  create: create,
  assign: assign,
  mixin: mixin
};

var Eventable$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  assign: assign,
  mixin: mixin,
  'default': Eventable
});

/**
 * @module View
 * @version 1.1.0
 * 
 * A view is a section of a world that is drawn onto a section of a
 * display. For every view, there must exist a camera and viewport.
 * However, there could exist multiple cameras in the same view
 * (albeit inactive).
 * 
 * A viewport is the section of the display that shows the content.
 * Since viewports generally change with the display, it is calculated
 * when needed rather than stored. Usually, you only want the full display
 * as a viewport.
 * 
 * A camera is the view in the world space itself. This usually means
 * it has the view and projection matrix. And because of its existance
 * within the world, it is often manipulated to change the world view.
 * 
 * Another way to look at it is that viewports hold the destination
 * dimensions of a view, whilst the camera holds the source transformations
 * that are applied to a view's source canvas (its buffer) dimension.
 * The size of the view buffer should never change (unless game resolution
 * and aspect ratio changes).
 */

/**
 * Creates a view which facilitates rendering from world to screen space.
 */
function createView() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 640;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 480;

  var _createViewBuffer = createViewBuffer(width, height),
      canvas = _createViewBuffer.canvas,
      context = _createViewBuffer.context;

  return {
    _canvas: canvas,
    _context: context,
    _width: width,
    _height: height,

    get canvas() {
      return this._canvas;
    },

    get context() {
      return this._context;
    },

    get width() {
      return this._width;
    },

    set width(value) {
      this._width = value;
      this._canvas.width = value;
    },

    get height() {
      return this._height;
    },

    set height(value) {
      this._height = value;
      this._canvas.height = value;
    }

  };
}
function createViewBuffer(width, height) {
  var canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  canvasElement.style = 'image-rendering: pixelated';
  var canvasContext = canvasElement.getContext('2d');
  canvasContext.imageSmoothingEnabled = false;
  return {
    canvas: canvasElement,
    context: canvasContext
  };
}
function drawBufferToCanvas(targetCanvasContext, bufferCanvasElement) {
  var viewPortX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var viewPortY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var viewPortWidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : targetCanvasContext.canvas.clientWidth;
  var viewPortHeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : targetCanvasContext.canvas.clientHeight;
  targetCanvasContext.drawImage(bufferCanvasElement, viewPortX, viewPortY, viewPortWidth, viewPortHeight);
}

var View = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createView: createView,
  createViewBuffer: createViewBuffer,
  drawBufferToCanvas: drawBufferToCanvas
});

function setViewTransform(view) {
  var camera = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (camera) {
    var _view$context, _view$context2;

    (_view$context = view.context).setTransform.apply(_view$context, _toConsumableArray(camera.getProjectionMatrix()));

    (_view$context2 = view.context).transform.apply(_view$context2, _toConsumableArray(camera.getViewMatrix()));
  } else {
    view.context.setTransform(1, 0, 0, 1, 0, 0);
  }
}

var ViewHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setViewTransform: setViewTransform
});

/**
 * A viewport for a display output. This serves as the output dimensions of a view.
 * @param {HTMLElement} canvasElement The output canvas (or the display).
 * @param {RenderingContext} canvasContext The output canvas context.
 */
var ViewPort =
/*#__PURE__*/
function () {
  function ViewPort(canvasElement, canvasContext) {
    _classCallCheck(this, ViewPort);

    this._canvas = canvasElement;
    this._context = canvasContext;
  } // NOTE: We use function getters instead of property getters here because
  // this can easily be overridden for a different implementation. These
  // values are expected to support both computed and stored values. Whereas
  // property getters imply a static, or stored, value.

  /** The x position offset in the output. */


  _createClass(ViewPort, [{
    key: "getX",
    value: function getX() {
      return 0;
    }
    /** The y position offset in the output. */

  }, {
    key: "getY",
    value: function getY() {
      return 0;
    }
    /** The width of the viewport in the output. */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this._canvas.clientWidth;
    }
    /** The height of the viewport in the output. */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._canvas.clientHeight;
    }
    /** The output canvas element. */

  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this._canvas;
    }
    /** The output canvas context. */

  }, {
    key: "getContext",
    value: function getContext() {
      return this._context;
    }
  }]);

  return ViewPort;
}();

/**
 * A camera for a view. This serves as the in-world representation of the
 * view. This is usually manipulated to move the world, zoom in, etc.
 */
var AbstractCamera =
/*#__PURE__*/
function () {
  function AbstractCamera() {
    _classCallCheck(this, AbstractCamera);
  }

  _createClass(AbstractCamera, [{
    key: "update",
    value: function update(dt) {}
    /** @abstract */

  }, {
    key: "getProjectionMatrix",
    value: function getProjectionMatrix() {
      return [1, 0, 0, 1, 0, 0];
    }
    /** @abstract */

  }, {
    key: "getViewMatrix",
    value: function getViewMatrix() {
      return [1, 0, 0, 1, 0, 0];
    }
  }]);

  return AbstractCamera;
}();

var INSTANCES = new Map();
var DEFAULT_FRAME_TIME = 1000 / 60;
/**
 * @typedef {Eventable.Eventable} GameLoop
 * 
 * @property {number} prevFrameTime The time of the previous frame in milliseconds.
 * @property {Object} animationFrameHandle The handle for the animation frame request. Used by cancelAnimationRequest().
 * @property {Object} gameContext The context of the game loop to run in.
 * @property {Object} frameTime The expected time taken per frame.
 * @property {Object} started Whether the game has started.
 * @property {Object} paused Whether the game is paused.
 * 
 * @property {function} run The game loop function itself.
 * @property {function} start Begins the game loop.
 * @property {function} stop Ends the game loop.
 * @property {function} pause Pauses the game loop.
 * @property {function} resume Resumes the game loop.
 */

/**
 * Starts a game loop.
 * 
 * @param {Object} [handle] The handle that refers to the registered game
 * loop. If the handle has not been previously registered, it will
 * register the handle with a new game loop, with the handle serving as
 * both the new game loop's handle and context (only if the handle is
 * an object, otherwise, it will create an empty context).
 * @returns {GameLoop} The started game loop instance.
 */

function start() {
  var handle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var gameLoop;

  if (INSTANCES.has(handle)) {
    gameLoop = INSTANCES.get(handle);
  } else {
    var context;
    if (_typeof(handle) === 'object') context = handle;else context = {};
    gameLoop = registerGameLoop(context, handle);
  } // Start the loop (right after any chained method calls, like event listeners)


  setTimeout(function () {
    return gameLoop.start();
  }, 0);
  return gameLoop;
}
/**
 * Stops a game loop.
 * 
 * @param {Object} [handle] The handle that refers to the registered game loop.
 * @returns {GameLoop} The stopped game loop instance or null if no game loop
 * was found with handle.
 */

function stop(handle) {
  if (INSTANCES.has(handle)) {
    var gameLoop = INSTANCES.get(handle);
    gameLoop.stop();
    return gameLoop;
  }

  return null;
}
function registerGameLoop() {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var handle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : context;
  var gameLoop = createGameLoop(context);
  INSTANCES.set(handle, gameLoop);
  return gameLoop;
}
function createGameLoop() {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var result = create(context);
  result.prevFrameTime = 0;
  result.animationFrameHandle = null;
  result.gameContext = context;
  result.frameTime = DEFAULT_FRAME_TIME;
  result.started = false;
  result.paused = false;
  /** Sets the frame time. Only changes dt; does NOT change how many times update() is called. */

  result.setFrameTime = function setFrameTime(dt) {
    this.frameTime = dt;
    return this;
  };
  /** Runs the game loop. Will call itself. */


  result.run = function run(now) {
    this.animationFrameHandle = requestAnimationFrame(this.run);
    var dt = (now - this.prevFrameTime) / this.frameTime;
    this.prevFrameTime = now;
    if (typeof this.gameContext.update === 'function') this.gameContext.update.call(this.gameContext, dt);
    this.emit('update', dt);
  }.bind(result);
  /** Starts the game loop. Calls run(). */


  result.start = function start() {
    if (this.started) throw new Error('Loop already started.'); // If the window is out of focus, just ignore the time.

    window.addEventListener('focus', this.resume);
    window.addEventListener('blur', this.pause);
    this.prevFrameTime = performance.now();
    this.started = true;
    if (typeof this.gameContext.start === 'function') this.gameContext.start.call(this.gameContext);
    this.emit('start');
    this.run(this.prevFrameTime);
  }.bind(result);
  /** Stops the game loop. */


  result.stop = function stop() {
    if (!this.started) throw new Error('Loop not yet started.'); // If the window is out of focus, just ignore the time.

    window.removeEventListener('focus', this.resume);
    window.removeEventListener('blur', this.pause);
    cancelAnimationFrame(this.animationFrameHandle);
    this.animationFrameHandle = null;
    this.started = false;
    if (typeof this.gameContext.stop === 'function') this.gameContext.stop.call(this.gameContext);
    this.emit('stop');
  }.bind(result);
  /** Pauses the game loop. */


  result.pause = function pause() {
    if (!this.started || this.paused) return;
    cancelAnimationFrame(this.animationFrameHandle);
    this.animationFrameHandle = null;
    this.paused = true;
    if (typeof this.gameContext.pause === 'function') this.gameContext.pause.call(this.gameContext);
    this.emit('pause');
  }.bind(result);
  /** Resumes the game loop. */


  result.resume = function resume() {
    if (!this.started || !this.pause) return;
    this.prevFrameTime = performance.now();
    this.paused = false;
    if (typeof this.gameContext.resume === 'function') this.gameContext.resume.call(this.gameContext);
    this.emit('resume');
    this.run(this.prevFrameTime);
  }.bind(result);

  return result;
}

var GameLoop = /*#__PURE__*/Object.freeze({
  __proto__: null,
  INSTANCES: INSTANCES,
  DEFAULT_FRAME_TIME: DEFAULT_FRAME_TIME,
  start: start,
  stop: stop,
  registerGameLoop: registerGameLoop,
  createGameLoop: createGameLoop
});

function getComponentTypeName$1(componentType) {
  return componentType.name || componentType.toString();
}

var ComponentHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getComponentTypeName: getComponentTypeName$1
});

var OPERATOR$1 = Symbol('operator');
var HANDLER$1 = Symbol('handler');
/**
 * NOTE: Intentionally does not depend on the "world" to exist in order to be created.
 */

var EntityQuery =
/*#__PURE__*/
function () {
  _createClass(EntityQuery, null, [{
    key: "select",
    value: function select(world, components) {
      return new EntityQuery(components).select(world, false);
    }
  }, {
    key: "computeKey",
    value: function computeKey(components) {
      var result = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var component = _step.value;

          if (_typeof(component) === 'object' && OPERATOR$1 in component) {
            result.push(component[OPERATOR$1].toString() + getComponentTypeName$1(component));
          } else {
            result.push(getComponentTypeName$1(component));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return result.sort().join('-');
    }
  }]);

  function EntityQuery(components) {
    _classCallCheck(this, EntityQuery);

    this._included = [];
    this._operated = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = components[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var component = _step2.value;

        if (_typeof(component) === 'object' && OPERATOR$1 in component) {
          var operator = component[OPERATOR$1];

          if (operator in this._operated) {
            this._operated[operator].components.push(component.component);
          } else {
            this._operated[operator] = {
              components: [component.component],
              handler: component[HANDLER$1]
            };
          }
        } else {
          this._included.push(component);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this.world = null;
    this.persistent = false;
    this.entityIds = new Set();
    this.key = EntityQuery.computeKey(components);
    this.onEntityCreate = this.onEntityCreate.bind(this);
    this.onEntityDestroy = this.onEntityDestroy.bind(this);
    this.onComponentAdd = this.onComponentAdd.bind(this);
    this.onComponentRemove = this.onComponentRemove.bind(this);
  }

  _createClass(EntityQuery, [{
    key: "matches",
    value: function matches(world, entityId) {
      if (this.world !== world) return false;
      if (!world.hasComponent.apply(world, [entityId].concat(_toConsumableArray(this._included)))) return false;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.getOwnPropertyNames(this._operated)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var operatedInfo = _step3.value;

          if (!operatedInfo[HANDLER$1].call(this, world, entityId, operatedInfo.components)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return true;
    }
  }, {
    key: "select",
    value: function select(world) {
      var persistent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (this.persistent) return this.entityIds;
      this.world = world;
      this.entityIds.clear();
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = world.getEntityIds()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var entityId = _step4.value;

          if (this.matches(world, entityId)) {
            this.entityIds.add(entityId);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (persistent) {
        world.entityManager.on('create', this.onEntityCreate);
        world.entityManager.on('destroy', this.onEntityDestroy);
        world.componentManager.on('add', this.onComponentAdd);
        world.componentManager.on('remove', this.onComponentRemove);
        this.persistent = true;
      }

      return this.entityIds;
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.persistent) {
        this.world.entityManager.off('create', this.onEntityCreate);
        this.world.entityManager.off('destroy', this.onEntityDestroy);
        this.world.componentManager.off('add', this.onComponentAdd);
        this.world.componentManager.off('remove', this.onComponentRemove);
        this.persistent = false;
      }

      this.entityIds.clear();
      this.world = null;
    }
  }, {
    key: "onEntityCreate",
    value: function onEntityCreate(entityId) {
      if (this.matches(this.world, entityId)) {
        this.entityIds.add(entityId);
      }
    }
  }, {
    key: "onEntityDestroy",
    value: function onEntityDestroy(entityId) {
      if (this.entityIds.has(entityId)) {
        this.entityIds["delete"](entityId);
      }
    }
  }, {
    key: "onComponentAdd",
    value: function onComponentAdd(entityId, componentType, component, initialValues) {
      this.onComponentRemove(entityId, componentType, component);
    } // NOTE: Could be further optimized if we know it ONLY contains includes, etc.

  }, {
    key: "onComponentRemove",
    value: function onComponentRemove(entityId, componentType, component) {
      if (this.matches(this.world, entityId)) {
        this.entityIds.add(entityId);
      } else if (this.entityIds.has(entityId)) {
        this.entityIds["delete"](entityId);
      }
    }
  }]);

  return EntityQuery;
}();

/**
 * @fires create
 * @fires destroy
 */

var EntityManager =
/*#__PURE__*/
function () {
  function EntityManager() {
    _classCallCheck(this, EntityManager);

    this._entities = new Set();
    this._nextAvailableEntityId = 1;
  }

  _createClass(EntityManager, [{
    key: "addEntityId",
    value: function addEntityId(entityId) {
      this._entities.add(entityId);

      this.emit('create', entityId);
    }
  }, {
    key: "deleteEntityId",
    value: function deleteEntityId(entityId) {
      this._entities["delete"](entityId);

      this.emit('destroy', entityId);
    }
  }, {
    key: "getNextAvailableEntityId",
    value: function getNextAvailableEntityId() {
      return this._nextAvailableEntityId++;
    }
  }, {
    key: "getEntityIds",
    value: function getEntityIds() {
      return this._entities;
    }
  }]);

  return EntityManager;
}();
mixin(EntityManager);

/**
 * @fires add
 * @fires remove
 */

var ComponentManager =
/*#__PURE__*/
function () {
  function ComponentManager() {
    _classCallCheck(this, ComponentManager);

    this.componentTypeInstanceMap = new Map();
  }

  _createClass(ComponentManager, [{
    key: "createComponent",
    value: function createComponent(entityId, componentType, initialValues) {
      var component; // Instantiate the component...

      var type = _typeof(componentType);

      if (type === 'object') {
        // NOTE: Although this checks the prototype chain on EVERY add, it only
        // checks on the class object, which should NOT have a chain.
        if (!('create' in componentType)) {
          throw new Error("Instanced component class '".concat(getComponentTypeName(componentType), "' must at least have a create() function."));
        }

        component = componentType.create(this, entityId);
      } else if (type === 'function') {
        component = new componentType(this, entityId);
      } else if (type === 'symbol') {
        // NOTE: Symbols lose their immutability when converted into a component
        // (their equality is checked by their toString() when computing its key)
        throw new Error('Symbols are not yet supported as components.');
      } else {
        // NOTE: This means that these can be numbers and strings.
        // HOWEVER, I caution against using numbers. Numbers can often be confused
        // with other operations (particularly when computation is involved).
        component = componentType;
      } // Initialize the component...


      if (initialValues) {
        // Try user-defined static copy...
        if ('copy' in componentType) {
          componentType.copy(component, initialValues);
        } // Try user-defined instance copy...
        else if ('copy' in component) {
            component.copy(initialValues);
          } // Try default copy...
          else {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = Object.getOwnPropertyNames(initialValues)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var key = _step.value;
                  component[key] = initialValues[key];
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            }
      }

      return component;
    }
  }, {
    key: "putComponent",
    value: function putComponent(entityId, componentType, component, initialValues) {
      var componentInstanceMap;

      if (this.componentTypeInstanceMap.has(componentType)) {
        componentInstanceMap = this.componentTypeInstanceMap.get(componentType);
      } else {
        this.componentTypeInstanceMap.set(componentType, componentInstanceMap = new Map());
      }

      if (componentInstanceMap.has(entityId)) {
        throw new Error("Cannot add more than one instance of component class '".concat(getComponentTypeName(componentType), "' for entity '").concat(entityId, "'."));
      }

      componentInstanceMap.set(entityId, component);
      this.emit('add', entityId, componentType, component, initialValues);
    }
  }, {
    key: "deleteComponent",
    value: function deleteComponent(entityId, componentType, component) {
      this.componentTypeInstanceMap.get(componentType)["delete"](entityId);
      var reusable;

      if ('reset' in componentType) {
        reusable = componentType.reset(component);
      } else if ('reset' in component) {
        reusable = component.reset();
      } else {
        // Do nothing. It cannot be reset.
        reusable = false;
      }

      this.emit('remove', entityId, componentType, component);
    }
  }, {
    key: "hasComponentType",
    value: function hasComponentType(componentType) {
      return this.componentTypeInstanceMap.has(componentType);
    }
  }, {
    key: "getComponentTypes",
    value: function getComponentTypes() {
      return this.componentTypeInstanceMap.keys();
    }
  }, {
    key: "getComponentInstanceMapByType",
    value: function getComponentInstanceMapByType(componentType) {
      return this.componentTypeInstanceMap.get(componentType);
    }
  }, {
    key: "getComponentInstanceMaps",
    value: function getComponentInstanceMaps() {
      return this.componentTypeInstanceMap.values();
    }
  }]);

  return ComponentManager;
}();
mixin(ComponentManager);

/**
 * @typedef EntityId
 * The unique id for every entity in a world.
 */

/**
 * Manages all entities.
 */

var EntityWorld =
/*#__PURE__*/
function () {
  function EntityWorld() {
    _classCallCheck(this, EntityWorld);

    this.entityManager = new EntityManager(this);
    this.componentManager = new ComponentManager(this);
  }

  _createClass(EntityWorld, [{
    key: "clear",
    value: function clear() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.entityManager.getEntityIds()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entityId = _step.value;
          this.destroyEntity(entityId, opts);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /** Creates a unique entity with passed-in components (without initial values). */

  }, {
    key: "createEntity",
    value: function createEntity() {
      var entityId = this.entityManager.getNextAvailableEntityId();
      this.entityManager.addEntityId(entityId);

      for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
        components[_key] = arguments[_key];
      }

      for (var _i = 0, _components = components; _i < _components.length; _i++) {
        var component = _components[_i];
        this.addComponent(entityId, component);
      }

      return entityId;
    }
    /** Destroys the passed-in entity (and its components). */

  }, {
    key: "destroyEntity",
    value: function destroyEntity(entityId) {
      // Remove entity components from world
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.componentManager.getComponentTypes()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _componentType = _step2.value;

          if (this.componentManager.getComponentInstanceMapByType(_componentType).has(entityId)) {
            this.removeComponent(entityId, _componentType);
          }
        } // Remove entity from world

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.entityManager.deleteEntityId(entityId);
    }
  }, {
    key: "getEntityIds",
    value: function getEntityIds() {
      return this.entityManager.getEntityIds();
    }
    /**
     * 
     * @param {import('./Entity.js').EntityId} entityId The id of the entity to add to.
     * @param {FunctionConstructor|import('./Component.js').ComponentFactory|String|Number} componentType The component type.
     * Can either be a component class or a component factory.
     * @param {Object} [initialValues] The initial values for the component. Can be an object
     * map of all defined key-value pairs or another instance of the same component. This
     * must be undefined for tag-like components.
     */

  }, {
    key: "addComponent",
    value: function addComponent(entityId, componentType) {
      var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      try {
        var component = this.componentManager.createComponent(entityId, componentType, initialValues);
        this.componentManager.putComponent(entityId, componentType, component, initialValues);
        return component;
      } catch (e) {
        console.error("Failed to add component '".concat(getComponentTypeName$1(componentType), "' to entity '").concat(entityId, "'."));
        console.error(e);
      }
    }
  }, {
    key: "removeComponent",
    value: function removeComponent(entityId, componentType) {
      try {
        var component = this.getComponent(entityId, componentType);
        this.componentManager.deleteComponent(entityId, componentType, component);
      } catch (e) {
        console.error("Failed to remove component '".concat(getComponentTypeName$1(componentType), "' from entity '").concat(entityId, "'."));
        console.error(e);
      }
    }
  }, {
    key: "clearComponents",
    value: function clearComponents(entityId) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.componentManager.getComponentInstanceMaps()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var entityComponentMap = _step3.value;

          if (entityComponentMap.has(entityId)) {
            var component = entityComponentMap.get(entityId);
            this.componentManager.deleteComponent(entityId, componentType, component);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "getComponent",
    value: function getComponent(entityId, componentType) {
      return this.componentManager.getComponentInstanceMapByType(componentType).get(entityId);
    }
  }, {
    key: "hasComponent",
    value: function hasComponent(entityId) {
      for (var _len2 = arguments.length, componentTypes = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        componentTypes[_key2 - 1] = arguments[_key2];
      }

      for (var _i2 = 0, _componentTypes = componentTypes; _i2 < _componentTypes.length; _i2++) {
        var _componentType2 = _componentTypes[_i2];
        if (!this.componentManager.hasComponentType(_componentType2)) return false;
        if (!this.componentManager.getComponentInstanceMapByType(_componentType2).has(entityId)) return false;
      }

      return true;
    }
  }, {
    key: "countComponents",
    value: function countComponents(entityId) {
      var count = 0;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.componentManager.getComponentInstanceMaps()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var entityComponentMap = _step4.value;

          if (entityComponentMap.has(entityId)) {
            ++count;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return count;
    }
    /**
     * Immediately query entity ids by its components. This is simply an alias for Query.select().
     * @param {Array<Component>} components The component list to match entities to.
     * @returns {Iterable<EntityId>} A collection of all matching entity ids.
     */

  }, {
    key: "query",
    value: function query(components) {
      return EntityQuery.select(this, components);
    }
  }]);

  return EntityWorld;
}();

function createQueryOperator(handler) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Symbol(handler.name);

  var result = function result(componentType) {
    var _ref;

    return _ref = {}, _defineProperty(_ref, OPERATOR, key), _defineProperty(_ref, HANDLER, handler), _defineProperty(_ref, "component", componentType), _ref;
  }; // Dynamic renaming of function for debugging purposes
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name


  Object.defineProperty(result, 'name', {
    value: name,
    configurable: true
  });
  return result;
}
var Not = createQueryOperator(function NotOperator(world, entityId, componentTypees) {
  return !world.hasComponent.apply(world, [entityId].concat(_toConsumableArray(componentTypees)));
}, Symbol('!'));

var QueryOperator = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createQueryOperator: createQueryOperator,
  Not: Not
});

/**
 * Creates a new component instance for this component type.
 * @callback create
 * @param {import('../World.js').World} world The world the component will be added to.
 * @param {import('../entity/Entity.js').EntityId} entityId The id of the entity this component is added to.
 */

/**
 * Copies a component instance from values.
 * @callback copy
 * @param {Object} dst The target component instance to modify.
 * @param {Object} values The source values to copy from.
 */

/**
 * Resets a component instance to be re-used or deleted.
 * @callback reset
 * @param {Object} dst The target component instance to reset.
 */

/**
 * @typedef ComponentFactory
 * A component factory handles the creation, modification, and deletion of component instances.
 * 
 * @property {create} create Creates a new component instance for this type.
 * @property {copy} [copy] Copies a component instance from values.
 * @property {reset} [reset] Resets a component instance to be re-used or deleted.
 */

/**
 * Creates a component factory given the passed-in handlers. This is not required
 * to create a component factory; any object with create(), copy(), and reset() can
 * be considered a component factory and used as is without this function. This
 * function is mostly for ease of use and readability.
 * 
 * @param {String} name The name of the component. This should be unique; it is used as its hash key.
 * @param {create} [create=defaultCreate] The function to create new components.
 * @param {copy} [copy=defaultCopy] The function to copy new components from values.
 * @param {reset} [reset=defaultReset] The function to reset a component to be re-used or deleted.
 * @returns {ComponentFactory} The created component factory.
 */
function createComponentFactory(name) {
  var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultCreate;
  var copy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultCopy;
  var reset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultReset;
  return {
    name: name,
    create: create,
    copy: copy,
    reset: reset
  };
}

function defaultCreate(world, entityId) {
  return {};
}

function defaultCopy(dst, values) {
  Object.assign(dst, values);
}

function defaultReset(dst) {
  Object.getOwnPropertyNames(dst).forEach(function (value) {
    return delete dst[value];
  });
}

var ComponentFactory = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createComponentFactory: createComponentFactory
});

/**
 * A class to represent a component. This class is not required to
 * create a component; any class can be considered a component. To
 * override reset or copy behavior, simply implement the reset()
 * or copy() functions respectively for that class.
 * 
 * This class serves mostly as a quick and dirty default fallback. It
 * has defaults for all functionality except its properties (which are
 * usually unique to each component type).
 * 
 * Usually, you will use this class like so:
 * @example
 * class MyComponent extends ComponentBase
 * {
 *   constructor()
 *   {
 *     super();
 *     this.myValue = true;
 *     this.myString = 'Hello World';
 *   }
 * 
 *   // Feel free to override any default functionality when needed...
 * }
 */
var DEFAULT_UNDEFINED = Symbol('defaultUndefined');
var ComponentBase =
/*#__PURE__*/
function () {
  _createClass(ComponentBase, null, [{
    key: "defaultValues",
    get: function get() {
      return null;
    }
  }]);

  function ComponentBase(world, entityId) {
    var resetAsSelfConstructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, ComponentBase);

    if (!('defaultValues' in this.constructor)) {
      if (resetAsSelfConstructor) {
        // NOTE: Must make sure 'defaultValues' exists before recursing into the constructor.
        this.constructor.defaultValues = null;
        this.constructor.defaultValues = new this.constructor();
      } else {
        this.constructor.defaultValues = DEFAULT_UNDEFINED;
      }
    }
  }

  _createClass(ComponentBase, [{
    key: "copy",
    value: function copy(values) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.getOwnPropertyNames(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;
          this[key] = values[key];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      if ('defaultValues' in this.constructor) {
        var defaultValues = this.constructor.defaultValues;

        if (defaultValues === DEFAULT_UNDEFINED) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.getOwnPropertyNames(this)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var key = _step2.value;
              this[key] = undefined;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return true;
        } else if (defaultValues) {
          this.copy(this, this.constructor.defaultValues);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }]);

  return ComponentBase;
}();

/**
 * A class to represent a component with no data, also known as a tag.
 * This class is not required to create a tag component; any class is
 * considered a tag, if:
 * 
 * - It does not implement reset() or reset() always returns false.
 * - And its instances do not own any properties.
 * 
 * This class is mostly for ease of use and readability.
 */
var TagComponent = function TagComponent() {
  _classCallCheck(this, TagComponent);
};

/** Cannot be directly added through world.addComponent(). Must be create with new EntityComponent(). */
var EntityComponent$1 =
/*#__PURE__*/
function () {
  function EntityComponent(world) {
    var entityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, EntityComponent);

    if (typeof entityId !== 'undefined') {
      throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
    }

    if (!world) {
      throw new Error('Cannot create entity in null world.');
    }

    var id = world.createEntity(); // Skip component creation, as we will be using ourselves :D

    world.componentManager.putComponent(id, EntityComponent, this, undefined);
    this.id = id;
  }
  /** @override */


  _createClass(EntityComponent, [{
    key: "copy",
    value: function copy(values) {
      throw new Error('Unsupported operation; cannot be initialized by existing values.');
    }
    /** @override */

  }, {
    key: "reset",
    value: function reset() {
      return false;
    }
  }]);

  return EntityComponent;
}();

var EntityBase =
/*#__PURE__*/
function (_EntityComponent) {
  _inherits(EntityBase, _EntityComponent);

  function EntityBase(world) {
    var _this;

    _classCallCheck(this, EntityBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EntityBase).call(this, world));
    _this.world = world;
    return _this;
  }

  _createClass(EntityBase, [{
    key: "destroy",
    value: function destroy() {
      this.world.destroyEntity(this.entityId);
      this.world = null;
    }
  }, {
    key: "addComponent",
    value: function addComponent(componentType) {
      var initialValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      this.world.addComponent(this.id, componentType, initialValues);
      return this;
    }
  }, {
    key: "removeComponent",
    value: function removeComponent(componentType) {
      this.world.removeComponent(this.id, componentType);
      return this;
    }
  }, {
    key: "hasComponent",
    value: function hasComponent(componentType) {
      return this.world.hasComponent(this.id, componentType);
    }
  }, {
    key: "getComponent",
    value: function getComponent(componentType) {
      return this.world.getComponent(this.id, componentType);
    }
  }]);

  return EntityBase;
}(EntityComponent$1);

var HybridEntity =
/*#__PURE__*/
function (_EntityBase) {
  _inherits(HybridEntity, _EntityBase);

  function HybridEntity(world) {
    var _this;

    _classCallCheck(this, HybridEntity);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HybridEntity).call(this, world));
    _this.onComponentAdd = _this.onComponentAdd.bind(_assertThisInitialized(_this));
    _this.onComponentRemove = _this.onComponentRemove.bind(_assertThisInitialized(_this));

    _this.world.componentManager.on('add', _this.onComponentAdd);

    _this.world.componentManager.on('remove', _this.onComponentRemove);

    return _this;
  }
  /** @abstract */


  _createClass(HybridEntity, [{
    key: "onDestroy",
    value: function onDestroy() {}
  }, {
    key: "onComponentAdd",
    value: function onComponentAdd(entityId, componentType, component, initialValues) {
      if (entityId === this.id) {
        // NOTE: Since this callback is connected only AFTER EntityComponent has been added
        // we can safely assume that it cannot be added again.
        addComponentProperties(this, componentType, component);
      }
    }
  }, {
    key: "onComponentRemove",
    value: function onComponentRemove(entityId, componentType, component) {
      if (entityId === this.id) {
        if (componentType === EntityComponent) {
          this.world.off('componentadd', this.onComponentAdd);
          this.world.off('componentremove', this.onComponentRemove);
          this.onDestroy();
        } else {
          removeComponentProperties(this, componentType, component);
        }
      }
    }
  }]);

  return HybridEntity;
}(EntityBase);

function addComponentProperties(target, componentType, component) {
  if (_typeof(component) === 'object') {
    var ownProps = Object.getOwnPropertyNames(target);
    var newProps = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var prop = _step.value;

        if (ownProps.includes(prop)) {
          throw new Error("Conflicting property names in entity for component '".concat(getComponentTypeName(componentType), "'."));
        }

        newProps[prop] = {
          get: function get() {
            return component[prop];
          },
          set: function set(value) {
            component[prop] = value;
          },
          configurable: true
        };
      };

      for (var _iterator = Object.getOwnPropertyNames(component)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    Object.defineProperties(target, newProps);
  }
}

function removeComponentProperties(target, componentType, component) {
  if (_typeof(component) === 'object') {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.getOwnPropertyNames(component)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var prop = _step2.value;
        delete target[prop];
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
}

function getEntityById(world, entityId) {
  return getComponent(entityId, EntityComponent);
}
function getEntities(world) {
  var dst = [];
  var entityIds = world.query([EntityComponent]);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = entityIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var entityId = _step.value;
      var component = world.getComponent(entityId, EntityComponent);
      dst.push(component);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return dst;
}

var EntityHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getEntityById: getEntityById,
  getEntities: getEntities
});

/**
 * @module Utils
 * @version 1.0.2
 * 
 * # Changelog
 * ## 1.0.2
 * - Added outline parameter for drawBox()
 * - Added uuid()
 */
function randomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
function loadImage(url) {
  var image = new Image();
  image.src = url;
  return image;
}
function clampRange(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
function clearScreen(ctx, width, height) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
}
function drawText(ctx, text, x, y) {
  var radians = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var fontSize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 16;
  var color = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'white';
  ctx.translate(x, y);
  if (radians) ctx.rotate(radians);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "".concat(fontSize, "px sans-serif");
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  if (radians) ctx.rotate(-radians);
  ctx.translate(-x, -y);
}
function drawBox(ctx, x, y) {
  var radians = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var w = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 16;
  var h = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : w;
  var color = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'white';
  var outline = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
  ctx.translate(x, y);
  if (radians) ctx.rotate(radians);

  if (!outline) {
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
  } else {
    ctx.strokeStyle = color;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
  }

  if (radians) ctx.rotate(-radians);
  ctx.translate(-x, -y);
}
function intersectBox(a, b) {
  return Math.abs(a.x - b.x) * 2 < a.width + b.width && Math.abs(a.y - b.y) * 2 < a.height + b.height;
}
function applyMotion(entity) {
  var inverseFrictionX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var inverseFrictionY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : inverseFrictionX;

  if (inverseFrictionX !== 1) {
    entity.dx *= inverseFrictionX;
  }

  if (inverseFrictionY !== 1) {
    entity.dy *= inverseFrictionY;
  }

  entity.x += entity.dx;
  entity.y += entity.dy;
}
function withinRadius(from, to, radius) {
  var dx = from.x - to.x;
  var dy = from.y - to.y;
  return dx * dx + dy * dy <= radius * radius;
}
function onDOMLoaded(listener) {
  window.addEventListener('DOMContentLoaded', listener);
}
function lerp(a, b, dt) {
  return a + (b - a) * dt;
}
function distance2D(from, to) {
  var dx = to.x - from.x;
  var dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function direction2D(from, to) {
  var dx = to.x - from.x;
  var dy = to.y - from.y;
  return Math.atan2(dy, dx);
}
function lookAt2D(radians, target, dt) {
  var step = cycleRange(target - radians, -Math.PI, Math.PI);
  return clampRange(radians + step, radians - dt, radians + dt);
}
function cycleRange(value, min, max) {
  var range = max - min;
  var result = (value - min) % range;
  if (result < 0) result += range;
  return result + min;
}
function drawCircle(ctx, x, y) {
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 16;
  var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'white';
  var outline = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  if (outline) ctx.stroke();else ctx.fill();
}
/**
 * Generates a uuid v4.
 * 
 * @param {number} a The placeholder (serves for recursion within function).
 * @returns {string} The universally unique id.
 */

function uuid() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  // https://gist.github.com/jed/982883
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

var Utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  randomHexColor: randomHexColor,
  loadImage: loadImage,
  clampRange: clampRange,
  clearScreen: clearScreen,
  drawText: drawText,
  drawBox: drawBox,
  intersectBox: intersectBox,
  applyMotion: applyMotion,
  withinRadius: withinRadius,
  onDOMLoaded: onDOMLoaded,
  lerp: lerp,
  distance2D: distance2D,
  direction2D: direction2D,
  lookAt2D: lookAt2D,
  cycleRange: cycleRange,
  drawCircle: drawCircle,
  uuid: uuid
});

/**
 * @module Display
 * @version 1.0.1
 */
var canvas;
var context; // Default setup...

onDOMLoaded(function () {
  if (!canvas) {
    var canvasElement = null;
    var canvasContext = null; // Try resolve to <display-port> if exists...

    var displayElement = document.querySelector('display-port');

    if (displayElement) {
      canvasElement = displayElement.getCanvas();
      canvasContext = displayElement.getContext();
    } // Otherwise, find a <canvas> element...
    else {
        canvasElement = document.querySelector('canvas');
      }

    if (canvasElement) {
      if (!canvasContext) canvasContext = canvasElement.getContext('2d');
      attachCanvas(canvasElement, canvasContext);
    }
  }
});
function createCanvas() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 320;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : width;
  var parentElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
  var canvasElement = document.createElement('canvas');
  parentElement.appendChild(canvasElement);
  attachCanvas(canvasElement, width, height);
}
function attachCanvas(canvasElement, canvasContext) {
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 320;
  var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : width;
  canvas = canvasElement;
  context = canvasContext;
  canvas.width = width;
  canvas.height = height;
}
function drawBufferToScreen(ctx) {
  var viewportOffsetX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var viewportOffsetY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var viewportWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getClientWidth();
  var viewportHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : getClientHeight();
  getDrawContext().drawImage(ctx.canvas, viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight);
}
function getCanvas() {
  return canvas;
}
function getDrawContext() {
  return context;
}
function getClientWidth() {
  return canvas.clientWidth;
}
function getClientHeight() {
  return canvas.clientHeight;
}
function getClientOffsetX() {
  return canvas.offsetLeft;
}
function getClientOffsetY() {
  return canvas.offsetTop;
}

var Display = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createCanvas: createCanvas,
  attachCanvas: attachCanvas,
  drawBufferToScreen: drawBufferToScreen,
  getCanvas: getCanvas,
  getDrawContext: getDrawContext,
  getClientWidth: getClientWidth,
  getClientHeight: getClientHeight,
  getClientOffsetX: getClientOffsetX,
  getClientOffsetY: getClientOffsetY
});

var audioContext = new AudioContext();
function createSound(filepath) {
  var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var result = {
    _playing: false,
    _data: null,
    _source: null,
    play: function play() {
      var _this = this;

      if (!this._data) return;
      if (this._source) this.destroy();
      var source = audioContext.createBufferSource();
      source.loop = loop;
      source.buffer = this._data;
      source.addEventListener('ended', function () {
        _this._playing = false;
      });
      source.connect(audioContext.destination);
      source.start(0);
      this._source = source;
      this._playing = true;
    },
    pause: function pause() {
      this._source.stop();

      this._playing = false;
    },
    destroy: function destroy() {
      if (this._source) this._source.disconnect();
      this._source = null;
    },
    isPaused: function isPaused() {
      return !this._playing;
    }
  };
  fetch(filepath).then(function (response) {
    return response.arrayBuffer();
  }).then(function (buffer) {
    return audioContext.decodeAudioData(buffer);
  }).then(function (data) {
    return result._data = data;
  });
  return result;
}

var Audio = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createSound: createSound
});

/**
 * @module Input
 * @version 1.0.1
 */
var source = createSource();
var context$1 = createContext().attach(source); // Default setup...

onDOMLoaded(function () {
  if (!source.element) {
    var canvasElement = null; // Try resolve to <display-port> if exists...

    var displayElement = document.querySelector('display-port');

    if (displayElement) {
      canvasElement = displayElement.getCanvas();
    } // Otherwise, find a <canvas> element...
    else {
        canvasElement = document.querySelector('canvas');
      }

    if (canvasElement) {
      attachCanvas$1(canvasElement);
    }
  }
});
function attachCanvas$1(canvasElement) {
  if (source.element) source.detach();
  return source.attach(canvasElement);
}
function createContext$1() {
  var priority = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return createContext().setPriority(priority).toggle(active).attach(source);
}
function createInput(adapter) {
  return context$1.registerInput(getNextInputName(), adapter);
}
function createAction() {
  for (var _len = arguments.length, eventKeyStrings = new Array(_len), _key = 0; _key < _len; _key++) {
    eventKeyStrings[_key] = arguments[_key];
  }

  return context$1.registerAction.apply(context$1, [getNextInputName()].concat(eventKeyStrings));
}
function createRange(eventKeyString) {
  return context$1.registerRange(getNextInputName(), eventKeyString);
}
function createState(eventKeyMap) {
  return context$1.registerState(getNextInputName(), eventKeyMap);
}
function poll() {
  return source.poll();
}
function handleEvent(eventKeyString, value) {
  return source.handleEvent(eventKeyString, value);
}
var nextInputNameId = 1;

function getNextInputName() {
  return "__input#".concat(nextInputNameId++);
}

var Input = /*#__PURE__*/Object.freeze({
  __proto__: null,
  attachCanvas: attachCanvas$1,
  createContext: createContext$1,
  createInput: createInput,
  createAction: createAction,
  createRange: createRange,
  createState: createState,
  poll: poll,
  handleEvent: handleEvent
});

var DEFAULT_RNG = new RandomGenerator();
function createRandom() {
  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new SimpleRandomGenerator(seed);
}
function random() {
  return DEFAULT_RNG.random();
}
function randomRange(min, max) {
  return DEFAULT_RNG.randomRange(min, max);
}
function randomChoose(choices) {
  return DEFAULT_RNG.randomChoose(choices);
}
function randomSign() {
  return DEFAULT_RNG.randomSign();
}

var Random = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createRandom: createRandom,
  random: random,
  randomRange: randomRange,
  randomChoose: randomChoose,
  randomSign: randomSign
});



export default self;
export { AbstractCamera, AbstractInputAdapter, ActionInputAdapter, Audio, ComponentHelper as Component, ComponentBase, ComponentFactory, DOUBLE_ACTION_TIME, Display, DisplayPort, DoubleActionInputAdapter, EntityHelper as Entity, EntityBase, EntityComponent$1 as EntityComponent, EntityQuery, EntityWorld, EventKey, Eventable$1 as Eventable, GameLoop, HybridEntity, Input, Keyboard, MAX_CONTEXT_PRIORITY, MIN_CONTEXT_PRIORITY, MODE_CENTER, MODE_FIT, MODE_NOSCALE, MODE_STRETCH, Mouse, QueryOperator, Random, RandomGenerator, RangeInputAdapter, SimpleRandomGenerator, StateInputAdapter, TagComponent, Utils, View, ViewHelper, ViewPort, createContext, createSource };
