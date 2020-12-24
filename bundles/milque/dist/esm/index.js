export * from '@milque/display';
export * from '@milque/input';
import { vec3, quat, mat4, mat3, vec2 } from 'gl-matrix';

class RandomGenerator {
  /** @abstract */
  next() {
    return Math.random();
  }

}

let RAND;

class Random {
  constructor(randomGenerator = new RandomGenerator()) {
    this.generator = randomGenerator;
  }

  static next() {
    return RAND.next();
  }

  next() {
    return this.generator.next();
  }

  static choose(list) {
    return RAND.choose(list);
  }

  choose(list) {
    return list[Math.floor(this.generator.next() * list.length)];
  }

  static range(min, max) {
    return RAND.range(min, max);
  }

  range(min, max) {
    return (max - min) * this.generator.next() + min;
  }

  static sign() {
    return RAND.sign();
  }

  sign() {
    return this.generator.next() < 0.5 ? -1 : 1;
  }

}

RAND = new Random();

class SimpleRandomGenerator extends RandomGenerator {
  constructor(seed = 0) {
    super();
    this._seed = Math.abs(seed % 2147483647);
    this._next = this._seed;
  }
  /** @override */


  next() {
    this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
    return this._next / 2147483646;
  }

  get seed() {
    return this._seed;
  }

  set seed(value) {
    this._seed = Math.abs(value % 2147483647);
    this._next = this._seed;
  }

}

// Bresenham's Line Algorithm
function line(fromX, fromY, toX, toY, callback) {
  let fx = Math.floor(fromX);
  let fy = Math.floor(fromY);
  let tx = Math.floor(toX);
  let ty = Math.floor(toY);
  let dx = Math.abs(toX - fromX);
  let sx = fromX < toX ? 1 : -1;
  let dy = -Math.abs(toY - fromY);
  let sy = fromY < toY ? 1 : -1;
  let er = dx + dy;
  let x = fx;
  let y = fy;
  let flag = callback(x, y);
  if (typeof flag !== 'undefined') return flag;
  let maxLength = dx * dx + dy * dy;
  let length = 0;

  while (length < maxLength && (x !== tx || y !== ty)) {
    // Make sure it doesn't go overboard.
    ++length;
    let er2 = er * 2;

    if (er2 >= dy) {
      er += dy;
      x += sx;
    }

    if (er2 <= dx) {
      er += dx;
      y += sy;
    }

    flag = callback(x, y);
    if (typeof flag !== 'undefined') return flag;
  }
}

var Discrete = /*#__PURE__*/Object.freeze({
  __proto__: null,
  line: line
});
const FILE_TYPE_PNG = 'png';
const FILE_TYPE_SVG = 'svg';

function downloadText(filename, textData) {
  downloadURL(filename, getTextDataURI(textData));
}

function downloadImageFromSVG(filename, filetype, svg, width, height) {
  const blob = createBlobFromSVG(svg);

  switch (filetype) {
    case FILE_TYPE_PNG:
      {
        const url = URL.createObjectURL(blob);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        const image = new Image();

        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          URL.revokeObjectURL(url);
          const imageURI = canvas.toDataURL('image/' + filetype).replace('image/' + filetype, 'image/octet-stream');
          downloadURL(filename, imageURI);
        };

        image.src = url;
      }
      break;

    case FILE_TYPE_SVG:
      {
        const reader = new FileReader();

        reader.onload = () => {
          downloadURL(filename, reader.result);
        };

        reader.readAsDataURL(blob);
      }
      break;

    default:
      throw new Error('Unknown file type \'' + filetype + '\'');
  }
}

function downloadURL(filename, url) {
  const element = document.createElement('a');
  const headerIndex = url.indexOf(';');
  url = url.substring(0, headerIndex + 1) + 'headers=Content-Disposition%3A%20attachment%3B%20filename=' + filename + ';' + url.substring(headerIndex + 1);
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function createBlobFromSVG(svg) {
  const styledSVG = computeSVGStyles(svg);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(styledSVG);
  const blob = new Blob([svgString], {
    type: 'image/svg+xml'
  });
  return blob;
} // SOURCE: https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser/44769098#44769098


const SVG_CONTAINERS = ['svg', 'g'];

function computeSVGStyles(svg, dst = svg.cloneNode(true)) {
  let sourceChildren = svg.childNodes;
  let children = dst.childNodes;

  for (var index = 0; index < children.length; index++) {
    let child = children[index];
    let tagName = child.tagName;

    if (SVG_CONTAINERS.indexOf(tagName) != -1) {
      computeSVGStyles(sourceChildren[index], child);
    } else if (sourceChildren[index] instanceof Element) {
      const computedStyle = window.getComputedStyle(sourceChildren[index]);
      let styleAttributes = [];

      for (let styleName of Object.keys(computedStyle)) {
        styleAttributes.push(`${styleName}:${computedStyle.getPropertyValue(styleName)};`);
      }

      child.setAttribute('style', styleAttributes.join(''));
    }
  }

  return dst;
}

function getTextDataURI(data) {
  return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
}

var Downloader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FILE_TYPE_PNG: FILE_TYPE_PNG,
  FILE_TYPE_SVG: FILE_TYPE_SVG,
  downloadText: downloadText,
  downloadImageFromSVG: downloadImageFromSVG,
  downloadURL: downloadURL
});

async function uploadFile(accept = [], multiple = false) {
  return new Promise((resolve, reject) => {
    const element = document.createElement('input');
    element.addEventListener('change', e => {
      if (multiple) {
        resolve(e.target.files);
      } else {
        resolve(e.target.files[0]);
      }
    });
    element.type = 'file';
    element.accept = accept.join(',');
    element.style.display = 'none';
    element.toggleAttribute('multiple', multiple);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });
}

var Uploader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  uploadFile: uploadFile
}); // Log levels

const TRACE = 5;
const DEBUG = 4;
const INFO = 3;
const WARN = 2;
const ERROR = 1;
const OFF = 0;
const LOG_LEVEL_STYLES = {
  [TRACE]: styledLogLevel('#7F8C8D'),
  // Gray
  [DEBUG]: styledLogLevel('#2ECC71'),
  // Green
  [INFO]: styledLogLevel('#4794C8'),
  // Blue
  [WARN]: styledLogLevel('#F39C12'),
  // Yellow
  [ERROR]: styledLogLevel('#C0392B'),
  // Red
  [OFF]: ['']
};

function compareLogLevel(a, b) {
  return a - b;
}

function styledLogLevel(color) {
  return [`background: ${color}`, 'border-radius: 0.5em', 'color: white', 'font-weight: bold', 'padding: 2px 0.5em'];
} // Useful functions


function noop() {
  /** Do nothing. */
}

function getStyledMessage(message, styles) {
  return [`%c${message}`, styles.join(';')];
}

function getConsoleFunction(level) {
  switch (level) {
    case TRACE:
      return console.trace;

    case DEBUG:
      return console.log;

    case INFO:
      return console.log;

    case WARN:
      return console.warn;

    case ERROR:
      return console.error;

    case OFF:
      return noop;

    default:
      return console.log;
  }
}

function prependMessageTags(out, name, domain, level) {
  if (name) {
    out.unshift(`[${name}]`);
  }

  if (domain) {
    let tag = getStyledMessage(domain, LOG_LEVEL_STYLES[level]);
    out.unshift(tag[0], tag[1]);
  }

  return out;
}

const LEVEL = Symbol('level');
const DOMAIN = Symbol('domain');
const LOGGERS = {
  /** To be populated by logger instances. */
};
let DEFAULT_LEVEL = WARN;
let DEFAULT_DOMAIN = 'app';

class Logger {
  static get TRACE() {
    return TRACE;
  }

  static get DEBUG() {
    return DEBUG;
  }

  static get INFO() {
    return INFO;
  }

  static get WARN() {
    return WARN;
  }

  static get ERROR() {
    return ERROR;
  }

  static get OFF() {
    return OFF;
  }
  /**
   * Creates or gets the logger for the given unique name.
   * @param {String} name 
   * @returns {Logger} The logger with the name.
   */


  static getLogger(name) {
    if (name in LOGGERS) {
      return LOGGERS[name];
    } else {
      return LOGGERS[name] = new Logger(name);
    }
  }

  static useDefaultLevel(level) {
    DEFAULT_LEVEL = level;
    return this;
  }

  static useDefaultDomain(domain) {
    DEFAULT_DOMAIN = domain;
    return this;
  }

  constructor(name) {
    this.name = name;
    this[LEVEL] = DEFAULT_LEVEL;
    this[DOMAIN] = DEFAULT_DOMAIN;
  }

  setLevel(level) {
    this[LEVEL] = level;
    return this;
  }

  getLevel() {
    return this[LEVEL];
  }

  setDomain(domain) {
    this[DOMAIN] = domain;
    return this;
  }

  getDomain() {
    return this[DOMAIN];
  }

  log(level, ...messages) {
    if (compareLogLevel(this[LEVEL], level) < 0) return this;
    prependMessageTags(messages, this.name, this[DOMAIN], level);
    getConsoleFunction(level)(...messages);
  }

  trace(...messages) {
    if (compareLogLevel(this[LEVEL], TRACE) < 0) return this;
    prependMessageTags(messages, this.name, this[DOMAIN], TRACE);
    getConsoleFunction(TRACE)(...messages);
  }

  debug(...messages) {
    if (compareLogLevel(this[LEVEL], DEBUG) < 0) return this;
    prependMessageTags(messages, this.name, this[DOMAIN], DEBUG);
    getConsoleFunction(DEBUG)(...messages);
  }

  info(...messages) {
    if (compareLogLevel(this[LEVEL], INFO) < 0) return this;
    prependMessageTags(messages, this.name, this[DOMAIN], INFO);
    getConsoleFunction(INFO)(...messages);
  }

  warn(...messages) {
    if (compareLogLevel(this[LEVEL], WARN) < 0) return this;
    prependMessageTags(messages, this.name, this[DOMAIN], WARN);
    getConsoleFunction(WARN)(...messages);
  }

  error(...messages) {
    if (compareLogLevel(this[LEVEL], ERROR) < 0) return this;
    prependMessageTags(messages, this.name, this[DOMAIN], ERROR);
    getConsoleFunction(ERROR)(...messages);
  }

}

var Logger$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Logger: Logger
});
/**
 * @typedef Eventable
 * @property {function} on
 * @property {function} off
 * @property {function} once
 * @property {function} emit
 */

/**
 * @version 1.3.0
 * @description
 * # Changelog
 * ## 1.3.0
 * - Return results for emit()
 * ## 1.2.0
 * - Added named exports
 * - Added custom this context
 * - Added some needed explanations for the functions
 * ## 1.1.0
 * - Started versioning
 */

