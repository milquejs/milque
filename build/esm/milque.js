var VIEWS = new Map();
var VIEW = {
  id: null,
  canvas: null
};

function attach(canvasElement) {
  var viewID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  // Attaching an alternative view...
  if (viewID) {
    VIEWS.set(viewID, canvasElement);

    if (!VIEW.canvas) {
      bind(viewID);
    }
  } // Attaching a main view...
  else {
      if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('width', 640);
        canvasElement.setAttribute('height', 480);
        document.body.appendChild(canvasElement);
      }

      VIEWS.set(null, canvasElement);
      bind(null);
    }
}

function detach(viewID) {
  VIEWS["delete"](viewID);
}

function bind() {
  var viewID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (VIEWS.has(viewID)) {
    var canvasElement = VIEWS.get(viewID);
    VIEW.id = viewID;
    VIEW.canvas = canvasElement;
  } else {
    unbind();
  }
}

function unbind() {
  VIEW.id = null;
  VIEW.canvas = null;
}

function width() {
  return VIEW.canvas.width;
}

function height() {
  return VIEW.canvas.height;
}

function clear() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#000000';
  var ctx = VIEW.canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width(), height());
}

var DisplayModule = /*#__PURE__*/Object.freeze({
    VIEW: VIEW,
    attach: attach,
    detach: detach,
    bind: bind,
    unbind: unbind,
    width: width,
    height: height,
    clear: clear
});

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

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _readOnlyError(name) {
  throw new Error("\"" + name + "\" is read-only");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
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

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * Generates a uuidv4.
 * 
 * @returns {String} the universally unique id
 */
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
  });
}
/**
 * Interpolates, or lerps, between 2 values by the specified amount, dt.
 * 
 * @param {Number} a the initial value
 * @param {Number} b the final value
 * @param {Number} dt the amount changed
 * @returns {Number} the interpolated value
 */

function lerp(a, b, dt) {
  return a * (1 - dt) + b * dt;
}
/**
 * Generates a number hash for the string. For an empty string, it will return 0.
 * 
 * @param {String} [value=''] the string to hash
 * @returns {Number} a hash that uniquely identifies the string
 */

function stringHash() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var hash = 0;

  for (var i = 0, len = value.length; i < len; i++) {
    hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
  }

  return hash;
}
/**
 * Calculates the directional vector for the passed-in points.
 * 
 * @param {Number} x1 the x component of the source point
 * @param {Number} y1 the y component of the source point
 * @param {Number} x2 the x component of the destination point
 * @param {Number} y2 the y component of the destination point
 * @param {Number} [magnitude=1] the magnitude, or length, of the vector
 * @param {Number} [angleOffset=0] additional angle offset from the calculated direction vector
 * @param {Object} [dst={x: 0, y: 0}] the result
 * @returns {Object} dst
 */

function getDirectionalVector(x1, y1, x2, y2) {
  var magnitude = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var angleOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var dst = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [0, 0];
  var dx = x2 - x1;
  var dy = y2 - y1;
  var angle = Math.atan2(dy, dx) + angleOffset;
  dst[0] = Math.cos(angle) * magnitude;
  dst[1] = Math.sin(angle) * magnitude;
  return dst;
}
/**
 * Calculates the midpoint between the passed-in points.
 * 
 * @param {Number} x1 the x component of the source point
 * @param {Number} y1 the y component of the source point
 * @param {Number} x2 the x component of the destination point
 * @param {Number} y2 the y component of the destination point
 * @param {Object} [dst] the result
 * @returns {Object} dst
 */

function getMidPoint(x1, y1, x2, y2) {
  var dst = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [0, 0];
  dst[0] = x1 + (x2 - x1) / 2;
  dst[1] = y1 + (y2 - y1) / 2;
  return dst;
}
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
function choose(items) {
  return items[Math.floor(Math.random() * items.length)];
}
function distanceSqu(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
}
function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

var MathHelper = /*#__PURE__*/Object.freeze({
    uuid: uuid,
    lerp: lerp,
    stringHash: stringHash,
    getDirectionalVector: getDirectionalVector,
    getMidPoint: getMidPoint,
    randomRange: randomRange,
    choose: choose,
    distanceSqu: distanceSqu,
    distance: distance
});

var InputState =
/*#__PURE__*/
function () {
  function InputState() {
    _classCallCheck(this, InputState);

    this.actions = new Set();
    this.states = new Set();
    this.ranges = new Map();
  }

  _createClass(InputState, [{
    key: "clear",
    value: function clear() {
      this.actions.clear();
      this.ranges.clear();
      this.states.clear();
    }
  }, {
    key: "setAction",
    value: function setAction(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (value) {
        this.actions.add(name);
      } else {
        this.actions["delete"](name);
      }

      return this;
    }
  }, {
    key: "setState",
    value: function setState(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (value) {
        this.states.add(name);
      } else {
        this.states["delete"](name);
      }

      return this;
    }
  }, {
    key: "setRange",
    value: function setRange(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (typeof value === 'undefined') {
        this.ranges["delete"](name);
      } else {
        this.ranges.set(name, value);
      }

      return this;
    }
  }, {
    key: "getAction",
    value: function getAction(name) {
      var consume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.actions.has(name)) {
        if (consume) {
          this.actions["delete"](name);
        }

        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "getState",
    value: function getState(name) {
      var consume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.states.has(name)) {
        if (consume) {
          this.states["delete"](name);
        }

        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "getRange",
    value: function getRange(name) {
      var consume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.ranges.has(name)) {
        var result = this.ranges.get(name);

        if (consume) {
          this.ranges["delete"](name);
        }

        return result;
      } else {
        return 0;
      }
    }
  }, {
    key: "hasAction",
    value: function hasAction(name) {
      return this.actions.has(name);
    }
  }, {
    key: "hasState",
    value: function hasState(name) {
      return this.states.has(name);
    }
  }, {
    key: "hasRange",
    value: function hasRange(name) {
      return this.ranges.has(name);
    }
  }]);

  return InputState;
}();

/**
 * A map of event keys to inputs. This is the bridge between raw input events to custom inputs.
 */
var InputMapping =
/*#__PURE__*/
function () {
  function InputMapping() {
    _classCallCheck(this, InputMapping);

    this.inputs = new Map();
  }

  _createClass(InputMapping, [{
    key: "clear",
    value: function clear() {
      this.inputs.clear();
    }
  }, {
    key: "register",
    value: function register(input) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input.eventKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventKey = _step.value;

          if (this.inputs.has(eventKey)) {
            this.inputs.get(eventKey).push(input);
          } else {
            this.inputs.set(eventKey, [input]);
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
  }, {
    key: "unregister",
    value: function unregister(input) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = input.eventKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var eventKey = _step2.value;

          if (this.inputs.has(eventKey)) {
            var inputs = this.inputs.get(eventKey);
            var index = inputs.indexOf(input);

            if (index >= 0) {
              inputs.splice(index, 1);
            }
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
  }, {
    key: "get",
    value: function get(eventKey) {
      if (this.inputs.has(eventKey)) {
        return this.inputs.get(eventKey);
      } else {
        return [];
      }
    }
  }, {
    key: "values",
    value: function values() {
      return this.inputs.values();
    }
  }], [{
    key: "toEventKey",
    value: function toEventKey(sourceName, key) {
      var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return sourceName + '[' + key + ']' + (event ? ':' + event : '');
    }
  }, {
    key: "fromEventKey",
    value: function fromEventKey(inputEventKey) {
      var dst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var sourceEnd = inputEventKey.indexOf('[');

      if (sourceEnd >= 0) {
        var sourceName = inputEventKey.substring(0, sourceEnd).trim();
        dst.push(sourceName);
        var keyEnd = inputEventKey.indexOf(']', sourceEnd + 1);

        if (keyEnd >= 0) {
          var keyName = inputEventKey.substring(sourceEnd + 1, keyEnd).trim();
          dst.push(keyName);
          var eventBegin = inputEventKey.indexOf(':', keyEnd + 1);

          if (eventBegin >= 0) {
            var eventName = inputEventKey.substring(eventBegin + 1).trim();
            dst.push(eventName);
          }
        } else {
          throw new Error('Invalid format - missing closing bracket for key.');
        }
      } else {
        dst.push(inputEventKey.trim());
      }

      return dst;
    }
  }]);

  return InputMapping;
}();

var InputContext =
/*#__PURE__*/
function () {
  function InputContext(name) {
    _classCallCheck(this, InputContext);

    this.name = name;
    this.disabled = false;
    this.mapping = new InputMapping();
  }

  _createClass(InputContext, [{
    key: "enable",
    value: function enable() {
      this.disabled = true;
      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.disabled = true;
      return this;
    }
  }]);

  return InputContext;
}();

var Input =
/*#__PURE__*/
function () {
  function Input(name) {
    _classCallCheck(this, Input);

    this.name = name;

    for (var _len = arguments.length, eventKeys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      eventKeys[_key - 1] = arguments[_key];
    }

    this.eventKeys = eventKeys;
  }

  _createClass(Input, [{
    key: "update",
    value: function update(source, key, event, value) {
      return value;
    }
  }]);

  return Input;
}();

var ActionInput =
/*#__PURE__*/
function (_Input) {
  _inherits(ActionInput, _Input);

  function ActionInput(name) {
    var _getPrototypeOf2;

    _classCallCheck(this, ActionInput);

    for (var _len = arguments.length, eventKeys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      eventKeys[_key - 1] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ActionInput)).call.apply(_getPrototypeOf2, [this, name].concat(eventKeys)));
  }
  /** @override */


  _createClass(ActionInput, [{
    key: "update",
    value: function update(source, key, event, value) {
      if (typeof value !== 'boolean') {
        value = Boolean(value);
      }

      return value;
    }
  }]);

  return ActionInput;
}(Input);

var StateInput =
/*#__PURE__*/
function (_Input) {
  _inherits(StateInput, _Input);

  function StateInput(name, downEventKey, upEventKey) {
    var _this;

    _classCallCheck(this, StateInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StateInput).call(this, name, downEventKey, upEventKey));
    _this.active = false;
    return _this;
  }
  /** @override */


  _createClass(StateInput, [{
    key: "update",
    value: function update(source, key, event, value) {
      if (typeof value !== 'boolean') {
        value = Boolean(value);
      }

      var eventKey = InputMapping.toEventKey(source.name, key, event);

      if (eventKey === this.eventKeys[0]) {
        this.active = value;
      } else if (eventKey === this.eventKeys[1]) {
        this.active = !value;
      } else {
        return null;
      }

      return this.active;
    }
  }]);

  return StateInput;
}(Input);

var RangeInput =
/*#__PURE__*/
function (_Input) {
  _inherits(RangeInput, _Input);

  function RangeInput(name, eventKey, fromMin, fromMax) {
    var _this;

    var toMin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var toMax = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

    _classCallCheck(this, RangeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RangeInput).call(this, name, eventKey));

    if (typeof fromMax !== 'number' || typeof fromMin !== 'number' || typeof toMax !== 'number' || typeof toMin !== 'number') {
      throw new Error('Range bounds for input not specified');
    }

    if (fromMax < fromMin || toMax < toMin) {
      throw new Error('Max range must be greater than min range');
    }

    if (fromMax === fromMin || toMax === toMin) {
      throw new Error('Range of input cannot be zero');
    }

    _this.fromMin = fromMin;
    _this.fromMax = fromMax;
    _this.fromNormal = fromMax - fromMin;
    _this.toMin = toMin;
    _this.toMax = toMax;
    _this.toNormal = toMax - toMin;
    return _this;
  }
  /** @override */


  _createClass(RangeInput, [{
    key: "update",
    value: function update(source, key, event, value) {
      if (typeof value !== 'number') {
        value = value ? 1 : 0;
      }

      return this.normalize(value);
    }
  }, {
    key: "normalize",
    value: function normalize(value) {
      return (value - this.fromMin) / this.fromNormal * this.toNormal + this.toMin;
    }
  }]);

  return RangeInput;
}(Input);

/**
 * Manages the input by context layers. To create a context, call registerContext() with
 * a unique context name. It is better practice to register all contexts at the beginning
 * and enable/disable individually. This way, the order of register is the same priority
 * order. Furthermore, you must register any Input objects created with the context.mapping.
 * To simplify this, a default context is already created for you (grab it with getContext()
 * with no args). Finally, call poll() each update loop to keep certain input states up to
 * date.
 * Inputs are created as 3 types: action, state, or range. Each of these have its own
 * associated class and take a name and other arguments.
 * For action inputs, it can take any number of event keys that will trigger the input.
 * For state inputs, it takes 2 event keys: the first for the down event and the other for the up event.
 * For range inputs, it takes 1 event key and requires a min and max bound.
 */

