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
    on(event, callback, handle = callback)
    {
        let callbacks;
        if (!this.__events.has(event))
        {
            callbacks = new Map();
            this.__events.set(event, callbacks);
        }
        else
        {
            callbacks = this.__events.get(event);
        }

        if (!callbacks.has(handle))
        {
            callbacks.set(handle, callback);
        }
        else
        {
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
    off(event, handle)
    {
        if (this.__events.has(event))
        {
            const callbacks = this.__events.get(event);
            if (callbacks.has(handle))
            {
                callbacks.delete(handle);
            }
            else
            {
                throw new Error(`Unable to find callback for event '${event}' with handle '${handle}'.`);
            }
        }
        else
        {
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
    once(event, callback, handle = callback)
    {
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
    emit(event, ...args)
    {
        if (this.__events.has(event))
        {
            let results = [];
            const callbacks = Array.from(this.__events.get(event).values());
            for(const callback of callbacks)
            {
                let result = callback.apply(this.__context || this, args);
                if (result) results.push(result);
            }
            return results;
        }
        else
        {
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
function create(context = undefined)
{
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
function assign(dst, context = undefined)
{
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
function mixin(targetClass, context = undefined)
{
    const targetPrototype = targetClass.prototype;
    Object.assign(targetPrototype, EventableInstance);
    targetPrototype.__events = new Map();
    targetPrototype.__context = context;
    return targetPrototype;
}

const Eventable = {
    create,
    assign,
    mixin,
};

// Log levels
const TRACE = 5;
const DEBUG = 4;
const INFO = 3;
const WARN = 2;
const ERROR = 1;
const OFF = 0;

const LOG_LEVEL_STYLES = {
    [TRACE]: styledLogLevel('#7F8C8D'), // Gray
    [DEBUG]: styledLogLevel('#2ECC71'), // Green
    [INFO]: styledLogLevel('#4794C8'), // Blue
    [WARN]: styledLogLevel('#F39C12'), // Yellow
    [ERROR]: styledLogLevel('#C0392B'), // Red
    [OFF]: [''],
};

function compareLogLevel(a, b)
{
    return a - b;
}

function styledLogLevel(color)
{
    return [
        `background: ${color}`,
        'border-radius: 0.5em',
        'color: white',
        'font-weight: bold',
        'padding: 2px 0.5em',
    ];
}

// Useful functions
function noop() { /** Do nothing. */ }

function getStyledMessage(message, styles)
{
    return [
        `%c${message}`,
        styles.join(';'),
    ];
}

function getConsoleFunction(level)
{
    switch(level)
    {
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

function prependMessageTags(out, name, domain, level)
{
    if (name)
    {
        out.unshift(`[${name}]`);
    }

    if (domain)
    {
        let tag = getStyledMessage(domain, LOG_LEVEL_STYLES[level]);
        out.unshift(tag[0], tag[1]);
    }

    return out;
}

const LEVEL = Symbol('level');
const DOMAIN = Symbol('domain');
const LOGGERS = { /** To be populated by logger instances. */ };
let DEFAULT_LEVEL = WARN;
let DEFAULT_DOMAIN = 'app';
class Logger
{
    static get TRACE() { return TRACE; }
    static get DEBUG() { return DEBUG; }
    static get INFO() { return INFO; }
    static get WARN() { return WARN; }
    static get ERROR() { return ERROR; }
    static get OFF() { return OFF; }

    /**
     * Creates or gets the logger for the given unique name.
     * @param {String} name 
     * @returns {Logger} The logger with the name.
     */
    static getLogger(name)
    {
        if (name in LOGGERS)
        {
            return LOGGERS[name];
        }
        else
        {
            return LOGGERS[name] = new Logger(name);
        }
    }

    static useDefaultLevel(level)
    {
        DEFAULT_LEVEL = level;
        return this;
    }

    static useDefaultDomain(domain)
    {
        DEFAULT_DOMAIN = domain;
        return this;
    }

    constructor(name)
    {
        this.name = name;
        this[LEVEL] = DEFAULT_LEVEL;
        this[DOMAIN] = DEFAULT_DOMAIN;
    }

    setLevel(level)
    {
        this[LEVEL] = level;
        return this;
    }
    
    getLevel()
    {
        return this[LEVEL];
    }

    setDomain(domain)
    {
        this[DOMAIN] = domain;
        return this;
    }

    getDomain()
    {
        return this[DOMAIN];
    }

    log(level, ...messages)
    {
        if (compareLogLevel(this[LEVEL], level) < 0) return this;
        prependMessageTags(messages, this.name, this[DOMAIN], level);
        getConsoleFunction(level)(...messages);
    }

    trace(...messages)
    {
        if (compareLogLevel(this[LEVEL], TRACE) < 0) return this;
        prependMessageTags(messages, this.name, this[DOMAIN], TRACE);
        getConsoleFunction(TRACE)(...messages);
    }

    debug(...messages)
    {
        if (compareLogLevel(this[LEVEL], DEBUG) < 0) return this;
        prependMessageTags(messages, this.name, this[DOMAIN], DEBUG);
        getConsoleFunction(DEBUG)(...messages);
    }

    info(...messages)
    {
        if (compareLogLevel(this[LEVEL], INFO) < 0) return this;
        prependMessageTags(messages, this.name, this[DOMAIN], INFO);
        getConsoleFunction(INFO)(...messages);
    }

    warn(...messages)
    {
        if (compareLogLevel(this[LEVEL], WARN) < 0) return this;
        prependMessageTags(messages, this.name, this[DOMAIN], WARN);
        getConsoleFunction(WARN)(...messages);
    }

    error(...messages)
    {
        if (compareLogLevel(this[LEVEL], ERROR) < 0) return this;
        prependMessageTags(messages, this.name, this[DOMAIN], ERROR);
        getConsoleFunction(ERROR)(...messages);
    }
}

// Bresenham's Line Algorithm
function bresenhamLine(fromX, fromY, toX, toY, callback)
{
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
    while(length < maxLength && (x !== tx || y !== ty))
    {
        // Make sure it doesn't go overboard.
        ++length;

        let er2 = er * 2;

        if (er2 >= dy)
        {
            er += dy;
            x += sx;
        }

        if (er2 <= dx)
        {
            er += dx;
            y += sy;
        }

        flag = callback(x, y);
        if (typeof flag !== 'undefined') return flag;
    }
}

const FILE_TYPE_PNG = 'png';
const FILE_TYPE_SVG = 'svg';

function downloadText(filename, textData)
{
    downloadURL(filename, getTextDataURI(textData));
}

function downloadImageFromSVG(filename, filetype, svg, width, height)
{
    const blob = createBlobFromSVG(svg);
    switch (filetype)
    {
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
                image.onload = () => 
                {
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
                reader.onload = () => 
                {
                    downloadURL(filename, reader.result);
                };
                reader.readAsDataURL(blob);
            }
            break;
        default:
            throw new Error('Unknown file type \'' + filetype + '\'');
    }
}

function downloadURL(filename, url)
{
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

function createBlobFromSVG(svg)
{
    const styledSVG = computeSVGStyles(svg);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(styledSVG);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    return blob;
}

// SOURCE: https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser/44769098#44769098
const SVG_CONTAINERS = ['svg', 'g'];
function computeSVGStyles(svg, dst = svg.cloneNode(true))
{
    let sourceChildren = svg.childNodes;
    let children = dst.childNodes;

    for (var index = 0; index < children.length; index++)
    {
        let child = children[index];
        let tagName = child.tagName;
        if (SVG_CONTAINERS.indexOf(tagName) != -1)
        {
            computeSVGStyles(sourceChildren[index], child);
        }
        else if (sourceChildren[index] instanceof Element)
        {
            const computedStyle = window.getComputedStyle(sourceChildren[index]);

            let styleAttributes = [];
            for(let styleName of Object.keys(computedStyle))
            {
                styleAttributes.push(`${styleName}:${computedStyle.getPropertyValue(styleName)};`);
            }

            child.setAttribute('style', styleAttributes.join(''));
        }
    }

    return dst;
}

function getTextDataURI(data)
{
    return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
}

async function uploadFile(accept = [], multiple = false)
{
    return new Promise((resolve, reject) => {
        const element = document.createElement('input');
        element.addEventListener('change', (e) => {
            if (multiple)
            {
                resolve(e.target.files);
            }
            else
            {
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

const TOP_INDEX = 0;

// NOTE: Uses a binary heap to sort.
class PriorityQueue
{
    constructor(comparator)
    {
        this._heap = [];
        this._comparator = comparator;
    }

    get size() { return this._heap.length; }

    clear()
    {
        this._heap.length = 0;
    }

    push(...values)
    {
        for (const value of values)
        {
            this._heap.push(value);
            this._shiftUp();
        }
    }

    pop()
    {
        const result = this.peek();
        let bottom = bottomIndex(this);
        if (bottom > TOP_INDEX)
        {
            this._swap(TOP_INDEX, bottom);
        }
        this._heap.pop();
        this._shiftDown();
        return result;
    }

    /** Replaces the top value with the new value. */
    replace(value)
    {
        const result = this.peek();
        this._heap[TOP_INDEX] = value;
        this._shiftDown();
        return result;
    }

    peek()
    {
        return this._heap[TOP_INDEX];
    }

    /** @private */
    _compare(i, j)
    {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    /** @private */
    _swap(i, j)
    {
        let result = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = result;
    }

    /** @private */
    _shiftUp()
    {
        let node = this._heap.length - 1;
        let nodeParent;
        while (node > TOP_INDEX && this._compare(node, nodeParent = parentIndex(node)))
        {
            this._swap(node, nodeParent);
            node = nodeParent;
        }
    }

    /** @private */
    _shiftDown()
    {
        const length = this._heap.length;
        let node = TOP_INDEX;
        let nodeMax;

        let nodeLeft = leftIndex(node);
        let flagLeft = nodeLeft < length;
        let nodeRight = rightIndex(node);
        let flagRight = nodeRight < length;

        while ((flagLeft && this._compare(nodeLeft, node))
            || (flagRight && this._compare(nodeRight, node)))
        {
            nodeMax = (flagRight && this._compare(nodeRight, nodeLeft)) ? nodeRight : nodeLeft;
            this._swap(node, nodeMax);
            node = nodeMax;

            nodeLeft = leftIndex(node);
            flagLeft = nodeLeft < length;
            nodeRight = rightIndex(node);
            flagRight = nodeRight < length;
        }
    }

    values()
    {
        return this._heap;
    }

    [Symbol.iterator]()
    {
        return this._heap[Symbol.iterator]();
    }
}

function bottomIndex(queue)
{
    return queue._heap.length - 1;
}

function parentIndex(i)
{
    return ((i + 1) >>> 1) - 1;
}

function leftIndex(i)
{
    return (i << 1) + 1;
}

function rightIndex(i)
{
    return (i + 1) << 1;
}

/**
 * Generates a uuid v4.
 * 
 * @param {number} a The placeholder (serves for recursion within function).
 * @returns {string} The universally unique id.
 */
function uuid(a = undefined)
{
    // https://gist.github.com/jed/982883
    return a
        ? (a ^ Math.random() * 16 >> a / 4).toString(16)
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

function lerp(a, b, t)
{
    return a + (b - a) * t;
}

function clamp(value, min, max)
{
    return Math.min(max, Math.max(min, value));
}

function cycle(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}

function withinRadius(fromX, fromY, toX, toY, radius)
{
    const dx = fromX - toX;
    const dy = fromY - toY;
    return dx * dx + dy * dy <= radius * radius;
}

function distance2(fromX, fromY, toX, toY)
{
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.sqrt(dx * dx + dy * dy);
}

function direction2(fromX, fromY, toX, toY)
{
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.atan2(dy, dx);
}

function lookAt2(radians, target, dt)
{
    let step = cycle(target - radians, -Math.PI, Math.PI);
    return clamp(radians + step, radians - dt, radians + dt);
}

const TO_RAD_FACTOR = Math.PI / 180;
const TO_DEG_FACTOR = 180 / Math.PI;
function toRadians(degrees)
{
    return degrees * TO_RAD_FACTOR;
}

function toDegrees(radians)
{
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
function topoSort(nodes, dependencyCallback)
{
    let dependencyEntries = [];
    for(let node of nodes)
    {
        let outs = dependencyCallback(node);
        if (Array.isArray(outs))
        {
            dependencyEntries.push([node, ...outs]);
        }
        else if (outs)
        {
            throw new Error('Dependency callback must return an array.');
        }
    }
    return computeDependencyList(
        getNodesFromDependencyEntries(dependencyEntries),
        getEdgesFromDependencyEntries(dependencyEntries)
    );
}

function getNodesFromDependencyEntries(dependencyEntries)
{
    let result = new Set();
    for(let dependencyEntry of dependencyEntries)
    {
        for(let value of dependencyEntry)
        {
            result.add(value);
        }
    }
    return Array.from(result);
}

function getEdgesFromDependencyEntries(dependencyEntries)
{
    let result = [];
    for(let dependencyEntry of dependencyEntries)
    {
        let source = dependencyEntry[0];
        for(let i = 1; i < dependencyEntry.length; ++i)
        {
            let dependency = dependencyEntry[i];
            result.push([source, dependency]);
        }
    }
    return result;
}

function computeDependencyList(nodes, edges, dst = [])
{
    // Compute edge outs (more efficient lookup)
    let edgeOuts = new Map();
    for(let edge of edges)
    {
        if (edge.length > 1)
        {
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
        dst,
    };

    for(let node of nodes)
    {
        visit(context, node, new Set());
    }

    return dst;
}

function visit(context, node, prev)
{
    if (prev.has(node))
    {
        throw new Error(`Found cyclic dependency for '${node.name || node}'.`);
    }
    
    if (context.visited.has(node)) return;
    context.visited.add(node);

    if (context.edgeMap.has(node))
    {
        let outs = context.edgeMap.get(node);
        if (outs.size > 0)
        {
            prev.add(node);
            for(let out of outs)
            {
                visit(context, out, prev);
            }
            prev.delete(node);
        }
    }

    context.dst.push(node);
}

export { Eventable, FILE_TYPE_PNG, FILE_TYPE_SVG, Logger, PriorityQueue, bresenhamLine, clamp, cycle, direction2, distance2, downloadImageFromSVG, downloadText, downloadURL, lerp, lookAt2, toDegrees, toRadians, topoSort, uploadFile, uuid, withinRadius };
