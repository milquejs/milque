(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Milque = {}));
}(this, (function (exports) { 'use strict';

    var self = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Display () { return Display; },
        get Audio () { return Audio; },
        get Input () { return Input; },
        get Random () { return Random; },
        get Viewport () { return Viewport; },
        get Utils () { return Utils; },
        get default () { return self; },
        get MODE_NOSCALE () { return MODE_NOSCALE; },
        get MODE_CENTER () { return MODE_CENTER; },
        get MODE_FIT () { return MODE_FIT; },
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
        get GameLoop () { return GameLoop; }
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
    function drawBox(ctx, x, y, radians, w) {
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

    function createView() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 320;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : width;
      var canvasElement = document.createElement('canvas');
      canvasElement.width = width;
      canvasElement.height = height;
      canvasElement.style = 'image-rendering: pixelated';
      var canvasContext = canvasElement.getContext('2d');
      canvasContext.imageSmoothingEnabled = false;
      var result = {
        canvas: canvasElement,
        context: canvasContext,
        width: width,
        height: height,
        offsetX: 0,
        offsetY: 0
      };
      return result;
    }

    var Viewport = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createView: createView
    });

    /**
     * @module DisplayPort
     * @version 1.3
     * 
     * # Changelog
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
    var DEFAULT_MODE = MODE_CENTER;
    var DEFAULT_WIDTH = 640;
    var DEFAULT_HEIGHT = 480;
    var INNER_HTML = "\n<label class=\"hidden\" id=\"title\">display-port</label>\n<label class=\"hidden\" id=\"fps\">00</label>\n<label class=\"hidden\" id=\"dimension\">0x0</label>\n<canvas></canvas>";
    var INNER_STYLE = "\n<style>\n    :host {\n        display: inline-block;\n        color: #555555;\n    }\n    div {\n        display: flex;\n        position: relative;\n        width: 100%;\n        height: 100%;\n    }\n    canvas {\n        background: #000000;\n        margin: auto;\n    }\n    label {\n        font-family: monospace;\n        color: currentColor;\n        position: absolute;\n    }\n    #title {\n        left: 0.5rem;\n        top: 0.5rem;\n    }\n    #fps {\n        right: 0.5rem;\n        top: 0.5rem;\n    }\n    #dimension {\n        left: 0.5rem;\n        bottom: 0.5rem;\n    }\n    .hidden {\n        display: none;\n    }\n    :host([debug]) div {\n        outline: 8px dashed rgba(0, 0, 0, 0.4);\n        outline-offset: -4px;\n        background-color: rgba(0, 0, 0, 0.1);\n    }\n    :host([mode=\"".concat(MODE_NOSCALE, "\"]) canvas {\n        margin: 0;\n        top: 0;\n        left: 0;\n    }\n    :host([mode=\"").concat(MODE_FIT, "\"]), :host([mode=\"").concat(MODE_CENTER, "\"]) {\n        width: 100%;\n        height: 100%;\n    }\n    :host([full]) {\n        width: 100vw!important;\n        height: 100vh!important;\n    }\n</style>");
    var DisplayPort =
    /*#__PURE__*/
    function (_HTMLElement) {
      _inherits(DisplayPort, _HTMLElement);

      _createClass(DisplayPort, null, [{
        key: "observedAttributes",

        /** @override */
        get: function get() {
          return ['width', 'height', // NOTE: For debuggin purposes...
          'id', 'class', 'debug'];
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
            this._fpsElement.innerText = frames; // Update dimensions...

            this._dimensionElement.innerText = "".concat(this._width, "x").concat(this._height, "|").concat(this.shadowRoot.host.clientWidth, "x").concat(this.shadowRoot.host.clientHeight);
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

          if (mode !== MODE_NOSCALE) {
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
        key: "drawBufferToCanvas",
        value: function drawBufferToCanvas(bufferContext) {
          var viewportOffsetX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var viewportOffsetY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
          var viewportWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
          var viewportHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;

          this._canvasContext.drawImage(bufferContext.canvas, viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight);
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
          return this.setAttribute('width', value);
        }
      }, {
        key: "height",
        get: function get() {
          return this._height;
        },
        set: function set(value) {
          return this.setAttribute('height', value);
        }
      }, {
        key: "mode",
        get: function get() {
          return this.getAttribute('mode');
        },
        set: function set(value) {
          return this.setAttribute('mode', value);
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

    var INSTANCES = new Map();
    var DEFAULT_FRAME_TIME = 1000 / 60;
    /**
     * @typedef {Eventable.Eventable} GameLoop
     * 
     * @property {number} prevFrameTime The time of the previous frame in milliseconds.
     * @property {Object} animationFrameHandle The handle for the animation frame request. Used by cancelAnimationRequest().
     * @property {Object} gameContext The context of the game loop to run in.
     * 
     * @property {function} run The game loop function itself.
     * @property {function} start Begins the game loop.
     * @property {function} stop Ends the game loop.
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
        if (this.started) throw new Error('Loop already started.');
        this.prevFrameTime = 0;
        this.started = true;
        if (typeof this.gameContext.start === 'function') this.gameContext.start.call(this.gameContext);
        this.emit('start');
        this.run(0);
      }.bind(result);
      /** Stops the game loop. */


      result.stop = function stop() {
        if (!this.started) throw new Error('Loop not yet started.');
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
        this.prevFrameTime = 0;
        this.paused = false;
        if (typeof this.gameContext.resume === 'function') this.gameContext.resume.call(this.gameContext);
        this.emit('resume');
        this.run(0);
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



    exports.AbstractInputAdapter = AbstractInputAdapter;
    exports.ActionInputAdapter = ActionInputAdapter;
    exports.Audio = Audio;
    exports.DOUBLE_ACTION_TIME = DOUBLE_ACTION_TIME;
    exports.Display = Display;
    exports.DisplayPort = DisplayPort;
    exports.DoubleActionInputAdapter = DoubleActionInputAdapter;
    exports.EventKey = EventKey;
    exports.Eventable = Eventable$1;
    exports.GameLoop = GameLoop;
    exports.Input = Input;
    exports.Keyboard = Keyboard;
    exports.MAX_CONTEXT_PRIORITY = MAX_CONTEXT_PRIORITY;
    exports.MIN_CONTEXT_PRIORITY = MIN_CONTEXT_PRIORITY;
    exports.MODE_CENTER = MODE_CENTER;
    exports.MODE_FIT = MODE_FIT;
    exports.MODE_NOSCALE = MODE_NOSCALE;
    exports.Mouse = Mouse;
    exports.Random = Random;
    exports.RandomGenerator = RandomGenerator;
    exports.RangeInputAdapter = RangeInputAdapter;
    exports.SimpleRandomGenerator = SimpleRandomGenerator;
    exports.StateInputAdapter = StateInputAdapter;
    exports.Utils = Utils;
    exports.Viewport = Viewport;
    exports.createContext = createContext;
    exports.createSource = createSource;
    exports.default = self;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