var InputManager =
/*#__PURE__*/
function () {
  function InputManager() {
    _classCallCheck(this, InputManager);

    this.devices = {};
    this.contexts = new Map();
    this.currentState = new InputState(); // Set default context

    this.contexts.set('default', new InputContext('default'));
    this.onInputEvent = this.onInputEvent.bind(this);
  }

  _createClass(InputManager, [{
    key: "addDevice",
    value: function addDevice(inputDevice) {
      // TODO: What if multiple of the same TYPE of input device?
      this.devices[inputDevice.name] = inputDevice;
      inputDevice.addInputListener(this.onInputEvent);
    }
  }, {
    key: "removeDevice",
    value: function removeDevice(inputDevice) {
      inputDevice.removeInputListener(this.onInputEvent);
      delete this.devices[inputDevice.name];
    }
  }, {
    key: "getDevice",
    value: function getDevice(inputDevice) {
      return this.devices[inputDevice.name];
    }
  }, {
    key: "clearDevices",
    value: function clearDevices() {
      for (var _i = 0, _Object$keys = Object.keys(this.devices); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        var inputDevice = this.devices[key];
        inputDevice.removeInputListener(this.onInputEvent);
        delete this.devices[key];
      }
    }
  }, {
    key: "getDevices",
    value: function getDevices() {
      return Object.values(this.devices);
    }
    /**
     * For each update loop: poll first, update second.
     */

  }, {
    key: "poll",
    value: function poll() {
      // NOTE: States cant't update properly by themselves. This is because states may
      // have values that are passively set even though the associated input events may
      // not fire. For example, the down state of a key may first register as DOWN when
      // first pressed. But all frames between the press and release must also trigger as
      // DOWN even when no input events are fired. Therefore, we will manually trigger
      // state input events for all states that are active in the update loop.
      this.propagateActiveStateInputs();
    }
  }, {
    key: "propagateActiveStateInputs",
    value: function propagateActiveStateInputs() {
      var dst = this.currentState;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.contexts.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var context = _step.value;
          if (context.disabled) continue;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = context.mapping.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var mappedInputs = _step2.value;
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = mappedInputs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var mappedInput = _step3.value;

                  if (mappedInput instanceof StateInput) {
                    if (mappedInput.active) {
                      // Keep the mapped input active!
                      dst.setState(mappedInput.name, true); // Only the first mapped input gets it due to priority.

                      break;
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
    key: "onInputEvent",
    value: function onInputEvent(source, key, event) {
      var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var dst = this.currentState;
      var eventKey = InputMapping.toEventKey(source.name, key, event);

      for (var _len = arguments.length, args = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
        args[_key - 4] = arguments[_key];
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.contexts.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var context = _step4.value;
          if (context.disabled) continue;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = context.mapping.get(eventKey)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var mappedInput = _step5.value;
              var result = mappedInput.update.apply(mappedInput, [source, key, event, value].concat(args));

              if (result !== null) {
                if (mappedInput instanceof ActionInput) {
                  dst.setAction(mappedInput.name, result);
                } else if (mappedInput instanceof StateInput) {
                  dst.setState(mappedInput.name, result);
                } else if (mappedInput instanceof RangeInput) {
                  dst.setRange(mappedInput.name, result);
                } else {
                  throw new Error('Unknown input class.');
                }

                break;
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                _iterator5["return"]();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
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
  }, {
    key: "registerContext",
    value: function registerContext(contextName) {
      // Since order is preserved for maps, context priority is dependent on register order.
      var context = new InputContext(contextName);
      this.contexts.set(contextName, context);
      return this;
    }
  }, {
    key: "unregisterContext",
    value: function unregisterContext(contextName) {
      this.contexts["delete"](contextName);
      return this;
    }
  }, {
    key: "getContext",
    value: function getContext() {
      var contextName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      return this.contexts.get(contextName);
    }
  }]);

  return InputManager;
}();

var InputDevice =
/*#__PURE__*/
function () {
  function InputDevice(name) {
    _classCallCheck(this, InputDevice);

    this.name = name;
    this.inputListeners = [];
    this.listeners = new Map();
  }

  _createClass(InputDevice, [{
    key: "delete",
    value: function _delete() {
      this.inputListeners.length = 0;
      this.listeners.clear();
    }
  }, {
    key: "addInputListener",
    value: function addInputListener(listener) {
      this.inputListeners.push(listener);
    }
  }, {
    key: "removeInputListener",
    value: function removeInputListener(listener) {
      this.inputListeners.splice(this.inputListeners.indexOf(listener), 1);
    }
  }, {
    key: "dispatchInput",
    value: function dispatchInput(inputKey, inputEvent, inputValue) {
      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.inputListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var inputListener = _step.value;
          inputListener.call.apply(inputListener, [null, this, inputKey, inputEvent, inputValue].concat(args));
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
  }]);

  return InputDevice;
}();

var Keyboard =
/*#__PURE__*/
function (_InputDevice) {
  _inherits(Keyboard, _InputDevice);

  function Keyboard(element) {
    var _this;

    _classCallCheck(this, Keyboard);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Keyboard).call(this, 'key'));
    _this.element = element;
    _this.onKeyDown = _this.onKeyDown.bind(_assertThisInitialized(_this));
    _this.onKeyUp = _this.onKeyUp.bind(_assertThisInitialized(_this));
    document.addEventListener('keydown', _this.onKeyDown);
    document.addEventListener('keyup', _this.onKeyUp);
    return _this;
  }
  /** @override */


  _createClass(Keyboard, [{
    key: "delete",
    value: function _delete() {
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);

      _get(_getPrototypeOf(Keyboard.prototype), "delete", this).call(this);
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      if (e.repeat) return;
      this.dispatchInput(e.key, 'down', true);
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      this.dispatchInput(e.key, 'up', true);
    }
  }]);

  return Keyboard;
}(InputDevice);

var Mouse =
/*#__PURE__*/
function (_InputDevice) {
  _inherits(Mouse, _InputDevice);

  function Mouse(element) {
    var _this;

    var allowCursorLock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Mouse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Mouse).call(this, 'mouse'));
    _this.element = element;
    _this.allowCursorLock = allowCursorLock;
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseDown = _this.onMouseDown.bind(_assertThisInitialized(_this));
    _this.onMouseUp = _this.onMouseUp.bind(_assertThisInitialized(_this));
    _this._down = false;
    element.addEventListener('mousedown', _this.onMouseDown, false);
    document.addEventListener('mousemove', _this.onMouseMove, false);
    _this.onMouseClick = _this.onMouseClick.bind(_assertThisInitialized(_this));
    element.addEventListener('click', _this.onMouseClick, false);
    return _this;
  }
  /** @override */


  _createClass(Mouse, [{
    key: "delete",
    value: function _delete() {
      if (this.hasPointerLock()) {
        document.exitPointerLock();
      }

      this.element.removeEventListener('mousedown', this.onMouseDown);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      this.element.removeEventListener('click', this.onMouseClick);

      _get(_getPrototypeOf(Mouse.prototype), "delete", this).call(this);
    }
  }, {
    key: "onMouseClick",
    value: function onMouseClick(e) {
      if (this.allowCursorLock) {
        this.element.requestPointerLock();
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      if (this.allowCursorLock && !this.hasPointerLock()) return;
      this.dispatchInput('move', 'x', e.movementX);
      this.dispatchInput('move', 'y', e.movementY);

      if (this.element instanceof Element) {
        var rect = this.element.getBoundingClientRect();
        this.dispatchInput('pos', 'x', e.clientX - rect.left);
        this.dispatchInput('pos', 'y', e.clientY - rect.top);
      } else {
        this.dispatchInput('pos', 'x', e.pageX);
        this.dispatchInput('pos', 'y', e.pageY);
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      if (this.allowCursorLock && !this.hasPointerLock()) return;

      if (this._down) {
        document.removeEventListener('mouseup', this.onMouseUp);
      }

      this._down = true;
      document.addEventListener('mouseup', this.onMouseUp, false);
      this.dispatchInput(e.button, 'down', true, e.clientX, e.clientY);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      if (this.allowCursorLock && !this.hasPointerLock()) return;
      document.removeEventListener('mouseup', this.onMouseUp);
      this._down = false;
      this.dispatchInput(e.button, 'up', true, e.clientX, e.clientY);
    }
  }, {
    key: "hasPointerLock",
    value: function hasPointerLock() {
      return document.pointerLockElement === this.element;
    }
  }]);

  return Mouse;
}(InputDevice);

var INPUT_MANAGER = new InputManager();
var KEYBOARD = new Keyboard(window);
var MOUSE = new Mouse(window, false);
INPUT_MANAGER.addDevice(KEYBOARD);
INPUT_MANAGER.addDevice(MOUSE);

function Action() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uuid();
  var result = {
    name: name,
    input: null,
    attach: function attach() {
      if (this.input) throw new Error('Already attached input to source.');

      for (var _len2 = arguments.length, eventKeys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        eventKeys[_key2] = arguments[_key2];
      }

      this.input = _construct(ActionInput, [this.name].concat(eventKeys));
      INPUT_MANAGER.getContext().mapping.register(this.input);
      return this;
    },
    get: function get() {
      var consume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.input) {
        var inputState = INPUT_MANAGER.currentState;

        if (inputState.hasAction(this.input.name)) {
          return inputState.getAction(this.input.name, consume);
        }
      }

      return false;
    }
  };

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (args.length > 0) {
    result.attach.apply(result, args);
  }

  return result;
}

function State() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uuid();
  var result = {
    name: name,
    inputs: null,
    attach: function attach() {
      if (this.inputs) throw new Error('Already attached input to source.');
      this.inputs = [];

      for (var _len4 = arguments.length, downUpEventKeys = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        downUpEventKeys[_key4] = arguments[_key4];
      }

      for (var _i = 0, _downUpEventKeys = downUpEventKeys; _i < _downUpEventKeys.length; _i++) {
        var downUpEventKey = _downUpEventKeys[_i];
        var downEventKey = void 0;
        var upEventKey = void 0;

        if (Array.isArray(downUpEventKey)) {
          downEventKey = downUpEventKey[0];
          upEventKey = downUpEventKey[1];
        } else {
          var _InputMapping$fromEve = InputMapping.fromEventKey(downUpEventKey),
              _InputMapping$fromEve2 = _slicedToArray(_InputMapping$fromEve, 2),
              sourceName = _InputMapping$fromEve2[0],
              key = _InputMapping$fromEve2[1];

          downEventKey = InputMapping.toEventKey(sourceName, key, 'down');
          upEventKey = InputMapping.toEventKey(sourceName, key, 'up');
        }

        var input = new StateInput(this.name, downEventKey, upEventKey);
        INPUT_MANAGER.getContext().mapping.register(input);
        this.inputs.push(input);
      }

      return this;
    },
    get: function get() {
      var consume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var inputState = INPUT_MANAGER.currentState;

      if (inputState.hasState(this.inputs[0].name)) {
        return inputState.getState(this.inputs[0].name, consume);
      }

      return false;
    }
  };

  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  if (args.length > 0) {
    result.attach.apply(result, args);
  }

  return result;
}

function Range() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uuid();
  var result = {
    name: name,
    input: null,
    attach: function attach(eventKey) {
      var fromMin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var fromMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var toMin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : fromMin;
      var toMax = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : fromMax;
      if (this.input) throw new Error('Already attached input to source.');
      this.input = new RangeInput(this.name, eventKey, fromMin, fromMax, toMin, toMax);
      INPUT_MANAGER.getContext().mapping.register(this.input);
      return this;
    },
    get: function get() {
      var consume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var inputState = INPUT_MANAGER.currentState;

      if (inputState.hasRange(this.input.name)) {
        return inputState.getRange(this.input.name, consume);
      }

      return 0;
    }
  };

  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if (args.length > 0) {
    result.attach.apply(result, args);
  }

  return result;
}

var InputModule = /*#__PURE__*/Object.freeze({
    INPUT_MANAGER: INPUT_MANAGER,
    KEYBOARD: KEYBOARD,
    MOUSE: MOUSE,
    Action: Action,
    State: State,
    Range: Range
});

var ComponentBase =
/*#__PURE__*/
function () {
  function ComponentBase() {
    _classCallCheck(this, ComponentBase);
  }
  /**
   * Creates the component instance. Must also support no args.
   * @param  {...any} args Any additional arguments to initialize with.
   * @returns {Object} The component instance.
   */


  _createClass(ComponentBase, [{
    key: "onCreate",
    value: function onCreate(instance) {
      if (instance) {
        var keys = Object.keys(instance);

        for (var i = 0; i < keys.length; ++i) {
          instance[keys[i]] = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
        }

        return instance;
      } else {
        return {};
      }
    }
    /**
     * Changes the component instance for the provided args.
     * @param  {...any} args Any additional arguments to change for.
     */

  }, {
    key: "onChange",
    value: function onChange(instance) {
      var keys = Object.keys(instance);

      for (var i = 0; i < keys.length; ++i) {
        instance[keys[i]] = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
      }
    }
    /**
     * Destroys the component instance.
     * @returns {Object} The instance to cache, null if not cacheable.
     */

  }, {
    key: "onDestroy",
    value: function onDestroy(instance) {
      return true;
    }
  }]);

  return ComponentBase;
}();