const EventableInstance = {
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
  on(event, callback, handle = callback) {
    let callbacks;

    if (!this.__events.has(event)) {
      callbacks = new Map();

      this.__events.set(event, callbacks);
    } else {
      callbacks = this.__events.get(event);
    }

    if (!callbacks.has(handle)) {
      callbacks.set(handle, callback);
    } else {
      throw new Error(`Found callback for event '${event}' with the same handle '${handle}'.`);
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
  off(event, handle) {
    if (this.__events.has(event)) {
      const callbacks = this.__events.get(event);

      if (callbacks.has(handle)) {
        callbacks.delete(handle);
      } else {
        throw new Error(`Unable to find callback for event '${event}' with handle '${handle}'.`);
      }
    } else {
      throw new Error(`Unable to find event '${event}'.`);
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
  once(event, callback, handle = callback) {
    const func = (...args) => {
      this.off(event, handle);
      callback.apply(this.__context || this, args);
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
   * @return {Array<any>} Array of any returned values of the callbacks.
   */
  emit(event, ...args) {
    if (this.__events.has(event)) {
      let results = [];
      const callbacks = Array.from(this.__events.get(event).values());

      for (const callback of callbacks) {
        let result = callback.apply(this.__context || this, args);
        if (result) results.push(result);
      }

      return results;
    } else {
      this.__events.set(event, new Map());

      return [];
    }
  }

};
/**
 * Creates an eventable object.
 * 
 * @param {Object} [context] The context used for the event handlers.
 * @return {Eventable} The created eventable object.
 */

function create(context = undefined) {
  const result = Object.create(EventableInstance);
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


function assign(dst, context = undefined) {
  const result = Object.assign(dst, EventableInstance);
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


function mixin(targetClass, context = undefined) {
  const targetPrototype = targetClass.prototype;
  Object.assign(targetPrototype, EventableInstance);
  targetPrototype.__events = new Map();
  targetPrototype.__context = context;
  return targetPrototype;
}

var Eventable = {
  create,
  assign,
  mixin
};
var Eventable$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  assign: assign,
  mixin: mixin,
  'default': Eventable
});
const TOP_INDEX = 0; // NOTE: Uses a binary heap to sort.

class PriorityQueue {
  constructor(comparator) {
    this._heap = [];
    this._comparator = comparator;
  }

  get size() {
    return this._heap.length;
  }

  clear() {
    this._heap.length = 0;
  }

  push(...values) {
    for (const value of values) {
      this._heap.push(value);

      this._shiftUp();
    }
  }

  pop() {
    const result = this.peek();
    let bottom = bottomIndex(this);

    if (bottom > TOP_INDEX) {
      this._swap(TOP_INDEX, bottom);
    }

    this._heap.pop();

    this._shiftDown();

    return result;
  }
  /** Replaces the top value with the new value. */


  replace(value) {
    const result = this.peek();
    this._heap[TOP_INDEX] = value;

    this._shiftDown();

    return result;
  }

  peek() {
    return this._heap[TOP_INDEX];
  }
  /** @private */


  _compare(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  /** @private */


  _swap(i, j) {
    let result = this._heap[i];
    this._heap[i] = this._heap[j];
    this._heap[j] = result;
  }
  /** @private */


  _shiftUp() {
    let node = this._heap.length - 1;
    let nodeParent;

    while (node > TOP_INDEX && this._compare(node, nodeParent = parentIndex(node))) {
      this._swap(node, nodeParent);

      node = nodeParent;
    }
  }
  /** @private */


  _shiftDown() {
    const length = this._heap.length;
    let node = TOP_INDEX;
    let nodeMax;
    let nodeLeft = leftIndex(node);
    let flagLeft = nodeLeft < length;
    let nodeRight = rightIndex(node);
    let flagRight = nodeRight < length;

    while (flagLeft && this._compare(nodeLeft, node) || flagRight && this._compare(nodeRight, node)) {
      nodeMax = flagRight && this._compare(nodeRight, nodeLeft) ? nodeRight : nodeLeft;

      this._swap(node, nodeMax);

      node = nodeMax;
      nodeLeft = leftIndex(node);
      flagLeft = nodeLeft < length;
      nodeRight = rightIndex(node);
      flagRight = nodeRight < length;
    }
  }

  values() {
    return this._heap;
  }

  [Symbol.iterator]() {
    return this._heap[Symbol.iterator]();
  }

}

function bottomIndex(queue) {
  return queue._heap.length - 1;
}

function parentIndex(i) {
  return (i + 1 >>> 1) - 1;
}

function leftIndex(i) {
  return (i << 1) + 1;
}

function rightIndex(i) {
  return i + 1 << 1;
}
/**
 * Generates a uuid v4.
 * 
 * @param {number} a The placeholder (serves for recursion within function).
 * @returns {string} The universally unique id.
 */


function uuid(a = undefined) {
  // https://gist.github.com/jed/982883
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cycle(value, min, max) {
  let range = max - min;
  let result = (value - min) % range;
  if (result < 0) result += range;
  return result + min;
}

function withinRadius(fromX, fromY, toX, toY, radius) {
  const dx = fromX - toX;
  const dy = fromY - toY;
  return dx * dx + dy * dy <= radius * radius;
}

function distance2(fromX, fromY, toX, toY) {
  let dx = toX - fromX;
  let dy = toY - fromY;
  return Math.sqrt(dx * dx + dy * dy);
}

function direction2(fromX, fromY, toX, toY) {
  let dx = toX - fromX;
  let dy = toY - fromY;
  return Math.atan2(dy, dx);
}

function lookAt2(radians, target, dt) {
  let step = cycle(target - radians, -Math.PI, Math.PI);
  return clamp(radians + step, radians - dt, radians + dt);
}

const TO_RAD_FACTOR = Math.PI / 180;
const TO_DEG_FACTOR = 180 / Math.PI;

function toRadians(degrees) {
  return degrees * TO_RAD_FACTOR;
}

function toDegrees(radians) {
  return radians * TO_DEG_FACTOR;
}
/**
 * @callback DependencyCallback
 * @param {Object} node The target node to get the dependencies for.
 * @returns {Array<Object>} A list of all dependencies for the given node.
 */

/**
 * Sort an array topologically.
 * 
 * @param {Array<Object>} nodes List of all nodes (as long as it includes the root node).
 * @param {DependencyCallback} dependencyCallback A callback to get the dependencies of a node.
 * @returns {Array<Object>} A sorted array of node objects where the dependent nodes are always listed before the dependees.
 */


function topoSort(nodes, dependencyCallback) {
  let dependencyEntries = [];

  for (let node of nodes) {
    let outs = dependencyCallback(node);

    if (Array.isArray(outs)) {
      dependencyEntries.push([node, ...outs]);
    } else if (outs) {
      throw new Error('Dependency callback must return an array.');
    }
  }

  return computeDependencyList(getNodesFromDependencyEntries(dependencyEntries), getEdgesFromDependencyEntries(dependencyEntries));
}

function getNodesFromDependencyEntries(dependencyEntries) {
  let result = new Set();

  for (let dependencyEntry of dependencyEntries) {
    for (let value of dependencyEntry) {
      result.add(value);
    }
  }

  return Array.from(result);
}

function getEdgesFromDependencyEntries(dependencyEntries) {
  let result = [];

  for (let dependencyEntry of dependencyEntries) {
    let source = dependencyEntry[0];

    for (let i = 1; i < dependencyEntry.length; ++i) {
      let dependency = dependencyEntry[i];
      result.push([source, dependency]);
    }
  }

  return result;
}

function computeDependencyList(nodes, edges, dst = []) {
  // Compute edge outs (more efficient lookup)
  let edgeOuts = new Map();

  for (let edge of edges) {
    if (edge.length > 1) {
      let source = edge[0];
      let dest = edge[1];
      if (!edgeOuts.has(source)) edgeOuts.set(source, new Set());
      if (!edgeOuts.has(dest)) edgeOuts.set(dest, new Set());
      edgeOuts.get(source).add(dest);
    }
  }

  let context = {
    edgeMap: edgeOuts,
    index: nodes.length,
    visited: new Set(),
    dst
  };

  for (let node of nodes) {
    visit(context, node, new Set());
  }

  return dst;
}

function visit(context, node, prev) {
  if (prev.has(node)) {
    throw new Error(`Found cyclic dependency for '${node.name || node}'.`);
  }

  if (context.visited.has(node)) return;
  context.visited.add(node);

  if (context.edgeMap.has(node)) {
    let outs = context.edgeMap.get(node);

    if (outs.size > 0) {
      prev.add(node);

      for (let out of outs) {
        visit(context, out, prev);
      }

      prev.delete(node);
    }
  }

  context.dst.push(node);
}

async function loadImage(filepath, opts) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.addEventListener('error', ev => {
      reject(ev);
    });
    img.src = filepath;
  });
}

var ImageLoader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadImage: loadImage
});

async function loadText(filepath, opts) {
  let result = await fetch(filepath);
  return result.text();
}

var TextLoader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadText: loadText
});

async function loadBytes(filepath, opts) {
  let result = await fetch(filepath);
  let buffer = await result.arrayBuffer();
  return buffer;
}

var ByteLoader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadBytes: loadBytes
});

async function loadJSON(filepath, opts) {
  let result = await fetch(filepath);
  let json = await result.json();
  return json;
}

var JSONLoader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadJSON: loadJSON
});

async function loadOBJ(filepath, opts) {
  let result = await fetch(filepath);
  let string = await result.text();
  {
    // console.log('ORIGINAL');
    const attempts = 10;

    for (let i = 0; i < attempts; ++i) {
      let then = performance.now();
      parse(string);
      let now = performance.now();
    } // console.log(sum / attempts);

  }
  {
    // console.log('UPDATE');
    const attempts = 10;

    for (let i = 0; i < attempts; ++i) {
      let then = performance.now();
      parse2(string);
      let now = performance.now();
    } // console.log(sum / attempts);

  }
  return parse2(string);
}

