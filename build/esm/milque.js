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

function halfWidth() {
  return VIEW.canvas.width / 2;
}

function halfHeight() {
  return VIEW.canvas.height / 2;
}

var DisplayModule = /*#__PURE__*/Object.freeze({
    VIEW: VIEW,
    attach: attach,
    detach: detach,
    bind: bind,
    unbind: unbind,
    width: width,
    height: height,
    halfWidth: halfWidth,
    halfHeight: halfHeight
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

  function RangeInput(name, eventKey, min, max) {
    var _this;

    _classCallCheck(this, RangeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RangeInput).call(this, name, eventKey));

    if (typeof max !== 'number' || typeof min !== 'number') {
      throw new Error('Range bounds for input not specified');
    }

    if (max < min) {
      throw new Error('Max range must be greater than min range');
    }

    _this.min = min;
    _this.max = max;
    var normal = max - min;

    if (normal == 0) {
      throw new Error('Range of input cannot be zero');
    }

    _this.normal = normal;
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
      return (value - this.min) / this.normal;
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
      inputDevice.addEventListener('input', this.onInputEvent);
    }
  }, {
    key: "removeDevice",
    value: function removeDevice(inputDevice) {
      inputDevice.removeEventListener('input', this.onInputEvent);
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
        inputDevice.removeEventListener('input', this.onInputEvent);
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
    this.listeners = new Map();
  }

  _createClass(InputDevice, [{
    key: "delete",
    value: function _delete() {
      this.listeners.clear();
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(event, listener) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).push(listener);
      } else {
        this.listeners.set(event, [listener]);
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event, listener) {
      if (this.listeners.has(event)) {
        var listeners = this.listeners.get(event);
        var index = listener.indexOf(listener);

        if (index >= 0) {
          listeners.splice(index, 1);
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event, inputKey, inputEvent, inputValue) {
      if (this.listeners.has(event)) {
        for (var _len = arguments.length, args = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
          args[_key - 4] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.listeners.get(event)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var listener = _step.value;
            listener.call.apply(listener, [null, this, inputKey, inputEvent, inputValue].concat(args));
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
      this.dispatchEvent('input', e.key, 'down', true);
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      this.dispatchEvent('input', e.key, 'up', true);
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
      this.dispatchEvent('input', 'move', 'x', e.movementX);
      this.dispatchEvent('input', 'move', 'y', e.movementY);

      if (this.element instanceof Element) {
        var rect = this.element.getBoundingClientRect();
        this.dispatchEvent('input', 'pos', 'x', e.clientX - rect.left);
        this.dispatchEvent('input', 'pos', 'y', e.clientY - rect.top);
      } else {
        this.dispatchEvent('input', 'pos', 'x', e.clientX);
        this.dispatchEvent('input', 'pos', 'y', e.clientY);
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
      this.dispatchEvent('input', e.button, 'down', true, e.clientX, e.clientY);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      if (this.allowCursorLock && !this.hasPointerLock()) return;
      document.removeEventListener('mouseup', this.onMouseUp);
      this._down = false;
      this.dispatchEvent('input', e.button, 'up', true, e.clientX, e.clientY);
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

function Action(name) {
  for (var _len = arguments.length, eventKeys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    eventKeys[_key - 1] = arguments[_key];
  }

  var input = _construct(ActionInput, [name].concat(eventKeys));

  INPUT_MANAGER.getContext().mapping.register(input);
  return {
    input: input,
    get: function get() {
      var consume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var inputState = INPUT_MANAGER.currentState;

      if (inputState.hasAction(this.input.name)) {
        return inputState.getAction(this.input.name, consume);
      }

      return false;
    }
  };
}

function State(name) {
  var inputs = [];

  for (var _len2 = arguments.length, downUpEventKeys = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    downUpEventKeys[_key2 - 1] = arguments[_key2];
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

    var input = new StateInput(name, downEventKey, upEventKey);
    INPUT_MANAGER.getContext().mapping.register(input);
    inputs.push(input);
  }

  return {
    inputs: inputs,
    get: function get() {
      var consume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var inputState = INPUT_MANAGER.currentState;

      if (inputState.hasState(this.inputs[0].name)) {
        return inputState.getState(this.inputs[0].name, consume);
      }

      return false;
    }
  };
}

function Range(name, eventKey) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var input = new RangeInput(name, eventKey, min, max);
  INPUT_MANAGER.getContext().mapping.register(input);
  return {
    input: input,
    get: function get() {
      var consume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var inputState = INPUT_MANAGER.currentState;

      if (inputState.hasRange(this.input.name)) {
        return inputState.getRange(this.input.name, consume);
      }

      return 0;
    }
  };
}

var InputModule = /*#__PURE__*/Object.freeze({
    INPUT_MANAGER: INPUT_MANAGER,
    KEYBOARD: KEYBOARD,
    MOUSE: MOUSE,
    Action: Action,
    State: State,
    Range: Range
});

var EntityBase =
/*#__PURE__*/
function () {
  _createClass(EntityBase, null, [{
    key: "TAG",
    get: function get() {
      return "#".concat(this.name);
    }
    /**
     * Creates an entity.
     * @param {EntityManager} entityManager The entity manager that owns this entity.
     */

  }]);

  function EntityBase(entityManager) {
    _classCallCheck(this, EntityBase);

    this.entityManager = entityManager;
  }

  _createClass(EntityBase, [{
    key: "create",
    value: function create() {
      var _this$entityManager;

      var tags = findInheritedTags(this.constructor);
      this.id = (_this$entityManager = this.entityManager).create.apply(_this$entityManager, _toConsumableArray(tags));
      return this;
    }
    /**
     * @returns {Boolean} True if instance can be cached and re-used.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.entityManager.destroy(this.id);
      this.id = -1;
      return false;
    }
  }, {
    key: "assign",
    value: function assign(component) {
      var _this$entityManager2;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_this$entityManager2 = this.entityManager).assign.apply(_this$entityManager2, [this.id, component].concat(args));

      return this;
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this$entityManager3;

      for (var _len2 = arguments.length, components = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        components[_key2] = arguments[_key2];
      }

      (_this$entityManager3 = this.entityManager).remove.apply(_this$entityManager3, [this.id].concat(components));

      return this;
    }
  }, {
    key: "has",
    value: function has() {
      var _this$entityManager4;

      for (var _len3 = arguments.length, components = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        components[_key3] = arguments[_key3];
      }

      return (_this$entityManager4 = this.entityManager).has.apply(_this$entityManager4, [this.id].concat(components));
    }
  }, {
    key: "get",
    value: function get(component) {
      var _this$entityManager5;

      for (var _len4 = arguments.length, components = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        components[_key4 - 1] = arguments[_key4];
      }

      return (_this$entityManager5 = this.entityManager).get.apply(_this$entityManager5, [this.id, component].concat(components));
    }
  }]);

  return EntityBase;
}();

function findInheritedTags(Class) {
  var dst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (Class.hasOwnProperty('INHERITED_TAGS')) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Class.INHERITED_TAGS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var tag = _step.value;
        dst.push(tag);
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
  } else if (Class.hasOwnProperty('TAG')) {
    dst.push(Class.TAG);
    var superClass = Object.getPrototypeOf(Class);

    if (superClass) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = findInheritedTags(superClass)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _tag = _step2.value;
          dst.push(_tag);
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

    Class.INHERITED_TAGS = dst;
  }

  return dst;
}

var EntityView =
/*#__PURE__*/
function () {
  function EntityView(entityManager, filter) {
    _classCallCheck(this, EntityView);

    this.entityManager = entityManager;
    this.filter = filter;
  }

  _createClass(EntityView, [{
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

var STATIC_TAG_INSTANCE = {};

var ComponentManager =
/*#__PURE__*/
function () {
  function ComponentManager(component) {
    _classCallCheck(this, ComponentManager);

    this.components = new Map();
    this.type = component;
    this._createComponent = null;
    this._destroyComponent = null;

    if (typeof component === 'string') {
      this._createComponent = createComponentByTag;
      this._destroyComponent = destroyComponentByTag;
    } else {
      this._createComponent = createComponentByFunction;
      this._destroyComponent = destroyComponentByFunction;
    }
  }

  _createClass(ComponentManager, [{
    key: "add",
    value: function add(entity) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var dst = this._createComponent.apply(this, [this.type].concat(args));

      this.components.set(entity, dst);
      return dst;
    }
  }, {
    key: "remove",
    value: function remove(entity) {
      if (this.components.has(entity)) {
        var component = this.components.get(entity);

        if (this._destroyComponent(this.type, component)) ; // NOTE: Can re-use component for a new entity!
        // TODO: Implement this later. For now, always assume you can't.
        // Remove it from the entity.


        this.components["delete"](entity);
      }
    }
  }, {
    key: "get",
    value: function get(entity) {
      return this.components.get(entity);
    }
  }, {
    key: "has",
    value: function has(entity) {
      return this.components.has(entity);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.components.clear();
    }
  }]);

  return ComponentManager;
}();

function createComponentByTag(ComponentTag) {
  // (...args) are ignored...
  return STATIC_TAG_INSTANCE;
}

function destroyComponentByTag(ComponentTag, instance) {
  return true;
}

function createComponentByFunction(ComponentFunction) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return ComponentFunction.apply(void 0, args);
}

function destroyComponentByFunction(ComponentFunction, instance) {
  return true;
}

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
  }, {
    key: "destroy",
    value: function destroy(entity) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._componentManagers.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var componentManager = _step.value;

          if (componentManager.has(entity)) {
            componentManager.remove(entity);
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

      this._entities["delete"](entity);
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
  }, {
    key: "assign",
    value: function assign(entity, component) {
      var _componentManager;

      var componentManager;

      if (!this._componentManagers.has(component)) {
        componentManager = new ComponentManager(component);

        this._componentManagers.set(component, componentManager);
      } else {
        componentManager = this._componentManagers.get(component);
      }

      for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return (_componentManager = componentManager).add.apply(_componentManager, [entity].concat(args));
    }
  }, {
    key: "remove",
    value: function remove(entity) {
      for (var _len6 = arguments.length, components = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        components[_key6 - 1] = arguments[_key6];
      }

      for (var _i4 = 0, _components4 = components; _i4 < _components4.length; _i4++) {
        var c = _components4[_i4];

        this._componentManagers.get(c).remove(entity);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.components.length > 0) {
        for (var _len7 = arguments.length, components = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          components[_key7] = arguments[_key7];
        }

        for (var _i5 = 0, _components5 = components; _i5 < _components5.length; _i5++) {
          var c = _components5[_i5];

          this._componentManagers.get(c).clear();
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
 * @param {Class} EntityClass A sub-class of EntityBase.
 * @returns {EntityBase} The created entity instance of passed-in class.
 */

function spawn() {
  var EntityClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EntityBase;
  var result = new EntityClass(ENTITY_MANAGER);
  return result.create();
}

function keys() {
  return ENTITY_MANAGER.entities.apply(ENTITY_MANAGER, arguments);
}

function component(entity, component) {
  for (var _len = arguments.length, components = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    components[_key - 2] = arguments[_key];
  }

  return ENTITY_MANAGER.get.apply(ENTITY_MANAGER, [entity, component].concat(components));
}

var EntityModule = /*#__PURE__*/Object.freeze({
    ENTITY_MANAGER: ENTITY_MANAGER,
    EntityBase: EntityBase,
    spawn: spawn,
    keys: keys,
    component: component
});

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

var GameLoop =
/*#__PURE__*/
function () {
  function GameLoop() {
    _classCallCheck(this, GameLoop);

    this.handle = 0;
    this.ticks = 0;
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
    value: function run() {
      this.handle = requestAnimationFrame(this.run);
      this.emit('update');
      ++this.ticks;
    }
  }]);

  return GameLoop;
}();

Eventable.mixin(GameLoop);

var GAME_LOOP = new GameLoop();
GAME_LOOP.on('update', onGameUpdate);

function onGameUpdate() {
  INPUT_MANAGER.poll();
}

export { DisplayModule as Display, EntityModule as Entity, GAME_LOOP as Game, InputModule as Input };