var ComponentInstanceBase =
/*#__PURE__*/
function () {
  function ComponentInstanceBase() {
    _classCallCheck(this, ComponentInstanceBase);
  }

  _createClass(ComponentInstanceBase, [{
    key: "onChange",
    value: function onChange() {}
  }, {
    key: "onDestroy",
    value: function onDestroy() {}
  }]);

  return ComponentInstanceBase;
}();

var EntityBase =
/*#__PURE__*/
function (_ComponentInstanceBas) {
  _inherits(EntityBase, _ComponentInstanceBas);

  function EntityBase(entityManager, entityID) {
    var _this;

    _classCallCheck(this, EntityBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EntityBase).call(this));
    _this.entityManager = entityManager;
    _this.entityID = entityID;
    return _this;
  }
  /** @override */


  _createClass(EntityBase, [{
    key: "onChange",
    value: function onChange() {}
    /** @override */

  }, {
    key: "onDestroy",
    value: function onDestroy() {
      this.entityManager.destroy(this.entityID, {
        exclude: [this.constructor]
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.entityManager.destroy(this.entityID);
    }
    /**
     * If the component does not exist for the entity, it will assign
     * a new instance of the component. Otherwise, it will update the
     * component instance based on the arguments passed-in.
     * @param {ComponentBase|Function} component The component to add/upate for this entity.
     * @param  {...any} args Any additional args to pass to component.
     */

  }, {
    key: "component",
    value: function component(_component) {
      var _this2 = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.entityManager.has(this.entityID, _component)) {
        var _this$entityManager;

        (_this$entityManager = this.entityManager).update.apply(_this$entityManager, [this.entityID, _component].concat(args));
      } else {
        (function () {
          var _this2$entityManager;

          var instance = (_this2$entityManager = _this2.entityManager).assign.apply(_this2$entityManager, [_this2.entityID, _component].concat(args));

          var _loop = function _loop() {
            var key = _Object$keys[_i];
            var propDescriptor = Object.getOwnPropertyDescriptor(_this2, key); // Initialize property if already defined.

            if (propDescriptor && propDescriptor.value) instance[key] = value;
            /**
             * This is important. On a macro level, this let's the programmer
             * to focus less on the data structure of the program by allowing
             * them to initially, arbitrarily decide where to store the data:
             * either on the entity handler itself for ease of use or separated
             * by components. The programmer can then easily refactor the
             * properties, once there is a better understanding of the program's
             * design and features, into modular components when needed. Since
             * access of both kinds are the same, this process is really easy.
             * The difference is only in how they are created, which is usually
             * referenced only once.
             */

            Object.defineProperty(_this2, key, {
              get: function get() {
                return instance[key];
              },
              set: function set(value) {
                instance[key] = value;
              },
              enumerable: true
            });
          };

          for (var _i = 0, _Object$keys = Object.keys(instance); _i < _Object$keys.length; _i++) {
            _loop();
          }
        })();
      }

      return this;
    }
  }, {
    key: "tag",
    value: function tag(_tag) {
      var enabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (enabled) {
        this.entityManager.assign(this.entityID, _tag);
      } else {
        this.entityManager.remove(this.entityID, _tag);
      }

      return this;
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this$entityManager2;

      for (var _len2 = arguments.length, components = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        components[_key2] = arguments[_key2];
      }

      for (var _i2 = 0, _components = components; _i2 < _components.length; _i2++) {
        var component = _components[_i2];
        var instance = this.entityManager.get(this.entityID, component);

        for (var _i3 = 0, _Object$keys2 = Object.keys(instance); _i3 < _Object$keys2.length; _i3++) {
          var key = _Object$keys2[_i3];
          delete this[key];
        }
      }

      (_this$entityManager2 = this.entityManager).remove.apply(_this$entityManager2, [this.entityID].concat(components));

      return this;
    }
  }, {
    key: "has",
    value: function has() {
      var _this$entityManager3;

      for (var _len3 = arguments.length, components = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        components[_key3] = arguments[_key3];
      }

      return (_this$entityManager3 = this.entityManager).has.apply(_this$entityManager3, [this.entityID].concat(components));
    }
  }, {
    key: "get",
    value: function get(component) {
      var _this$entityManager4;

      for (var _len4 = arguments.length, components = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        components[_key4 - 1] = arguments[_key4];
      }

      return (_this$entityManager4 = this.entityManager).get.apply(_this$entityManager4, [this.entityID, component].concat(components));
    }
  }]);

  return EntityBase;
}(ComponentInstanceBase);

var EntityView =
/*#__PURE__*/
function () {
  function EntityView(entityManager, filter) {
    _classCallCheck(this, EntityView);

    this.entityManager = entityManager;
    this.filter = filter;
  }

  _createClass(EntityView, [{
    key: "subview",
    value: function subview(filter) {
      var _this = this;

      return new EntityView(this.entityManager, function (entity) {
        return _this.filter(entity) && filter(entity);
      });
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      return {
        filter: this.filter,
        iterator: this.entityManager._entities[Symbol.iterator](),
        next: function next() {
          var result;

          while (!(result = this.iterator.next()).done) {
            var entity = result.value;

            if (this.filter(entity)) {
              return {
                value: entity,
                done: false
              };
            }
          }

          return {
            done: true
          };
        }
      };
    }
  }]);

  return EntityView;
}();

var ComponentManager =
/*#__PURE__*/
function () {
  _createClass(ComponentManager, null, [{
    key: "getComponentName",
    value: function getComponentName(component) {
      if (typeof component === 'string') {
        return component;
      } else {
        return component.name;
      }
    }
  }]);

  function ComponentManager(componentFactory) {
    _classCallCheck(this, ComponentManager);

    this.components = new Map();
    this.factory = componentFactory;
  }
  /**
   * Creates a component for the entity. Assumes component has not yet
   * been assigned for the entity.
   * @param {Number} entity The id of the entity to add.
   * @param  {...any} args Create arguments passed to the component handler.
   * @returns {Object} The added component instance.
   */


  _createClass(ComponentManager, [{
    key: "add",
    value: function add(entity) {
      var _this$factory;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var dst = (_this$factory = this.factory).create.apply(_this$factory, args);

      this.components.set(entity, dst);
      return dst;
    }
    /**
     * Changes the component for the entity. Assumes component has already
     * been assigned to the entity.
     * @param {Number} entity The id of the entity to change for.
     * @param  {...any} args Change arguments passed to the component handler.
     * @returns {Object} The changed component instance.
     */

  }, {
    key: "change",
    value: function change(entity) {
      var _this$factory2;

      // Due to assumption, this will NEVER be null.
      var component = this.components.get(entity);

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      (_this$factory2 = this.factory).change.apply(_this$factory2, [component].concat(args));

      return component;
    }
    /**
     * Removes the component for the entity. Assumes component has already
     * been assigned and not yet removed from the entity.
     * @param {Number} entity The id of the entity to remove.
     */

  }, {
    key: "remove",
    value: function remove(entity) {
      // Due to assumption, this will NEVER be null.
      var component = this.components.get(entity);
      this.factory.destroy(component); // Remove it from the entity.

      this.components["delete"](entity);
    }
    /**
     * Gets the component instance assigned to the entity.
     * @param {Number} entity The id of the entity to get.
     * @returns {Object} The component instance for the entity.
     */

  }, {
    key: "get",
    value: function get(entity) {
      return this.components.get(entity);
    }
    /**
     * Checks whether the component exists for the entity.
     * @param {Number} entity The id of the entity to check for.
     * @returns {Boolean} Whether the entity has the component.
     */

  }, {
    key: "has",
    value: function has(entity) {
      return this.components.has(entity);
    }
    /**
     * Removes all component instances.
     */

  }, {
    key: "clear",
    value: function clear() {
      this.components.clear();
    }
  }]);

  return ComponentManager;
}();

var ComponentFactory =
/*#__PURE__*/
function () {
  function ComponentFactory() {
    _classCallCheck(this, ComponentFactory);
  }

  _createClass(ComponentFactory, [{
    key: "create",
    value: function create() {
      return {};
    }
  }, {
    key: "change",
    value: function change(instance) {}
  }, {
    key: "destroy",
    value: function destroy(instance) {}
  }]);

  return ComponentFactory;
}();

var ComponentTagFactory =
/*#__PURE__*/
function (_ComponentFactory) {
  _inherits(ComponentTagFactory, _ComponentFactory);

  function ComponentTagFactory(tagName) {
    var _this;

    _classCallCheck(this, ComponentTagFactory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ComponentTagFactory).call(this));
    _this.tagName = tagName;
    return _this;
  }
  /** @override */


  _createClass(ComponentTagFactory, [{
    key: "create",
    value: function create() {
      return null;
    }
  }]);

  return ComponentTagFactory;
}(ComponentFactory);

var ComponentClassFactory =
/*#__PURE__*/
function (_ComponentFactory) {
  _inherits(ComponentClassFactory, _ComponentFactory);

  function ComponentClassFactory(handlerClass) {
    var _this;

    _classCallCheck(this, ComponentClassFactory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ComponentClassFactory).call(this));
    _this.handler = new handlerClass();
    _this._cached = [];
    return _this;
  }
  /** @override */


  _createClass(ComponentClassFactory, [{
    key: "create",
    value: function create() {
      var _this$handler;

      var instance;

      if (this._cached.length > 0) {
        instance = this._cached.shift();
      } else {
        instance = {};
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_this$handler = this.handler).onCreate.apply(_this$handler, [instance].concat(args));
    }
    /** @override */

  }, {
    key: "change",
    value: function change(instance) {
      var _this$handler2;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      (_this$handler2 = this.handler).onChange.apply(_this$handler2, [instance].concat(args));
    }
    /** @override */

  }, {
    key: "destroy",
    value: function destroy(instance) {
      var result = this.handler.onDestroy(instance); // See if instance can be cached...

      if (result) {
        this._cached.push(instance);
      }
    }
  }]);

  return ComponentClassFactory;
}(ComponentFactory);

var ComponentClassInstanceFactory =
/*#__PURE__*/
function (_ComponentFactory) {
  _inherits(ComponentClassInstanceFactory, _ComponentFactory);

  function ComponentClassInstanceFactory(instanceClass) {
    var _this;

    _classCallCheck(this, ComponentClassInstanceFactory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ComponentClassInstanceFactory).call(this));
    _this.instanceClass = instanceClass;
    return _this;
  }
  /** @override */


  _createClass(ComponentClassInstanceFactory, [{
    key: "create",
    value: function create() {
      var instanceClass = this.instanceClass;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _construct(instanceClass, args);
    }
    /** @override */

  }, {
    key: "change",
    value: function change(instance) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      instance.onChange.apply(instance, args);
    }
    /** @override */

  }, {
    key: "destroy",
    value: function destroy(instance) {
      instance.onDestroy();
    }
  }]);

  return ComponentClassInstanceFactory;
}(ComponentFactory);

var ComponentFunctionFactory =
/*#__PURE__*/
function (_ComponentFactory) {
  _inherits(ComponentFunctionFactory, _ComponentFactory);

  function ComponentFunctionFactory(handlerFunction) {
    var _this;

    _classCallCheck(this, ComponentFunctionFactory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ComponentFunctionFactory).call(this));
    _this.handler = handlerFunction;
    _this._cached = [];
    return _this;
  }
  /** @override */


  _createClass(ComponentFunctionFactory, [{
    key: "create",
    value: function create() {
      var instance;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (this._cached.length > 0) {
        instance = this._cached.shift();

        if (typeof this.handler.onRecreate === 'function') {
          var _this$handler$onRecre;

          (_this$handler$onRecre = this.handler.onRecreate).call.apply(_this$handler$onRecre, [this.handler, instance].concat(args));
        } else {
          var keys = Object.keys(instance);

          for (var i = 0; i < keys.length; ++i) {
            instance[keys[i]] = args[i];
          }
        }
      } else {
        var _this$handler;

        instance = (_this$handler = this.handler).call.apply(_this$handler, [this.handler].concat(args));
      }

      return instance;
    }
    /** @override */

  }, {
    key: "change",
    value: function change(instance) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof this.handler.onChange === 'function') {
        var _this$handler$onChang;

        (_this$handler$onChang = this.handler.onChange).call.apply(_this$handler$onChang, [this.handler, instance].concat(args));
      } else {
        var keys = Object.keys(instance);
        var length = Math.min(args.length, keys.length);

        for (var i = 0; i < length; ++i) {
          instance[keys[i]] = args[i];
        }
      }
    }
    /** @override */

  }, {
    key: "destroy",
    value: function destroy(instance) {
      if (typeof this.handler.onDestroy === 'function') {
        var result = this.handler.onDestroy.call(this.handler, instance); // See if instance can be cached...

        if (result) {
          this._cached.push(instance);
        }
      }
    }
  }]);

  return ComponentFunctionFactory;
}(ComponentFactory);