function parse2(string) {
  const vertexList = [];
  const texcoordList = [];
  const normalList = [];
  const vertexIndices = [];
  const texcoordIndices = [];
  const normalIndices = []; // # comments

  const commentPattern = /^#.*/g; // v float float float

  const vertexPattern = /v\s+(\S+)\s+(\S+)\s+(\S+)/g; // vn float float float

  const normalPattern = /vn\s+(\S+)\s+(\S+)\s+(\S+)/g; // vt float float float

  const texcoordPattern = /vt\s+(\S+)\s+(\S+)/g; // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

  const facePattern = /f\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*))(\s+(([^/\s]*)\/([^/\s]*)\/?([^/\s]*)))?/g; // f float float float

  const faceVertexPattern = /f\s+([^/\s]+)\s+([^/\s]+)\s+([^/\s]+)/g;
  let quad = false;
  let result = null;
  let x, y, z, w; // Remove all comments

  string = string.replace(commentPattern, ''); // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

  while ((result = vertexPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    z = Number.parseFloat(result[3]);
    vertexList.push(x);
    vertexList.push(y);
    vertexList.push(z);
  } // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]


  while ((result = normalPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    z = Number.parseFloat(result[3]);
    normalList.push(x);
    normalList.push(y);
    normalList.push(z);
  } // ["vt 1.0 2.0", "1.0", "2.0"]


  while ((result = texcoordPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    texcoordList.push(x);
    texcoordList.push(y);
  } // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]


  while ((result = facePattern.exec(string)) != null) {
    // Vertex indices
    x = Number.parseInt(result[2]);
    if (Number.isNaN(x)) x = 1;
    y = Number.parseInt(result[6]);
    if (Number.isNaN(y)) y = 1;
    z = Number.parseInt(result[10]);
    if (Number.isNaN(z)) z = 1;
    vertexIndices.push(x);
    vertexIndices.push(y);
    vertexIndices.push(z); // Normal indices

    x = Number.parseInt(result[4]);

    if (Number.isNaN(x)) {
      // No UVs.
      x = Number.parseInt(result[3]);
      y = Number.parseInt(result[7]);
      z = Number.parseInt(result[11]);
      normalIndices.push(x);
      normalIndices.push(y);
      normalIndices.push(z);
      texcoordIndices.push(1);
      texcoordIndices.push(1);
      texcoordIndices.push(1);
    } else {
      // Maybe UVs.
      y = Number.parseInt(result[8]);
      if (Number.isNaN(y)) y = 1;
      z = Number.parseInt(result[12]);
      if (Number.isNaN(z)) z = 1;
      normalIndices.push(x);
      normalIndices.push(y);
      normalIndices.push(z); // UV indices

      x = Number.parseInt(result[3]);
      if (Number.isNaN(x)) x = 1;
      y = Number.parseInt(result[7]);
      if (Number.isNaN(y)) y = 1;
      z = Number.parseInt(result[11]);
      if (Number.isNaN(z)) z = 1;
      texcoordIndices.push(x);
      texcoordIndices.push(y);
      texcoordIndices.push(z);
    } // Quad face


    if (typeof result[13] !== 'undefined') {
      // Vertex indices
      w = Number.parseInt(result[15]);
      if (Number.isNaN(w)) w = 1;
      vertexIndices.push(w); // Normal indices

      w = Number.parseInt(result[17]);

      if (Number.isNaN(w)) {
        // No UVs.
        w = Number.parseInt(result[16]);
        normalIndices.push(w);
        texcoordIndices.push(1);
      } else {
        // Maybe UVs.
        normalIndices.push(w);
        w = Number.parseInt(result[16]);
        texcoordIndices.push(w);
      }

      quad = true;
    }
  } // ["f 1 2 3 4", "1", "2", "3", "4"]


  while ((result = faceVertexPattern.exec(string)) != null) {
    // Vertex indices
    x = Number.parseInt(result[2]);
    y = Number.parseInt(result[6]);
    z = Number.parseInt(result[10]);
    vertexIndices.push(x);
    vertexIndices.push(y);
    vertexIndices.push(z); // UV indices

    texcoordIndices.push(1);
    texcoordIndices.push(1);
    texcoordIndices.push(1); // Normal indices

    normalIndices.push(1);
    normalIndices.push(1);
    normalIndices.push(1); // Quad face

    if (typeof result[13] !== 'undefined') {
      // Vertex indices
      w = Number.parseInt(result[14]);
      vertexIndices.push(w); // UV indices

      texcoordIndices.push(1); // Normal indices

      normalIndices.push(1);
      quad = true;
    }
  }

  let index, size;
  size = vertexIndices.length;
  const positions = new Float32Array(size * 3);

  for (let i = 0; i < size; ++i) {
    index = vertexIndices[i] - 1;
    positions[i * 3 + 0] = vertexList[index * 3 + 0];
    positions[i * 3 + 1] = vertexList[index * 3 + 1];
    positions[i * 3 + 2] = vertexList[index * 3 + 2];
  }

  size = texcoordIndices.length;
  const texcoords = new Float32Array(size * 2);

  for (let i = 0; i < size; ++i) {
    index = texcoordIndices[i] - 1;
    texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
    texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
  }

  size = normalIndices.length;
  const normals = new Float32Array(size * 3);

  for (let i = 0; i < size; ++i) {
    index = normalIndices[i] - 1;
    normals[i * 3 + 0] = normalList[index * 3 + 0];
    normals[i * 3 + 1] = normalList[index * 3 + 1];
    normals[i * 3 + 2] = normalList[index * 3 + 2];
  } // Must be either unsigned short or unsigned byte.


  size = vertexIndices.length;
  const indices = new Uint16Array(size);

  for (let i = 0; i < size; ++i) {
    indices[i] = i;
  }

  if (quad) {
    console.warn('WebGL does not support quad faces, only triangles.');
  }

  return {
    positions,
    texcoords,
    normals,
    indices
  };
}

function parse(string) {
  const vertexList = [];
  const texcoordList = [];
  const normalList = [];
  const vertexIndices = [];
  const texcoordIndices = [];
  const normalIndices = []; // # comments

  const commentPattern = /^#.*/g; // v float float float

  const vertexPattern = /v( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g; // vn float float float

  const normalPattern = /vn( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g; // vt float float float

  const texcoordPattern = /vt( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g; // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

  const facePattern = /f( +([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))?/g; // f float float float

  const faceVertexPattern = /f( +[\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)( [\d|.|+|\-|e]+)/g;
  let quad = false;
  let result = null;
  let x, y, z, w; // Remove all comments

  string = string.replace(commentPattern, ''); // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

  while ((result = vertexPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    z = Number.parseFloat(result[3]);
    vertexList.push(x);
    vertexList.push(y);
    vertexList.push(z);
  } // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]


  while ((result = normalPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    z = Number.parseFloat(result[3]);
    normalList.push(x);
    normalList.push(y);
    normalList.push(z);
  } // ["vt 1.0 2.0", "1.0", "2.0"]


  while ((result = texcoordPattern.exec(string)) != null) {
    x = Number.parseFloat(result[1]);
    y = Number.parseFloat(result[2]);
    texcoordList.push(x);
    texcoordList.push(y);
  } // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]


  while ((result = facePattern.exec(string)) != null) {
    // Vertex indices
    x = Number.parseInt(result[2]);
    if (Number.isNaN(x)) x = 1;
    y = Number.parseInt(result[6]);
    if (Number.isNaN(y)) y = 1;
    z = Number.parseInt(result[10]);
    if (Number.isNaN(z)) z = 1;
    vertexIndices.push(x);
    vertexIndices.push(y);
    vertexIndices.push(z); // UV indices

    x = Number.parseInt(result[3]);
    if (Number.isNaN(x)) x = 1;
    y = Number.parseInt(result[7]);
    if (Number.isNaN(y)) y = 1;
    z = Number.parseInt(result[11]);
    if (Number.isNaN(z)) z = 1;
    texcoordIndices.push(x);
    texcoordIndices.push(y);
    texcoordIndices.push(z); // Normal indices

    x = Number.parseInt(result[4]);
    if (Number.isNaN(x)) x = 1;
    y = Number.parseInt(result[8]);
    if (Number.isNaN(y)) y = 1;
    z = Number.parseInt(result[12]);
    if (Number.isNaN(z)) z = 1;
    normalIndices.push(x);
    normalIndices.push(y);
    normalIndices.push(z); // Quad face

    if (typeof result[13] !== 'undefined') {
      // Vertex indices
      w = Number.parseInt(result[14]);
      if (Number.isNaN(w)) w = 1;
      vertexIndices.push(w); // UV indices

      w = Number.parseInt(result[15]);
      if (Number.isNaN(w)) w = 1;
      texcoordIndices.push(w); // Normal indices

      w = Number.parseInt(result[16]);
      if (Number.isNaN(w)) w = 1;
      normalIndices.push(w);
      quad = true;
    }
  } // ["f 1 2 3 4", "1", "2", "3", "4"]


  while ((result = faceVertexPattern.exec(string)) != null) {
    // Vertex indices
    x = Number.parseInt(result[2]);
    y = Number.parseInt(result[6]);
    z = Number.parseInt(result[10]);
    vertexIndices.push(x);
    vertexIndices.push(y);
    vertexIndices.push(z); // UV indices

    texcoordIndices.push(1);
    texcoordIndices.push(1);
    texcoordIndices.push(1); // Normal indices

    normalIndices.push(1);
    normalIndices.push(1);
    normalIndices.push(1); // Quad face

    if (typeof result[13] !== 'undefined') {
      // Vertex indices
      w = Number.parseInt(result[14]);
      vertexIndices.push(w); // UV indices

      texcoordIndices.push(1); // Normal indices

      normalIndices.push(1);
      quad = true;
    }
  }

  let index, size;
  size = vertexIndices.length;
  const positions = new Float32Array(size * 3);

  for (let i = 0; i < size; ++i) {
    index = vertexIndices[i] - 1;
    positions[i * 3 + 0] = vertexList[index * 3 + 0];
    positions[i * 3 + 1] = vertexList[index * 3 + 1];
    positions[i * 3 + 2] = vertexList[index * 3 + 2];
  }

  size = texcoordIndices.length;
  const texcoords = new Float32Array(size * 2);

  for (let i = 0; i < size; ++i) {
    index = texcoordIndices[i] - 1;
    texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
    texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
  }

  size = normalIndices.length;
  const normals = new Float32Array(size * 3);

  for (let i = 0; i < size; ++i) {
    index = normalIndices[i] - 1;
    normals[i * 3 + 0] = normalList[index * 3 + 0];
    normals[i * 3 + 1] = normalList[index * 3 + 1];
    normals[i * 3 + 2] = normalList[index * 3 + 2];
  } // Must be either unsigned short or unsigned byte.


  size = vertexIndices.length;
  const indices = new Uint16Array(size);

  for (let i = 0; i < size; ++i) {
    indices[i] = i;
  }

  if (quad) {
    console.warn('WebGL does not support quad faces, only triangles.');
  }

  return {
    positions,
    texcoords,
    normals,
    indices
  };
}

var OBJLoader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadOBJ: loadOBJ
});
let ASSET_LOADERS = {};
defineAssetLoader('image', loadImage);
defineAssetLoader('text', loadText);
defineAssetLoader('json', loadJSON);
defineAssetLoader('bytes', loadBytes);
defineAssetLoader('obj', loadOBJ);

function defineAssetLoader(assetType, assetLoader) {
  ASSET_LOADERS[assetType] = assetLoader;
}

function getAssetLoader(assetType) {
  if (assetType in ASSET_LOADERS) {
    return ASSET_LOADERS[assetType];
  } else {
    throw new Error(`Unknown asset type '${assetType}'.`);
  }
}

async function loadAssetMap(assetMap, assetParentPath = '.') {
  let result = {};

  for (let assetName of Object.keys(assetMap)) {
    let entry = assetMap[assetName];

    if (typeof entry === 'string') {
      result[assetName] = await loadAsset(entry, undefined, assetParentPath);
    } else if (typeof entry === 'object') {
      if (!('src' in entry)) {
        throw new Error('Missing required field \'src\' for entry in asset map.');
      }

      if ('name' in entry && entry.name !== assetName) {
        throw new Error(`Cannot redefine name for asset '${assetName}' for entry in asset map.`);
      }

      result[assetName] = await loadAsset(entry.src, entry, assetParentPath);
    } else {
      throw new Error('Unknown entry type in asset map.');
    }
  }

  return result;
}

async function loadAssetList(assetList, assetParentPath = '.') {
  let result = {};

  for (let entry of assetList) {
    if (typeof entry === 'string') {
      result[entry] = await loadAsset(entry, undefined, assetParentPath);
    } else if (typeof entry === 'object') {
      if (!('src' in entry)) {
        throw new Error('Missing required field \'src\' for entry in asset list.');
      }

      result['name' in entry ? entry.name : entry.src] = await loadAsset(entry.src, entry, assetParentPath);
    } else {
      throw new Error('Unknown entry type in asset list.');
    }
  }

  return result;
}

async function loadAsset(assetSrc, assetOpts = {}, assetParentPath = '.') {
  if (assetSrc.indexOf(':') < 0) {
    throw new Error('Missing type for asset source.');
  }

  let [assetType, assetPath] = assetSrc.split(':');
  let assetLoader = getAssetLoader(assetType);
  return await assetLoader(assetParentPath + '/' + assetPath, assetOpts);
}

var AssetLoader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  defineAssetLoader: defineAssetLoader,
  getAssetLoader: getAssetLoader,
  loadAssetMap: loadAssetMap,
  loadAssetList: loadAssetList,
  loadAsset: loadAsset
}); // SOURCE: https://noonat.github.io/intersect/#aabb-vs-aabb

/* Surface contacts are considered intersections, including sweeps. */

const EPSILON = 1e-8;

function clamp$1(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createAABB(x, y, rx, ry) {
  return {
    x,
    y,
    rx,
    ry
  };
}

function createRect(left, top, right, bottom) {
  let rx = Math.abs(right - left) / 2;
  let ry = Math.abs(bottom - top) / 2;
  return createAABB(Math.min(left, right) + rx, Math.min(top, bottom) + ry, rx, ry);
}

function testAABB(a, b) {
  if (Math.abs(a.x - b.x) > a.rx + b.rx) return false;
  if (Math.abs(a.y - b.y) > a.ry + b.ry) return false;
  return true;
}

function intersectAABB(out, a, b) {
  let dx = b.x - a.x;
  let px = b.rx + a.rx - Math.abs(dx);
  if (px < 0) return null;
  let dy = b.y - a.y;
  let py = b.ry + a.ry - Math.abs(dy);
  if (py < 0) return null;

  if (px < py) {
    let sx = Math.sign(dx);
    out.dx = px * sx;
    out.dy = 0;
    out.nx = sx;
    out.ny = 0;
    out.x = a.x + a.rx * sx;
    out.y = b.y;
  } else {
    let sy = Math.sign(dy);
    out.dx = 0;
    out.dy = py * sy;
    out.nx = 0;
    out.ny = sy;
    out.x = b.x;
    out.y = a.y + a.ry * sy;
  }

  return out;
}

function intersectPoint(out, a, x, y) {
  let dx = x - a.x;
  let px = a.rx - Math.abs(dx);
  if (px < 0) return null;
  let dy = y - a.y;
  let py = a.ry - Math.abs(dy);
  if (py < 0) return null;

  if (px < py) {
    let sx = Math.sign(dx);
    out.dx = px * sx;
    out.dy = 0;
    out.nx = sx;
    out.ny = 0;
    out.x = a.x + a.rx * sx;
    out.y = y;
  } else {
    let sy = Math.sign(dy);
    out.dx = 0;
    out.dy = py * sy;
    out.nx = 0;
    out.ny = sy;
    out.x = x;
    out.y = a.y + a.ry * sy;
  }

  return out;
}

function intersectSegment(out, a, x, y, dx, dy, px = 0, py = 0) {
  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON && px === 0 && py === 0) {
    return intersectPoint(out, a, x, y);
  }

  let arx = a.rx;
  let ary = a.ry;
  let bpx = px;
  let bpy = py;
  let scaleX = 1.0 / (dx || EPSILON);
  let scaleY = 1.0 / (dy || EPSILON);
  let signX = Math.sign(scaleX);
  let signY = Math.sign(scaleY);
  let nearTimeX = (a.x - signX * (arx + bpx) - x) * scaleX;
  let nearTimeY = (a.y - signY * (ary + bpy) - y) * scaleY;
  let farTimeX = (a.x + signX * (arx + bpx) - x) * scaleX;
  let farTimeY = (a.y + signY * (ary + bpy) - y) * scaleY;
  if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;
  let nearTime = Math.max(nearTimeX, nearTimeY);
  let farTime = Math.min(farTimeX, farTimeY);
  if (nearTime > 1 || farTime < 0) return null;
  let time = clamp$1(nearTime, 0, 1);
  let hitdx = (1.0 - time) * -dx;
  let hitdy = (1.0 - time) * -dy;
  let hitx = x + dx * time;
  let hity = y + dy * time;

  if (nearTimeX > nearTimeY) {
    out.time = time;
    out.nx = -signX;
    out.ny = 0;
    out.dx = hitdx;
    out.dy = hitdy;
    out.x = hitx;
    out.y = hity;
  } else {
    out.time = time;
    out.nx = 0;
    out.ny = -signY;
    out.dx = hitdx;
    out.dy = hitdy;
    out.x = hitx;
    out.y = hity;
  }

  return out;
}

function intersectSweepAABB(out, a, b, dx, dy) {
  return intersectSegment(out, a, b.x, b.y, dx, dy, b.rx, b.ry);
}

function sweepIntoAABB(out, a, b, dx, dy) {
  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
    let hit = intersectAABB({}, b, a);
    if (hit) hit.time = 0;
    out.x = a.x;
    out.y = a.y;
    out.time = hit ? 0 : 1;
    out.hit = hit;
    return out;
  }

  let hit = intersectSweepAABB({}, b, a, dx, dy);

  if (hit) {
    let time = clamp$1(hit.time, 0, 1);
    let length = Math.sqrt(dx * dx + dy * dy);
    let normaldx;
    let normaldy;

    if (length) {
      normaldx = dx / length;
      normaldy = dy / length;
    } else {
      normaldx = 0;
      normaldy = 0;
    }

    hit.x = clamp$1(hit.x + normaldx * a.rx, b.x - b.rx, b.x + b.rx);
    hit.y = clamp$1(hit.y + normaldy * a.ry, b.y - b.ry, b.y + b.ry);
    out.time = time;
    out.x = a.x + dx * time;
    out.y = a.y + dy * time;
    out.hit = hit;
  } else {
    out.time = 1;
    out.x = a.x + dx;
    out.y = a.y + dy;
    out.hit = hit;
  }

  return out;
}

function sweepInto(out, a, staticColliders, dx, dy) {
  let tmp = {};
  out.time = 1;
  out.x = a.x + dx;
  out.y = a.y + dy;
  out.hit = null;

  for (let i = 0, l = staticColliders.length; i < l; ++i) {
    let result = sweepIntoAABB(tmp, a, staticColliders[i], dx, dy);

    if (result.time <= out.time) {
      out.time = result.time;
      out.x = result.x;
      out.y = result.y;
      out.hit = result.hit;
    }
  }

  return out;
}

var IntersectionHelper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EPSILON: EPSILON,
  clamp: clamp$1,
  createAABB: createAABB,
  createRect: createRect,
  testAABB: testAABB,
  intersectAABB: intersectAABB,
  intersectPoint: intersectPoint,
  intersectSegment: intersectSegment,
  sweepInto: sweepInto
});
const MAX_SWEEP_RESOLUTION_ITERATIONS = 100;

function computeIntersections(masks, statics = []) {
  // Compute physics.
  for (let mask of masks) {
    switch (mask.type) {
      case 'point':
        mask.hit = null;

        for (let other of statics) {
          mask.hit = intersectPoint({}, other, mask.x, mask.y);
          if (mask.hit) break;
        }

        break;

      case 'segment':
        mask.hit = null;

        for (let other of statics) {
          mask.hit = intersectSegment({}, other, mask.x, mask.y, mask.dx, mask.dy, mask.px, mask.py);
          if (mask.hit) break;
        }

        break;

      case 'aabb':
        mask.hit = null;

        for (let other of statics) {
          mask.hit = intersectAABB({}, other, mask);
          if (mask.hit) break;
        }

        break;
    }
  }
}

function resolveIntersections(dynamics, statics = [], dt = 1) {
  // Do physics.
  for (let dynamic of dynamics) {
    let dx = dynamic.dx * dt;
    let dy = dynamic.dy * dt;
    let time = 0;
    let tmp = {};
    let sweep;
    let hit = null;
    let iterations = MAX_SWEEP_RESOLUTION_ITERATIONS;

    do {
      // Do detection.
      sweep = sweepInto(tmp, dynamic, statics, dx, dy); // Do resolution.

      dynamic.x = sweep.x - Math.sign(dx) * EPSILON;
      dynamic.y = sweep.y - Math.sign(dy) * EPSILON;
      time += sweep.time;

      if (sweep.hit) {
        dx += sweep.hit.nx * Math.abs(dx);
        dy += sweep.hit.ny * Math.abs(dy);
        hit = sweep.hit; // Make sure that spent motion is consumed.

        let remainingTime = Math.max(1 - time, 0);
        dx *= remainingTime;
        dy *= remainingTime;
        if (Math.abs(dx) < EPSILON) dx = 0;
        if (Math.abs(dy) < EPSILON) dy = 0;
      }
    } while (time < 1 && --iterations >= 0);

    dynamic.dx = dx;
    dynamic.dy = dy;
    dynamic.hit = hit;
  }
}

var IntersectionResolver = /*#__PURE__*/Object.freeze({
  __proto__: null,
  computeIntersections: computeIntersections,
  resolveIntersections: resolveIntersections
});

function createIntersectionWorld() {
  return {
    dynamics: [],
    masks: [],
    statics: [],

    update(dt) {
      resolveIntersections(this.dynamics, this.statics, dt);
      computeIntersections(this.masks, this.statics);
    },

    render(ctx) {
      ctx.save();
      {
        // Draw static colliders.
        ctx.strokeStyle = 'green';

        for (let collider of this.statics) {
          ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
        } // Draw dynamic colliders.


        ctx.strokeStyle = 'lime';

        for (let collider of this.dynamics) {
          ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
        } // Draw mask colliders.


        ctx.strokeStyle = 'blue';

        for (let collider of this.masks) {
          switch (collider.type) {
            case 'point':
              ctx.save();
              {
                ctx.fillStyle = 'red';
                ctx.fillRect(collider.x - 1, collider.y - 1, 2, 2);
              }
              ctx.restore();
              break;

            case 'segment':
              ctx.beginPath();
              ctx.moveTo(collider.x, collider.y);
              ctx.lineTo(collider.x + collider.dx, collider.y + collider.dy);
              ctx.stroke();
              break;

            case 'aabb':
              ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
              break;
          }
        }
      }
      ctx.restore();
    }

  };
}

var IntersectionWorld = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createIntersectionWorld: createIntersectionWorld
});
const AUDIO_CONTEXT = new AudioContext();
autoUnlock(AUDIO_CONTEXT);
const AUDIO_ASSET_TAG = 'audio';

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

var Audio = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AUDIO_CONTEXT: AUDIO_CONTEXT,
  AUDIO_ASSET_TAG: AUDIO_ASSET_TAG,
  loadAudio: loadAudio
});
const MAX_FIXED_UPDATES = 250;
/**
 * @typedef Application
 * @property {Function} [start]
 * @property {Function} [stop]
 * @property {Function} [preUpdate]
 * @property {Function} [update]
 * @property {Function} [fixedUpdate]
 * @property {Function} [postUpdate]
 * @property {Function} [pause]
 * @property {Function} [resume]
 */