var EntityManager =
/*#__PURE__*/
function () {
  function EntityManager() {
    _classCallCheck(this, EntityManager);

    this._entities = new Set();
    this._componentManagers = new Map();
    this._nextEntityID = 1;
  }

  _createClass(EntityManager, [{
    key: "registerComponent",
    value: function registerComponent(component) {
      var componentFactory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!componentFactory) {
        // It's a tag component.
        if (typeof component === 'string') {
          componentFactory = new ComponentTagFactory(component);
        } else if (component.prototype instanceof ComponentBase) {
          componentFactory = new ComponentClassFactory(component);
        } else if (component.prototype instanceof ComponentInstanceBase) {
          componentFactory = new ComponentClassInstanceFactory(component);
        } else if (typeof component === 'function') {
          componentFactory = new ComponentFunctionFactory(component);
        } else {
          throw new Error('Cannot find factory for component type.');
        }
      }

      var componentManager = new ComponentManager(componentFactory);

      this._componentManagers.set(component, componentManager);

      return componentManager;
    }
  }, {
    key: "unregisterComponent",
    value: function unregisterComponent(component) {
      this._componentManagers["delete"](component);
    }
    /**
     * Creates an entity.
     * @param  {...any} components Any components to be assigned to the created entity.
     * @returns {Number} The id of the entity created.
     */

  }, {
    key: "create",
    value: function create() {
      var entity = this._nextEntityID++;

      this._entities.add(entity);

      for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
        components[_key] = arguments[_key];
      }

      for (var _i = 0, _components = components; _i < _components.length; _i++) {
        var component = _components[_i];
        this.assign(entity, component);
      }

      return entity;
    }
    /**
     * Destroys an entity and all its components.
     * @param {Number} entity The id of the entity to be destroyed.
     * @param {Object} opts Any additional options.
     * @param {Array} opts.exclude Will not remove specified components. This
     * is usually used to delay destruction of a component type until later.
     * @param {Boolean} opts.persist If true, will NOT remove entity from entity
     * list.
     */

  }, {
    key: "destroy",
    value: function destroy(entity) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._componentManagers.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var componentType = _step.value;

          var componentManager = this._componentManagers.get(componentType);

          if (componentManager.has(entity)) {
            if (opts.exclude && opts.exclude.includes(componentType)) {
              continue;
            } else {
              componentManager.remove(entity);
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

      if (!opts.persist) {
        this._entities["delete"](entity);
      }
    }
  }, {
    key: "entities",
    value: function entities() {
      var _this = this;

      for (var _len2 = arguments.length, components = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        components[_key2] = arguments[_key2];
      }

      return new EntityView(this, function (entity) {
        return _this.has.apply(_this, [entity].concat(components));
      });
    }
  }, {
    key: "has",
    value: function has(entity) {
      if (!this._entities.has(entity)) return false;

      for (var _len3 = arguments.length, components = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        components[_key3 - 1] = arguments[_key3];
      }

      for (var _i2 = 0, _components2 = components; _i2 < _components2.length; _i2++) {
        var component = _components2[_i2];

        if (this._componentManagers.has(component)) {
          if (!this._componentManagers.get(component).has(entity)) {
            return false;
          }
        } else {
          return false;
        }
      }

      return true;
    }
    /**
     * Gets the component instances for the listed components. If only 1 component is passed in,
     * then just the instance is returned. Otherwise, an array of all listed components, in the order
     * provided, is returned instead (this allows easy spreading of values).
     * @param {Number} entity The id of the entity for the components.
     * @param {ComponentBase|Function|String} component The component type to get the instance for.
     * @param  {...ComponentBase|Function|String} components Additional component types to get instances for.
     * @returns {Object|Array<Object>}
     */

  }, {
    key: "get",
    value: function get(entity, component) {
      for (var _len4 = arguments.length, components = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        components[_key4 - 2] = arguments[_key4];
      }

      if (components.length > 0) {
        var dst = [];
        dst.push(this._componentManagers.get(component).get(entity));

        for (var _i3 = 0, _components3 = components; _i3 < _components3.length; _i3++) {
          var c = _components3[_i3];
          dst.push(this._componentManagers.get(c).get(entity));
        }

        return dst;
      } else {
        return this._componentManagers.get(component).get(entity);
      }
    }
    /**
     * Assigns the component to the entity. Assumes component does not exist
     * for the entity yet.
     * @param {Number} entity The id of the entity to assign to.
     * @param {ComponentBase|Function|String} component The component type to create.
     * @param  {...any} args Additional args passed to the component to create.
     * @returns {Object} The component instance assigned.
     */

  }, {
    key: "assign",
    value: function assign(entity, component) {
      var _componentManager;

      if (typeof entity !== 'number') throw new Error('Invalid entity handle - must be a number.');
      var componentManager;

      if (!this._componentManagers.has(component)) {
        componentManager = this.registerComponent(component);
      } else {
        componentManager = this._componentManagers.get(component);
      }

      for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return (_componentManager = componentManager).add.apply(_componentManager, [entity].concat(args));
    }
    /**
     * Changes the component for the entity. Assumes component has already been
     * assigned to the entity.
     * @param {Number} entity The id of the entity to change.
     * @param {ComponentBase|Function|String} component The component type to change.
     * @param  {...any} args Additional args passed to the component to change.
     * @returns {Object} The component instance changed.
     */

  }, {
    key: "change",
    value: function change(entity, component) {
      if (typeof entity !== 'number') throw new Error('Invalid entity handle - must be a number.'); // Due to assumption, this will NEVER be null.

      var componentManager = this._componentManagers.get(component);

      for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        args[_key6 - 2] = arguments[_key6];
      }

      return componentManager.change.apply(componentManager, [entity].concat(args));
    }
    /**
     * Removes the listed components from the entity. If component does not exist
     * for the entity, it is ignored.
     * @param {Number} entity The id of the entity to remove from.
     * @param  {...any} components The component types to remove.
     */

  }, {
    key: "remove",
    value: function remove(entity) {
      for (var _len7 = arguments.length, components = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        components[_key7 - 1] = arguments[_key7];
      }

      for (var _i4 = 0, _components4 = components; _i4 < _components4.length; _i4++) {
        var c = _components4[_i4];

        if (this._componentManagers.has(c)) {
          var componentManager = this._componentManagers.get(c);

          if (componentManager.has(entity)) {
            componentManager.remove(entity);
          }
        }
      }
    }
    /**
     * Clears all instances of the listed component type. If none are supplied, then all are removed.
     * If the component has no instances, it is skipped.
     * @param {...ComponentBase|Function|String} components Component types to be cleared.
     */

  }, {
    key: "clear",
    value: function clear() {
      for (var _len8 = arguments.length, components = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        components[_key8] = arguments[_key8];
      }

      if (components.length > 0) {
        for (var _i5 = 0, _components5 = components; _i5 < _components5.length; _i5++) {
          var c = _components5[_i5];

          if (this._componentManagers.has(c)) {
            var componentManager = this._componentManagers.get(c);

            componentManager.clear();
          }
        }
      } else {
        this._componentManagers.clear();

        this._entities.clear();
      }
    }
  }]);

  return EntityManager;
}();

var ENTITY_MANAGER = new EntityManager();
/**
 * Spawns an entity of the class type. This serves as the hybrid ECS / MVC entity.
 * The returned value can be treated as the entity object itself and any manipulations
 * should be handled through that object. Implementation-wise, the created instance is
 * treated as a component (with fancy callbacks) and therefore can easily interoperate
 * with other components while being able to own its data and logic. In other words,
 * you can easily substitute a Component with a EntityClass for any component function,
 * including entitites(), has(), etc.
 * 
 * NOTE: Because references to this instance may exist AFTER it has been destroyed, it
 * is NOT recommended to destroy() or remove() "class" components from the manager.
 * Instead, it should be done through the entity itself, and therefore the user will
 * at least SEE the destruction and take action in removing it manually.
 * 
 * @param {Class<EntityBase>} EntityClass The class of the entity to create.
 * @param  {...any} args Any additional arguments to pass to the entity's create().
 * @returns {EntityBase} The handler component for the entity.
 */

function spawn() {
  var EntityClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EntityBase;
  var entityID = ENTITY_MANAGER.create();

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return ENTITY_MANAGER.assign.apply(ENTITY_MANAGER, [entityID, EntityClass, ENTITY_MANAGER, entityID].concat(args));
}

function entities() {
  for (var _len2 = arguments.length, components = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    components[_key2] = arguments[_key2];
  }

  return _defineProperty({
    view: new EntityView(ENTITY_MANAGER, function (entity) {
      return ENTITY_MANAGER.has.apply(ENTITY_MANAGER, [entity, EntityBase].concat(components));
    })
  }, Symbol.iterator, function () {
    return {
      iterator: this.view[Symbol.iterator](),
      next: function next() {
        var result = this.iterator.next();

        if (!result.done) {
          return {
            value: ENTITY_MANAGER.get(result.value, EntityBase),
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
  });
}

function components() {
  for (var _len3 = arguments.length, components = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    components[_key3] = arguments[_key3];
  }

  return _defineProperty({
    view: new EntityView(ENTITY_MANAGER, function (entity) {
      return ENTITY_MANAGER.has.apply(ENTITY_MANAGER, [entity].concat(components));
    })
  }, Symbol.iterator, function () {
    return {
      iterator: this.view[Symbol.iterator](),
      next: function next() {
        var result = this.iterator.next();

        if (!result.done) {
          return {
            value: ENTITY_MANAGER.get.apply(ENTITY_MANAGER, [result.value].concat(components)),
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
  });
}

var EntityModule = /*#__PURE__*/Object.freeze({
    ENTITY_MANAGER: ENTITY_MANAGER,
    ComponentBase: ComponentBase,
    EntityBase: EntityBase,
    spawn: spawn,
    entities: entities,
    components: components
});

var TweenManager =
/*#__PURE__*/
function () {
  function TweenManager() {
    _classCallCheck(this, TweenManager);

    this.tweens = new Map();
    this.cachedTweens = new Set();
    this.useCache = false;
  }

  _createClass(TweenManager, [{
    key: "add",
    value: function add(tween) {
      if (this.useCache) {
        this.cachedTweens.add(tween);
      } else {
        this.tweens.set(tween.id, tween);
      }
    }
  }, {
    key: "remove",
    value: function remove(tween) {
      if (this.cachedTweens.has(tween)) {
        this.cachedTweens["delete"](tween);
      } else {
        this.tweens["delete"](tween.id);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.tweens.clear();
      this.cachedTweens.clear();
    }
  }, {
    key: "update",
    value: function update(time) {
      var preserve = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      do {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.cachedTweens.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tween = _step.value;
            this.add(tween);
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

        this.cachedTweens.clear();
        this.useCache = true;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.tweens.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var tweenID = _step2.value;

            var _tween = this.tweens.get(tweenID);

            if (!_tween.update(time)) {
              if (!preserve) {
                this.tweens["delete"](tweenID);
              }
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

        this.useCache = false;
      } while (this.cachedTweens.size > 0);
    }
  }]);

  return TweenManager;
}();

var EventableInstance = {
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
  once: function once(event, callback) {
    var _this = this;

    var handle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : callback;

    var func = function func() {
      _this.off(event, handle);

      callback.apply(void 0, arguments);
    };

    return this.on(event, func, handle);
  },
  emit: function emit(event) {
    if (this.__events.has(event)) {
      var callbacks = Array.from(this.__events.get(event).values());

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var _i = 0, _callbacks = callbacks; _i < _callbacks.length; _i++) {
        var callback = _callbacks[_i];
        callback.apply(void 0, args);
      }
    } else {
      this.__events.set(event, new Map());
    }

    return this;
  }
};
var Eventable = {
  create: function create() {
    var result = Object.create(EventableInstance);
    result.__events = new Map();
    return result;
  },
  assign: function assign(dst) {
    var result = Object.assign(dst, EventableInstance);
    result.__events = new Map();
    return result;
  },
  mixin: function mixin(targetClass) {
    var targetPrototype = targetClass.prototype;
    Object.assign(targetPrototype, EventableInstance);
    targetPrototype.__events = new Map();
  }
};

function getFunctionByName(name) {
  switch (name) {
    case 'linear':
      return Linear.Both;

    case 'quadratic':
    case 'quadratic-both':
    case 'quadratic-in-out':
      return Quadratic.Both;

    case 'quadratic-in':
      return Quadratic.In;

    case 'quadratic-out':
      return Quadratic.Out;

    case 'cubic':
    case 'cubic-both':
    case 'cubic-in-out':
      return Cubic.Both;

    case 'cubic-in':
      return Cubic.In;

    case 'cubic-out':
      return Cubic.Out;

    case 'sinusoidal':
    case 'sinusoidal-both':
    case 'sinusoidal-in-out':
      return Sinusoidal.Both;

    case 'sinusoidal-in':
      return Sinusoidal.In;

    case 'sinusoidal-out':
      return Sinusoidal.Out;

    case 'exponential':
    case 'exponential-both':
    case 'exponential-in-out':
      return Exponential.Both;

    case 'exponential-in':
      return Exponential.In;

    case 'exponential-out':
      return Exponential.Out;

    case 'circular':
    case 'circular-both':
    case 'circular-in-out':
      return Circular.Both;

    case 'circular-in':
      return Circular.In;

    case 'circular-out':
      return Circular.Out;

    case 'elastic':
    case 'elastic-both':
    case 'elastic-in-out':
      return Elastic.Both;

    case 'elastic-in':
      return Elastic.In;

    case 'elastic-out':
      return Elastic.Out;

    case 'back':
    case 'back-both':
    case 'back-in-out':
      return Back.Both;

    case 'back-in':
      return Back.In;

    case 'back-out':
      return Back.Out;

    case 'bounce':
    case 'bounce-both':
    case 'bounce-in-out':
      return Bounce.Both;

    case 'bounce-in':
      return Bounce.In;

    case 'bounce-out':
      return Bounce.Out;

    default:
      throw new Error("Unknown easing function name '".concat(name, "'."));
  }
}
var Linear = {
  Both: function Both(k) {
    return k;
  }
};
var Quadratic = {
  In: function In(k) {
    return k * k;
  },
  Out: function Out(k) {
    return k * (2 - k);
  },
  Both: function Both(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k;
    } else {
      return -0.5 * (--k * (k - 2) - 1);
    }
  }
};
var Cubic = {
  In: function In(k) {
    return k * k * k;
  },
  Out: function Out(k) {
    return --k * k * k + 1;
  },
  Both: function Both(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    } else {
      return 0.5 * ((k -= 2) * k * k + 2);
    }
  }
};
var Sinusoidal = {
  In: function In(k) {
    return 1 - Math.cos(k * Math.PI / 2);
  },
  Out: function Out(k) {
    return Math.sin(k * Math.PI / 2);
  },
  Both: function Both(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }
};
var Exponential = {
  In: function In(k) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  },
  Out: function Out(k) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  },
  Both: function Both(k) {
    if (k === 0) return 0;
    if (k === 1) return 1;

    if ((k *= 2) < 1) {
      return 0.5 * Math.pow(1024, k - 1);
    } else {
      return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }
  }
};
var Circular = {
  In: function In(k) {
    return 1 - Math.sqrt(1 - k * k);
  },
  Out: function Out(k) {
    return Math.sqrt(1 - --k * k);
  },
  Both: function Both(k) {
    if ((k *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    } else {
      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
  }
};
var Elastic = {
  In: function In(k) {
    if (k === 0) return 0;
    if (k === 1) return 1;
    return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
  },
  Out: function Out(k) {
    if (k === 0) return 0;
    if (k === 1) return 1;
    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
  },
  Both: function Both(k) {
    if (k === 0) return 0;
    if (k === 1) return 1;
    k *= 2;

    if (k < 1) {
      return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    } else {
      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    }
  }
};
var Back = {
  In: function In(k) {
    var s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },
  Out: function Out(k) {
    var s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },
  Both: function Both(k) {
    var s = 1.70158 * 1.525;

    if ((k *= 2) < 1) {
      return 0.5 * (k * k * ((s + 1) * k - s));
    } else {
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  }
};
var Bounce = {
  In: function In(k) {
    return 1 - Bounce.Out(1 - k);
  },
  Out: function Out(k) {
    if (k < 1 / 2.75) {
      return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
  },
  Both: function Both(k) {
    if (k < 0.5) {
      return Bounce.In(k * 2) * 0.5;
    } else {
      return Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    }
  }
};

var Easing = /*#__PURE__*/Object.freeze({
    getFunctionByName: getFunctionByName,
    Linear: Linear,
    Quadratic: Quadratic,
    Cubic: Cubic,
    Sinusoidal: Sinusoidal,
    Exponential: Exponential,
    Circular: Circular,
    Elastic: Elastic,
    Back: Back,
    Bounce: Bounce
});

function getFunctionByName$1(name) {
  switch (name) {
    case 'linear':
      return Linear$1;

    case 'bezier':
      return Bezier;

    case 'catmullrom':
      return CatmullRom;

    default:
      throw new Error("Unknown interpolation function name '".concat(name, "'."));
  }
}
function Linear$1(v, k) {
  var m = v.length - 1;
  var f = m * k;
  var i = Math.floor(f);
  var fn = Lerp;

  if (k < 0) {
    return fn(v[0], v[1], f);
  }

  if (k > 1) {
    return fn(v[m], v[m - 1], m - f);
  }

  return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
}
function Bezier(v, k) {
  var b = 0;
  var n = v.length - 1;
  var pw = Math.pow;
  var bn = Bernstein;

  for (var i = 0; i <= n; i++) {
    b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
  }

  return b;
}
function CatmullRom(v, k) {
  var m = v.length - 1;
  var f = m * k;
  var i = Math.floor(f);
  var fn = CatmullRomHelper;

  if (v[0] === v[m]) {
    if (k < 0) {
      i = Math.floor(f = (_readOnlyError("f"), m * (1 + k)));
    }

    return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
  } else {
    if (k < 0) {
      return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
    }

    if (k > 1) {
      return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
    }

    return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
  }
}

function Lerp(p0, p1, t) {
  return (p1 - p0) * t + p0;
}

function Bernstein(n, i) {
  var fc = Factorial;
  return fc(n) / fc(i) / fc(n - i);
}

var factorialCache = [1];

function Factorial(n) {
  if (factorialCache[n]) return factorialCache[n];
  var s = 1;

  for (var i = n; i > 1; i--) {
    s *= i;
  }

  factorialCache[n] = s;
  return s;
}

function CatmullRomHelper(p0, p1, p2, p3, t) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  var t2 = t * t;
  var t3 = t * t2;
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
}

var Interpolation = /*#__PURE__*/Object.freeze({
    getFunctionByName: getFunctionByName$1,
    Linear: Linear$1,
    Bezier: Bezier,
    CatmullRom: CatmullRom
});

var NEXT_ID = 1;

var Tween =
/*#__PURE__*/
function () {
  _createClass(Tween, null, [{
    key: "now",
    value: function now() {
      return Date.now();
    }
  }]);

  function Tween(target) {
    _classCallCheck(this, Tween);

    this.target = target;
    this.id = NEXT_ID++;
    this.active = false;
    this.startTime = 0;
    this.startProperties = {};
    this.repeatProperties = {};
    this.reversed = false;
    this.endProperties = {};
    this.nexts = [];
    this.easingFunction = Linear.Both;
    this.interpolationFunction = Linear$1;
    this._duration = 1000;
    this._startDelay = 0;
    this._repeatDelay = 0;
    this._repeat = 0;
    this._yoyo = false;
    this.firstUpdate = false;
  }

  _createClass(Tween, [{
    key: "to",
    value: function to(properties) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      this.endProperties = Object.create(properties);
      if (typeof duration !== 'undefined') this._duration = duration;
      return this;
    }
  }, {
    key: "next",
    value: function next() {
      for (var _len = arguments.length, tweens = new Array(_len), _key = 0; _key < _len; _key++) {
        tweens[_key] = arguments[_key];
      }

      this.nexts = tweens;
      return this;
    }
  }, {
    key: "start",
    value: function start() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (typeof time === 'undefined') {
        this.startTime = Tween.now();
      } else {
        this.startTime = time;
      }

      this.startTime += this._startDelay;

      for (var property in this.endProperties) {
        // Can only tween properties that already exist.
        if (!(property in this.target)) throw new Error('Cannot tween non-existent property.');
        var targetProperty = this.target[property]; // Can only tween number properties.

        if (typeof targetProperty !== 'number') throw new Error('Cannot tween non-number property.');
        var endProperty = this.endProperties[property]; // Don't forget to include initial state when interpolating...

        if (Array.isArray(endProperty)) {
          this.endProperties[property] = [targetProperty].concat(_toConsumableArray(endProperty));
        } else if (typeof endProperty !== 'function' && typeof endProperty !== 'number') {
          throw new Error('Unable to tween unknown end property type.');
        }

        this.startProperties[property] = targetProperty;
        this.repeatProperties[property] = this.startProperties[property];
      }

      this.active = true;
      this.firstUpdate = true;
      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      var finish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!this.active) return this;
      this.active = false;

      if (finish) {
        this.update(Infinity);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.nexts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var next = _step.value;
            next.stop();
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

      return this;
    }
  }, {
    key: "update",
    value: function update() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Tween.now();
      if (time < this.startTime) return true;

      if (this.firstUpdate) {
        this.firstUpdate = false;
        this.emit('start', this.target);
      }

      var elapsed = this._duration > 0 ? Math.min((time - this.startTime) / this._duration, 1) : 1;
      var progress = this.easingFunction(elapsed);

      for (var property in this.endProperties) {
        if (!(property in this.startProperties)) continue;
        var start = this.startProperties[property];
        var end = this.endProperties[property];
        this.target[property] = this.getTweenValue(start, end, progress);
      }

      this.emit('update', this.target, elapsed);

      if (elapsed >= 1) {
        if (this._repeat > 0) {
          if (Number.isFinite(this._repeat)) --this._repeat;

          for (var _property in this.repeatProperties) {
            // Reverse the start and end states for repeat yoyos.
            if (this._yoyo) {
              var repeatValue = this.repeatProperties[_property];
              this.repeatProperties[_property] = this.endProperties[_property];
              this.endProperties[_property] = repeatValue; // This would only happen on the return of the yoyo, where the start was the new endpoint.

              if (typeof this.repeatProperties[_property] === 'function') {
                // Therefore, we can safely assume 2 things:
                // - The repeat and end properties were swapped, since repeat values can only be initially set as numbers.
                // - The respective end property must be a number, since start properties are assigned repeat values after swap and start properties can only be numbers.
                // Set start properties as the EVALUATED repeat properties.
                // This way we can just use repeat properties as storage for the yoyo function until it is swapped again.
                this.startProperties[_property] = this.repeatProperties[_property].call(null, this.endProperties[_property]);
                continue;
              }
            } // If it's a dynamic end value, update the start state to the cumulative state.
            // But yoyo should not be cumulative, hence the else...
            else if (typeof this.endProperties[_property] === 'function') {
                this.repeatProperties[_property] += this.endProperties[_property].call(null, this.repeatProperties[_property]);
              } // Set start properties as repeat properties...


            this.startProperties[_property] = this.repeatProperties[_property];
          }

          if (this._yoyo) {
            this.reversed = !this.reversed;
          }

          if (this._repeatDelay) {
            this.startTime = time + this._repeatDelay;
          } else {
            this.startTime = time + this._startDelay;
          }

          this.emit('repeat', this.target);
          return true;
        } else {
          this.active = false;
          this.emit('complete', this.target);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.nexts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var next = _step2.value;
              next.start(this.startTime + this._duration);
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
      }

      return true;
    }
  }, {
    key: "getTweenValue",
    value: function getTweenValue(start, end, progress) {
      var result;

      if (Array.isArray(end)) {
        result = this.interpolationFunction(end, progress);
      } else if (typeof end === 'function') {
        result = end.call(null, start);
      } else {
        result = end;
      }

      if (typeof result === 'number') {
        return start + (result - start) * progress;
      } else {
        throw new Error('Unable to tween unknown end property type.');
      }
    }
  }, {
    key: "ease",
    value: function ease(func) {
      if (typeof func === 'string') {
        this.easingFunction = getFunctionByName(func);
      } else {
        this.easingFunction = func;
      }

      return this;
    }
  }, {
    key: "interpolate",
    value: function interpolate(func) {
      if (typeof func === 'string') {
        this.interpolationFunction = getFunctionByName$1(func);
      } else {
        this.interpolationFunction = func;
      }

      return this;
    }
  }, {
    key: "repeat",
    value: function repeat() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;
      var repeatDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      this._repeat = count;
      if (typeof repeatDelay !== 'undefined') this._repeatDelay = repeatDelay;
      return this;
    }
  }, {
    key: "delay",
    value: function delay() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
      var repeatDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      this._startDelay = time;
      if (typeof repeatDelay === 'undefined') this._repeatDelay = repeatDelay;
      return this;
    }
  }, {
    key: "yoyo",
    value: function yoyo() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this._yoyo = value;
      if (this._repeat <= 0) this._repeat = 1;
      return this;
    }
  }, {
    key: "setDuration",
    value: function setDuration(value) {
      this._duration = value;
      return this;
    }
  }, {
    key: "setRepeatDelay",
    value: function setRepeatDelay(time) {
      this._repeatDelay = time;
      return this;
    }
  }]);

  return Tween;
}();

Eventable.mixin(Tween);

var TWEEN_MANAGER = new TweenManager();

function create(target, result) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  // In order to start, tween must know at least the target, result, and start delay.
  var tween = new Tween(target).to(result, duration).delay(delay);
  TWEEN_MANAGER.add(tween);
  return tween;
}

var TweenModule = /*#__PURE__*/Object.freeze({
    TWEEN_MANAGER: TWEEN_MANAGER,
    Easing: Easing,
    Interpolation: Interpolation,
    create: create
});

function randomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

var ColorHelper = /*#__PURE__*/Object.freeze({
    randomColor: randomColor
});

/**
 * @private
 */
var branch_pool = [];
/**
 * A branch within a BVH
 * @class
 * @private
 */

var BVHBranch =
/*#__PURE__*/
function () {
  /**
   * @constructor
   */
  function BVHBranch() {
    _classCallCheck(this, BVHBranch);

    /** @private */
    this._bvh_parent = null;
    /** @private */

    this._bvh_branch = true;
    /** @private */

    this._bvh_left = null;
    /** @private */

    this._bvh_right = null;
    /** @private */

    this._bvh_sort = 0;
    /** @private */

    this._bvh_min_x = 0;
    /** @private */

    this._bvh_min_y = 0;
    /** @private */

    this._bvh_max_x = 0;
    /** @private */

    this._bvh_max_y = 0;
  }
  /**
   * Returns a branch from the branch pool or creates a new branch
   * @returns {BVHBranch}
   */


  _createClass(BVHBranch, null, [{
    key: "getBranch",
    value: function getBranch() {
      if (branch_pool.length) {
        return branch_pool.pop();
      }

      return new BVHBranch();
    }
    /**
     * Releases a branch back into the branch pool
     * @param {BVHBranch} branch The branch to release
     */

  }, {
    key: "releaseBranch",
    value: function releaseBranch(branch) {
      branch_pool.push(branch);
    }
    /**
     * Sorting callback used to sort branches by deepest first
     * @param {BVHBranch} a The first branch
     * @param {BVHBranch} b The second branch
     * @returns {Number}
     */

  }, {
    key: "sortBranches",
    value: function sortBranches(a, b) {
      return a.sort > b.sort ? -1 : 1;
    }
  }]);

  return BVHBranch;
}();

/**
 * A Bounding Volume Hierarchy (BVH) used to find potential collisions quickly
 * @class
 * @private
 */

var BVH =
/*#__PURE__*/
function () {
  /**
   * @constructor
   */
  function BVH() {
    _classCallCheck(this, BVH);

    /** @private */
    this._hierarchy = null;
    /** @private */

    this._bodies = [];
    /** @private */

    this._dirty_branches = [];
  }
  /**
   * Inserts a body into the BVH
   * @param {Circle|Polygon|Point} body The body to insert
   * @param {Boolean} [updating = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
   */


  _createClass(BVH, [{
    key: "insert",
    value: function insert(body) {
      var updating = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!updating) {
        var bvh = body._bvh;

        if (bvh && bvh !== this) {
          throw new Error('Body belongs to another collision system');
        }

        body._bvh = this;

        this._bodies.push(body);
      }

      var polygon = body._polygon;
      var body_x = body.x;
      var body_y = body.y;

      if (polygon) {
        if (body._dirty_coords || body.x !== body._x || body.y !== body._y || body.angle !== body._angle || body.scale_x !== body._scale_x || body.scale_y !== body._scale_y) {
          body._calculateCoords();
        }
      }

      var padding = body._bvh_padding;
      var radius = polygon ? 0 : body.radius * body.scale;
      var body_min_x = (polygon ? body._min_x : body_x - radius) - padding;
      var body_min_y = (polygon ? body._min_y : body_y - radius) - padding;
      var body_max_x = (polygon ? body._max_x : body_x + radius) + padding;
      var body_max_y = (polygon ? body._max_y : body_y + radius) + padding;
      body._bvh_min_x = body_min_x;
      body._bvh_min_y = body_min_y;
      body._bvh_max_x = body_max_x;
      body._bvh_max_y = body_max_y;
      var current = this._hierarchy;
      var sort = 0;

      if (!current) {
        this._hierarchy = body;
      } else {
        while (true) {
          // Branch
          if (current._bvh_branch) {
            var left = current._bvh_left;
            var left_min_y = left._bvh_min_y;
            var left_max_x = left._bvh_max_x;
            var left_max_y = left._bvh_max_y;
            var left_new_min_x = body_min_x < left._bvh_min_x ? body_min_x : left._bvh_min_x;
            var left_new_min_y = body_min_y < left_min_y ? body_min_y : left_min_y;
            var left_new_max_x = body_max_x > left_max_x ? body_max_x : left_max_x;
            var left_new_max_y = body_max_y > left_max_y ? body_max_y : left_max_y;
            var left_volume = (left_max_x - left._bvh_min_x) * (left_max_y - left_min_y);
            var left_new_volume = (left_new_max_x - left_new_min_x) * (left_new_max_y - left_new_min_y);
            var left_difference = left_new_volume - left_volume;
            var right = current._bvh_right;
            var right_min_x = right._bvh_min_x;
            var right_min_y = right._bvh_min_y;
            var right_max_x = right._bvh_max_x;
            var right_max_y = right._bvh_max_y;
            var right_new_min_x = body_min_x < right_min_x ? body_min_x : right_min_x;
            var right_new_min_y = body_min_y < right_min_y ? body_min_y : right_min_y;
            var right_new_max_x = body_max_x > right_max_x ? body_max_x : right_max_x;
            var right_new_max_y = body_max_y > right_max_y ? body_max_y : right_max_y;
            var right_volume = (right_max_x - right_min_x) * (right_max_y - right_min_y);
            var right_new_volume = (right_new_max_x - right_new_min_x) * (right_new_max_y - right_new_min_y);
            var right_difference = right_new_volume - right_volume;
            current._bvh_sort = sort++;
            current._bvh_min_x = left_new_min_x < right_new_min_x ? left_new_min_x : right_new_min_x;
            current._bvh_min_y = left_new_min_y < right_new_min_y ? left_new_min_y : right_new_min_y;
            current._bvh_max_x = left_new_max_x > right_new_max_x ? left_new_max_x : right_new_max_x;
            current._bvh_max_y = left_new_max_y > right_new_max_y ? left_new_max_y : right_new_max_y;
            current = left_difference <= right_difference ? left : right;
          } // Leaf
          else {
              var grandparent = current._bvh_parent;
              var parent_min_x = current._bvh_min_x;
              var parent_min_y = current._bvh_min_y;
              var parent_max_x = current._bvh_max_x;
              var parent_max_y = current._bvh_max_y;
              var new_parent = current._bvh_parent = body._bvh_parent = BVHBranch.getBranch();
              new_parent._bvh_parent = grandparent;
              new_parent._bvh_left = current;
              new_parent._bvh_right = body;
              new_parent._bvh_sort = sort++;
              new_parent._bvh_min_x = body_min_x < parent_min_x ? body_min_x : parent_min_x;
              new_parent._bvh_min_y = body_min_y < parent_min_y ? body_min_y : parent_min_y;
              new_parent._bvh_max_x = body_max_x > parent_max_x ? body_max_x : parent_max_x;
              new_parent._bvh_max_y = body_max_y > parent_max_y ? body_max_y : parent_max_y;

              if (!grandparent) {
                this._hierarchy = new_parent;
              } else if (grandparent._bvh_left === current) {
                grandparent._bvh_left = new_parent;
              } else {
                grandparent._bvh_right = new_parent;
              }

              break;
            }
        }
      }
    }
    /**
     * Removes a body from the BVH
     * @param {Circle|Polygon|Point} body The body to remove
     * @param {Boolean} [updating = false] Set to true if this is a temporary removal (used internally when updating the body's position)
     */

  }, {
    key: "remove",
    value: function remove(body) {
      var updating = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!updating) {
        var bvh = body._bvh;

        if (bvh && bvh !== this) {
          throw new Error('Body belongs to another collision system');
        }

        body._bvh = null;

        this._bodies.splice(this._bodies.indexOf(body), 1);
      }

      if (this._hierarchy === body) {
        this._hierarchy = null;
        return;
      }

      var parent = body._bvh_parent;
      var grandparent = parent._bvh_parent;
      var parent_left = parent._bvh_left;
      var sibling = parent_left === body ? parent._bvh_right : parent_left;
      sibling._bvh_parent = grandparent;

      if (sibling._bvh_branch) {
        sibling._bvh_sort = parent._bvh_sort;
      }

      if (grandparent) {
        if (grandparent._bvh_left === parent) {
          grandparent._bvh_left = sibling;
        } else {
          grandparent._bvh_right = sibling;
        }

        var branch = grandparent;

        while (branch) {
          var left = branch._bvh_left;
          var left_min_x = left._bvh_min_x;
          var left_min_y = left._bvh_min_y;
          var left_max_x = left._bvh_max_x;
          var left_max_y = left._bvh_max_y;
          var right = branch._bvh_right;
          var right_min_x = right._bvh_min_x;
          var right_min_y = right._bvh_min_y;
          var right_max_x = right._bvh_max_x;
          var right_max_y = right._bvh_max_y;
          branch._bvh_min_x = left_min_x < right_min_x ? left_min_x : right_min_x;
          branch._bvh_min_y = left_min_y < right_min_y ? left_min_y : right_min_y;
          branch._bvh_max_x = left_max_x > right_max_x ? left_max_x : right_max_x;
          branch._bvh_max_y = left_max_y > right_max_y ? left_max_y : right_max_y;
          branch = branch._bvh_parent;
        }
      } else {
        this._hierarchy = sibling;
      }

      BVHBranch.releaseBranch(parent);
    }
    /**
     * Updates the BVH. Moved bodies are removed/inserted.
     */

  }, {
    key: "update",
    value: function update() {
      var bodies = this._bodies;
      var count = bodies.length;

      for (var i = 0; i < count; ++i) {
        var body = bodies[i];
        var update = false;

        if (!update && body.padding !== body._bvh_padding) {
          body._bvh_padding = body.padding;
          update = true;
        }

        if (!update) {
          var polygon = body._polygon;

          if (polygon) {
            if (body._dirty_coords || body.x !== body._x || body.y !== body._y || body.angle !== body._angle || body.scale_x !== body._scale_x || body.scale_y !== body._scale_y) {
              body._calculateCoords();
            }
          }

          var x = body.x;
          var y = body.y;
          var radius = polygon ? 0 : body.radius * body.scale;
          var min_x = polygon ? body._min_x : x - radius;
          var min_y = polygon ? body._min_y : y - radius;
          var max_x = polygon ? body._max_x : x + radius;
          var max_y = polygon ? body._max_y : y + radius;
          update = min_x < body._bvh_min_x || min_y < body._bvh_min_y || max_x > body._bvh_max_x || max_y > body._bvh_max_y;
        }

        if (update) {
          this.remove(body, true);
          this.insert(body, true);
        }
      }
    }
    /**
     * Returns a list of potential collisions for a body
     * @param {Circle|Polygon|Point} body The body to test
     * @returns {Array<Body>}
     */

  }, {
    key: "potentials",
    value: function potentials(body) {
      var results = [];
      var min_x = body._bvh_min_x;
      var min_y = body._bvh_min_y;
      var max_x = body._bvh_max_x;
      var max_y = body._bvh_max_y;
      var current = this._hierarchy;
      var traverse_left = true;

      if (!current || !current._bvh_branch) {
        return results;
      }

      while (current) {
        if (traverse_left) {
          traverse_left = false;
          var left = current._bvh_branch ? current._bvh_left : null;

          while (left && left._bvh_max_x >= min_x && left._bvh_max_y >= min_y && left._bvh_min_x <= max_x && left._bvh_min_y <= max_y) {
            current = left;
            left = current._bvh_branch ? current._bvh_left : null;
          }
        }

        var branch = current._bvh_branch;
        var right = branch ? current._bvh_right : null;

        if (right && right._bvh_max_x > min_x && right._bvh_max_y > min_y && right._bvh_min_x < max_x && right._bvh_min_y < max_y) {
          current = right;
          traverse_left = true;
        } else {
          if (!branch && current !== body) {
            results.push(current);
          }

          var parent = current._bvh_parent;

          if (parent) {
            while (parent && parent._bvh_right === current) {
              current = parent;
              parent = current._bvh_parent;
            }

            current = parent;
          } else {
            break;
          }
        }
      }

      return results;
    }
    /**
     * Draws the bodies within the BVH to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The context to draw to
     */

  }, {
    key: "draw",
    value: function draw(context) {
      var bodies = this._bodies;
      var count = bodies.length;

      for (var i = 0; i < count; ++i) {
        bodies[i].draw(context);
      }
    }
    /**
     * Draws the BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
     * @param {CanvasRenderingContext2D} context The context to draw to
     */

  }, {
    key: "drawBVH",
    value: function drawBVH(context) {
      var current = this._hierarchy;
      var traverse_left = true;

      while (current) {
        if (traverse_left) {
          traverse_left = false;
          var left = current._bvh_branch ? current._bvh_left : null;

          while (left) {
            current = left;
            left = current._bvh_branch ? current._bvh_left : null;
          }
        }

        var branch = current._bvh_branch;
        var min_x = current._bvh_min_x;
        var min_y = current._bvh_min_y;
        var max_x = current._bvh_max_x;
        var max_y = current._bvh_max_y;
        var right = branch ? current._bvh_right : null;
        context.moveTo(min_x, min_y);
        context.lineTo(max_x, min_y);
        context.lineTo(max_x, max_y);
        context.lineTo(min_x, max_y);
        context.lineTo(min_x, min_y);

        if (right) {
          current = right;
          traverse_left = true;
        } else {
          var parent = current._bvh_parent;

          if (parent) {
            while (parent && parent._bvh_right === current) {
              current = parent;
              parent = current._bvh_parent;
            }

            current = parent;
          } else {
            break;
          }
        }
      }
    }
  }]);

  return BVH;
}();