class ApplicationLoop {
  static currentTime() {
    return performance.now();
  }

  static start(app) {
    let result = new ApplicationLoop(app, false);
    result.start();
    return result;
  }
  /**
   * @param {Application} app The application object that holds all the executable logic.
   * @param {Boolean} [controlled = false] Whether the loop should NOT execute and manage itself.
   */


  constructor(app, controlled = false) {
    this.app = app;
    this._controlled = controlled;
    this._animationFrameHandle = null;
    this.prevFrameTime = 0;
    this.started = false;
    this.paused = false;
    this.fixedTimeStep = 1 / 60;
    this.prevAccumulatedTime = 0;
    this._onstart = null;
    this._onstop = null;
    this._onpreupdate = null;
    this._onupdate = null;
    this._onfixedupdate = null;
    this._onpostupdate = null;
    this._onpause = null;
    this._onresume = null;
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.onWindowFocus = this.onWindowFocus.bind(this);
    this.onWindowBlur = this.onWindowBlur.bind(this);
  }

  setFixedUpdatesPerSecond(count) {
    this.fixedTimeStep = 1 / count;
    return this;
  }

  onWindowFocus() {
    if (!this.started) return;
    this.resume();
  }

  onWindowBlur() {
    if (!this.started) return;
    this.pause();
  }
  /**
   * Runs the game loop. If this is a controlled game loop, it will call itself
   * continuously until stop() or pause().
   */


  onAnimationFrame(now) {
    if (this._controlled) throw new Error('Cannot run controlled game loop; call step() instead.');
    if (!this.started) throw new Error('Must be called after start().');
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.step(now);
  }
  /** Runs one update step for the game loop. This is usually called 60 times a second. */


  step(now = ApplicationLoop.currentTime()) {
    if (!this.started) return false;
    const deltaTime = now - this.prevFrameTime;
    this.prevFrameTime = now;
    if (this.paused) return false;
    if (this.app.preUpdate) this.app.preUpdate(deltaTime);
    if (this.app.update) this.app.update(deltaTime);
    this.prevAccumulatedTime += deltaTime / 1000;

    if (this.prevAccumulatedTime > MAX_FIXED_UPDATES * this.fixedTimeStep) {
      let max = MAX_FIXED_UPDATES * this.fixedTimeStep;
      let count = Math.floor((this.prevAccumulatedTime - max) / this.fixedTimeStep);
      this.prevAccumulatedTime = max;
      console.error(`[ApplicationLoop] Too many updates! Skipped ${count} fixed updates.`);
    }

    while (this.prevAccumulatedTime >= this.fixedTimeStep) {
      this.prevAccumulatedTime -= this.fixedTimeStep;
      if (this.app.fixedUpdate) this.app.fixedUpdate();
    }

    if (this.app.postUpdate) this.app.postUpdate(deltaTime);
  }
  /** Starts the game loop. Calls run(), unless recursive is set to false. */


  start() {
    if (this.started) throw new Error('Loop already started.'); // If the window is out of focus, just ignore the time.

    window.addEventListener('focus', this.onWindowFocus);
    window.addEventListener('blur', this.onWindowBlur);
    this.started = true;
    this.prevFrameTime = ApplicationLoop.currentTime();
    if (this.app.start) this.app.start();

    if (!this.controlled) {
      this.onAnimationFrame(this.prevFrameTime);
    }

    return this;
  }
  /** Stops the game loop. */


  stop() {
    if (!this.started) throw new Error('Loop not yet started.'); // If the window is out of focus, just ignore the time.

    window.removeEventListener('focus', this.onWindowFocus);
    window.removeEventListener('blur', this.onWindowBlur);
    this.started = false;
    if (this.app.stop) this.app.stop();

    if (!this._controlled) {
      if (this.animationFrameHandle) {
        cancelAnimationFrame(this.animationFrameHandle);
        this.animationFrameHandle = null;
      }
    }

    return this;
  }
  /** Pauses the game loop. */


  pause() {
    if (this.paused) return this;
    this.paused = true;
    if (this.app.pause) this.app.pause();
    return this;
  }
  /** Resumes the game loop. */


  resume() {
    if (!this.pause) return this; // This is an intentional frame skip (due to pause).

    this.prevFrameTime = ApplicationLoop.currentTime();
    this.paused = false;
    if (this.app.resume) this.app.resume();
    return this;
  }

}

class Game {
  constructor(context) {
    this.context = context;
    this.display = null;
    this.renderContext = null;
  }

  setDisplay(display) {
    this.display = display;
    this.renderContext = display.canvas.getContext('2d');
    return this;
  }
  /** @override */


  start() {
    this.context.start();
  }
  /** @override */


  update(dt) {
    this.context.update(dt);
    this.context.render(this.renderContext);
  }

}

const GAME_PROPERTY = Symbol('game');
const LOOP_PROPERTY = Symbol('loop');

function start(context) {
  let gameContext = { ...context
  };
  let game = new Game(gameContext);
  let loop = new ApplicationLoop(game);
  gameContext[GAME_PROPERTY] = game;
  gameContext[LOOP_PROPERTY] = loop;
  gameContext.display = null;
  window.addEventListener('DOMContentLoaded', () => {
    let display = document.querySelector('display-port');
    if (!display) throw new Error('Cannot find display-port in document.');
    game.setDisplay(display);
    gameContext.display = display;
    gameContext.load().then(() => loop.start());
  });
  return gameContext;
}

function stop(gameContext) {
  gameContext[LOOP_PROPERTY].stop();
  delete gameContext[GAME_PROPERTY];
  delete gameContext[LOOP_PROPERTY];
}

var Game$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  start: start,
  stop: stop
});
const DEFAULT_INFO = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
  color: 'dodgerblue',
  solid: true
};
const INFO_KEY = Symbol('BoxRendererInfo');

class BoxRenderer {
  static get Info() {
    return INFO_KEY;
  }

  static draw(ctx, targets, defaultInfo = undefined) {
    const defaults = defaultInfo ? { ...DEFAULT_INFO,
      ...defaultInfo
    } : DEFAULT_INFO;

    for (let target of targets) {
      const info = target[INFO_KEY];
      const x = resolveInfo('x', info, target, defaults);
      const y = resolveInfo('y', info, target, defaults);
      const width = resolveInfo('width', info, target, defaults);
      const height = resolveInfo('height', info, target, defaults);
      const color = resolveInfo('color', info, target, defaults);
      const solid = resolveInfo('solid', info, target, defaults);
      ctx.translate(x, y);
      {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (solid) {
          ctx.fillStyle = color;
          ctx.fillRect(-halfWidth, -halfHeight, width, height);
        } else {
          ctx.strokeStyle = color;
          ctx.strokeRect(-halfWidth, -halfHeight, width, height);
        }
      }
      ctx.translate(-x, -y);
    }
  }

}

function resolveInfo(param, info, target, defaults) {
  if (info) {
    if (param in info) {
      return info[param];
    } else if (param in target) {
      return target[param];
    } else {
      return defaults[param];
    }
  } else if (target) {
    if (param in target) {
      return target[param];
    } else {
      return defaults[param];
    }
  } else {
    return defaults[param];
  }
}

const DEFAULT_INFO$1 = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
  spriteImage: null
};
const INFO_KEY$1 = Symbol('SpriteRendererInfo');

class SpriteRenderer {
  static get Info() {
    return INFO_KEY$1;
  }

  static draw(ctx, targets, defaultInfo = undefined) {
    const defaults = defaultInfo ? { ...DEFAULT_INFO$1,
      ...defaultInfo
    } : DEFAULT_INFO$1;

    for (let target of targets) {
      const info = target[INFO_KEY$1];
      const x = resolveInfo$1('x', info, target, defaults);
      const y = resolveInfo$1('y', info, target, defaults);
      const spriteImage = resolveInfo$1('spriteImage', info, target, defaults);

      if (spriteImage) {
        const width = spriteImage.width;
        const height = spriteImage.height;
        ctx.translate(x, y);
        {
          const halfWidth = width / 2;
          const halfHeight = height / 2;
          ctx.drawImage(spriteImage, -halfWidth, -halfHeight);
        }
        ctx.translate(-x, -y);
      } else {
        const width = 10;
        const height = 10;
        ctx.translate(x, y);
        {
          const halfWidth = width / 2;
          const halfHeight = height / 2;
          ctx.strokeStyle = 'black';
          ctx.strokeRect(-halfWidth, -halfHeight, width, height);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.strokeText('?', 0, 0, width);
        }
        ctx.translate(-x, -y);
      }
    }
  }

}

function resolveInfo$1(param, info, target, defaults) {
  if (info) {
    if (param in info) {
      return info[param];
    } else if (param in target) {
      return target[param];
    } else {
      return defaults[param];
    }
  } else if (target) {
    if (param in target) {
      return target[param];
    } else {
      return defaults[param];
    }
  } else {
    return defaults[param];
  }
} // https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

/**
 * @typedef Bounds
 * @property {Number} x The center x position.
 * @property {Number} y The center y position.
 * @property {Number} rx The half width of the bounds.
 * @property {Number} ry The half height of the bounds.
 */


const MAX_OBJECTS = 10;
const MAX_LEVELS = 5;
/**
 * A quadtree to help your sort boxes by proximity (in quadrants). Usually, this is used
 * like this:
 * 1. Clear the tree to be empty.
 * 2. Add all the boxes. They should be in the shape of {@link Bounds}.
 * 3. For each target box you want to check for, call {@link retrieve()}.
 * 4. The previous function should return a list of potentially colliding boxes. This is
 * where you should use a more precise intersection test to accurately determine if the
 * result is correct.
 * 
 * ```js
 * // Here is an example
 * quadTree.clear();
 * quadTree.insertAll(boxes);
 * let out = [];
 * for(let box of boxes)
 * {
 *   quadTree.retrieve(box, out);
 *   for(let other of out)
 *   {
 *     // Found a potential collision between box and other.
 *     // Run your collision detection algorithm for them here.
 *   }
 *   out.length = 0;
 * }
 * ```
 */

class QuadTree {
  /**
   * Creates bounds for the given dimensions.
   * 
   * @param {Number} x The center x position.
   * @param {Number} y The center y position.
   * @param {Number} rx The half width of the bounds.
   * @param {Number} ry The half height of the bounds.
   * @returns {Bounds} The newly created bounds.
   */
  static createBounds(x, y, rx, ry) {
    return {
      x,
      y,
      rx,
      ry
    };
  }
  /**
   * Constructs an empty quadtree.
   * 
   * @param {Number} [level] The root level for this tree.
   * @param {Bounds} [bounds] The bounds of this tree.
   */


  constructor(level = 0, bounds = QuadTree.createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)) {
    this.level = level;
    this.bounds = bounds;
    this.boxes = [];
    this.nodes = new Array(4);
  }
  /**
   * Inserts all the boxes into the tree.
   * 
   * @param {Array<Buonds>} boxes A list of boxes.
   */


  insertAll(boxes) {
    for (let box of boxes) {
      this.insert(box);
    }
  }
  /**
   * Inserts the box into the tree.
   * 
   * @param {Bounds} box A box.
   */


  insert(box) {
    let hasNode = this.nodes[0];

    if (hasNode) {
      let quadIndex = this.findQuadIndex(box);

      if (quadIndex >= 0) {
        this.nodes[quadIndex].insert(box);
        return;
      }
    }

    this.boxes.push(box);

    if (this.boxes.length > MAX_OBJECTS && this.level < MAX_LEVELS) {
      if (!hasNode) this.split();

      for (let i = this.boxes.length - 1; i >= 0; --i) {
        let otherBox = this.boxes[i];
        let quadIndex = this.findQuadIndex(otherBox);

        if (quadIndex >= 0) {
          this.boxes.splice(i, 1);
          this.nodes[quadIndex].insert(otherBox);
        }
      }
    }
  }
  /**
   * Retrieves all the near boxes for the target.
   * 
   * @param {Bounds} box The target box to get all near boxes for.
   * @param {Array<Bounds>} [out=[]] The list to append results to.
   * @param {Object} [opts] Any additional options.
   * @param {Boolean} [opts.includeSelf=false] Whether to include the
   * target in the result list.
   * @returns {Array<Bounds>} The appended list of results.
   */


  retrieve(box, out = [], opts = {}) {
    const {
      includeSelf = false
    } = opts;

    if (this.nodes[0]) {
      let quadIndex = this.findQuadIndex(box);

      if (quadIndex >= 0) {
        this.nodes[quadIndex].retrieve(box, out);
      }
    }

    let boxes = this.boxes;

    if (!includeSelf) {
      // Append all elements before the index (or none, if not found)...
      let targetIndex = boxes.indexOf(box);

      for (let i = 0; i < targetIndex; ++i) {
        out.push(boxes[i]);
      } // Append all elements after the index (or from 0, if not found)...


      let length = boxes.length;

      for (let i = targetIndex + 1; i < length; ++i) {
        out.push(boxes[i]);
      }
    } else {
      out.push(...boxes);
    }

    return out;
  }
  /**
   * Removes all boxes form the tree.
   */


  clear() {
    this.boxes.length = 0;

    for (let i = 0; i < this.nodes.length; ++i) {
      let node = this.nodes[i];

      if (node) {
        node.clear();
        this.nodes[i] = null;
      }
    }
  }
  /** @private */


  split() {
    let {
      x,
      y,
      rx,
      ry
    } = this.bounds;
    let nextLevel = this.level + 1;
    let ChildConstructor = this.constructor;
    this.nodes[0] = new ChildConstructor(nextLevel, QuadTree.createBounds(x + rx, y, rx, ry));
    this.nodes[1] = new ChildConstructor(nextLevel, QuadTree.createBounds(x, y, rx, ry));
    this.nodes[2] = new ChildConstructor(nextLevel, QuadTree.createBounds(x, y + ry, rx, ry));
    this.nodes[3] = new ChildConstructor(nextLevel, QuadTree.createBounds(x + rx, y + ry, rx, ry));
  }
  /** @private */


  findQuadIndex(box) {
    const {
      x: bx,
      y: by,
      rx: brx,
      ry: bry
    } = this.bounds;
    const midpointX = bx + brx;
    const midpointY = by + bry;
    const {
      x,
      y,
      rx,
      ry
    } = box;
    const isTop = y < midpointY && y + ry * 2 < midpointY;
    const isBottom = y > midpointY;
    const isLeft = x < midpointX && x + rx * 2 < midpointX;
    const isRight = x > midpointX;
    let index = -1;

    if (isLeft) {
      if (isTop) {
        index = 1;
      } else if (isBottom) {
        index = 2;
      }
    } else if (isRight) {
      if (isTop) {
        index = 0;
      } else if (isBottom) {
        index = 3;
      }
    }

    return index;
  }

}