/**
 * Determines if two bodies are colliding using the Separating Axis Theorem
 * @private
 * @param {Circle|Polygon|Point} a The source body to test
 * @param {Circle|Polygon|Point} b The target body to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own collision heuristic)
 * @returns {Boolean}
 */
function SAT(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var aabb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var a_polygon = a._polygon;
  var b_polygon = b._polygon;
  var collision = false;

  if (result) {
    result.a = a;
    result.b = b;
    result.a_in_b = true;
    result.b_in_a = true;
    result.overlap = null;
    result.overlap_x = 0;
    result.overlap_y = 0;
  }

  if (a_polygon) {
    if (a._dirty_coords || a.x !== a._x || a.y !== a._y || a.angle !== a._angle || a.scale_x !== a._scale_x || a.scale_y !== a._scale_y) {
      a._calculateCoords();
    }
  }

  if (b_polygon) {
    if (b._dirty_coords || b.x !== b._x || b.y !== b._y || b.angle !== b._angle || b.scale_x !== b._scale_x || b.scale_y !== b._scale_y) {
      b._calculateCoords();
    }
  }

  if (!aabb || aabbAABB(a, b)) {
    if (a_polygon && a._dirty_normals) {
      a._calculateNormals();
    }

    if (b_polygon && b._dirty_normals) {
      b._calculateNormals();
    }

    collision = a_polygon && b_polygon ? polygonPolygon(a, b, result) : a_polygon ? polygonCircle(a, b, result, false) : b_polygon ? polygonCircle(b, a, result, true) : circleCircle(a, b, result);
  }

  if (result) {
    result.collision = collision;
  }

  return collision;
}
/**
 * Determines if two bodies' axis aligned bounding boxes are colliding
 * @param {Circle|Polygon|Point} a The source body to test
 * @param {Circle|Polygon|Point} b The target body to test against
 */

function aabbAABB(a, b) {
  var a_polygon = a._polygon;
  var a_x = a_polygon ? 0 : a.x;
  var a_y = a_polygon ? 0 : a.y;
  var a_radius = a_polygon ? 0 : a.radius * a.scale;
  var a_min_x = a_polygon ? a._min_x : a_x - a_radius;
  var a_min_y = a_polygon ? a._min_y : a_y - a_radius;
  var a_max_x = a_polygon ? a._max_x : a_x + a_radius;
  var a_max_y = a_polygon ? a._max_y : a_y + a_radius;
  var b_polygon = b._polygon;
  var b_x = b_polygon ? 0 : b.x;
  var b_y = b_polygon ? 0 : b.y;
  var b_radius = b_polygon ? 0 : b.radius * b.scale;
  var b_min_x = b_polygon ? b._min_x : b_x - b_radius;
  var b_min_y = b_polygon ? b._min_y : b_y - b_radius;
  var b_max_x = b_polygon ? b._max_x : b_x + b_radius;
  var b_max_y = b_polygon ? b._max_y : b_y + b_radius;
  return a_min_x < b_max_x && a_min_y < b_max_y && a_max_x > b_min_x && a_max_y > b_min_y;
}
/**
 * Determines if two polygons are colliding
 * @param {Polygon} a The source polygon to test
 * @param {Polygon} b The target polygon to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */


function polygonPolygon(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var a_count = a._coords.length;
  var b_count = b._coords.length; // Handle points specially

  if (a_count === 2 && b_count === 2) {
    var _a_coords = a._coords;
    var _b_coords = b._coords;

    if (result) {
      result.overlap = 0;
    }

    return _a_coords[0] === _b_coords[0] && _a_coords[1] === _b_coords[1];
  }

  var a_coords = a._coords;
  var b_coords = b._coords;
  var a_normals = a._normals;
  var b_normals = b._normals;

  if (a_count > 2) {
    for (var ix = 0, iy = 1; ix < a_count; ix += 2, iy += 2) {
      if (separatingAxis(a_coords, b_coords, a_normals[ix], a_normals[iy], result)) {
        return false;
      }
    }
  }

  if (b_count > 2) {
    for (var _ix = 0, _iy = 1; _ix < b_count; _ix += 2, _iy += 2) {
      if (separatingAxis(a_coords, b_coords, b_normals[_ix], b_normals[_iy], result)) {
        return false;
      }
    }
  }

  return true;
}
/**
 * Determines if a polygon and a circle are colliding
 * @param {Polygon} a The source polygon to test
 * @param {Circle} b The target circle to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @param {Boolean} [reverse = false] Set to true to reverse a and b in the result parameter when testing circle->polygon instead of polygon->circle
 * @returns {Boolean}
 */


function polygonCircle(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var reverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var a_coords = a._coords;
  var a_edges = a._edges;
  var a_normals = a._normals;
  var b_x = b.x;
  var b_y = b.y;
  var b_radius = b.radius * b.scale;
  var b_radius2 = b_radius * 2;
  var radius_squared = b_radius * b_radius;
  var count = a_coords.length;
  var a_in_b = true;
  var b_in_a = true;
  var overlap = null;
  var overlap_x = 0;
  var overlap_y = 0; // Handle points specially

  if (count === 2) {
    var coord_x = b_x - a_coords[0];
    var coord_y = b_y - a_coords[1];
    var length_squared = coord_x * coord_x + coord_y * coord_y;

    if (length_squared > radius_squared) {
      return false;
    }

    if (result) {
      var length = Math.sqrt(length_squared);
      overlap = b_radius - length;
      overlap_x = coord_x / length;
      overlap_y = coord_y / length;
      b_in_a = false;
    }
  } else {
    for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
      var _coord_x = b_x - a_coords[ix];

      var _coord_y = b_y - a_coords[iy];

      var edge_x = a_edges[ix];
      var edge_y = a_edges[iy];
      var dot = _coord_x * edge_x + _coord_y * edge_y;
      var region = dot < 0 ? -1 : dot > edge_x * edge_x + edge_y * edge_y ? 1 : 0;
      var tmp_overlapping = false;
      var tmp_overlap = 0;
      var tmp_overlap_x = 0;
      var tmp_overlap_y = 0;

      if (result && a_in_b && _coord_x * _coord_x + _coord_y * _coord_y > radius_squared) {
        a_in_b = false;
      }

      if (region) {
        var left = region === -1;
        var other_x = left ? ix === 0 ? count - 2 : ix - 2 : ix === count - 2 ? 0 : ix + 2;
        var other_y = other_x + 1;
        var coord2_x = b_x - a_coords[other_x];
        var coord2_y = b_y - a_coords[other_y];
        var edge2_x = a_edges[other_x];
        var edge2_y = a_edges[other_y];
        var dot2 = coord2_x * edge2_x + coord2_y * edge2_y;
        var region2 = dot2 < 0 ? -1 : dot2 > edge2_x * edge2_x + edge2_y * edge2_y ? 1 : 0;

        if (region2 === -region) {
          var target_x = left ? _coord_x : coord2_x;
          var target_y = left ? _coord_y : coord2_y;

          var _length_squared = target_x * target_x + target_y * target_y;

          if (_length_squared > radius_squared) {
            return false;
          }

          if (result) {
            var _length = Math.sqrt(_length_squared);

            tmp_overlapping = true;
            tmp_overlap = b_radius - _length;
            tmp_overlap_x = target_x / _length;
            tmp_overlap_y = target_y / _length;
            b_in_a = false;
          }
        }
      } else {
        var normal_x = a_normals[ix];
        var normal_y = a_normals[iy];

        var _length2 = _coord_x * normal_x + _coord_y * normal_y;

        var absolute_length = _length2 < 0 ? -_length2 : _length2;

        if (_length2 > 0 && absolute_length > b_radius) {
          return false;
        }

        if (result) {
          tmp_overlapping = true;
          tmp_overlap = b_radius - _length2;
          tmp_overlap_x = normal_x;
          tmp_overlap_y = normal_y;

          if (b_in_a && _length2 >= 0 || tmp_overlap < b_radius2) {
            b_in_a = false;
          }
        }
      }

      if (tmp_overlapping && (overlap === null || overlap > tmp_overlap)) {
        overlap = tmp_overlap;
        overlap_x = tmp_overlap_x;
        overlap_y = tmp_overlap_y;
      }
    }
  }

  if (result) {
    result.a_in_b = reverse ? b_in_a : a_in_b;
    result.b_in_a = reverse ? a_in_b : b_in_a;
    result.overlap = overlap;
    result.overlap_x = reverse ? -overlap_x : overlap_x;
    result.overlap_y = reverse ? -overlap_y : overlap_y;
  }

  return true;
}
/**
 * Determines if two circles are colliding
 * @param {Circle} a The source circle to test
 * @param {Circle} b The target circle to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */


function circleCircle(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var a_radius = a.radius * a.scale;
  var b_radius = b.radius * b.scale;
  var difference_x = b.x - a.x;
  var difference_y = b.y - a.y;
  var radius_sum = a_radius + b_radius;
  var length_squared = difference_x * difference_x + difference_y * difference_y;

  if (length_squared > radius_sum * radius_sum) {
    return false;
  }

  if (result) {
    var length = Math.sqrt(length_squared);
    result.a_in_b = a_radius <= b_radius && length <= b_radius - a_radius;
    result.b_in_a = b_radius <= a_radius && length <= a_radius - b_radius;
    result.overlap = radius_sum - length;
    result.overlap_x = difference_x / length;
    result.overlap_y = difference_y / length;
  }

  return true;
}
/**
 * Determines if two polygons are separated by an axis
 * @param {Array<Number[]>} a_coords The coordinates of the polygon to test
 * @param {Array<Number[]>} b_coords The coordinates of the polygon to test against
 * @param {Number} x The X direction of the axis
 * @param {Number} y The Y direction of the axis
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */


function separatingAxis(a_coords, b_coords, x, y) {
  var result = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var a_count = a_coords.length;
  var b_count = b_coords.length;

  if (!a_count || !b_count) {
    return true;
  }

  var a_start = null;
  var a_end = null;
  var b_start = null;
  var b_end = null;

  for (var ix = 0, iy = 1; ix < a_count; ix += 2, iy += 2) {
    var dot = a_coords[ix] * x + a_coords[iy] * y;

    if (a_start === null || a_start > dot) {
      a_start = dot;
    }

    if (a_end === null || a_end < dot) {
      a_end = dot;
    }
  }

  for (var _ix2 = 0, _iy2 = 1; _ix2 < b_count; _ix2 += 2, _iy2 += 2) {
    var _dot = b_coords[_ix2] * x + b_coords[_iy2] * y;

    if (b_start === null || b_start > _dot) {
      b_start = _dot;
    }

    if (b_end === null || b_end < _dot) {
      b_end = _dot;
    }
  }

  if (a_start > b_end || a_end < b_start) {
    return true;
  }

  if (result) {
    var overlap = 0;

    if (a_start < b_start) {
      result.a_in_b = false;

      if (a_end < b_end) {
        overlap = a_end - b_start;
        result.b_in_a = false;
      } else {
        var option1 = a_end - b_start;
        var option2 = b_end - a_start;
        overlap = option1 < option2 ? option1 : -option2;
      }
    } else {
      result.b_in_a = false;

      if (a_end > b_end) {
        overlap = a_start - b_end;
        result.a_in_b = false;
      } else {
        var _option = a_end - b_start;

        var _option2 = b_end - a_start;

        overlap = _option < _option2 ? _option : -_option2;
      }
    }

    var current_overlap = result.overlap;
    var absolute_overlap = overlap < 0 ? -overlap : overlap;

    if (current_overlap === null || current_overlap > absolute_overlap) {
      var sign = overlap < 0 ? -1 : 1;
      result.overlap = absolute_overlap;
      result.overlap_x = x * sign;
      result.overlap_y = y * sign;
    }
  }

  return false;
}

/**
 * The base class for bodies used to detect collisions
 */