function createHitResult(x, y, dx, dy, nx, ny, time) {
  return {
    x,
    y,
    dx,
    dy,
    nx,
    ny,
    time
  };
}

function intersectAxisAlignedBoundingBox(a, b) {
  let dx = b.x - a.x;
  let px = b.rx + a.rx - Math.abs(dx);
  if (px < 0) return null;
  let dy = b.y - a.y;
  let py = b.ry + a.ry - Math.abs(dy);
  if (py < 0) return null;

  if (px < py) {
    let sx = Math.sign(dx);
    return createHitResult(a.x + a.rx * sx, b.y, px * sx, 0, sx, 0, 0);
  } else {
    let sy = Math.sign(dy);
    return createHitResult(b.x, a.y + a.ry * sy, 0, py * sy, 0, sy, 0);
  }
}
/**
 * @typedef Mask
 * @property {Object} owner
 * @property {String} name
 * @property {AxisAlignedBoundingBox} box
 * @property {Function} get
 */


function createMask(owner, name, box, get) {
  return {
    owner,
    name,
    box,
    get
  };
}
/**
 * The property key for masks to keep count of how many are
 * still available.
 */


const MASK_COUNT = Symbol('maskCount');
/** An axis-aligned graph for effeciently solving box collisions. */

class AxisAlignedBoundingBoxGraph {
  /**
   * Constructs an empty graph.
   * 
   * @param {Object} [opts={}] Any additional options.
   */
  constructor(opts = {}) {
    /** @type {Map<*, Record<String, Mask>>} */
    this.masks = new Map();
    /** @type {Set<AxisAlignedBoundingBox>} */

    this.boxes = new Set(); // Used to store dynamic mask data and provide constant lookup.

    this.dynamics = new Map(); // Used for efficiently pruning objects when solving.

    this.quadtree = new QuadTree();
  }

  add(owner, maskName, maskValues = {}) {
    let mask = createMask(owner, maskName, null, null);

    if (!this.masks.has(owner)) {
      this.masks.set(owner, {
        [MASK_COUNT]: 1,
        [maskName]: mask
      });
    } else if (!(maskName in this.masks.get(owner))) {
      let ownedMasks = this.masks.get(owner);
      ownedMasks[maskName] = mask;
      ownedMasks[MASK_COUNT]++;
    } else {
      throw new Error(`Mask ${maskName} already exists for owner.`);
    }

    if (Array.isArray(maskValues)) {
      const x = maskValues[0] || 0;
      const y = maskValues[1] || 0;
      const rx = maskValues[2] / 2 || 0;
      const ry = maskValues[3] / 2 || 0;
      let box = new AxisAlignedBoundingBox(this, mask, x, y, rx, ry);
      this.boxes.add(box);
      mask.box = box;
    } else if (typeof maskValues === 'object') {
      let x = maskValues.x || 0;
      let y = maskValues.y || 0;
      let rx = maskValues.rx || maskValues.width / 2 || 0;
      let ry = maskValues.ry || maskValues.height / 2 || 0;

      if (typeof owner === 'object') {
        if (!x) x = owner.x || 0;
        if (!y) y = owner.y || 0;
        if (!rx) rx = owner.width / 2 || 0;
        if (!ry) ry = owner.height / 2 || 0;
      }

      let box = new AxisAlignedBoundingBox(this, mask, x, y, rx, ry);
      this.boxes.add(box);
      mask.box = box;

      if ('get' in maskValues) {
        mask.get = maskValues.get;
        mask.get(box, owner);
        this.dynamics.set(mask, {
          halfdx: 0,
          halfdy: 0
        });
      }
    } else if (typeof maskValues === 'function') {
      let box = new AxisAlignedBoundingBox(this, mask, 0, 0, 0, 0);
      this.boxes.add(box);
      mask.box = box;
      mask.get = maskValues;
      mask.get(box, owner);
      this.dynamics.set(mask, {
        halfdx: 0,
        halfdy: 0
      });
    } else {
      throw new Error('Invalid mask option type.');
    }
  }
  /**
   * @returns {Boolean} Whether the mask for the given name exists and was
   * removed from the owner.
   */


  remove(owner, maskName) {
    if (this.masks.has(owner)) {
      let ownedMasks = this.masks.get(owner);
      let mask = ownedMasks[maskName];

      if (mask) {
        if (mask.get) this.dynamics.delete(mask);
        this.boxes.delete(mask.box);
        ownedMasks[maskName] = null;
        let count = --ownedMasks[MASK_COUNT];

        if (count <= 0) {
          this.masks.delete(owner);
        }

        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  /** @returns {Mask} The owned mask for the given name. */


  get(owner, maskName) {
    if (this.masks.has(owner)) {
      return this.masks.get(owner)[maskName];
    } else {
      return null;
    }
  }
  /** @returns {Number} The number of masks that belong to the owner. */


  count(owner) {
    if (this.masks.has(owner)) {
      return this.masks.get(owner)[MASK_COUNT];
    } else {
      return 0;
    }
  }

  clear() {
    this.boxes.clear();
    this.masks.clear();
    this.dynamics.clear();
    this.quadtree.clear();
  }
  /**
   * Solves the current graph for collisions.
   * 
   * @param {Array<Object>} [targets=undefined] A list of active target to solve
   * for. If undefined or null, it will solve collisions using all boxes as
   * active targets. This can be used to prune box collisions that are not
   * relevant, or "active".
   * @returns {Array<CollisionResult>} The collisions found in the current graph.
   */


  solve(targets = undefined) {
    // Update dynamic boxes to include motions
    for (let mask of this.dynamics.keys()) {
      let {
        box,
        owner
      } = mask;
      let x0 = box.x;
      let y0 = box.y;
      mask.get(box, owner);
      let dynamics = this.dynamics.get(mask);
      let halfMotionX = (box.x - x0) / 2;
      let halfMotionY = (box.y - y0) / 2;
      dynamics.halfMotionX = halfMotionX;
      dynamics.halfMotionY = halfMotionY;
      box.x -= halfMotionX;
      box.y -= halfMotionY;
      box.rx += Math.abs(halfMotionX);
      box.ry += Math.abs(halfMotionY);
    }

    if (typeof targets === 'undefined' || targets === null) {
      targets = this.masks.keys();
    }

    let result = [];
    let quadtree = this.quadtree;
    quadtree.clear();
    quadtree.insertAll(this.boxes); // Revert dynamic boxes back to their original dimensions

    for (let mask of this.dynamics.keys()) {
      const {
        box
      } = mask;
      const {
        halfMotionX,
        halfMotionY
      } = this.dynamics.get(mask);
      box.x += halfMotionX;
      box.y += halfMotionY;
      box.rx -= Math.abs(halfMotionX);
      box.ry -= Math.abs(halfMotionY);
    }

    let others = [];

    for (let owner of targets) {
      let ownedMasks = Object.values(this.masks.get(owner));

      for (let mask of ownedMasks) {
        const {
          box
        } = mask;
        quadtree.retrieve(box, others);
        let dx = 0;
        let dy = 0;

        if (this.dynamics.has(mask)) {
          const {
            halfMotionX,
            halfMotionY
          } = this.dynamics.get(mask);
          dx = halfMotionX * 2;
          dy = halfMotionY * 2;
        }

        for (let other of others) {
          let hit = intersectAxisAlignedBoundingBox(box, other);

          if (hit) {
            result.push({
              owner,
              other: other.mask.owner,
              ownerMask: mask,
              otherMask: other.mask,
              hit,
              dx,
              dy
            });
          }
        }

        others.length = 0;
      }
    }

    return result;
  }

}
/**
 * A representative bounding box to keep positional and
 * dimensional metadata for any object in the
 * {@link AxisAlignedBoundingBoxGraph}.
 */


class AxisAlignedBoundingBox {
  constructor(aabbGraph, mask, x, y, rx, ry) {
    this.aabbGraph = aabbGraph;
    this.mask = mask;
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  setSize(width, height) {
    return this.setHalfSize(width / 2, height / 2);
  }

  setHalfSize(rx, ry) {
    this.rx = rx;
    this.ry = ry;
    return this;
  }

}
/**
 * Tests whether either {@link AxisAlignedBoundingBox} intersect one another.
 * 
 * @param {AxisAlignedBoundingBox} a A box.
 * @param {AxisAlignedBoundingBox} b Another box in the same graph.
 * @returns {Boolean} If either box intersects the other.
 */


function testAxisAlignedBoundingBox(a, b) {
  return !(Math.abs(a.x - b.x) > a.rx + b.rx) && !(Math.abs(a.y - b.y) > a.ry + b.ry);
}
/**
 * TODO: Change to use ref instead of names.
 * Use REFERENCES as keys, instead of strings.
 * - This way, we can enforce depedencies throught import.
 * - The benefits of strings is the loose coupling, but
 * this only allow us to add additional functionality,
 * which, if components are optimized which they should be,
 * then it can be easily done by create a Position2 instead.
 */

/**
 * TODO: Enforce 1 component only.
 * There should only always be 1 component per entity, that way
 * when you implement Transform, you only have to worry about 1
 * of them. Not ALL components should be able to support multiple
 * per entity.
 * 
 * BUT, some do. So we need a way to allow for MultiComponents,
 * which are arrays of components, identified by some index/id.
 */

/**
 * TODO: Components should init from template.
 * Delay any architectural decisions as late as possible. So let's
 * not dictate how to setup a component.
 */

/**
 * @typedef {String} EntityId
 */


const DEFAULT_PROPS = {};
/**
 * Handles all entity and component mappings.
 */

class EntityManager {
  /**
   * Constructs an empty entity manager with the given factories.
   * 
   * @param {Object} [opts={}] Any additional options.
   * @param {Object} [opts.componentFactoryMap={}] An object map of each component to its factory.
   * @param {Boolean} [opts.strictMode=false] Whether to enable error checking (and throwing).
   */
  constructor(opts = {}) {
    const {
      componentFactoryMap = {},
      strictMode = false
    } = opts;
    let factoryMap = {};
    let instances = {};

    for (let componentName in componentFactoryMap) {
      let factoryOption = componentFactoryMap[componentName];
      let create, destroy;

      try {
        create = 'create' in factoryOption ? factoryOption.create : typeof factoryOption === 'function' ? factoryOption : null;
        destroy = 'destroy' in factoryOption ? factoryOption.destroy : null;
      } catch (e) {
        throw new Error('Unsupported component factory options.');
      }

      factoryMap[componentName] = {
        owner: factoryOption,
        create,
        destroy
      };
      instances[componentName] = {};
    }

    this.factoryMap = factoryMap;
    this.instances = instances;
    this.entities = new Set();
    this.nextAvailableEntityId = 1;
    this.strictMode = strictMode;
  }

  create(entityId = undefined) {
    if (typeof entityId !== 'undefined') {
      if (typeof entityId !== 'string') {
        throw new Error('Invalid type for entity id - must be a string.');
      }
    } else {
      entityId = String(this.nextAvailableEntityId++);
    }

    if (!this.entities.has(entityId)) {
      this.entities.add(entityId);
      return entityId;
    } else {
      throw new Error(`Invalid duplicate entity id '${entityId}' allocated for new entity.`);
    }
  }

  destroy(entityId) {
    for (let componentName in this.instances) {
      this.remove(componentName, entityId);
    }

    this.entities.delete(entityId);
  }

  add(componentName, entityId, props = undefined) {
    if (!(componentName in this.factoryMap)) {
      if (this.strictMode) {
        throw new Error(`Missing component factory for '${componentName}'.`);
      } else {
        this.factoryMap[componentName] = {
          owner: {},
          create: null,
          destroy: null
        };
        this.instances[componentName] = {};
      }
    }

    if (!(componentName in this.instances)) {
      throw new Error(`Missing component instance mapping for '${componentName}'.`);
    }

    if (!this.entities.has(entityId)) {
      throw new Error(`Entity '${entityId}' does not exist.`);
    }

    if (this.instances[componentName][entityId]) {
      throw new Error(`Entity already has component '${componentName}'.`);
    }

    const {
      create
    } = this.factoryMap[componentName];
    let result = create ? create(typeof props !== 'undefined' ? props : DEFAULT_PROPS, entityId, this) : props ? { ...props
    } : {};

    if (result) {
      this.instances[componentName][entityId] = result;
    }
  }

  remove(componentName, entityId) {
    if (!(componentName in this.factoryMap)) {
      if (this.strictMode) {
        throw new Error(`Missing component factory for '${componentName}'.`);
      } else {
        return;
      }
    }

    if (!(componentName in this.instances)) {
      throw new Error(`Missing component instance mapping for '${componentName}'.`);
    }

    let entityComponents = this.instances[componentName];
    let componentValues = entityComponents[entityId];

    if (componentValues) {
      entityComponents[entityId] = null;
      const {
        destroy
      } = this.factoryMap[componentName];
      if (destroy) destroy(componentValues, entityId, this);
    }
  }
  /**
   * Finds the component for the given entity.
   * 
   * @param {String} componentName The name of the target component.
   * @param {EntityId} entityId The id of the entity to look in.
   * @returns {Object} The component found. If it does not exist, null
   * is returned instead.
   */


  get(componentName, entityId) {
    if (!(componentName in this.instances)) {
      throw new Error(`Missing component instance mapping for '${componentName}'.`);
    }

    const entityComponents = this.instances[componentName];
    return entityComponents[entityId] || null;
  }
  /**
   * Checks whether the entity has the component.
   * 
   * @param {String} componentName The name of the target component.
   * @param {EntityId} entityId The id of the entity to look in.
   * @returns {Boolean} Whether the component exists for the entity.
   */


  has(componentName, entityId) {
    return componentName in this.instances && Boolean(this.instances[componentName][entityId]);
  }

  clear(componentName) {
    if (!(componentName in this.factoryMap)) {
      if (this.strictMode) {
        throw new Error(`Missing component factory for '${componentName}'.`);
      } else {
        return;
      }
    }

    if (!(componentName in this.instances)) {
      throw new Error(`Missing component instance mapping for '${componentName}'.`);
    }

    let entityComponents = this.instances[componentName];
    const {
      destroy
    } = this.factoryMap[componentName];

    if (destroy) {
      for (let entityId in entityComponents) {
        let componentValues = entityComponents[entityId];
        entityComponents[entityId] = null;
        destroy(componentValues, componentName, entityId, this);
      }
    }

    this.instances[componentName] = {};
  }
  /**
   * Gets all the entity ids.
   * 
   * @returns {Set<EntityId>} The set of entity ids.
   */


  getEntityIds() {
    return this.entities;
  }

  getComponentFactory(componentName) {
    if (componentName in this.factoryMap) {
      return this.factoryMap[componentName].owner;
    } else {
      return null;
    }
  }

  getComponentNames() {
    return Object.keys(this.factoryMap);
  }

  getComponentEntityIds(componentName) {
    if (componentName in this.instances) {
      return Object.keys(this.instances[componentName]);
    } else {
      return [];
    }
  }

  getComponentInstances(componentName) {
    if (componentName in this.instances) {
      return Object.values(this.instances[componentName]);
    } else {
      return [];
    }
  }

}

const MAX_DEPTH_LEVEL = 100;
/**
 * @callback WalkCallback Called for each node, before traversing its children.
 * @param {Object} child The current object.
 * @param {SceneNode} childNode The representative node for the current object.
 * @returns {WalkBackCallback|Boolean} If false, the walk will skip
 * the current node's children. If a function, it will be called after
 * traversing down all of its children.
 * 
 * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
 * traversing the current node's children.
 * @param {Object} child The current object.
 * @param {SceneNode} childNode The representative node for the current object.
 * 
 * @callback WalkChildrenCallback Called for each level of children, before
 * traversing its children. This is usually used to determine visit order.
 * @param {Array<SceneNode>} childNodes A mutable list of child nodes to be
 * visited.
 * @param {SceneNode} childNode The representative node for the current object.
 * This is also the parent of these children.
 */

/**
 * A tree-like graph of nodes with n-children.
 */

class SceneGraph {
  /**
   * Constructs an empty scene graph with nodes to be created from the given constructor.
   * 
   * @param {Object} [opts] Any additional options.
   * @param {typeof SceneNode} [opts.nodeConstructor] The scene node constructor that make up the graph.
   */
  constructor(opts = {}) {
    this.nodeConstructor = opts.nodeConstructor || SceneNode;
    this.nodes = new Map();
    this.rootNodes = [];
  }
  /**
   * Adds an object to the scene graph.
   * 
   * @param {Object} child The child object to add.
   * @param {Object} [parent=null] The parent object to add the child under. If null,
   * the child will be inserted under the root node.
   * @returns {SceneNode} The scene node that represents the added child object.
   */


  add(child, parent = null) {
    if (child === null) throw new Error('Cannot add null as child to scene graph.');

    if (parent === null || this.nodes.has(parent)) {
      let parentNode = parent === null ? null : this.nodes.get(parent);

      if (this.nodes.has(child)) {
        let childNode = this.nodes.get(child);
        detach(childNode.parentNode, childNode, this);
        attach(parentNode, childNode, this);
        return childNode;
      } else {
        let childNode = new this.nodeConstructor(this, child, null, []);
        this.nodes.set(child, childNode);
        attach(parentNode, childNode, this);
        return childNode;
      }
    } else {
      throw new Error('No node in scene graph exists for parent.');
    }
  }
  /**
   * Removes an object from the scene graph, along with all
   * of its descendents.
   * 
   * @param {Object} child The child object to remove. If null, will clear
   * the entire graph.
   * @returns {Boolean} Whether any objects were removed from the scene.
   */


  remove(child) {
    if (child === null) {
      this.clear();
      return true;
    } else if (this.nodes.has(child)) {
      let childNode = this.nodes.get(child);
      let parentNode = childNode.parentNode;
      detach(parentNode, childNode, this);
      walkImpl(this, childNode, 0, descendent => {
        this.nodes.delete(descendent);
      });
      return true;
    } else {
      return false;
    }
  }
  /**
   * Replaces the target object with the new child object in the graph,
   * inheriting its parent and children.
   * 
   * @param {Object} target The target object to replace. Cannot be null.
   * @param {Object} child The object to replace with. If null,
   * it will remove the target and the target's parent will adopt
   * its grandchildren.
   */


  replace(target, child) {
    if (target === null) throw new Error('Cannot replace null for child in scene graph.');

    if (this.nodes.has(target)) {
      let targetNode = this.nodes.get(target);
      let targetParent = targetNode.parentNode;
      let targetChildren = [...targetNode.childNodes]; // Remove target node from the graph

      detach(targetParent, targetNode, this); // Begin grafting the grandchildren by first removing...

      targetNode.childNodes.length = 0;

      if (child === null) {
        // Reattach all grandchildren to target parent.
        if (targetParent === null) {
          // As root children.
          this.rootNodes.push(...targetChildren);
        } else {
          // As regular children.
          targetParent.childNodes.push(...targetChildren);
        }
      } else {
        // Reattach all grandchildren to new child.
        let childNode;

        if (this.nodes.has(child)) {
          childNode = this.nodes.get(child); // Remove child node from prev parent

          detach(childNode.parentNode, childNode, this); // ...and graft them back.

          childNode.childNodes.push(...targetChildren);
        } else {
          childNode = new this.nodeConstructor(this, child, null, targetChildren);
          this.nodes.set(child, childNode);
        } // And reattach target parent to new child.


        attach(targetParent, childNode, this);
      } // ...and graft them back.


      for (let targetChild of targetChildren) {
        targetChild.parentNode = targetParent;
      }

      return child;
    } else if (target === null) {
      return this.replace(this.root.owner, child);
    } else {
      throw new Error('Cannot find target object to replace in scene graph.');
    }
  }
  /** Removes all nodes from the graph. */


  clear() {
    this.nodes.clear();
    this.rootNodes.length = 0;
  }
  /**
   * Gets the scene node for the given object.
   * 
   * @param {Object} child The object to retrieve the node for.
   * @returns {SceneNode} The scene node that represents the object.
   */


  get(child) {
    return this.nodes.get(child);
  }
  /**
   * Walks through every child node in the graph for the given
   * object's associated node.
   * 
   * @param {WalkCallback} callback The function called for each node
   * in the graph, in ordered traversal from parent to child.
   * @param {Object} [opts={}] Any additional options.
   * @param {Boolean} [opts.childrenOnly=true] Whether to skip traversing
   * the first node, usually the root, and start from its children instead.
   * @param {Function} [opts.childrenCallback] The function called before
   * walking through the children. This is usually used to determine the
   * visiting order.
   */


  walk(from, callback, opts = {}) {
    const {
      childrenOnly = true,
      childrenCallback
    } = opts;

    if (from === null) {
      sortChildrenForWalk(this.nodes, this.rootNodes, null, childrenCallback);

      for (let childNode of this.rootNodes) {
        walkImpl(this, childNode, 0, callback, childrenCallback);
      }
    } else {
      const fromNode = this.get(from);

      if (!fromNode) {
        if (childrenOnly) {
          sortChildrenForWalk(this.nodes, fromNode.childNodes, fromNode, childrenCallback);

          for (let childNode of fromNode.childNodes) {
            walkImpl(this, childNode, 0, callback, childrenCallback);
          }
        } else {
          walkImpl(this, fromNode, 0, callback, childrenCallback);
        }
      } else {
        throw new Error('No node in scene graph exists for walk start.');
      }
    }
  }

}

function attach(parentNode, childNode, sceneGraph) {
  if (parentNode === null) {
    sceneGraph.rootNodes.push(childNode);
    childNode.parentNode = null;
  } else {
    parentNode.childNodes.push(childNode);
    childNode.parentNode = parentNode;
  }
}

function detach(parentNode, childNode, sceneGraph) {
  if (parentNode === null) {
    let index = sceneGraph.rootNodes.indexOf(childNode);
    sceneGraph.rootNodes.splice(index, 1);
    childNode.parentNode = undefined;
  } else {
    let index = parentNode.childNodes.indexOf(childNode);
    parentNode.childNodes.splice(index, 1);
    childNode.parentNode = undefined;
  }
}
/**
 * Walk down from the parent and through all its descendents.
 * 
 * @param {SceneNode} parentNode The parent node to start walking from.
 * @param {Number} level The current call depth level. This is used to limit the call stack.
 * @param {WalkCallback} nodeCallback The function called on each visited node.
 * @param {WalkChildrenCallback} [childrenCallback] The function called before
 * walking through the children. This is usually used to determine the visiting order.
 */


function walkImpl(sceneGraph, parentNode, level, nodeCallback, childrenCallback = undefined) {
  if (level >= MAX_DEPTH_LEVEL) return;
  let result = nodeCallback(parentNode.owner, parentNode);
  if (result === false) return;
  let nextNodes = parentNode.childNodes;

  if (childrenCallback) {
    sortChildrenForWalk(sceneGraph.nodes, nextNodes, parentNode, childrenCallback);
  }

  for (let childNode of nextNodes) {
    walkImpl(childNode, level + 1, nodeCallback);
  }

  if (typeof result === 'function') {
    result(parentNode.owner, parentNode);
  }
}

function sortChildrenForWalk(nodeMapping, childNodes, parentNode, childrenCallback) {
  let nextChildren = childNodes.map(node => node.owner);
  childrenCallback(nextChildren, parentNode);

  for (let i = 0; i < nextChildren.length; ++i) {
    childNodes[i] = nodeMapping.get(nextChildren[i]);
  }

  childNodes.length = nextChildren.length;
}
/**
 * A representative node to keep relational metadata for any object in
 * the {@link SceneGraph}.
 */


class SceneNode {
  /**
   * Constructs a scene node with the given parent and children. This assumes
   * the given parent and children satisfy the correctness constraints of the
   * graph. In other words, This does not validate nor modify other nodes,
   * such as its parent or children, to maintain correctness. That must be
   * handled externally.
   * 
   * @param {SceneGraph} sceneGraph The scene graph this node belongs to.
   * @param {Object} owner The owner object.
   * @param {SceneNode} parentNode The parent node.
   * @param {Array<SceneNode>} childNodes The list of child nodes.
   */
  constructor(sceneGraph, owner, parentNode, childNodes) {
    this.sceneGraph = sceneGraph;
    this.owner = owner;
    this.parentNode = parentNode;
    this.childNodes = childNodes;
  }

}

const ORIGIN = vec3.fromValues(0, 0, 0);
const XAXIS = vec3.fromValues(1, 0, 0);
const YAXIS = vec3.fromValues(0, 1, 0);
const ZAXIS = vec3.fromValues(0, 0, 1);

function create$1() {
  return {
    translation: vec3.create(),
    rotation: quat.create(),
    scale: vec3.fromValues(1, 1, 1)
  };
}
/** This is the INVERSE of gluLookAt(). */


function lookAt(transform, target = ORIGIN) {
  const result = vec3.create();
  vec3.subtract(result, target, transform.position);
  vec3.normalize(result, result);
  const dotProduct = vec3.dot(ZAXIS, result);

  if (Math.abs(dotProduct - -1) < Number.EPSILON) {
    quat.set(transform.rotation, 0, 0, 1, Math.PI);
    return transform;
  }

  if (Math.abs(dotProduct - 1) < Number.EPSILON) {
    quat.set(transform.rotation, 0, 0, 0, 1);
    return transform;
  }

  vec3.cross(result, ZAXIS, result);
  vec3.normalize(result, result);
  const halfAngle = Math.acos(dotProduct) / 2;
  const sineAngle = Math.sin(halfAngle);
  transform.rotation[0] = result[0] * sineAngle;
  transform.rotation[1] = result[1] * sineAngle;
  transform.rotation[2] = result[2] * sineAngle;
  transform.rotation[3] = Math.cos(halfAngle);
  return transform;
}

function getTransformationMatrix(transform, dst = mat4.create()) {
  return mat4.fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
}

function getForwardVector(transform, dst = vec3.create()) {
  vec3.transformQuat(dst, ZAXIS, transform.rotation);
  return dst;
}

function getUpVector(transform, dst = vec3.create()) {
  vec3.transformQuat(dst, YAXIS, transform.rotation);
  return dst;
}

function getRightVector(transform, dst = vec3.create()) {
  vec3.transformQuat(dst, XAXIS, transform.rotation);
  return dst;
}

var Transform = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ORIGIN: ORIGIN,
  XAXIS: XAXIS,
  YAXIS: YAXIS,
  ZAXIS: ZAXIS,
  create: create$1,
  lookAt: lookAt,
  getTransformationMatrix: getTransformationMatrix,
  getForwardVector: getForwardVector,
  getUpVector: getUpVector,
  getRightVector: getRightVector
});

class SceneGraph$1 {
  constructor() {
    this.root = this.createSceneNode(create$1(), null);
  }

  update() {
    this.root.updateWorldMatrix();
  }

  createSceneNode(transform = create$1(), parent = this.root) {
    const result = {
      sceneGraph: this,
      transform,
      localMatrix: mat4.create(),
      worldMatrix: mat4.create(),
      parent: null,
      children: [],

      setParent(sceneNode) {
        if (this.parent) {
          const index = this.parent.children.indexOf(this);
          this.parent.children.splice(index, 1);
        }

        if (sceneNode) {
          sceneNode.children.push(this);
        }

        this.parent = parent;
        return this;
      },

      updateWorldMatrix(parentWorldMatrix) {
        // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
        // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
        // recompute the matrix prevents this.
        getTransformationMatrix(this.transform, this.localMatrix);

        if (parentWorldMatrix) {
          mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
        } else {
          mat4.copy(this.worldMatrix, this.localMatrix);
        }

        for (const child of this.children) {
          child.updateWorldMatrix(this.worldMatrix);
        }
      }

    };

    if (parent) {
      result.setParent(parent);
    }

    return result;
  }

}

function create$1$1(position, texcoord, normal, indices, color = undefined) {
  if (!color) {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    color = [];

    for (let i = 0; i < position.length; i += 3) {
      color.push(r, g, b);
    }
  }

  return {
    position,
    texcoord,
    normal,
    indices,
    color,
    elementSize: 3,
    elementCount: indices.length
  };
}

function applyColor(r, g, b, geometry) {
  for (let i = 0; i < geometry.color.length; i += 3) {
    geometry.color[i + 0] = r;
    geometry.color[i + 1] = g;
    geometry.color[i + 2] = b;
  }

  return geometry;
}

function applyTransformation(transformationMatrix, geometry) {
  const position = geometry.position;
  const normal = geometry.normal;
  const inverseTransposeMatrix = mat3.create();
  mat3.normalFromMat4(inverseTransposeMatrix, transformationMatrix);
  const result = vec3.create();

  for (let i = 0; i < position.length; i += 3) {
    result[0] = position[i + 0];
    result[1] = position[i + 1];
    result[2] = position[i + 2];
    vec3.transformMat4(result, result, transformationMatrix);
    position[i + 0] = result[0];
    position[i + 1] = result[1];
    position[i + 2] = result[2];
    result[0] = normal[i + 0];
    result[1] = normal[i + 1];
    result[2] = normal[i + 2];
    vec3.transformMat3(result, result, inverseTransposeMatrix);
    normal[i + 0] = result[0];
    normal[i + 1] = result[1];
    normal[i + 2] = result[2];
  }

  return geometry;
}

function joinGeometry(...geometries) {
  const position = [];
  const texcoord = [];
  const normal = [];
  const indices = [];
  const color = [];
  let indexCount = 0;

  for (const geometry of geometries) {
    position.push(...geometry.position);
    texcoord.push(...geometry.texcoord);
    normal.push(...geometry.normal);
    color.push(...geometry.color);
    indices.push(...geometry.indices.map(value => value + indexCount));
    indexCount += geometry.position.length / 3;
  }

  return create$1$1(position, texcoord, normal, indices, color);
}

function create$2(centered = false) {
  const x = 0;
  const y = 0;
  const z = 0;
  const width = 1;
  const height = 1;
  let position;

  if (centered) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    position = [x - halfWidth, y - halfHeight, z, x + halfWidth, y - halfHeight, z, x - halfWidth, y + halfHeight, z, x + halfWidth, y + halfHeight, z];
  } else {
    position = [x, y, z, x + width, y, z, x, y + height, z, x + width, y + height, z];
  }

  const texcoord = [0, 0, 1, 0, 0, 1, 1, 1];
  const normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  const indices = [0, 1, 2, 2, 1, 3];
  return create$1$1(position, texcoord, normal, indices);
}

var QuadGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$2
});