var Body =
/*#__PURE__*/
function () {
  /**
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  function Body() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Body);

    /**
     * @desc The X coordinate of the body
     * @type {Number}
     */
    this.x = x;
    /**
     * @desc The Y coordinate of the body
     * @type {Number}
     */

    this.y = y;
    /**
     * @desc The amount to pad the bounding volume when testing for potential collisions
     * @type {Number}
     */

    this.padding = padding;
    /** @private */

    this._circle = false;
    /** @private */

    this._polygon = false;
    /** @private */

    this._point = false;
    /** @private */

    this._bvh = null;
    /** @private */

    this._bvh_parent = null;
    /** @private */

    this._bvh_branch = false;
    /** @private */

    this._bvh_padding = padding;
    /** @private */

    this._bvh_min_x = 0;
    /** @private */

    this._bvh_min_y = 0;
    /** @private */

    this._bvh_max_x = 0;
    /** @private */

    this._bvh_max_y = 0;
  }
  /**
   * Determines if the body is colliding with another body
   * @param {Circle|Polygon|Point} target The target body to test against
   * @param {Result} [result = null] A Result object on which to store information about the collision
   * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
   * @returns {Boolean}
   */


  _createClass(Body, [{
    key: "collides",
    value: function collides(target) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var aabb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return SAT(this, target, result, aabb);
    }
    /**
     * Gets a list of potential collisions.
     * @returns {Array<Body>} A list of potential collisions.
     */

  }, {
    key: "potentials",
    value: function potentials() {
      var bvh = this._bvh;

      if (bvh === null) {
        throw new Error('Body does not belong to a collision system');
      }

      return bvh.potentials(this);
    }
    /**
     * Removes the body from its current collision system.
     */

  }, {
    key: "remove",
    value: function remove() {
      var bvh = this._bvh;

      if (bvh) {
        bvh.remove(this, false);
      }
    }
  }]);

  return Body;
}();

/**
 * A circle used to detect collisions
 */

var Circle =
/*#__PURE__*/
function (_Body) {
  _inherits(Circle, _Body);

  /**
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Number} [radius = 0] The radius
   * @param {Number} [scale = 1] The scale
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  function Circle() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var padding = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, Circle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, x, y, padding));
    /**
     * @desc
     * @type {Number}
     */

    _this.radius = radius;
    /**
     * @desc
     * @type {Number}
     */

    _this.scale = scale;
    return _this;
  }
  /**
   * Draws the circle to a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The context to add the arc to
   */


  _createClass(Circle, [{
    key: "draw",
    value: function draw(context) {
      var x = this.x;
      var y = this.y;
      var radius = this.radius * this.scale;
      context.moveTo(x + radius, y);
      context.arc(x, y, radius, 0, Math.PI * 2);
    }
  }]);

  return Circle;
}(Body);

/**
 * A polygon used to detect collisions
 * @class
 */

var Polygon =
/*#__PURE__*/
function (_Body) {
  _inherits(Polygon, _Body);

  /**
   * @constructor
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
   * @param {Number} [angle = 0] The starting rotation in radians
   * @param {Number} [scale_x = 1] The starting scale along the X axis
   * @param {Number} [scale_y = 1] The starting scale long the Y axis
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  function Polygon() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var points = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var angle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var scale_x = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var scale_y = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    var padding = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, Polygon);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, x, y, padding));
    /**
     * @desc The angle of the body in radians
     * @type {Number}
     */

    _this.angle = angle;
    /**
     * @desc The scale of the body along the X axis
     * @type {Number}
     */

    _this.scale_x = scale_x;
    /**
     * @desc The scale of the body along the Y axis
     * @type {Number}
     */

    _this.scale_y = scale_y;
    /** @private */

    _this._polygon = true;
    /** @private */

    _this._x = x;
    /** @private */

    _this._y = y;
    /** @private */

    _this._angle = angle;
    /** @private */

    _this._scale_x = scale_x;
    /** @private */

    _this._scale_y = scale_y;
    /** @private */

    _this._min_x = 0;
    /** @private */

    _this._min_y = 0;
    /** @private */

    _this._max_x = 0;
    /** @private */

    _this._max_y = 0;
    /** @private */

    _this._points = null;
    /** @private */

    _this._coords = null;
    /** @private */

    _this._edges = null;
    /** @private */

    _this._normals = null;
    /** @private */

    _this._dirty_coords = true;
    /** @private */

    _this._dirty_normals = true;
    Polygon.prototype.setPoints.call(_assertThisInitialized(_this), points);
    return _this;
  }
  /**
   * Draws the polygon to a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The context to add the shape to
   */


  _createClass(Polygon, [{
    key: "draw",
    value: function draw(context) {
      if (this._dirty_coords || this.x !== this._x || this.y !== this._y || this.angle !== this._angle || this.scale_x !== this._scale_x || this.scale_y !== this._scale_y) {
        this._calculateCoords();
      }

      var coords = this._coords;

      if (coords.length === 2) {
        context.moveTo(coords[0], coords[1]);
        context.arc(coords[0], coords[1], 1, 0, Math.PI * 2);
      } else {
        context.moveTo(coords[0], coords[1]);

        for (var i = 2; i < coords.length; i += 2) {
          context.lineTo(coords[i], coords[i + 1]);
        }

        if (coords.length > 4) {
          context.lineTo(coords[0], coords[1]);
        }
      }
    }
    /**
     * Sets the points making up the polygon. It's important to use this function when changing the polygon's shape to ensure internal data is also updated.
     * @param {Array<Number[]>} new_points An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     */

  }, {
    key: "setPoints",
    value: function setPoints(new_points) {
      var count = new_points.length;
      this._points = new Float64Array(count * 2);
      this._coords = new Float64Array(count * 2);
      this._edges = new Float64Array(count * 2);
      this._normals = new Float64Array(count * 2);
      var points = this._points;

      for (var i = 0, ix = 0, iy = 1; i < count; ++i, ix += 2, iy += 2) {
        var new_point = new_points[i];
        points[ix] = new_point[0];
        points[iy] = new_point[1];
      }

      this._dirty_coords = true;
    }
    /**
     * Calculates and caches the polygon's world coordinates based on its points, angle, and scale
     */

  }, {
    key: "_calculateCoords",
    value: function _calculateCoords() {
      var x = this.x;
      var y = this.y;
      var angle = this.angle;
      var scale_x = this.scale_x;
      var scale_y = this.scale_y;
      var points = this._points;
      var coords = this._coords;
      var count = points.length;
      var min_x;
      var max_x;
      var min_y;
      var max_y;

      for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
        var coord_x = points[ix] * scale_x;
        var coord_y = points[iy] * scale_y;

        if (angle) {
          var cos = Math.cos(angle);
          var sin = Math.sin(angle);
          var tmp_x = coord_x;
          var tmp_y = coord_y;
          coord_x = tmp_x * cos - tmp_y * sin;
          coord_y = tmp_x * sin + tmp_y * cos;
        }

        coord_x += x;
        coord_y += y;
        coords[ix] = coord_x;
        coords[iy] = coord_y;

        if (ix === 0) {
          min_x = max_x = coord_x;
          min_y = max_y = coord_y;
        } else {
          if (coord_x < min_x) {
            min_x = coord_x;
          } else if (coord_x > max_x) {
            max_x = coord_x;
          }

          if (coord_y < min_y) {
            min_y = coord_y;
          } else if (coord_y > max_y) {
            max_y = coord_y;
          }
        }
      }

      this._x = x;
      this._y = y;
      this._angle = angle;
      this._scale_x = scale_x;
      this._scale_y = scale_y;
      this._min_x = min_x;
      this._min_y = min_y;
      this._max_x = max_x;
      this._max_y = max_y;
      this._dirty_coords = false;
      this._dirty_normals = true;
    }
    /**
     * Calculates the normals and edges of the polygon's sides
     */

  }, {
    key: "_calculateNormals",
    value: function _calculateNormals() {
      var coords = this._coords;
      var edges = this._edges;
      var normals = this._normals;
      var count = coords.length;

      for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
        var next = ix + 2 < count ? ix + 2 : 0;
        var x = coords[next] - coords[ix];
        var y = coords[next + 1] - coords[iy];
        var length = x || y ? Math.sqrt(x * x + y * y) : 0;
        edges[ix] = x;
        edges[iy] = y;
        normals[ix] = length ? y / length : 0;
        normals[iy] = length ? -x / length : 0;
      }

      this._dirty_normals = false;
    }
  }]);

  return Polygon;
}(Body);

/**
 * A point used to detect collisions.
 */

var Point =
/*#__PURE__*/
function (_Polygon) {
  _inherits(Point, _Polygon);

  /**
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  function Point() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Point);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Point).call(this, x, y, [[0, 0]], 0, 1, 1, padding));
    /** @private */

    _this._point = true;
    return _this;
  }
  /** @override */


  _createClass(Point, [{
    key: "setPoints",
    value: function setPoints() {
      throw new Error("Cannt set points for a single point.");
    }
  }]);

  return Point;
}(Polygon);

var BOX_POINTS = [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]];

var CollisionManager =
/*#__PURE__*/
function () {
  function CollisionManager() {
    var broadPhase = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var narrowPhase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, CollisionManager);

    this.broadPhase = broadPhase || new BVH();
    this.narrowPhase = narrowPhase;
  }

  _createClass(CollisionManager, [{
    key: "addCircle",
    value: function addCircle() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var padding = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var body = new Circle(x, y, radius, scale, padding);
      this.broadPhase.insert(body);
      return body;
    }
  }, {
    key: "addBox",
    value: function addBox() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var angle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var scale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var padding = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var body = new Polygon(x, y, BOX_POINTS, angle, width * scale, height * scale, padding);
      this.broadPhase.insert(body);
      return body;
    }
  }, {
    key: "addPolygon",
    value: function addPolygon() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var points = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [[0, 0]];
      var angle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var scale_x = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var scale_y = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var padding = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var body = new Polygon(x, y, points, angle, scale_x, scale_y, padding);
      this.broadPhase.insert(body);
      return body;
    }
  }, {
    key: "addPoint",
    value: function addPoint() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var body = new Point(x, y, padding);
      this.broadPhase.insert(body);
      return body;
    }
  }, {
    key: "add",
    value: function add() {
      for (var _len = arguments.length, bodies = new Array(_len), _key = 0; _key < _len; _key++) {
        bodies[_key] = arguments[_key];
      }

      for (var _i = 0, _bodies = bodies; _i < _bodies.length; _i++) {
        var body = _bodies[_i];
        this.broadPhase.insert(body, false);
      }

      return this;
    }
  }, {
    key: "remove",
    value: function remove() {
      for (var _len2 = arguments.length, bodies = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        bodies[_key2] = arguments[_key2];
      }

      for (var _i2 = 0, _bodies2 = bodies; _i2 < _bodies2.length; _i2++) {
        var body = _bodies2[_i2];
        this.broadPhase.remove(body, false);
      }

      return this;
    }
  }, {
    key: "update",
    value: function update() {
      this.broadPhase.update(); // this.narrowPhase.update();

      return this;
    }
  }, {
    key: "potentials",
    value: function potentials(body) {
      return this.broadPhase.potentials(body);
    }
  }, {
    key: "collides",
    value: function collides(body, target) {
      var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return SAT(body, target, result, true);
    }
  }]);

  return CollisionManager;
}();

var COLLISION_MANAGER = new CollisionManager();

function overlap(x, y, w, h, otherX, otherY, otherW, otherH) {
  return x + w >= otherX && otherX + otherW >= x && y + h >= otherY && otherY + otherH >= y;
}

function draw() {
  var ctx = VIEW.canvas.getContext('2d');
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  COLLISION_MANAGER.broadPhase.draw(ctx);
  ctx.stroke();
  ctx.strokeStyle = '#00FF00';
  ctx.beginPath();
  COLLISION_MANAGER.broadPhase.drawBVH(ctx);
  ctx.stroke();
}

var CollisionModule = /*#__PURE__*/Object.freeze({
    COLLISION_MANAGER: COLLISION_MANAGER,
    overlap: overlap,
    draw: draw
});

var GameLoop =
/*#__PURE__*/
function () {
  function GameLoop() {
    _classCallCheck(this, GameLoop);

    this.handle = 0;
    this.ticks = 0;
    this._prevtime = 0;
    this._running = false;
    this.run = this.run.bind(this);
  }

  _createClass(GameLoop, [{
    key: "hasStarted",
    value: function hasStarted() {
      return this._running;
    }
  }, {
    key: "start",
    value: function start() {
      this.emit('start');
      this.handle = requestAnimationFrame(this.run);
      this._prevtime = performance.now();
      this._running = true;
      this.ticks = 0;
      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      cancelAnimationFrame(this.handle);
      this.handle = 0;
      this._running = false;
      this.emit('stop');
      return this;
    }
  }, {
    key: "run",
    value: function run(now) {
      this.handle = requestAnimationFrame(this.run);
      var dt = now - this._prevtime;
      this.emit('update', dt);
      this._prevtime = now;
      ++this.ticks;
    }
  }]);

  return GameLoop;
}();

Eventable.mixin(GameLoop);

var GAME = Eventable.create();
var GAME_LOOP = new GameLoop();
GAME_LOOP.on('update', onGameUpdate);

function onGameUpdate(dt) {
  INPUT_MANAGER.poll();
  GAME.emit('preupdate');
  COLLISION_MANAGER.update();
  TWEEN_MANAGER.update();
  GAME.emit('update', dt * 0.01);
  GAME.emit('postupdate');
}

function play() {
  GAME_LOOP.start();
}

export { CollisionModule as Collision, ColorHelper as Color, DisplayModule as Display, EntityModule as Entity, Eventable, GAME as Game, InputModule as Input, MathHelper as Math, TweenModule as Tween, play };