function create$3(doubleSided = true) {
  const frontPlane = create$2(true);

  if (doubleSided) {
    const backPlane = create$2(true);
    const transformationMatrix = mat4.fromYRotation(mat4.create(), Math.PI);
    applyTransformation(transformationMatrix, backPlane);
    applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
    return joinGeometry(frontPlane, backPlane);
  } else {
    return frontPlane;
  }
}

var PlaneGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$3
});

function create$4(front = true, back = true, top = true, bottom = true, left = true, right = true) {
  const HALF_PI = Math.PI / 2;
  const halfWidth = 0.5;
  const halfHeight = 0.5;
  const halfDepth = 0.5;
  const transformationMatrix = mat4.create();
  const faces = []; // Front

  if (front) {
    const frontPlane = create$3(false);
    mat4.fromTranslation(transformationMatrix, [0, 0, halfDepth]);
    applyTransformation(transformationMatrix, frontPlane);
    faces.push(frontPlane);
  } // Top


  if (top) {
    const topPlane = create$3(false);
    mat4.fromXRotation(transformationMatrix, -HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
    applyTransformation(transformationMatrix, topPlane);
    faces.push(topPlane);
  } // Back


  if (back) {
    const backPlane = create$3(false);
    mat4.fromYRotation(transformationMatrix, Math.PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
    applyTransformation(transformationMatrix, backPlane);
    faces.push(backPlane);
  } // Bottom


  if (bottom) {
    const bottomPlane = create$3(false);
    mat4.fromXRotation(transformationMatrix, HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
    applyTransformation(transformationMatrix, bottomPlane);
    faces.push(bottomPlane);
  } // Left


  if (left) {
    const leftPlane = create$3(false);
    mat4.fromYRotation(transformationMatrix, -HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
    applyTransformation(transformationMatrix, leftPlane);
    faces.push(leftPlane);
  } // Right


  if (right) {
    const rightPlane = create$3(false);
    mat4.fromYRotation(transformationMatrix, HALF_PI);
    mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
    applyTransformation(transformationMatrix, rightPlane);
    faces.push(rightPlane);
  }

  return joinGeometry(...faces);
}

var CubeGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$4
});

function create$5() {
  const size = 1;
  const fifthSize = size * 0.2;
  const transformationMatrix = mat4.create();
  const topRung = create$4(true, true, true, true, false, true);
  mat4.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
  mat4.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
  applyTransformation(transformationMatrix, topRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
  const bottomRung = create$4(true, true, true, true, false, true);
  mat4.fromScaling(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
  applyTransformation(transformationMatrix, bottomRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);
  const leftBase = create$4(true, true, true, true, true, true);
  mat4.fromTranslation(transformationMatrix, [-fifthSize, 0, 0]);
  mat4.scale(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
  applyTransformation(transformationMatrix, leftBase);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);
  return joinGeometry(leftBase, topRung, bottomRung);
}

var GlyphFGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$5
});
var Geometry3D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Quad: QuadGeometry,
  Plane: PlaneGeometry,
  Cube: CubeGeometry,
  GlyphF: GlyphFGeometry,
  create: create$1$1,
  applyColor: applyColor,
  applyTransformation: applyTransformation,
  joinGeometry: joinGeometry
});

function create$6(position, texcoord, indices, color = undefined) {
  if (!color) {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    color = [];

    for (let i = 0; i < position.length; i += 3) {
      color.push(r, g, b);
    }
  }

  return {
    position,
    texcoord,
    indices,
    color,
    elementSize: 2,
    elementCount: indices.length
  };
}

function applyTransformation2D(transformationMatrix, geometry) {
  const position = geometry.position;
  const result = vec2.create();

  for (let i = 0; i < position.length; i += 2) {
    result[0] = position[i + 0];
    result[1] = position[i + 1];
    vec3.transformMat3(result, result, transformationMatrix);
    position[i + 0] = result[0];
    position[i + 1] = result[1];
  }

  return geometry;
}

function joinGeometry2D(...geometries) {
  const position = [];
  const texcoord = [];
  const indices = [];
  const color = [];
  let indexCount = 0;

  for (const geometry of geometries) {
    position.push(...geometry.position);
    texcoord.push(...geometry.texcoord);
    color.push(...geometry.color);

    for (let i = 0; i < geometry.indices.length; ++i) {
      const index = geometry.indices[i];
      indices.push(index + indexCount);
    }

    indexCount += geometry.position.length / 2;
  }

  return create$6(position, texcoord, indices, color);
}

function create$7(centered = false) {
  const x = 0;
  const y = 0;
  const width = 1;
  const height = 1;
  let position;

  if (centered) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    position = [x - halfWidth, y - halfHeight, x + halfWidth, y - halfHeight, x - halfWidth, y + halfHeight, x + halfWidth, y + halfHeight];
  } else {
    position = [x, y, x + width, y, x, y + height, x + width, y + height];
  }

  const texcoord = [0, 0, 1, 0, 0, 1, 1, 1];
  const indices = [0, 1, 2, 2, 1, 3];
  return create$6(position, texcoord, indices);
}

var Quad2DGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$7
});

function create$8() {
  const size = 1;
  const fifthSize = size * 0.2;
  const transformationMatrix = mat3.create();
  const topRung = create$7();
  mat3.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
  mat3.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
  applyTransformation2D(transformationMatrix, topRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
  const bottomRung = create$7();
  mat3.fromScaling(transformationMatrix, [fifthSize, fifthSize]);
  applyTransformation2D(transformationMatrix, bottomRung);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);
  const leftBase = create$7();
  mat3.fromTranslation(transformationMatrix, [-fifthSize, 0]);
  mat3.scale(transformationMatrix, transformationMatrix, [fifthSize, size]);
  applyTransformation2D(transformationMatrix, leftBase);
  applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);
  return joinGeometry2D(leftBase, topRung, bottomRung);
}

var GlyphF2DGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$8
});
var Geometry2D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Quad2D: Quad2DGeometry,
  GlyphF2D: GlyphF2DGeometry,
  applyColor2D: applyColor,
  create: create$6,
  applyTransformation2D: applyTransformation2D,
  joinGeometry2D: joinGeometry2D
});

function createShaderProgramInfo(gl, vertexShaderSource, fragmentShaderSource, sharedAttributeLayout = []) {
  const vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout); // Don't forget to clean up the shaders! It's no longer needed...

  gl.detachShader(programHandle, vertexShaderHandle);
  gl.detachShader(programHandle, fragmentShaderHandle);
  gl.deleteShader(vertexShaderHandle);
  gl.deleteShader(fragmentShaderHandle); // But do keep around the program :P

  return {
    handle: programHandle,
    _gl: gl,
    uniforms: createShaderProgramUniformSetters(gl, programHandle),
    attributes: createShaderProgramAttributeSetters(gl, programHandle),

    uniform(name, value) {
      // If the uniform exists, since it may have been optimized away by the compiler :(
      if (name in this.uniforms) {
        this.uniforms[name](this._gl, value);
      }

      return this;
    },

    attribute(name, bufferInfo) {
      // If the attribute exists, since it may have been optimized away by the compiler :(
      if (name in this.attributes) {
        this.attributes[name](this._gl, bufferInfo);
      }

      return this;
    },

    elementAttribute(bufferInfo) {
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);

      return this;
    }

  };
}

function createShader(gl, type, source) {
  const shaderHandle = gl.createShader(type);
  gl.shaderSource(shaderHandle, source);
  gl.compileShader(shaderHandle);

  if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS)) {
    const result = gl.getShaderInfoLog(shaderHandle);
    gl.deleteShader(shaderHandle);
    throw new Error(result);
  }

  return shaderHandle;
}

function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout = []) {
  const programHandle = gl.createProgram();
  gl.attachShader(programHandle, vertexShaderHandle);
  gl.attachShader(programHandle, fragmentShaderHandle); // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
  // NOTE: Unfortunately, this must happen before program linking to take effect.

  for (let i = 0; i < sharedAttributeLayout.length; ++i) {
    gl.bindAttribLocation(programHandle, i, sharedAttributeLayout[i]);
  }

  gl.linkProgram(programHandle);

  if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS)) {
    const result = gl.getProgramInfoLog(programHandle);
    gl.deleteProgram(programHandle);
    throw new Error(result);
  }

  return programHandle;
}

function createShaderProgramAttributeSetters(gl, programHandle) {
  const dst = {};
  const attributeCount = gl.getProgramParameter(programHandle, gl.ACTIVE_ATTRIBUTES);

  for (let i = 0; i < attributeCount; ++i) {
    const activeAttributeInfo = gl.getActiveAttrib(programHandle, i);
    if (!activeAttributeInfo) break;
    const attributeName = activeAttributeInfo.name;
    const attributeIndex = gl.getAttribLocation(programHandle, attributeName);
    dst[attributeName] = createShaderProgramAttributeSetter(attributeIndex);
  }

  return dst;
}

function createShaderProgramAttributeSetter(attributeIndex) {
  const result = function (attributeIndex, gl, bufferInfo) {
    gl.enableVertexAttribArray(attributeIndex);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.handle);
    gl.vertexAttribPointer(attributeIndex, bufferInfo.size, bufferInfo.type, bufferInfo.normalize, bufferInfo.stride, bufferInfo.offset);
  }.bind(null, attributeIndex);

  result.location = attributeIndex;
  return result;
}

function createShaderProgramUniformSetters(gl, programHandle) {
  const dst = {};
  const ctx = {
    textureUnit: 0
  };
  const uniformCount = gl.getProgramParameter(programHandle, gl.ACTIVE_UNIFORMS);

  for (let i = 0; i < uniformCount; ++i) {
    const activeUniformInfo = gl.getActiveUniform(programHandle, i);
    if (!activeUniformInfo) break;
    let uniformName = activeUniformInfo.name;

    if (uniformName.substring(uniformName.length - 3) === '[0]') {
      uniformName = uniformName.substring(0, uniformName.length - 3);
    }

    const uniformSetter = createShaderProgramUniformSetter(gl, programHandle, activeUniformInfo, ctx);
    dst[uniformName] = uniformSetter;
  }

  return dst;
}

function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx) {
  const name = uniformInfo.name;
  const location = gl.getUniformLocation(programHandle, name);
  const type = uniformInfo.type;
  const array = uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]';
  const uniformTypeInfo = getUniformTypeInfo(gl, type);

  if (!uniformTypeInfo) {
    throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);
  }

  switch (type) {
    case gl.FLOAT:
    case gl.INT:
    case gl.BOOL:
      return uniformTypeInfo.setter(location, array);

    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      {
        let textureUnit;

        if (array) {
          textureUnit = [];

          for (let i = 0; i < uniformInfo.size; ++i) {
            textureUnit.push(ctx.textureUnit++);
          }
        } else {
          textureUnit = ctx.textureUnit++;
        }

        return uniformTypeInfo.setter(location, array, textureUnit);
      }

    default:
      return uniformTypeInfo.setter(location);
  }
}

let UNIFORM_TYPE_MAP = null;

function getUniformTypeInfo(gl, type) {
  if (UNIFORM_TYPE_MAP) return UNIFORM_TYPE_MAP[type]; // NOTE: Instead of setting the active texture index for the sampler, we instead designate
  // active texture indices based on the program and number of sampler uniforms it has.
  // This way, we simply pass the texture handle to the uniform setter and it will find
  // the associated texture index by name. This is okay since we usually expect each
  // program to have it's own unqiue active texture list, therefore we can take advantage
  // of the reassignment of sampler uniforms to perform a lookup first instead.
  // This does mean that when creating a texture, you don't need to specify which active
  // texture index it should be in. This is handled by the shader program initialization,
  // and is assigned when the program is used.

  function samplerSetter(textureTarget, location, array = false, textureUnit = 0) {
    if (array && !Array.isArray(textureUnit)) throw new Error('Cannot create sampler array for non-array texture unit.');
    const result = (array ? function (location, textureUnits, textureTarget, gl, textures) {
      gl.uniform1fv(location, textureUnits);
      textures.forEach((texture, index) => {
        gl.activeTexture(gl.TEXTURE0 + textureUnits[index]);
        gl.bindTexture(textureTarget, texture);
      });
    } : function (location, textureUnit, textureTarget, gl, texture) {
      gl.uniform1i(location, textureUnit);
      gl.activeTexture(gl.TEXTURE0 + textureUnit);
      gl.bindTexture(textureTarget, texture);
    }).bind(null, location, textureUnit, textureTarget);
    result.location = location;
    return result;
  }

  UNIFORM_TYPE_MAP = {
    [gl.FLOAT]: {
      TypedArray: Float32Array,
      size: 4,

      setter(location, array = false) {
        const result = (array ? function (location, gl, value) {
          gl.uniform1fv(location, value);
        } : function (location, gl, value) {
          gl.uniform1f(location, value);
        }).bind(null, location);
        result.location = location;
        return result;
      }

    },
    [gl.FLOAT_VEC2]: {
      TypedArray: Float32Array,
      size: 8,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform2fv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.FLOAT_VEC3]: {
      TypedArray: Float32Array,
      size: 12,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform3fv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.FLOAT_VEC4]: {
      TypedArray: Float32Array,
      size: 16,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform4fv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.INT]: {
      TypedArray: Int32Array,
      size: 4,

      setter(location, array = false) {
        const result = (array ? function (location, gl, value) {
          gl.uniform1iv(location, value);
        } : function (location, gl, value) {
          gl.uniform1i(location, value);
        }).bind(null, location);
        result.location = location;
        return result;
      }

    },
    [gl.INT_VEC2]: {
      TypedArray: Int32Array,
      size: 8,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform2iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.INT_VEC3]: {
      TypedArray: Int32Array,
      size: 12,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform3iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.INT_VEC4]: {
      TypedArray: Int32Array,
      size: 16,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform4iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.BOOL]: {
      TypedArray: Uint32Array,
      size: 4,

      setter(location, array = false) {
        const result = (array ? function (location, gl, value) {
          gl.uniform1iv(location, value);
        } : function (location, gl, value) {
          gl.uniform1i(location, value);
        }).bind(null, location);
        result.location = location;
        return result;
      }

    },
    [gl.BOOL_VEC2]: {
      TypedArray: Uint32Array,
      size: 8,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform2iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.BOOL_VEC3]: {
      TypedArray: Uint32Array,
      size: 12,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform3iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.BOOL_VEC4]: {
      TypedArray: Uint32Array,
      size: 16,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniform4iv(location, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.FLOAT_MAT2]: {
      TypedArray: Float32Array,
      size: 16,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniformMatrix2fv(location, false, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.FLOAT_MAT3]: {
      TypedArray: Float32Array,
      size: 36,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniformMatrix3fv(location, false, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.FLOAT_MAT4]: {
      TypedArray: Float32Array,
      size: 64,

      setter(location) {
        const result = function (location, gl, value) {
          gl.uniformMatrix4fv(location, false, value);
        }.bind(null, location);

        result.location = location;
        return result;
      }

    },
    [gl.SAMPLER_2D]: {
      TypedArray: null,
      size: 0,
      setter: samplerSetter.bind(null, gl.TEXTURE_2D)
    },
    [gl.SAMPLER_CUBE]: {
      TypedArray: null,
      size: 0,
      setter: samplerSetter.bind(null, gl.TEXTURE_CUBE)
    } // UNSIGNED_INT
    // UNSIGNED_INT_VEC2
    // UNSIGNED_INT_VEC3
    // UNSIGNED_INT_VEC4
    // FLOAT_MAT2x3
    // FLOAT_MAT2x4
    // FLOAT_MAT3x2
    // FLOAT_MAT3x4
    // FLOAT_MAT4x2
    // FLOAT_MAT4x3
    // SAMPLER_3D
    // SAMPLER_2D_SHADOW
    // SAMPLER_2D_ARRAY
    // SAMPLER_2D_ARRAY_SHADOW
    // INT_SAMPLER_2D
    // INT_SAMPLER_3D
    // INT_SAMPLER_CUBE
    // INT_SAMPLER_2D_ARRAY
    // UNSIGNED_INT_SAMPLER_2D
    // UNSIGNED_INT_SAMPLER_3D
    // UNSIGNED_INT_SAMPLER_CUBE
    // UNSIGNED_INT_SAMPLER_2D_ARRAY

  };
  return UNIFORM_TYPE_MAP[type];
}

function createBufferInfo(gl, type, data, size, normalize = false, stride = 0, offset = 0, bufferTarget = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
  const bufferHandle = gl.createBuffer();
  const bufferTypeInfo = getBufferTypeInfo(gl, type);
  if (!bufferTypeInfo) throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);

  if (data instanceof bufferTypeInfo.TypedArray) {
    gl.bindBuffer(bufferTarget, bufferHandle);
    gl.bufferData(bufferTarget, data, usage);
  } else if (Array.isArray(data)) {
    data = new bufferTypeInfo.TypedArray(data);
    gl.bindBuffer(bufferTarget, bufferHandle);
    gl.bufferData(bufferTarget, data, usage);
  } else if (typeof data === 'number') {
    gl.bindBuffer(bufferTarget, bufferHandle);
    gl.bufferData(bufferTarget, data, usage);
  } else {
    throw new Error('Unknown buffer data type - can only be a TypedArray, an Array, or a number.');
  }

  return {
    handle: bufferHandle,
    size,
    type,
    normalize,
    stride,
    offset,

    /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
    updateData(gl, data, offset = 0, usage = gl.STATIC_DRAW) {
      // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
      const bufferTypeInfo = getBufferTypeInfo(gl, type);

      if (!(data instanceof bufferTypeInfo.TypedArray)) {
        data = new bufferTypeInfo.TypedArray(data);
      }

      if (offset > 0) {
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      }
    }

  };
}

function createElementBufferInfo(gl, type, data, stride = 0, offset = 0, usage = gl.STATIC_DRAW) {
  // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
  return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
}

let BUFFER_TYPE_MAP = null;

function getBufferTypeInfo(gl, type) {
  if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];
  BUFFER_TYPE_MAP = {
    [gl.BYTE]: {
      TypedArray: Int8Array,
      size: 1
    },
    [gl.SHORT]: {
      TypedArray: Int16Array,
      size: 2
    },
    [gl.UNSIGNED_BYTE]: {
      TypedArray: Uint8Array,
      size: 1
    },
    [gl.UNSIGNED_SHORT]: {
      TypedArray: Uint16Array,
      size: 2
    },
    [gl.FLOAT]: {
      TypedArray: Float32Array,
      size: 4
    } // HALF_FLOAT

  };
  return BUFFER_TYPE_MAP[type];
}

function createVertexArrayInfo(gl, sharedAttributeLayout = []) {
  const vertexArrayHandle = gl.createVertexArray();
  const attributes = {};

  for (let i = 0; i < sharedAttributeLayout.length; ++i) {
    attributes[sharedAttributeLayout[i]] = {
      location: i,
      setter: createShaderProgramAttributeSetter(i)
    };
  }

  return {
    handle: vertexArrayHandle,
    attributes: attributes,
    _gl: gl,
    elementBuffer: null,
    elementType: null,
    elementCount: 0,
    attributeBuffers: {},

    setElementCount(count) {
      this.elementCount = count;
      return this;
    },

    elementAttribute(bufferInfo) {
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

      const bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type); // NOTE: Number of bytes in buffer divided by the number of bytes of element type

      this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
      this.elementBuffer = bufferInfo;
      this.elementType = bufferInfo.type;
      return this;
    },

    sharedAttribute(name, bufferInfo) {
      if (name in this.attributes) {
        this.attributes[name].setter(this._gl, bufferInfo);
      }

      this.attributeBuffers[name] = bufferInfo;
      return this;
    },

    programAttribute(name, bufferInfo, ...programInfos) {
      for (const program of programInfos) {
        program.attribute(name, bufferInfo);
      }

      this.attributeBuffers[name] = bufferInfo;
      return this;
    }

  };
}

function createTextureInfo(gl) {
  const textureHandle = gl.createTexture();
  return {
    handle: textureHandle
  };
}

function createDrawInfo(programInfo, vertexArrayInfo, uniforms, drawArrayOffset = 0, drawMode = null) {
  return {
    programInfo,
    vertexArrayInfo,
    uniforms,
    drawArrayOffset,
    drawMode
  };
}

function draw(gl, drawInfos, sharedUniforms = {}) {
  for (const drawInfo of drawInfos) {
    const programInfo = drawInfo.programInfo;
    const vertexArrayInfo = drawInfo.vertexArrayInfo;
    const uniforms = drawInfo.uniforms;
    const drawArrayOffset = drawInfo.drawArrayOffset;
    const drawMode = drawInfo.drawMode || gl.TRIANGLES; // Prepare program...

    gl.useProgram(programInfo.handle); // Prepare vertex array...

    gl.bindVertexArray(vertexArrayInfo.handle); // Prepare shared uniforms...

    for (const [name, value] of Object.entries(sharedUniforms)) {
      programInfo.uniform(name, value);
    } // Prepare uniforms...


    for (const [name, value] of Object.entries(uniforms)) {
      programInfo.uniform(name, value);
    } // Depends on buffers in attributes...


    if (vertexArrayInfo.elementBuffer) {
      // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
      gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
    } else {
      gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
    }
  }
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SceneGraph: SceneGraph$1,
  Transform: Transform,
  Geometry: Geometry3D,
  Geometry2D: Geometry2D,
  createShaderProgramInfo: createShaderProgramInfo,
  createShader: createShader,
  createShaderProgram: createShaderProgram,
  createShaderProgramAttributeSetters: createShaderProgramAttributeSetters,
  createShaderProgramAttributeSetter: createShaderProgramAttributeSetter,
  createShaderProgramUniformSetters: createShaderProgramUniformSetters,
  createShaderProgramUniformSetter: createShaderProgramUniformSetter,
  getUniformTypeInfo: getUniformTypeInfo,
  createBufferInfo: createBufferInfo,
  createElementBufferInfo: createElementBufferInfo,
  getBufferTypeInfo: getBufferTypeInfo,
  createVertexArrayInfo: createVertexArrayInfo,
  createTextureInfo: createTextureInfo,
  createDrawInfo: createDrawInfo,
  draw: draw
});

class Camera {
  /** @abstract */
  getViewMatrix(out) {}
  /** @abstract */


  getProjectionMatrix(out) {}

}

class Camera2D extends Camera {
  constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1) {
    super();
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.clippingPlane = {
      left,
      right,
      top,
      bottom,
      near,
      far
    };
  }

  get x() {
    return this.position[0];
  }

  set x(value) {
    this.position[0] = value;
  }

  get y() {
    return this.position[1];
  }

  set y(value) {
    this.position[1] = value;
  }

  get z() {
    return this.position[2];
  }

  set z(value) {
    this.position[2] = value;
  }

  moveTo(x, y, z = 0, dt = 1) {
    let nextPosition = vec3.fromValues(x, y, z);
    vec3.lerp(this.position, this.position, nextPosition, Math.max(Math.min(dt, 1), 0));
    return this;
  }
  /** @override */


  getViewMatrix(out) {
    let viewX = -Math.round(this.x);
    let viewY = -Math.round(this.y);
    let viewZ = this.z === 0 ? 1 : 1 / this.z;
    let invPosition = vec3.fromValues(viewX, viewY, 0);
    let invScale = vec3.fromValues(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
    mat4.fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
    return out;
  }
  /** @override */


  getProjectionMatrix(out) {
    let {
      left,
      right,
      top,
      bottom,
      near,
      far
    } = this.clippingPlane;
    mat4.ortho(out, left, right, top, bottom, near, far);
    return out;
  }

}

class CanvasView2D {
  constructor(display, camera = new Camera2D()) {
    this.display = display;
    this.camera = camera;
    this.viewTransformDOMMatrix = new DOMMatrix();
  }

  transformScreenToWorld(screenX, screenY) {
    let matrix = mat4.create();
    this.getViewProjectionMatrix(matrix);
    mat4.invert(matrix, matrix);
    let result = vec3.fromValues(screenX, screenY, 0);
    vec3.transformMat4(result, result, matrix);
    return result;
  }

  transformCanvas(ctx) {
    let domMatrix = this.viewTransformDOMMatrix;
    let matrix = mat4.create();
    this.getViewProjectionMatrix(matrix);
    setDOMMatrix(domMatrix, matrix);
    const {
      a,
      b,
      c,
      d,
      e,
      f
    } = domMatrix;
    ctx.transform(a, b, c, d, e, f);
  }

  getViewProjectionMatrix(out) {
    const displayWidth = this.display.width;
    const displayHeight = this.display.height;
    let matrix = mat4.create();
    const projectionMatrix = this.camera.getProjectionMatrix(matrix);
    const viewMatrix = this.camera.getViewMatrix(out);
    mat4.multiply(matrix, viewMatrix, projectionMatrix); // HACK: This is the correct canvas matrix, but since we simply restore the
    // the aspect ratio by effectively undoing the scaling, we can skip this step
    // all together to achieve the same effect (albeit incorrect).

    /*
    const canvasMatrix = mat4.fromRotationTranslationScale(
        out,
        [0, 0, 0, 1],
        [displayWidth / 2, displayHeight / 2, 0],
        [displayWidth, displayHeight, 0]);
    */
    // HACK: This shouldn't be here. This should really be in the view matrix.

    const canvasMatrix = mat4.fromTranslation(out, [displayWidth / 2, displayHeight / 2, 0]);
    mat4.multiply(out, canvasMatrix, matrix);
    return out;
  }

}

function setDOMMatrix(domMatrix, glMatrix) {
  domMatrix.a = glMatrix[0];
  domMatrix.b = glMatrix[1];
  domMatrix.c = glMatrix[4];
  domMatrix.d = glMatrix[5];
  domMatrix.e = glMatrix[12];
  domMatrix.f = glMatrix[13];
  return domMatrix;
}
/** @deprecated */


class Camera3D extends Camera {
  static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix) {
    let mat = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix);
    mat4.invert(mat, mat);
    let result = vec3.fromValues(screenX, screenY, 0);
    vec3.transformMat4(result, result, mat);
    return result;
  }

  constructor(fieldOfView, aspectRatio, near = 0.1, far = 1000) {
    super();
    this.position = vec3.create();
    this.rotation = quat.create();
    this.fieldOfView = fieldOfView;
    this.aspectRatio = aspectRatio;
    this.clippingPlane = {
      near,
      far
    };
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
  }

  get x() {
    return this.position[0];
  }

  set x(value) {
    this.position[0] = value;
  }

  get y() {
    return this.position[1];
  }

  set y(value) {
    this.position[1] = value;
  }

  get z() {
    return this.position[2];
  }

  set z(value) {
    this.position[2] = value;
  }
  /** Moves the camera. This is the only way to change the position. */


  moveTo(x, y, z, dt = 1) {
    let nextPosition = vec3.fromValues(x, y, z);
    vec3.lerp(this.position, this.position, nextPosition, Math.min(1, dt));
  }
  /** @override */


  getViewMatrix(out = this._viewMatrix) {
    let viewX = -this.x;
    let viewY = -this.y;
    let viewZ = -this.z;
    let invPosition = vec3.fromValues(viewX, viewY, viewZ);
    mat4.fromRotationTranslation(out, this.rotation, invPosition);
    return out;
  }
  /** @override */


  getProjectionMatrix(out = this._projectionMatrix) {
    let {
      near,
      far
    } = this.clippingPlane;
    mat4.perspective(out, this.fieldOfView, this.aspectRatio, near, far);
    return out;
  }

}

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CanvasView2D: CanvasView2D,
  setDOMMatrix: setDOMMatrix,
  Camera: Camera,
  Camera2D: Camera2D,
  Camera3D: Camera3D
});

export { ApplicationLoop, AssetLoader, Audio, AxisAlignedBoundingBox, AxisAlignedBoundingBoxGraph, BoxRenderer, ByteLoader, Discrete, Downloader, EntityManager, Eventable$1 as Eventable, Game$1 as Game, ImageLoader, IntersectionHelper, IntersectionResolver, IntersectionWorld, JSONLoader, Logger$1 as Logger, index as Mogli, OBJLoader, PriorityQueue, QuadTree, Random, RandomGenerator, SceneGraph, SceneNode, SimpleRandomGenerator, SpriteRenderer, TextLoader, Uploader, index$1 as View, clamp, cycle, direction2, distance2, lerp, lookAt2, testAxisAlignedBoundingBox, toDegrees, toRadians, topoSort, uuid, withinRadius };
