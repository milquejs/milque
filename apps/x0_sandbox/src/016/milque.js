var self = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get default () { return self; },
    get Audio () { return Audio; },
    get Display () { return _default; },
    get DisplayPort () { return DisplayPort; },
    get MODE_CENTER () { return MODE_CENTER; },
    get MODE_FIT () { return MODE_FIT; },
    get MODE_NOSCALE () { return MODE_NOSCALE; },
    get MODE_STRETCH () { return MODE_STRETCH; },
    get View () { return View; },
    get Component () { return ComponentHelper; },
    get ComponentBase () { return ComponentBase; },
    get ComponentFactory () { return ComponentFactory; },
    get Entity () { return EntityHelper; },
    get EntityBase () { return EntityBase; },
    get EntityComponent () { return EntityComponent$1; },
    get EntityManager () { return EntityManager; },
    get EntityQuery () { return EntityQuery; },
    get EntityWrapper () { return EntityWrapper; },
    get FineDiffStrategy () { return FineDiffStrategy; },
    get HotEntityModule () { return HotEntityModule; },
    get HotEntityReplacement () { return HotEntityReplacement; },
    get QueryOperator () { return QueryOperator; },
    get ReflexiveEntity () { return ReflexiveEntity; },
    get TagComponent () { return TagComponent; },
    get AbstractInputAdapter () { return AbstractInputAdapter; },
    get ActionInputAdapter () { return ActionInputAdapter; },
    get DOUBLE_ACTION_TIME () { return DOUBLE_ACTION_TIME; },
    get DoubleActionInputAdapter () { return DoubleActionInputAdapter; },
    get EventKey () { return EventKey; },
    get Input () { return _default$1; },
    get InputContext () { return InputContext; },
    get InputSource () { return InputSource; },
    get Keyboard () { return Keyboard; },
    get Mouse () { return Mouse; },
    get RangeInputAdapter () { return RangeInputAdapter; },
    get StateInputAdapter () { return StateInputAdapter; },
    get Eventable () { return Eventable$1; },
    get PriorityQueue () { return PriorityQueue; },
    get uuid () { return uuid; },
    get AbstractCamera () { return AbstractCamera; },
    get Camera2D () { return Camera2D; },
    get Camera2DControls () { return Camera2DControls; },
    get CameraHelper () { return CameraHelper; },
    get EntitySpawner () { return EntitySpawner; },
    get Game () { return Game; },
    get MouseControls () { return MouseControls; },
    get MoveControls () { return MoveControls; },
    get SceneBase () { return SceneBase; },
    get SceneManager () { return SceneManager; },
    get SplashScene () { return SplashScene; },
    get Transform2D () { return Transform2D; },
    get Random () { return DEFAULT_RANDOM_INTERFACE; },
    get RandomGenerator () { return RandomGenerator; },
    get RandomInterface () { return RandomInterface; },
    get SimpleRandomGenerator () { return SimpleRandomGenerator; },
    get ApplicationLoop () { return ApplicationLoop; },
    get clampRange () { return clampRange; },
    get cycleRange () { return cycleRange; },
    get direction2 () { return direction2; },
    get distance2 () { return distance2; },
    get lerp () { return lerp; },
    get lookAt2 () { return lookAt2; },
    get withinRadius () { return withinRadius; }
});

var audioContext = new AudioContext();

function createSound(filepath, loop = false)
{
    const result = {
        _playing: false,
        _data: null,
        _source: null,
        play()
        {
            if (!this._data) return;
            if (this._source) this.destroy();

            let source = audioContext.createBufferSource();
            source.loop = loop;
            source.buffer = this._data;
            source.addEventListener('ended', () => {
                this._playing = false;
            });
            source.connect(audioContext.destination);
            source.start(0);

            this._source = source;
            this._playing = true;
        },
        pause()
        {
            this._source.stop();
            this._playing = false;
        },
        destroy()
        {
            if (this._source) this._source.disconnect();
            this._source = null;
        },
        isPaused()
        {
            return !this._playing;
        }
    };

    fetch(filepath)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(data => result._data = data);

    return result;
}

var Audio = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createSound: createSound
});

/**
 * @version 1.1.0
 * @description
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
class View
{
    /**
     * Creates a view which facilitates rendering from world to screen space.
     */
    constructor(width = 640, height = 480)
    {
        this._buffer = createViewBuffer(width, height);
        this._width = width;
        this._height = height;
    }

    get canvas() { return this._buffer.canvas; }
    get context() { return this._buffer.context; }

    get width() { return this._width; }
    set width(value)
    {
        this._width = value;
        this._canvas.width = value;
    }
    get height() { return this._height; }
    set height(value)
    {
        this._height = value;
        this._canvas.height = value;
    }

    drawBufferToCanvas(
        targetCanvasContext,
        viewPortX = 0,
        viewPortY = 0,
        viewPortWidth = targetCanvasContext.canvas.clientWidth,
        viewPortHeight = targetCanvasContext.canvas.clientHeight)
    {
        targetCanvasContext.drawImage(this._buffer.canvas,
            viewPortX, viewPortY, viewPortWidth, viewPortHeight);
    }
}

function createViewBuffer(width, height)
{
    let canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.style = 'image-rendering: pixelated';
    let canvasContext = canvasElement.getContext('2d');
    canvasContext.imageSmoothingEnabled = false;
    return { canvas: canvasElement, context: canvasContext };
}

const MODE_NOSCALE = 'noscale';
const MODE_CENTER = 'center';
const MODE_FIT = 'fit';
const MODE_STRETCH = 'stretch';

const DEFAULT_MODE = MODE_CENTER;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;

const INNER_HTML = `
<label class="hidden" id="title">display-port</label>
<label class="hidden" id="fps">00</label>
<label class="hidden" id="dimension">0x0</label>
<canvas></canvas>`;
const INNER_STYLE = `
<style>
    :host {
        display: inline-block;
        color: #555555;
    }
    div {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }
    canvas {
        background: #000000;
        margin: auto;
    }
    label {
        font-family: monospace;
        color: currentColor;
        position: absolute;
    }
    #title {
        left: 0.5rem;
        top: 0.5rem;
    }
    #fps {
        right: 0.5rem;
        top: 0.5rem;
    }
    #dimension {
        left: 0.5rem;
        bottom: 0.5rem;
    }
    .hidden {
        display: none;
    }
    :host([debug]) div {
        outline: 8px dashed rgba(0, 0, 0, 0.4);
        outline-offset: -4px;
        background-color: rgba(0, 0, 0, 0.1);
    }
    :host([mode="${MODE_NOSCALE}"]) canvas {
        margin: 0;
        top: 0;
        left: 0;
    }
    :host([mode="${MODE_FIT}"]), :host([mode="${MODE_CENTER}"]), :host([mode="${MODE_STRETCH}"]) {
        width: 100%;
        height: 100%;
    }
    :host([full]) {
        width: 100vw!important;
        height: 100vh!important;
    }
    :host([disabled]) {
        display: none;
    }
</style>`;

/**
 * @version 1.5.0
 * @description
 * # Changelog
 * ## 1.5.0
 * - Added clear()
 * - Added delta time for frame events
 * ## 1.4.0
 * - Added onframe and onresize attribute callbacks
 * - Added "stretch" mode
 * ## 1.3.0
 * - Changed "topleft" to "noscale"
 * - Changed default size to 640 x 480
 * - Changed "center" and "fit" to fill container instead of viewport
 * - Added "full" property to override and fill viewport
 * ## 1.2.0
 * - Moved default values to the top
 * ## 1.1.0
 * - Fixed scaling issues when dimensions do not match
 * ## 1.0.0
 * - Created DisplayPort
 * 
 * @fires frame Every time a new frame is rendered.
 * @fires resize When the display is resized.
 */
class DisplayPort extends HTMLElement
{
    /** @override */
    static get observedAttributes()
    {
        return [
            'width',
            'height',
            'disabled',
            // Event handlers...
            'onframe',
            /*
            // NOTE: Already handled by GlobalEventHandlers...
            'onresize',
            */
            // NOTE: For debuggin purposes...
            'debug',
            // ...listening for built-in attribs...
            'id',
            'class',
        ];
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<div>${INNER_STYLE}${INNER_HTML}</div>`;

        this._canvasElement = this.shadowRoot.querySelector('canvas');
        this._canvasContext = this._canvasElement.getContext('2d');
        this._canvasContext.imageSmoothingEnabled = false;

        this._titleElement = this.shadowRoot.querySelector('#title');
        this._fpsElement = this.shadowRoot.querySelector('#fps');
        this._dimensionElement = this.shadowRoot.querySelector('#dimension');

        this._animationRequestHandle = 0;
        this._prevAnimationFrameTime = 0;

        this._width = DEFAULT_WIDTH;
        this._height = DEFAULT_HEIGHT;

        this._onframe = null;
        /*
        // NOTE: Already handled by GlobalEventHandlers...
        this._onresize = null;
        */

        this.update = this.update.bind(this);
    }
    
    /** @override */
    connectedCallback()
    {
        if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;

        this.updateCanvasSize();
        this.resume();
    }

    /** @override */
    disconnectedCallback()
    {
        this.pause();
    } 

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'width':
                this._width = value;
                break;
            case 'height':
                this._height = value;
                break;
            case 'disabled':
                if (value)
                {
                    this.update(0);
                    this.pause();
                }
                else
                {
                    this.resume();
                }
                break;
            // Event handlers...
            case 'onframe':
                this.onframe = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            /*
            // NOTE: Already handled by GlobalEventHandlers...
            case 'onresize':
                this.onresize = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            */
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
    }

    update(now)
    {
        this._animationRequestHandle = requestAnimationFrame(this.update);

        this.updateCanvasSize();
        const delta = now - this._prevAnimationFrameTime;
        this._prevAnimationFrameTime = now;

        // NOTE: For debugging purposes...
        if (this.debug)
        {
            // Update FPS...
            const frames = delta <= 0 ? '--' : String(Math.round(1000 / delta)).padStart(2, '0');
            if (this._fpsElement.innerText !== frames)
            {
                this._fpsElement.innerText = frames;
            }

            // Update dimensions...
            if (this.mode === MODE_NOSCALE)
            {
                let result = `${this._width}x${this._height}`;
                if (this._dimensionElement.innerText !== result)
                {
                    this._dimensionElement.innerText = result;
                }
            }
            else
            {
                let result = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
                if (this._dimensionElement.innerText !== result)
                {
                    this._dimensionElement.innerText = result;
                }
            }
        }

        this.dispatchEvent(new CustomEvent('frame', {
            detail: {
                now,
                prev: this._prevAnimationFrameTime,
                delta,
                context: this._canvasContext
            },
            bubbles: false,
            composed: true
        }));
    }

    pause()
    {
        cancelAnimationFrame(this._animationRequestHandle);
    }

    resume()
    {
        this._animationRequestHandle = requestAnimationFrame(this.update);
    }

    clear(fill = undefined)
    {
        if (fill)
        {
            this._canvasContext.fillStyle = 'black';
            this._canvasContext.fillRect(0, 0, this._canvasElement.clientWidth, this._canvasElement.clientHeight);
        }
        else
        {
            this._canvasContext.clearRect(0, 0, this._canvasElement.clientWidth, this._canvasElement.clientHeight);
        }
    }

    updateCanvasSize()
    {
        let clientRect = this.shadowRoot.host.getBoundingClientRect();
        const clientWidth = clientRect.width;
        const clientHeight = clientRect.height;

        let canvas = this._canvasElement;
        let canvasWidth = this._width;
        let canvasHeight = this._height;

        const mode = this.mode;

        if (mode === MODE_STRETCH)
        {
            canvasWidth = clientWidth;
            canvasHeight = clientHeight;
        }
        else if (mode !== MODE_NOSCALE)
        {
            let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;
            if (flag)
            {
                let ratioX = clientWidth / canvasWidth;
                let ratioY = clientHeight / canvasHeight;

                if (ratioX < ratioY)
                {
                    canvasWidth = clientWidth;
                    canvasHeight = canvasHeight * ratioX;
                }
                else
                {
                    canvasWidth = canvasWidth * ratioY;
                    canvasHeight = clientHeight;
                }
            }
        }

        canvasWidth = Math.floor(canvasWidth);
        canvasHeight = Math.floor(canvasHeight);

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight)
        {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;
            this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
        }
    }

    getCanvas() { return this._canvasElement; }
    getContext() { return this._canvasContext; }

    /*
    // NOTE: Already handled by GlobalEventHandlers...
    get onresize() { return this._onresize; }
    set onresize(value)
    {
        if (this._onresize) this.removeEventListener('resize', this._onresize);
        this._onresize = value;
        if (this._onresize) this.addEventListener('resize', value);
    }
    */

    get onframe() { return this._onframe; }
    set onframe(value)
    {
        if (this._onframe) this.removeEventListener('frame', this._onframe);
        this._onframe = value;
        if (this._onframe) this.addEventListener('frame', value);
    }

    get width() { return this._width; }
    set width(value) { this.setAttribute('width', value); }

    get height() { return this._height; }
    set height(value) { this.setAttribute('height', value); }

    get mode() { return this.getAttribute('mode'); }
    set mode(value) { this.setAttribute('mode', value); }

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value) { if (value) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

    // NOTE: For debugging purposes...
    get debug() { return this.hasAttribute('debug'); }
    set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
}
window.customElements.define('display-port', DisplayPort);

/**
 * @module Display
 */

var canvas;
var context;

// Default setup...
window.addEventListener('DOMContentLoaded', () => {
    if (!canvas)
    {
        let canvasElement = null;
        let canvasContext = null;

        // Try resolve to <display-port> if exists...
        let displayElement = document.querySelector('display-port');
        if (displayElement)
        {
            canvasElement = displayElement.getCanvas();
            canvasContext = displayElement.getContext();
        }
        // Otherwise, find a <canvas> element...
        else
        {
            canvasElement = document.querySelector('canvas');
        }

        if (canvasElement)
        {
            if (!canvasContext) canvasContext = canvasElement.getContext('2d');
            attachCanvas(canvasElement, canvasContext);
        }
    }
});

function createCanvas(width = 320, height = width, parentElement = document.body)
{
    const canvasElement = document.createElement('canvas');
    parentElement.appendChild(canvasElement);
    attachCanvas(canvasElement, width, height);
}

function attachCanvas(canvasElement, canvasContext, width = 320, height = width)
{
    canvas = canvasElement;
    context = canvasContext;
    canvas.width = width;
    canvas.height = height;
}

function drawBufferToScreen(ctx, viewportOffsetX = 0, viewportOffsetY = 0, viewportWidth = getClientWidth(), viewportHeight = getClientHeight())
{
    getDrawContext().drawImage(ctx.canvas, viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight);
}

function getCanvas()
{
    return canvas;
}

function getDrawContext()
{
    return context;
}

function getClientWidth()
{
    return canvas.clientWidth;
}

function getClientHeight()
{
    return canvas.clientHeight;
}

function getClientOffsetX()
{
    return canvas.offsetLeft;
}

function getClientOffsetY()
{
    return canvas.offsetTop;
}

var _default = /*#__PURE__*/Object.freeze({
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

function getComponentTypeName$1(componentType)
{
    return componentType.name || componentType.toString();
}

var ComponentHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getComponentTypeName: getComponentTypeName$1
});

const OPERATOR$1 = Symbol('operator');
const HANDLER$1 = Symbol('handler');

/**
 * NOTE: Intentionally does not depend on the "entityManager" to exist in order to be created.
 */
class EntityQuery
{
    static select(entityManager, components)
    {
        return new EntityQuery(components, false).select(entityManager);
    }

    static computeKey(components)
    {
        let result = [];
        for(let component of components)
        {
            if (typeof component === 'object' && OPERATOR$1 in component)
            {
                result.push(component[OPERATOR$1].toString() + getComponentTypeName$1(component));
            }
            else
            {
                result.push(getComponentTypeName$1(component));
            }
        }
        return result.sort().join('-');
    }

    constructor(components, persistent = true)
    {
        this._included = [];
        this._operated = {};

        for(let component of components)
        {
            if (typeof component === 'object' && OPERATOR$1 in component)
            {
                const operator = component[OPERATOR$1];
                if (operator in this._operated)
                {
                    this._operated[operator].components.push(component.component);
                }
                else
                {
                    this._operated[operator] = {
                        components: [component.component],
                        handler: component[HANDLER$1],
                    };
                }
            }
            else
            {
                this._included.push(component);
            }
        }

        this.entityManager = null;
        this.persistent = persistent;
        this.entityIds = new Set();

        this.key = EntityQuery.computeKey(components);

        this.onEntityCreate = this.onEntityCreate.bind(this);
        this.onEntityDestroy = this.onEntityDestroy.bind(this);
        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);
    }

    matches(entityManager, entityId)
    {
        if (this.entityManager !== entityManager) return false;
        if (!entityManager.hasComponent(entityId, ...this._included)) return false;
        for(let operatedInfo of Object.getOwnPropertyNames(this._operated))
        {
            if (!operatedInfo[HANDLER$1].call(this, entityManager, entityId, operatedInfo.components))
            {
                return false;
            }
        }
        return true;
    }

    select(entityManager)
    {
        let flag = this.entityManager === entityManager;
        if (this.persistent && flag) return this.entityIds;
        
        const prevEntityManager = this.entityManager;
        this.entityManager = entityManager;
        this.entityIds.clear();

        for(let entityId of entityManager.getEntityIds())
        {
            if (this.matches(entityManager, entityId))
            {
                this.entityIds.add(entityId);
            }
        }

        if (this.persistent && !flag)
        {
            if (prevEntityManager)
            {
                prevEntityManager.entityHandler.off('create', this.onEntityCreate);
                prevEntityManager.entityHandler.off('destroy', this.onEntityDestroy);
                prevEntityManager.componentHandler.off('add', this.onComponentAdd);
                prevEntityManager.componentHandler.off('remove', this.onComponentRemove);
            }

            this.entityManager.entityHandler.on('create', this.onEntityCreate);
            this.entityManager.entityHandler.on('destroy', this.onEntityDestroy);
            this.entityManager.componentHandler.on('add', this.onComponentAdd);
            this.entityManager.componentHandler.on('remove', this.onComponentRemove);
        }

        return this.entityIds;
    }

    selectComponent(entityManager, component = this._included[0])
    {
        let result = this.select(entityManager);
        let dst = [];
        for(let entityId of result)
        {
            dst.push(entityManager.getComponent(entityId, component));
        }
        return dst;
    }

    clear()
    {
        if (this.persistent)
        {
            this.entityManager.entityHandler.off('create', this.onEntityCreate);
            this.entityManager.entityHandler.off('destroy', this.onEntityDestroy);
            this.entityManager.componentHandler.off('add', this.onComponentAdd);
            this.entityManager.componentHandler.off('remove', this.onComponentRemove);
        }

        this.entityIds.clear();
        this.entityManager = null;
    }

    onEntityCreate(entityId)
    {
        if (this.matches(this.entityManager, entityId))
        {
            this.entityIds.add(entityId);
        }
    }

    onEntityDestroy(entityId)
    {
        if (this.entityIds.has(entityId))
        {
            this.entityIds.delete(entityId);
        }
    }

    onComponentAdd(entityId, componentType, component, initialValues)
    {
        this.onComponentRemove(entityId, componentType, component);
    }
    
    // NOTE: Could be further optimized if we know it ONLY contains includes, etc.
    onComponentRemove(entityId, componentType, component)
    {
        if (this.matches(this.entityManager, entityId))
        {
            this.entityIds.add(entityId);
        }
        else if (this.entityIds.has(entityId))
        {
            this.entityIds.delete(entityId);
        }
    }
}

/**
 * @fires destroy
 */
class EntityHandler
{
    constructor()
    {
        this._entities = new Set();
        this._nextAvailableEntityId = 1;
        this._listeners = new Map();
    }

    /**
     * Adds a listener for entity events that occur for the passed-in id.
     * 
     * @param {EntityId} entityId The associated id for the entity to listen to.
     * @param {String} eventType The event type to listen for.
     * @param {Function} listener The listener function that will be called when the event occurs.
     * @param {Object} [opts] Additional options.
     * @param {Boolean} [opts.once=false] Whether the listener should be invoked at most once after being
     * added. If true, the listener would be automatically removed when invoked.
     * @param {Function|String|*} [opts.handle=listener] The handle to uniquely identify the listener. If set,
     * this will be used instead of the function instance. This is usful for anonymous functions, since
     * they are always unique and therefore cannot be removed, causing an unfortunate memory leak.
     */
    addEntityListener(entityId, eventType, listener, opts = undefined)
    {
        const handle = opts && typeof opts.handle !== 'undefined' ? opts.handle : listener;
        
        if (this._listeners.has(entityId))
        {
            let eventMap = this._listeners.get(entityId);
            if (eventType in eventMap)
            {
                let listeners = eventMap[eventType];
                listeners.set(handle, listener);
            }
            else
            {
                let listeners = new Map();
                listeners.set(handle, listener);
                eventMap[eventType] = listeners;
            }
        }
        else
        {
            let onces = new Set();
            let listeners = new Map();
            listeners.set(handle, listener);
            if (opts.once) onces.add(handle);
            let eventMap = {
                onces,
                [eventType]: listeners
            };
            this._listeners.set(entityId, eventMap);
        }
    }

    /**
     * Removes the listener from the entity with the passed-in id.
     * 
     * @param {EntityId} entityId The associated id for the entity to remove from.
     * @param {String} eventType The event type to remove from.
     * @param {Function|String|*} handle The listener handle that will be called when the event occurs.
     * Usually, this is the function itself.
     * @param {Object} [opts] Additional options.
     */
    removeEntityListener(entityId, eventType, handle, opts = undefined)
    {
        if (this._listeners.has(entityId))
        {
            let eventMap = this._listeners.get(entityId);
            if (eventType in eventMap)
            {
                eventMap[eventType].delete(handle);
                if (eventMap.onces.has(handle))
                {
                    eventMap.onces.delete(handle);
                }
            }
        }
    }

    /**
     * Dispatches an event to all the entity's listeners.
     * 
     * @param {EntityId} entityId The id of the entity.
     * @param {String} eventType The type of the dispatched event.
     * @param {Array} [eventArgs] An array of arguments to be passed to the listeners.
     */
    dispatchEntityEvent(entityId, eventType, eventArgs = undefined)
    {
        if (this._listeners.has(entityId))
        {
            let eventMap = this._listeners.get(entityId);
            if (eventType in eventMap)
            {
                let onces = eventMap.onces;
                let listeners = eventMap[eventType];
                for(let [handle, listener] of listeners.entries())
                {
                    listener.apply(undefined, eventArgs);
                    if (onces.has(handle))
                    {
                        listeners.delete(handle);
                    }
                }
            }
        }
    }

    addEntityId(entityId)
    {
        this._entities.add(entityId);
    }

    deleteEntityId(entityId)
    {
        this._entities.delete(entityId);
        this.dispatchEntityEvent(entityId, 'destroy', [ entityId ]);
    }

    hasEntityId(entityId)
    {
        return this._entities.has(entityId);
    }
    
    getNextAvailableEntityId()
    {
        return this._nextAvailableEntityId++;
    }

    getEntityIds()
    {
        return this._entities;
    }
}

/** Cannot be directly added through world.addComponent(). Must be create with new EntityComponent(). */
class EntityComponent$1
{
    constructor(world)
    {
        if (!world)
        {
            throw new Error('Cannot create entity in null world.');
        }

        const id = world.createEntity();

        // Skip component creation, as we will be using ourselves :D
        world.componentHandler.putComponent(id, EntityComponent$1, this, undefined);
        
        this.id = id;
    }

    /** @override */
    copy(values) { throw new Error('Unsupported operation; cannot be initialized by existing values.'); }
    
    /** @override */
    reset() { return false; }
}

/**
 * @fires componentadd
 * @fires componentremove
 */
class ComponentHandler
{
    constructor(entityHandler)
    {
        this._entityHandler = entityHandler;
        this.componentTypeInstanceMap = new Map();
    }

    createComponent(componentType, initialValues)
    {
        let component;

        // Instantiate the component...
        let type = typeof componentType;
        if (type === 'object')
        {
            // NOTE: Although this checks the prototype chain on EVERY add, it only
            // checks on the class object, which should NOT have a chain.
            if (!('create' in componentType))
            {
                throw new Error(`Instanced component class '${getComponentTypeName(componentType)}' must at least have a static create() function.`);
            }

            component = componentType.create(this);
        }
        else if (type === 'function')
        {
            // HACK: This is a hack debugging tool to stop wrong use.
            if (componentType.prototype instanceof EntityComponent$1)
            {
                throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
            }

            component = new componentType(this);
        }
        else if (type === 'symbol')
        {
            // NOTE: Symbols lose their immutability when converted into a component
            // (their equality is checked by their toString() when computing its key)
            throw new Error('Symbols are not yet supported as components.');
        }
        else
        {
            // NOTE: This means that these can be numbers and strings.
            // HOWEVER, I caution against using numbers. Numbers can often be confused
            // with other operations (particularly when computation is involved).
            component = componentType;
        }

        // Initialize the component...
        if (initialValues)
        {
            this.copyComponent(componentType, component, initialValues);
        }
        
        return component;
    }

    putComponent(entityId, componentType, component = componentType, initialValues = undefined)
    {
        let componentInstanceMap;
        if (this.componentTypeInstanceMap.has(componentType))
        {
            componentInstanceMap = this.componentTypeInstanceMap.get(componentType);
        }
        else
        {
            this.componentTypeInstanceMap.set(componentType, componentInstanceMap = new Map());
        }

        if (componentInstanceMap.has(entityId))
        {
            throw new Error(`Cannot add more than one instance of component class '${getComponentTypeName(componentType)}' for entity '${entityId}'.`);
        }

        componentInstanceMap.set(entityId, component);

        this._entityHandler.dispatchEntityEvent(entityId, 'componentadd', [entityId, componentType, component, initialValues]);
    }

    deleteComponent(entityId, componentType, component)
    {
        this.componentTypeInstanceMap.get(componentType).delete(entityId);
    
        let reusable;
        // It's a tag. No reuse.
        if (componentType === component)
        {
            reusable = false;
        }
        // Try user-defined static reset...
        else if ('reset' in componentType)
        {
            reusable = componentType.reset(component);
        }
        // Try user-defined instance reset...
        else if ('reset' in component)
        {
            reusable = component.reset();
        }
        // Try default reset...
        else
        {
            // Do nothing. It cannot be reset.
            reusable = false;
        }

        this._entityHandler.dispatchEntityEvent(entityId, 'componentremove', [entityId, componentType, component]);
        return component;
    }

    copyComponent(componentType, component, targetValues)
    {
        // It's a tag. No need to copy.
        if (componentType === component)
        {
            return;
        }
        // Try user-defined static copy...
        else if ('copy' in componentType)
        {
            componentType.copy(component, targetValues);
        }
        // Try user-defined instance copy...
        else if ('copy' in component)
        {
            component.copy(targetValues);
        }
        // Try default copy...
        else
        {
            for(let key of Object.getOwnPropertyNames(targetValues))
            {
                component[key] = targetValues[key];
            }
        }
    }

    hasComponentType(componentType)
    {
        return this.componentTypeInstanceMap.has(componentType);
    }

    getComponentTypes()
    {
        return this.componentTypeInstanceMap.keys();
    }

    getComponentInstanceMapByType(componentType)
    {
        return this.componentTypeInstanceMap.get(componentType);
    }

    getComponentInstanceMaps()
    {
        return this.componentTypeInstanceMap.values();
    }
}

/**
 * @typedef EntityId
 * The unique id for every entity in a world.
 */

/**
 * Manages all entities.
 */
class EntityManager
{
    constructor()
    {
        this.entityHandler = new EntityHandler();
        this.componentHandler = new ComponentHandler(this.entityHandler);
    }

    clear()
    {
        for(let entityId of this.entityHandler.getEntityIds())
        {
            this.destroyEntity(entityId);
        }
    }

    /** Creates a unique entity with passed-in components (without initial values). */
    createEntity(...components)
    {
        const entityId = this.entityHandler.getNextAvailableEntityId();
        this.entityHandler.addEntityId(entityId);

        for(let component of components)
        {
            this.addComponent(entityId, component);
        }
        return entityId;
    }

    /** Destroys the passed-in entity (and its components). */
    destroyEntity(entityId)
    {
        // Remove entity components from world
        for(let componentType of this.componentHandler.getComponentTypes())
        {
            if (this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId))
            {
                this.removeComponent(entityId, componentType);
            }
        }

        // Remove entity from world
        this.entityHandler.deleteEntityId(entityId);
    }

    hasEntity(entityId)
    {
        return this.entityHandler.hasEntityId(entityId);
    }

    getEntityIds()
    {
        return this.entityHandler.getEntityIds();
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
    addComponent(entityId, componentType, initialValues = undefined)
    {
        try
        {
            let component = this.componentHandler.createComponent(componentType, initialValues);
            this.componentHandler.putComponent(entityId, componentType, component, initialValues);
            return component;
        }
        catch(e)
        {
            console.error(`Failed to add component '${getComponentTypeName$1(componentType)}' to entity '${entityId}'.`);
            console.error(e);
        }
    }

    addTagComponent(entityId, componentType)
    {
        try
        {
            let type = typeof componentType;
            if (type === 'symbol')
            {
                throw new Error('Symbols are not yet supported as tag components.');
            }
            else if (type === 'number')
            {
                throw new Error('Numbers are not yet supported as tag components.');
            }
            else if (type === 'string')
            {
                this.componentHandler.putComponent(entityId, componentType);
            }
            else
            {
                throw new Error(`Component of type '${type}' cannot be a tag component.`);
            }
            return componentType;
        }
        catch(e)
        {
            console.error(`Failed to add tag component '${getComponentTypeName$1(componentType)}' to entity '${entityId}'.`);
            console.error(e);
        }
    }
    
    removeComponent(entityId, componentType)
    {
        try
        {
            let component = this.getComponent(entityId, componentType);
            this.componentHandler.deleteComponent(entityId, componentType, component);
            return component;
        }
        catch(e)
        {
            console.error(`Failed to remove component '${getComponentTypeName$1(componentType)}' from entity '${entityId}'.`);
            console.error(e);
        }
    }

    clearComponents(entityId)
    {
        for(let componentInstanceMap of this.componentHandler.getComponentInstanceMaps())
        {
            if (componentInstanceMap.has(entityId))
            {
                let component = componentInstanceMap.get(entityId);
                this.componentHandler.deleteComponent(entityId, componentType, component);
            }
        }
    }

    getComponentTypesByEntityId(entityId)
    {
        let dst = [];
        for(let componentType of this.componentHandler.getComponentTypes())
        {
            let componentInstanceMap = this.componentHandler.getComponentInstanceMapByType(componentType);
            if (componentInstanceMap.has(entityId))
            {
                dst.push(componentType);
            }
        }
        return dst;
    }

    getComponent(entityId, componentType)
    {
        return this.componentHandler.getComponentInstanceMapByType(componentType).get(entityId);
    }

    hasComponent(entityId, ...componentTypes)
    {
        for(let componentType of componentTypes)
        {
            if (!this.componentHandler.hasComponentType(componentType)) return false;
            if (!this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId)) return false;
        }
        return true;
    }

    countComponents(entityId)
    {
        let count = 0;
        for(let componentInstanceMap of this.componentHandler.getComponentInstanceMaps())
        {
            if (componentInstanceMap.has(entityId))
            {
                ++count;
            }
        }
        return count;
    }

    /**
     * Immediately find entity ids by its components. This is simply an alias for Query.select().
     * @param {Array<Component>} components The component list to match entities to.
     * @returns {Iterable<EntityId>} A collection of all matching entity ids.
     */
    find(components)
    {
        return EntityQuery.select(this, components);
    }

    [Symbol.iterator]()
    {
        return this.getEntityIds()[Symbol.iterator]();
    }
}

function createQueryOperator(handler, key = Symbol(handler.name))
{
    let result = function(componentType) {
        return { [OPERATOR]: key, [HANDLER]: handler, component: componentType };
    };
    // Dynamic renaming of function for debugging purposes
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
    Object.defineProperty(result, 'name', {
        value: name,
        configurable: true,
    });
    return result;
}

const Not = createQueryOperator(
    function NotOperator(world, entityId, componentTypees)
    {
        return !(world.hasComponent(entityId, ...componentTypees));
    },
    Symbol('!')
);

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
function createComponentFactory(name, create = defaultCreate, copy = defaultCopy, reset = defaultReset)
{
    return {
        name,
        create,
        copy,
        reset
    };
}

function defaultCreate(world, entityId) { return {}; }
function defaultCopy(dst, values) { Object.assign(dst, values); }
function defaultReset(dst) { Object.getOwnPropertyNames(dst).forEach(value => delete dst[value]); }

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
const DEFAULT_UNDEFINED = Symbol('defaultUndefined');
class ComponentBase
{
    static get defaultValues() { return null; }

    constructor(world, entityId, resetAsSelfConstructor = true)
    {
        if (!('defaultValues' in this.constructor))
        {
            if (resetAsSelfConstructor)
            {
                // NOTE: Must make sure 'defaultValues' exists before recursing into the constructor.
                this.constructor.defaultValues = null;
                this.constructor.defaultValues = new (this.constructor)();
            }
            else
            {
                this.constructor.defaultValues = DEFAULT_UNDEFINED;
            }
        }
    }
    
    copy(values)
    {
        for(let key of Object.getOwnPropertyNames(values))
        {
            this[key] = values[key];
        }
    }

    reset()
    {
        if ('defaultValues' in this.constructor)
        {
            let defaultValues = this.constructor.defaultValues;
            if (defaultValues === DEFAULT_UNDEFINED)
            {
                for(let key of Object.getOwnPropertyNames(this))
                {
                    this[key] = undefined;
                }
                return true;
            }
            else if (defaultValues)
            {
                this.copy(this, this.constructor.defaultValues);
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}

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
class TagComponent {}

class EntityBase extends EntityComponent$1
{
    constructor(entityManager)
    {
        super(entityManager);

        this.entityManager = entityManager;
    }

    destroy()
    {
        this.entityManager.destroyEntity(this.id);
    }

    addComponent(componentType, initialValues = undefined)
    {
        this.entityManager.addComponent(this.id, componentType, initialValues);
        return this;
    }

    addTagComponent(componentType)
    {
        this.entityManager.addTagComponent(this.id, componentType);
        return this;
    }

    removeComponent(componentType)
    {
        this.entityManager.removeComponent(this.id, componentType);
        return this;
    }

    hasComponent(componentType)
    {
        return this.entityManager.hasComponent(this.id, componentType);
    }

    getComponent(componentType)
    {
        return this.entityManager.getComponent(this.id, componentType);
    }
}

class ReflexiveEntity extends EntityBase
{
    constructor(entityManager)
    {
        super(entityManager);

        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);

        this.entityManager.entityHandler.addEntityListener(this.id, 'componentadd', this.onComponentAdd);
        this.entityManager.entityHandler.addEntityListener(this.id, 'componentremove', this.onComponentRemove);
    }
    
    /** @abstract */
    onDestroy() {}

    onComponentAdd(entityId, componentType, component, initialValues)
    {
        if (this.id !== entityId) return;

        // NOTE: Since this callback is connected only AFTER EntityComponent has been added
        // we can safely assume that it cannot be added again.
        addComponentProperties(this, componentType, component);
    }

    onComponentRemove(entityId, componentType, component)
    {
        if (this.id !== entityId) return;
        
        if (componentType === EntityComponent$1)
        {
            this.entityManager.entityHandler.removeEntityListener(this.id, 'componentadd', this.onComponentAdd);
            this.entityManager.entityHandler.removeEntityListener(this.id, 'componentremove', this.onComponentRemove);
            
            this.onDestroy();
        }
        else
        {
            removeComponentProperties(this, componentType, component);
        }
    }
}

function addComponentProperties(target, componentType, component)
{
    if (typeof component === 'object')
    {
        let ownProps = Object.getOwnPropertyNames(target);
        let newProps = {};
        for(let prop of Object.getOwnPropertyNames(component))
        {
            if (ownProps.includes(prop))
            {
                throw new Error(`Conflicting property names in entity for component '${getComponentTypeName(componentType)}'.`);
            }

            newProps[prop] = {
                get() { return component[prop]; },
                set(value) { component[prop] = value; },
                configurable: true,
            };
        }
        Object.defineProperties(target, newProps);
    }
}

function removeComponentProperties(target, componentType, component)
{
    if (typeof component === 'object')
    {
        for(let prop of Object.getOwnPropertyNames(component))
        {
            delete target[prop];
        }
    }
}

function getEntityById(world, entityId)
{
    return getComponent(entityId, EntityComponent);
}

function getEntities(world)
{
    let dst = [];
    let entityIds = world.query([EntityComponent]);
    for(let entityId of entityIds)
    {
        let component = world.getComponent(entityId, EntityComponent);
        dst.push(component);
    }
    return dst;
}

var EntityHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getEntityById: getEntityById,
    getEntities: getEntities
});

class EntityWrapperBase
{
    constructor(entityManager)
    {
        this.entityManager = entityManager;

        this.id = entityManager.createEntity();
    }

    add(componentType, initialValues = undefined)
    {
        this.entityManager.addComponent(this.id, componentType, initialValues);
        return this;
    }

    remove(componentType)
    {
        this.entityManager.removeComponent(this.id, componentType);
        return this;
    }

    has(...componentTypes)
    {
        return this.entityManager.hasComponent(this.id, ...componentTypes);
    }

    destroy()
    {
        this.entityManager.destroyEntity(this.id);
    }

    getEntityId() { return this.id; }
}

function create(entityManager)
{
    return new EntityWrapperBase(entityManager);
}

var EntityWrapper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EntityWrapperBase: EntityWrapperBase,
    create: create
});

const FUNCTION_NAME = Symbol('functionName');
const FUNCTION_ARGS = Symbol('functionArguments');

function resolveObject(target, path = [])
{
    let node = target;
    for(let p of path)
    {
        if (typeof p === 'object' && FUNCTION_NAME in p)
        {
            node = node[p[FUNCTION_NAME]](...p[FUNCTION_ARGS]);
        }
        else
        {
            node = node[p];
        }
    }
    return node;
}

function nextProperty(parentPath, nextKey)
{
    return [
        ...parentPath,
        nextKey,
    ];
}

function nextFunction(parentPath, functionName, functionArguments = [])
{
    return [
        ...parentPath,
        {
            [FUNCTION_NAME]: functionName,
            [FUNCTION_ARGS]: functionArguments,
        }
    ];
}

class DiffList extends Array
{
    static createRecord(type, key, value = undefined, path = [])
    {
        return {
            type,
            path,
            key,
            value,
        };
    }

    addRecord(type, key, value = undefined, path = [])
    {
        let result = DiffList.createRecord(type, key, value, path);
        this.push(result);
        return result;
    }

    addRecords(records)
    {
        this.push(...records);
    }
}

function applyDiff(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'new':
        case 'edit':
            sourceProp[diff.key] = diff.value;
            return true;
        case 'delete':
            delete sourceProp[diff.key];
            return true;
    }
    return false;
}

function computeDiff(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    let sourceKeys = new Set(Object.getOwnPropertyNames(source));
    for(let key of Object.getOwnPropertyNames(target))
    {
        if (!sourceKeys.has(key))
        {
            dst.addRecord('new', key, target[key], path);
        }
        else
        {
            sourceKeys.delete(key);
            let result = computeDiff$4(source[key], target[key], nextProperty(path, key), opts);
            if (!result)
            {
                dst.addRecord('edit', key, target[key], path);
            }
            else
            {
                dst.addRecords(result);
            }
        }
    }
    if (!opts.preserveSource)
    {
        for(let sourceKey of sourceKeys)
        {
            dst.addRecord('delete', sourceKey, undefined, path);
        }
    }
    return dst;
}

function isType(arg)
{
    return Array.isArray(arg);
}

function applyDiff$1(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'arrayObjectEdit':
            sourceProp[diff.key] = diff.value;
            return true;
        case 'arrayObjectAppend':
            ensureCapacity(diff.key);
            sourceProp[diff.key] = diff.value;
            return true;
        case 'arrayObjectSplice':
            sourceProp.splice(diff.key, diff.value);
            return true;
    }
    return false;
}

function computeDiff$1(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    const length = Math.min(source.length, target.length);
    for(let i = 0; i < length; ++i)
    {
        let result = computeDiff$4(source[i], target[i], nextProperty(path, i), opts);
        if (!result)
        {
            dst.addRecord('arrayObjectEdit', i, target[i], path);
        }
        else
        {
            dst.addRecords(result);
        }
    }

    if (!opts.preserveSource && source.length > target.length)
    {
        dst.addRecord('arrayObjectSplice', target.length, source.length - target.length, path);
    }
    else if (target.length > source.length)
    {
        for(let i = source.length; i < target.length; ++i)
        {
            dst.addRecord('arrayObjectAppend', i, target[i], path);
        }
    }
    return dst;
}

function ensureCapacity(array, capacity)
{
    if (array.length < capacity)
    {
        array.length = capacity;
    }
}

var ArrayObjectDiff = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isType: isType,
    applyDiff: applyDiff$1,
    computeDiff: computeDiff$1
});

function isType$1(arg)
{
    return arg instanceof Set;
}

function applyDiff$2(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'setAdd':
            sourceProp.add(diff.key);
            return true;
        case 'setDelete':
            sourceProp.delete(diff.key);
            return true;
    }
    return false;
}

// NOTE: If the set's contents are objects, there is no way to "update" that object.
// Therefore, this diff only works if NEW objects are added. This is the case for
// any object with indexed with keys. Keys MUST be checked with '===' and CANNOT be diffed.
function computeDiff$2(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    for(let value of target)
    {
        if (!source.has(value))
        {
            dst.addRecord('setAdd', value, undefined, path);
        }
    }
    if (!opts.preserveSource)
    {
        for(let value of source)
        {
            if (!target.has(value))
            {
                dst.addRecord('setDelete', value, undefined, path);
            }
        }
    }
    return dst;
}

var SetDiff = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isType: isType$1,
    applyDiff: applyDiff$2,
    computeDiff: computeDiff$2
});

function isType$2(arg)
{
    return arg instanceof Map;
}

function applyDiff$3(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'mapNew':
        case 'mapSet':
            sourceProp.set(diff.key, diff.value);
            return true;
        case 'mapDelete':
            sourceProp.delete(diff.key);
            return true;
    }
    return false;
}

// NOTE: Same as set diffing, keys MUST be checked with '===' and CANNOT be diffed.
// Although values can.
function computeDiff$3(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    for(let [key, value] of target)
    {
        if (!source.has(key))
        {
            dst.addRecord('mapNew', key, value, path);
        }
        else
        {
            let result = computeDiff$4(source.get(key), value, nextFunction(path, 'get', [ key ]), opts);
            if (!result)
            {
                dst.addRecord('mapSet', key, value, path);
            }
            else
            {
                dst.addRecords(result);
            }
        }
    }
    if (!opts.preserveSource)
    {
        for(let key of source.keys())
        {
            if (!target.has(key))
            {
                dst.addRecord('mapDelete', key, undefined, path);
            }
        }
    }
    return dst;
}

var MapDiff = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isType: isType$2,
    applyDiff: applyDiff$3,
    computeDiff: computeDiff$3
});

const DEFAULT_HANDLERS = [
    ArrayObjectDiff,
    MapDiff,
    SetDiff,
];

const DEFAULT_OPTS = {
    handlers: DEFAULT_HANDLERS,
    preserveSource: true,
    maxDepth: 1000,
};

function computeDiff$4(source, target, path = [], opts = DEFAULT_OPTS)
{
    // Force replacement since we have reached maximum depth...
    if (path.length >= opts.maxDepth) return null;
    // Check if type at least matches...
    if (typeof source !== typeof target) return null;
    // If it's an object...(which there are many kinds)...
    if (typeof source === 'object')
    {
        for(let handler of opts.handlers)
        {
            let type = handler.isType(source);
            if (type ^ (handler.isType(target))) return null;
            if (type) return handler.computeDiff(source, target, path, opts);
        }

        // It's probably just a simple object...
        return computeDiff(source, target, path, opts);
    }
    else
    {
        // Any other primitive types...
        if (source === target) return [];
        else return null;
    }
}

function applyDiff$4(source, diffList, opts = DEFAULT_OPTS)
{
    let sourceProp = source;
    for(let diff of diffList)
    {
        // Find property...
        sourceProp = resolveObject(source, diff.path);

        // Apply property diff...
        let flag = false;
        for(let handler of opts.handlers)
        {
            flag = handler.applyDiff(source, sourceProp, diff);
            if (flag) break;
        }

        // Apply default property diff...
        if (!flag)
        {
            applyDiff(source, sourceProp, diff);
        }
    }
    return source;
}

/**
 * Performs a fine diff on the entities and reconciles any changes with the current world state.
 * It respects the current world state with higher precedence over the modified changes. In other
 * words, any properties modified by the running program will be preserved. Only properties that
 * have not changed will be modified to reflect the new changes.
 * 
 * This assumes entity constructors are deterministic, non-reflexive, and repeatable in a blank
 * test world.
 * 
 * @param {HotEntityModule} prevHotEntityModule The old source hot entity module instance.
 * @param {HotEntityModule} nextHotEntityModule The new target hot entity module instance.
 * @param {Object} [opts] Any additional options.
 * @param {Function} [opts.worldObjectWrapper] If defined, the function will allow you wrap the create EntityManager
 * and specify the shape of the "world" parameter given to the entity constructors. The function takes in an instance
 * of EntityManager and returns an object to pass to the constructors.
 */
function FineDiffStrategy(prevHotEntityModule, nextHotEntityModule, opts = undefined)
{
    const prevEntityConstructor = prevHotEntityModule.entityConstructor;
    const prevEntityManagers = prevHotEntityModule.entityManagers;
    const nextEntityConstructor = nextHotEntityModule.entityConstructor;
    const nextEntityManagers = nextHotEntityModule.entityManagers;

    let cacheEntityManager = new EntityManager();
    let cacheWorld = (opts && opts.worldObjectWrapper)
        ? opts.worldObjectWrapper(cacheEntityManager)
        : cacheEntityManager;
    let oldEntity = prevEntityConstructor(cacheWorld);
    let newEntity = nextEntityConstructor(cacheWorld);

    // Diff the old and new components...only update what has changed...
    let componentValues = new Map();
    for(let componentType of cacheEntityManager.getComponentTypesByEntityId(newEntity))
    {
        let newComponent = cacheEntityManager.getComponent(newEntity, componentType);
        let oldComponent = cacheEntityManager.getComponent(oldEntity, componentType);

        if (!oldComponent)
        {
            // ...it's an addition!
            componentValues.set(componentType, true);
        }
        else
        {
            // ...it's an update!
            let result = computeDiff$4(oldComponent, newComponent);
            componentValues.set(componentType, result);
        }
    }
    for(let componentType of cacheEntityManager.getComponentTypesByEntityId(oldEntity))
    {
        if (!componentValues.has(componentType))
        {
            // ...it's a deletion!
            componentValues.set(componentType, false);
        }
    }

    // Clean up cache entity manager...
    cacheEntityManager.clear();

    // Update all existing entity managers to the new entities...
    for(let entityManager of prevEntityManagers)
    {
        // Update entities...
        for(let entity of prevHotEntityModule.entities.get(entityManager).values())
        {
            for(let [componentType, values] of componentValues.entries())
            {
                if (typeof values === 'boolean')
                {
                    if (values)
                    {
                        // Addition!
                        entityManager.addComponent(entity, componentType);
                    }
                    else
                    {
                        // Deletion!
                        entityManager.removeComponent(entity, componentType);
                    }
                }
                else
                {
                    // Update!
                    let component = entityManager.getComponent(entity, componentType);
                    applyDiff$4(component, values);
                }
            }
        }
    }
}

class HotEntityModule
{
    constructor(entityModule, entityConstructor)
    {
        this.moduleId = entityModule.id;
        this.entityConstructor = entityConstructor;

        this.entities = new Map();
    }

    addEntity(entityManager, entityId)
    {
        if (this.entities.has(entityManager))
        {
            this.entities.get(entityManager).add(entityId);
        }
        else
        {
            let entitySet = new Set();
            entitySet.add(entityId);
            this.entities.set(entityManager, entitySet);
        }

        // Add listener...
        entityManager.entityHandler.addEntityListener(
            entityId,
            'destroy',
            this.removeEntity.bind(this, entityManager, entityId),
            { handle: `${this.moduleId}:${entityId}` }
        );
    }

    removeEntity(entityManager, entityId)
    {
        // Remove listener...(just in case this was not triggered by a destroy event)...
        entityManager.entityHandler.removeEntityListener(
            entityId,
            'destroy',
            `${this.moduleId}:${entityId}`);
        
        let entitySet = this.entities.get(entityManager);
        entitySet.delete(entityId);
        if (entitySet.size <= 0) this.entities.delete(entityManager);
    }

    /**
     * Replaces the current state of with the next one. This includes all entities and entity managers.
     * However, it assumes both hot entity replacements are for the same module.
     * 
     * @param {HotEntityModule} nextHotEntityModule The new hot entity module object to replace this with.
     * @param {Object} [opts] Any additional options.
     * @param {Function} [opts.replaceStrategy] If defined, replacement will be handled by the passed in
     * function. It takes 3 arguemtns: the hot entity replacement instance, the target instance, and the replaceOpts if defined.
     * @param {Object} [opts.replaceOpts] This is given to the replacement strategy function, if defined.
     */
    replaceWith(nextHotEntityModule, opts = undefined)
    {
        // NOTE: Assumes more than one instance can exist at the same time.
        // NOTE: Assumes components do not store self references (nor their own entity id).
        // NOTE: Assumes you don't use objects in sets (unless they are immutable)...cause those are evil.

        const replaceStrategy = (opts && opts.replaceStrategy) || FineDiffStrategy;
        replaceStrategy.call(
            undefined,
            this,
            nextHotEntityModule,
            opts && opts.replaceOpts,
        );

        // Copy the new constructor over...
        this.entityConstructor = nextHotEntityModule.entityConstructor;

        // Copy any new entities over...
        for(let entityManager of nextHotEntityModule.entityManagers)
        {
            for(let entity of nextHotEntityModule.entities.get(entityManager).values())
            {
                nextHotEntityModule.removeEntity(entityManager, entity);
                this.addEntity(entityManager, entity);
            }
        }
    }

    isEmpty()
    {
        return this.entities.size <= 0;
    }

    get entityManagers()
    {
        return this.entities.keys();
    }
}

const HOT_ENTITY_MODULES = new Map();

function enableForEntity(entityModule, entityManager, entityId)
{
    if (!HOT_ENTITY_MODULES.has(entityModule.id))
    {
        throw new Error('Module must be accepted first for HER to enable hot entity replacement.');
    }

    let hotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
    hotEntityModule.addEntity(entityManager, entityId);
    return entityId;
}

function acceptForModule(entityModule, entityConstructor, worldConstructor = undefined)
{
    let newHotEntityModule = new HotEntityModule(entityModule, entityConstructor);
    if (HOT_ENTITY_MODULES.has(entityModule.id))
    {
        console.log(`Reloading '${entityModule.id}'...`);
        let oldHotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
        oldHotEntityModule.replaceWith(newHotEntityModule, worldConstructor);
    }
    else
    {
        console.log(`Preparing '${entityModule.id}'...`);
        HOT_ENTITY_MODULES.set(entityModule.id, newHotEntityModule);
    }

    return entityModule;
}

function getInstanceForModuleId(entityModuleId)
{
    return HER_MODULES.get(entityModuleId);
}

var HotEntityReplacement = /*#__PURE__*/Object.freeze({
    __proto__: null,
    enableForEntity: enableForEntity,
    acceptForModule: acceptForModule,
    getInstanceForModuleId: getInstanceForModuleId
});

const ANY = Symbol('any');

class EventKey
{
    static parse(eventKeyString)
    {
        let startCodeIndex = eventKeyString.indexOf('[');
        let endCodeIndex = eventKeyString.indexOf(']');
        let modeIndex = eventKeyString.indexOf('.');
    
        let source = null;
        let code = null;
        let mode = null;
    
        // For ANY source, use `[code].mode` or `.mode`
        // For ONLY codes and modes from source, use `source`
        if (startCodeIndex <= 0 || modeIndex === 0) source = ANY;
        else source = eventKeyString.substring(0, startCodeIndex);
    
        // For ANY code, use `source.mode` or `source[].mode`
        // For ONLY sources and modes for code, use `[code]`
        if (startCodeIndex < 0 || endCodeIndex < 0 || startCodeIndex + 1 === endCodeIndex) code = ANY;
        else code = eventKeyString.substring(startCodeIndex + 1, endCodeIndex);
    
        // For ANY mode, use `source[code]` or `source[code].`
        // For ONLY sources and codes for mode, use `.mode`
        if (modeIndex < 0 || eventKeyString.trim().endsWith('.')) mode = ANY;
        else mode = eventKeyString.substring(modeIndex + 1);
    
        return new EventKey(
            source,
            code,
            mode
        );
    }

    constructor(source, code, mode)
    {
        this.source = source;
        this.code = code;
        this.mode = mode;

        this.string = `${this.source.toString()}[${this.code.toString()}].${this.mode.toString()}`;
    }

    matches(eventKey)
    {
        if (this.source === ANY || eventKey.source === ANY || this.source === eventKey.source)
        {
            if (this.code === ANY || eventKey.code === ANY || this.code === eventKey.code)
            {
                if (this.mode === ANY || eventKey.mode === ANY || this.mode === eventKey.mode)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** @override */
    toString() { return this.string; }
}
// NOTE: Exported as a static variable of EventKey
EventKey.ANY = ANY;

class AbstractInputAdapter
{
    constructor(defaultValue)
    {
        this.prev = defaultValue;
        this.value = defaultValue;
        this.next = defaultValue;
    }

    update(eventKey, value) { return false; }
    consume() { return this.next; }

    poll()
    {
        this.prev = this.value;
        this.value = this.next;
        this.next = this.consume();
        return this;
    }
}

class ActionInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyStrings)
    {
        super(false);

        this.eventKeys = [];
        for(let eventKeyString of eventKeyStrings)
        {
            this.eventKeys.push(EventKey.parse(eventKeyString));
        }
    }

    /** @override */
    consume() { return false; }

    /** @override */
    update(eventKey, value = true)
    {
        for(let targetEventKey of this.eventKeys)
        {
            if (targetEventKey.matches(eventKey))
            {
                this.next = value;
                return true;
            }
        }
        return false;
    }
}

class RangeInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyString)
    {
        super(0);

        this.eventKey = EventKey.parse(eventKeyString);
    }

    /** @override */
    consume()
    {
        switch(this.eventKey.string)
        {
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
    update(eventKey, value = 1)
    {
        if (this.eventKey.matches(eventKey))
        {
            this.next = value;
            return true;
        }
        return false;
    }
}

class StateInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyMap)
    {
        super(0);
        
        this.eventKeyEntries = [];
        for(let eventKey of Object.keys(eventKeyMap))
        {
            this.eventKeyEntries.push({
                key: EventKey.parse(eventKey),
                value: eventKeyMap[eventKey]
            });
        }
    }

    /** @override */
    update(eventKey, value = true)
    {
        if (value)
        {
            for(let eventKeyEntry of this.eventKeyEntries)
            {
                if (eventKeyEntry.key.matches(eventKey))
                {
                    this.next = eventKeyEntry.value;
                    return true;
                }
            }
        }
        return false;
    }
}

const MIN_CONTEXT_PRIORITY = -100;
const MAX_CONTEXT_PRIORITY = 100;

function createContext()
{
    return {
        _source: null,
        _priority: 0,
        _active: true,
        inputs: new Map(),
        get active() { return this._active; },
        get source() { return this._source; },
        get priority() { return this._priority; },
        attach(inputSource)
        {
            this._source = inputSource;
            this._source.addContext(this);
            return this;
        },
        detach()
        {
            this._source.removeContext(this);
            this._source = null;
            return this;
        },
        setPriority(priority)
        {
            if (priority > MAX_CONTEXT_PRIORITY || priority < MIN_CONTEXT_PRIORITY)
            {
                throw new Error(`Context priority must be between [${MIN_CONTEXT_PRIORITY}, ${MAX_CONTEXT_PRIORITY}].`);
            }
            
            if (this._priority !== priority)
            {
                if (this._source)
                {
                    this._source.removeContext(this);
                    this._priority = priority;
                    this._source.addContext(this);
                }
                else
                {
                    this._priority = priority;
                }
            }
            return this;
        },
        registerInput(name, adapter)
        {
            this.inputs.set(name, adapter);
            return adapter;
        },
        registerAction(name, ...eventKeyStrings)
        {
            return this.registerInput(name, new ActionInputAdapter(eventKeyStrings));
        },
        registerRange(name, eventKeyString)
        {
            return this.registerInput(name, new RangeInputAdapter(eventKeyString));
        },
        registerState(name, eventKeyMap)
        {
            return this.registerInput(name, new StateInputAdapter(eventKeyMap));
        },
        toggle(force = undefined)
        {
            if (typeof force === 'undefined') force = !this._active;
            this._active = force;
            return this;
        },
        enable() { return this.toggle(true); },
        disable() { return this.toggle(false); },
        poll()
        {
            for(let adapter of this.inputs.values())
            {
                adapter.poll();
            }
        },
        update(eventKey, value)
        {
            let result;
            for(let adapter of this.inputs.values())
            {
                result |= adapter.update(eventKey, value);
            }
            return result;
        }
    };
}

var InputContext = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MIN_CONTEXT_PRIORITY: MIN_CONTEXT_PRIORITY,
    MAX_CONTEXT_PRIORITY: MAX_CONTEXT_PRIORITY,
    createContext: createContext
});

class Mouse
{
    constructor()
    {
        this.sourceElement = null;
        this.eventHandler = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    attach(sourceElement = document)
    {
        this.sourceElement = sourceElement;
        this.sourceElement.addEventListener('mousedown', this.onMouseDown);
        this.sourceElement.addEventListener('mouseup', this.onMouseUp);
        this.sourceElement.addEventListener('contextmenu', this.onContextMenu);
        document.addEventListener('mousemove', this.onMouseMove);
        return this;
    }

    detach()
    {
        this.sourceElement.removeEventListener('mousedown', this.onMouseDown);
        this.sourceElement.removeEventListener('mouseup', this.onMouseUp);
        this.sourceElement.removeEventListener('contextmenu', this.onContextMenu);
        document.removeEventListener('mousemove', this.onMouseMove);
        this.sourceElement = null;
        return this;
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onMouseDown(e)
    {
        if (!this.eventHandler) return;

        let result;
        result = this.eventHandler.call(this, `mouse[${e.button}].down`, true);

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onMouseUp(e)
    {
        if (!this.eventHandler) return;

        e.preventDefault();
        e.stopPropagation();
        
        this.eventHandler.call(this, `mouse[${e.button}].up`, true);
    }

    onMouseMove(e)
    {
        if (!this.eventHandler) return;

        const clientCanvas = this.sourceElement;
        const clientWidth = clientCanvas.clientWidth;
        const clientHeight = clientCanvas.clientHeight;
        
        this.eventHandler.call(this, 'mouse[pos].x', (e.pageX - clientCanvas.offsetLeft) / clientWidth);
        this.eventHandler.call(this, 'mouse[pos].y', (e.pageY - clientCanvas.offsetTop) / clientHeight);
        this.eventHandler.call(this, 'mouse[pos].dx', e.movementX / clientWidth);
        this.eventHandler.call(this, 'mouse[pos].dy', e.movementY / clientHeight);
    }

    onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }
}

class Keyboard
{
    constructor()
    {
        this.sourceElement = null;
        this.eventHandler = null;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    attach(sourceElement = document)
    {
        this.sourceElement = sourceElement;
        this.sourceElement.addEventListener('keydown', this.onKeyDown);
        this.sourceElement.addEventListener('keyup', this.onKeyUp);
        return this;
    }

    detach()
    {
        this.sourceElement.removeEventListener('keydown', this.onKeyDown);
        this.sourceElement.removeEventListener('keyup', this.onKeyUp);
        this.sourceElement = null;
        return this;
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onKeyDown(e)
    {
        if (!this.eventHandler) return;

        let result;
        if (e.repeat)
        {
            result = this.eventHandler.call(this, `key[${e.key}].repeat`, true);
        }
        else
        {
            result = this.eventHandler.call(this, `key[${e.key}].down`, true);
        }

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onKeyUp(e)
    {
        if (!this.eventHandler) return;

        let result;
        result = this.eventHandler.call(this, `key[${e.key}].up`, true);
        
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}

/**
 * @module InputSource
 */

function createSource()
{
    let result = {
        _contexts: new Array(MAX_CONTEXT_PRIORITY - MIN_CONTEXT_PRIORITY),
        element: null,
        keyboard: new Keyboard(),
        mouse: new Mouse(),
        attach(element)
        {
            this.element = element;
            this.keyboard.attach();
            this.mouse.attach(element);
            return this;
        },
        detach()
        {
            this.element = null;
            this.keyboard.detach();
            this.mouse.detach();
            return this;
        },
        addContext(context)
        {
            const priority = context.priority - MIN_CONTEXT_PRIORITY;
            if (!this._contexts[priority]) this._contexts[priority] = [];
            this._contexts[priority].push(context);
            return this;
        },
        removeContext(context)
        {
            const priority = context.priority - MIN_CONTEXT_PRIORITY;
            let contexts = this._contexts[priority];
            if (contexts)
            {
                contexts.splice(contexts.indexOf(context), 1);
            }
            return this;
        },
        poll()
        {
            for(let contexts of this._contexts)
            {
                if (contexts)
                {
                    for(let context of contexts)
                    {
                        if (context.active)
                        {
                            context.poll();
                        }
                    }
                }
            }
        },
        handleEvent(eventKeyString, value)
        {
            const eventKey = EventKey.parse(eventKeyString);
            for(let contexts of this._contexts)
            {
                if (contexts)
                {
                    for(let context of contexts)
                    {
                        if (context.active)
                        {
                            let result;
                            result = context.update(eventKey, value);
                            if (result)
                            {
                                return true;
                            }
                        }
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

var InputSource = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createSource: createSource
});

let DOUBLE_ACTION_TIME = 300;

class DoubleActionInputAdapter extends ActionInputAdapter
{
    constructor(eventKeyStrings)
    {
        super(eventKeyStrings);

        this.actionTime = 0;
    }

    /** @override */
    update(eventKey, value = true)
    {
        let currentTime = Date.now();
        for(let targetEventKey of this.eventKeys)
        {
            if (targetEventKey.matches(eventKey))
            {
                if (value)
                {
                    if (currentTime - this.actionTime <= DOUBLE_ACTION_TIME)
                    {
                        this.actionTime = 0;
                        this.next = true;
                        return true;
                    }
                    else
                    {
                        this.actionTime = currentTime;
                        return false;
                    }
                }
                else
                {
                    this.next = false;
                    return true;
                }
            }
        }
        return false;
    }
}

/**
 * @module Input
 */

var source = createSource();
var context$1 = createContext().attach(source);

// Default setup...
window.addEventListener('DOMContentLoaded', () => {
    if (!source.element)
    {
        let canvasElement = null;

        // Try resolve to <display-port> if exists...
        let displayElement = document.querySelector('display-port');
        if (displayElement)
        {
            canvasElement = displayElement.getCanvas();
        }
        // Otherwise, find a <canvas> element...
        else
        {
            canvasElement = document.querySelector('canvas');
        }

        if (canvasElement)
        {
            attachCanvas$1(canvasElement);
        }
    }
});

function attachCanvas$1(canvasElement)
{
    if (source.element) source.detach();
    return source.attach(canvasElement);
}

function createContext$1(priority = 0, active = true)
{
    return createContext().setPriority(priority).toggle(active).attach(source);
}

function createInput(adapter)
{
    return context$1.registerInput(getNextInputName(), adapter);
}

function createAction(...eventKeyStrings)
{
    return context$1.registerAction(getNextInputName(), ...eventKeyStrings);
}

function createRange(eventKeyString)
{
    return context$1.registerRange(getNextInputName(), eventKeyString);
}

function createState(eventKeyMap)
{
    return context$1.registerState(getNextInputName(), eventKeyMap);
}

function poll()
{
    return source.poll();
}

function handleEvent(eventKeyString, value)
{
    return source.handleEvent(eventKeyString, value);
}

var nextInputNameId = 1;
function getNextInputName()
{
    return `__input#${nextInputNameId++}`;
}

var _default$1 = /*#__PURE__*/Object.freeze({
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

    _compare(i, j)
    {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j)
    {
        let result = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = result;
    }

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
function create$1(context = undefined)
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

var Eventable = {
    create: create$1,
    assign,
    mixin
};

var Eventable$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$1,
    assign: assign,
    mixin: mixin,
    'default': Eventable
});

const DELTA_TIME_FACTOR = 1 / 1000;
const MAX_FIXED_UPDATES = 250;

/**
 * @version 1.4.0
 * @description
 * Handles a steady update loop.
 * 
 * # Changelog
 * ## 1.5.0
 * - Renamed to ApplicationLoop
 * ## 1.4.0
 * - Removed Eventable in favor of addEventListener()
 * - Changed GameLoop into a web component
 * ## 1.3.0
 * - Removed frameTime in favor of deltaTimeFactor
 * - Moved static start()/stop() for game loop to modules
 * ## 1.2.0
 * - Fixed incrementing dt on window blur
 * - Fixed large dt on first frame
 * ## 1.1.0
 * - Added pause and resume
 * ## 1.0.0
 * - Create GameLoop
 * 
 * @fires start
 * @fires stop
 * @fires pause
 * @fires resume
 * @fires update
 * @fires preupdate
 * @fires postupdate
 * @fires fixedupdate
 */
class ApplicationLoop extends HTMLElement
{
    static currentTime() { return performance.now(); }

    /** @override */
    static get observedAttributes()
    {
        return [
            // Event handlers...
            'onstart',
            'onstop',
            'onpreupdate',
            'onupdate',
            'onfixedupdate',
            'onpostupdate',
            'onpause',
            'onresume',
        ];
    }

    constructor(startImmediately = true, controlled = false)
    {
        super();

        this._controlled = controlled;
        this._connectedStart = startImmediately;
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

    setFixedUpdatesPerSecond(count)
    {
        this.fixedTimeStep = 1 / count;
        return this;
    } 

    /** @override */
    connectedCallback()
    {
        // If the window is out of focus, just ignore the time.
        window.addEventListener('focus', this.onWindowFocus);
        window.addEventListener('blur', this.onWindowBlur);

        if (this._connectedStart) this.start();
    }

    /** @override */
    disconnectedCallback()
    {
        // If the window is out of focus, just ignore the time.
        window.removeEventListener('focus', this.onWindowFocus);
        window.removeEventListener('blur', this.onWindowBlur);

        this.stop();
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            // Event handlers...
            case 'onstart':
                this._onstart = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onstop':
                this._onstop = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onpreupdate':
                this._onpreupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onupdate':
                this._onupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onfixedupdate':
                this._onfixedupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onpostupdate':
                this._onpostupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onpause':
                this._onpause = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
            case 'onresume':
                this._onresume = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                break;
        }
    }

    onWindowFocus()
    {
        if (!this.started) return;
        this.resume();
    }

    onWindowBlur()
    {
        if (!this.started) return;
        this.pause();
    }

    /**
     * Runs the game loop. If this is a controlled game loop, it will call itself
     * continuously until stop() or pause().
     */
    onAnimationFrame(now)
    {
        if (this._controlled) throw new Error('Cannot run controlled game loop; call step() instead.');
        if (!this.started) throw new Error('Must be called after start().');

        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.step(now);
    }

    /** Runs one update step for the game loop. This is usually called 60 times a second. */
    step(now = ApplicationLoop.currentTime())
    {
        if (!this.started) return false;

        const delta = (now - this.prevFrameTime) * DELTA_TIME_FACTOR;
        this.prevFrameTime = now;
        
        if (this.paused) return false;

        this.dispatchEvent(new CustomEvent('preupdate', {
            detail: { delta },
            bubbles: false,
            composed: true
        }));

        this.dispatchEvent(new CustomEvent('update', {
            detail: { delta },
            bubbles: false,
            composed: true
        }));

        this.prevAccumulatedTime += delta;
        if (this.prevAccumulatedTime > MAX_FIXED_UPDATES * this.fixedTimeStep)
        {
            let max = MAX_FIXED_UPDATES * this.fixedTimeStep;
            let count = (this.prevAccumulatedTime - max) / this.fixedTimeStep;
            this.prevAccumulatedTime = max;
            console.error(`[ApplicationLoop] Too many updates! Skipped ${count} fixed updates.`);
        }

        while(this.prevAccumulatedTime >= this.fixedTimeStep)
        {
            this.prevAccumulatedTime -= this.fixedTimeStep;
            this.dispatchEvent(new CustomEvent('fixedupdate', {
                bubbles: false,
                composed: true
            }));
        }

        this.dispatchEvent(new CustomEvent('postupdate', {
            detail: { delta },
            bubbles: false,
            composed: true
        }));
    }

    /** Starts the game loop. Calls run(), unless recursive is set to false. */
    start()
    {
        if (this.started) throw new Error('Loop already started.');

        this.started = true;
        this.prevFrameTime = ApplicationLoop.currentTime();

        this.dispatchEvent(new CustomEvent('start', {
            bubbles: false,
            composed: true
        }));
        
        if (!this.controlled)
        {
            this.onAnimationFrame(this.prevFrameTime);
        }
    }

    /** Stops the game loop. */
    stop()
    {
        if (!this.started) throw new Error('Loop not yet started.');

        this.started = false;

        this.dispatchEvent(new CustomEvent('stop', {
            bubbles: false,
            composed: true
        }));

        if (!this._controlled)
        {
            if (this.animationFrameHandle)
            {
                cancelAnimationFrame(this.animationFrameHandle);
                this.animationFrameHandle = null;
            }
        }
    }

    /** Pauses the game loop. */
    pause()
    {
        if (this.paused) return;

        this.paused = true;
        
        this.dispatchEvent(new CustomEvent('pause', {
            bubbles: false,
            composed: true
        }));
    }

    /** Resumes the game loop. */
    resume()
    {
        if (!this.pause) return;

        this.paused = false;

        this.dispatchEvent(new CustomEvent('resume', {
            bubbles: false,
            composed: true
        }));
    }

    get onstart() { return this._onstart; }
    set onstart(value)
    {
        if (this._onstart) this.removeEventListener('start', this._onstart);
        this._onstart = value;
        if (this._onstart) this.addEventListener('start', value);
    }

    get onstop() { return this._onstop; }
    set onstop(value)
    {
        if (this._onstop) this.removeEventListener('stop', this._onstop);
        this._onstop = value;
        if (this._onstop) this.addEventListener('stop', value);
    }

    get onpreupdate() { return this._onpreupdate; }
    set onpreupdate(value)
    {
        if (this._onpreupdate) this.removeEventListener('preupdate', this._onpreupdate);
        this._onpreupdate = value;
        if (this._onpreupdate) this.addEventListener('preupdate', value);
    }

    get onupdate() { return this._onupdate; }
    set onupdate(value)
    {
        if (this._onupdate) this.removeEventListener('update', this._onupdate);
        this._onupdate = value;
        if (this._onupdate) this.addEventListener('update', value);
    }

    get onfixedupdate() { return this._onfixedupdate; }
    set onfixedupdate(value)
    {
        if (this._onfixedupdate) this.removeEventListener('fixedupdate', this._onfixedupdate);
        this._onfixedupdate = value;
        if (this._onfixedupdate) this.addEventListener('fixedupdate', value);
    }

    get onpostupdate() { return this._onpostupdate; }
    set onpostupdate(value)
    {
        if (this._onpostupdate) this.removeEventListener('postupdate', this._onpostupdate);
        this._onpostupdate = value;
        if (this._onpostupdate) this.addEventListener('postupdate', value);
    }

    get onpause() { return this._onpause; }
    set onpause(value)
    {
        if (this._onpause) this.removeEventListener('pause', this._onpause);
        this._onpause = value;
        if (this._onpause) this.addEventListener('pause', value);
    }

    get onresume() { return this._onresume; }
    set onresume(value)
    {
        if (this._onresume) this.removeEventListener('resume', this._onresume);
        this._onresume = value;
        if (this._onresume) this.addEventListener('resume', value);
    }
}
window.customElements.define('application-loop', ApplicationLoop);

function clampRange(value, min, max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function withinRadius(fromX, fromY, toX, toY, radius)
{
    const dx = fromX - toX;
    const dy = fromY - toY;
    return dx * dx + dy * dy <= radius * radius
}

function lerp(a, b, dt)
{
    return a + (b - a) * dt;
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
    let step = cycleRange(target - radians, -Math.PI, Math.PI);
    return clampRange(radians + step, radians - dt, radians + dt);
}

function cycleRange(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}

const CONTEXT = _default$1.createContext().disable();
const POS_X = CONTEXT.registerRange('x', 'mouse[pos].x');
const POS_Y = CONTEXT.registerRange('y', 'mouse[pos].y');
/*
// FIXME: This consumes all input for some reason...
export const DOWN = CONTEXT.registerState('down', {
    'mouse.up': 0,
    'mouse.down': 1,
});
*/
const LEFT_DOWN = CONTEXT.registerState('ldown', {
    'mouse[0].up': 0,
    'mouse[0].down': 1,
});
const RIGHT_DOWN = CONTEXT.registerState('rdown', {
    'mouse[2].up': 0,
    'mouse[2].down': 1,
});
const CLICK = CONTEXT.registerAction('click', 'mouse.up');
const LEFT_CLICK = CONTEXT.registerAction('lclick', 'mouse[0].up');
const RIGHT_CLICK = CONTEXT.registerAction('rclick', 'mouse[2].up');

var MouseControls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CONTEXT: CONTEXT,
    POS_X: POS_X,
    POS_Y: POS_Y,
    LEFT_DOWN: LEFT_DOWN,
    RIGHT_DOWN: RIGHT_DOWN,
    CLICK: CLICK,
    LEFT_CLICK: LEFT_CLICK,
    RIGHT_CLICK: RIGHT_CLICK
});

const CONTEXT$1 = _default$1.createContext().disable();
const UP = CONTEXT$1.registerState('up', {
    'key[ArrowUp].up': 0,
    'key[ArrowUp].down': 1,
    'key[w].up': 0,
    'key[w].down': 1
});
const DOWN = CONTEXT$1.registerState('down', {
    'key[ArrowDown].up': 0,
    'key[ArrowDown].down': 1,
    'key[s].up': 0,
    'key[s].down': 1
});
const LEFT = CONTEXT$1.registerState('left', {
    'key[ArrowLeft].up': 0,
    'key[ArrowLeft].down': 1,
    'key[a].up': 0,
    'key[a].down': 1
});
const RIGHT = CONTEXT$1.registerState('right', {
    'key[ArrowRight].up': 0,
    'key[ArrowRight].down': 1,
    'key[d].up': 0,
    'key[d].down': 1
});

var MoveControls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CONTEXT: CONTEXT$1,
    UP: UP,
    DOWN: DOWN,
    LEFT: LEFT,
    RIGHT: RIGHT
});

function drawText(ctx, text, x, y, radians = 0, fontSize = 16, color = 'white')
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    if (radians) ctx.rotate(-radians);
    ctx.translate(-x, -y);
}

const GAME_INFO_PROPERTY = Symbol('gameInfo');

function getGameInfo(instance)
{
    return instance[GAME_INFO_PROPERTY];
}

async function begin(game)
{
    let instance = await loadGame(game);
    return startGame(instance);
}

async function end(instance)
{
    stopGame(instance);
    await unloadGame(instance);
    return instance;
}

async function loadGame(game)
{
    if (!game) game = {};

    let instance = (game.load && await game.load(game))
        || (Object.isExtensible(game) && game)
        || {};
    
    let gameInfo = {
        game,
        view: null,
        viewport: null,
        display: null,
        loop: null,
        onframe: onFrame.bind(undefined, instance),
        onpreupdate: onPreUpdate.bind(undefined, instance),
        onupdate: onUpdate.bind(undefined, instance),
        onfixedupdate: onFixedUpdate.bind(undefined, instance),
        onpostupdate: onPostUpdate.bind(undefined, instance),
        onfirstupdate: onFirstUpdate.bind(undefined, instance),
    };
    
    Object.defineProperty(instance, GAME_INFO_PROPERTY, {
        value: gameInfo,
        enumerable: false,
        configurable: true,
    });
    
    return instance;
}

function startGame(instance)
{
    let displayPort = document.querySelector('display-port');
    if (!displayPort)
    {
        displayPort = new DisplayPort();
        displayPort.toggleAttribute('full');
        displayPort.toggleAttribute('debug');
        document.body.appendChild(displayPort);
    }
    
    let view = instance.view || new View();
    let viewport = instance.viewport || {
        x: 0, y: 0,
        get width() { return displayPort.getCanvas().clientWidth; },
        get height() { return displayPort.getCanvas().clientHeight; },
    };

    let applicationLoop = new ApplicationLoop();

    let gameInfo = instance[GAME_INFO_PROPERTY];
    gameInfo.view = view;
    gameInfo.viewport = viewport;
    gameInfo.display = displayPort;
    gameInfo.loop = applicationLoop;
    
    applicationLoop.addEventListener('update', gameInfo.onfirstupdate, { once: true });
    applicationLoop.start();

    return instance;
}

function onFirstUpdate(instance, e)
{
    let { game, display, loop, onpreupdate, onupdate, onpostupdate, onfixedupdate, onframe } = instance[GAME_INFO_PROPERTY];

    if (game.start) game.start.call(instance);

    onpreupdate.call(instance,e);
    onupdate.call(instance, e);
    onfixedupdate.call(instance, e);
    onpostupdate.call(instance, e);

    loop.addEventListener('preupdate', onpreupdate);
    loop.addEventListener('update', onupdate);
    loop.addEventListener('fixedupdate', onfixedupdate);
    loop.addEventListener('postupdate', onpostupdate);
    display.addEventListener('frame', onframe);
}

function onPreUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;
    if (game.preupdate) game.preupdate.call(instance, dt);
}

function onUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;
    if (game.update) game.update.call(instance, dt);
}

function onFixedUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    if (game.fixedupdate) game.fixedupdate.call(instance);
}

function onPostUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;
    if (game.postupdate) game.postupdate.call(instance, dt);
}

function onFrame(instance, e)
{
    let { game, display, view, viewport } = instance[GAME_INFO_PROPERTY];
    let ctx = e.detail.context;

    // Reset any transformations...
    view.context.setTransform(1, 0, 0, 1, 0, 0);
    view.context.clearRect(0, 0, view.width, view.height);

    if (game.render) game.render.call(instance, view, instance);

    display.clear('black');
    view.drawBufferToCanvas(
        ctx,
        viewport.x,
        viewport.y,
        viewport.width,
        viewport.height
    );
}

async function pauseGame(instance)
{
    let { loop } = instance[GAME_INFO_PROPERTY];
    loop.pause();
}

async function resumeGame(instance)
{
    let { loop } = instance[GAME_INFO_PROPERTY];
    loop.resume();
}

function stopGame(instance)
{
    let { game, loop, display, onframe, onpreupdate, onupdate, onfixedupdate, onpostupdate, onfirstupdate } = instance[GAME_INFO_PROPERTY];

    loop.removeEventListener('update', onfirstupdate);
    loop.removeEventListener('preupdate', onpreupdate);
    loop.removeEventListener('update', onupdate);
    loop.removeEventListener('fixedupdate', onfixedupdate);
    loop.removeEventListener('postupdate', onpostupdate);
    display.removeEventListener('frame', onframe);

    loop.stop();
    if (game.stop) game.stop.call(instance);
    return instance;
}

async function unloadGame(instance)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    if (game.unload) await game.unload(instance);
    return instance;
}

async function nextGame(fromInstance, toGame)
{
    await end(fromInstance);
    let result = await begin(toGame);
    return result;
}

var Game = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getGameInfo: getGameInfo,
    begin: begin,
    end: end,
    loadGame: loadGame,
    startGame: startGame,
    pauseGame: pauseGame,
    resumeGame: resumeGame,
    stopGame: stopGame,
    unloadGame: unloadGame,
    nextGame: nextGame
});

const LOAD_TIME = 250;
const FADE_IN_TIME = LOAD_TIME * 0.3;
const FADE_OUT_TIME = LOAD_TIME * 0.9;

const CONTEXT$2 = _default$1.createContext().disable();
const ANY_KEY = CONTEXT$2.registerAction('continue', 'key.down', 'mouse.down');

class SplashScene
{
    constructor(splashText, nextScene)
    {
        this.splashText = splashText;
        this.nextScene = nextScene;
    }

    /** @override */
    async load(game)
    {
        CONTEXT$2.enable();
    }

    /** @override */
    async unload(game)
    {
        CONTEXT$2.disable();
    }

    /** @override */
    onStart()
    {
        this.time = 0;
    }
    
    /** @override */
    onUpdate(dt)
    {
        this.time += dt;
        // Skip loading...
        if (ANY_KEY.value && this.time > FADE_IN_TIME && this.time < FADE_OUT_TIME)
        {
            this.time = FADE_OUT_TIME;
        }
        // Continue to next scene...
        if (this.time > LOAD_TIME) undefined(this.nextScene);
    }
    
    /** @override */
    onRender(ctx, view, world)
    {
        let opacity = 0;
        if (world.time < FADE_IN_TIME)
        {
            opacity = world.time / (FADE_IN_TIME);
        }
        else if (world.time > FADE_OUT_TIME)
        {
            opacity = (LOAD_TIME - world.time) / (LOAD_TIME - FADE_OUT_TIME);
        }
        else
        {
            opacity = 1;
        }
        drawText(ctx, this.splashText, view.width / 2, view.height / 2, 0, 16, `rgba(255, 255, 255, ${opacity})`);
    }
}

function createSpawner(entityFactory)
{
    return {
        entities: new Set(),
        factory: entityFactory,
        create(...args)
        {
            return this.factory.apply(null, args);
        },
        destroy(entity)
        {
            this.entities.delete(entity);
        },
        spawn(...args)
        {
            let entity = this.create(...args);
            this.entities.add(entity);
            return entity;
        },
        clear()
        {
            this.entities.clear();
        },
        [Symbol.iterator]()
        {
            return this.entities.values();
        }
    };
}

var EntitySpawner = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createSpawner: createSpawner
});

const NO_TRANSITION = {};

class SceneManager
{
    constructor()
    {
        this.registry = new Map();
        this.sharedContext = {};

        this._scene = null;
        this._nextScene = null;
        this._nextLoadOpts = null;
        this._nextTransition = null;
    }

    /** Shared contexts are persistent across scenes of this manager. */
    setSharedContext(context)
    {
        this.sharedContext = context;
        return this;
    }

    register(name, scene)
    {
        if (typeof name !== 'string')
        {
            throw new Error('Scene name must be a string.');
        }

        this.registry.set(name, scene);
        return this;
    }

    unregister(name)
    {
        this.registry.delete(name);
        return this;
    }

    nextScene(scene, transition = null, loadOpts = {})
    {
        if (this._nextScene)
        {
            throw new Error('Cannot change scenes during a scene transition.');
        }

        // Whether to check the registry for the associated scene
        if (typeof scene === 'string')
        {
            if (!this.registry.has(scene))
            {
                throw new Error(`Cannot find scene with name '${scene}'.`);
            }

            scene = this.registry.get(scene);
        }

        // For class-like scene structure
        if (typeof scene === 'function')
        {
            scene = new scene();
        }
        // For object-like scene structure (includes modules)
        else if (typeof scene === 'object')
        {
            // Whether the scene is non-extensible and should be converted to an object
            if (!Object.isExtensible(scene))
            {
                scene = createExtensibleSceneFromModule(scene);
            }
        }
        // For anything else...
        else
        {
            throw new Error('Scene type not supported.');
        }

        this._nextScene = scene;
        this._nextLoadOpts = loadOpts;

        // NOTE: Transition MUST NEVER be null while switching scenes as it
        // also serves as the flag to stop scene updates.
        this._nextTransition = transition || NO_TRANSITION;
    }

    update(dt)
    {
        if (this._transition)
        {
            // TODO: Transitions should have their own methods and not just be tiny scenes...
            
            // Waiting for scene load...
            this._updateStep(dt, this._transition);
        }
        else if (this._nextScene)
        {
            // Starting next scene request...
            const nextScene = this._nextScene;
            const nextLoadOpts = this._nextLoadOpts;
            const nextTransition = this._nextTransition;

            this._nextScene = null;
            this._nextLoadOpts = null;
            this._nextTransition = null;

            this._transition = nextTransition;

            let result = Promise.resolve();
            let currentScene = this._scene;
            if (currentScene)
            {
                if ('onStop' in currentScene) currentScene.onStop(this.sharedContext);
                if ('unload' in currentScene) result = result.then(() =>
                    currentScene.unload(this.sharedContext));
            }

            if ('load' in nextScene) result = result.then(() =>
                nextScene.load(this.sharedContext, nextLoadOpts));
            
            result = result.then(() => {
                this._scene = nextScene;
                this._transition = null;

                if ('onStart' in this._scene) this._scene.onStart(this.sharedContext);
            });
        }
        else if (this._scene)
        {
            this._updateStep(dt, this._scene);
        }
    }

    _updateStep(dt, target)
    {
        if ('onPreUpdate' in target) target.onPreUpdate(dt);
        this.emit('preupdate', dt);
        if ('onUpdate' in target) target.onUpdate(dt);
        this.emit('update', dt);
        if ('onPostUpdate' in target) target.onPostUpdate(dt);
        this.emit('postupdate', dt);
    }

    getCurrentScene() { return this._scene; }
    getNextScene() { return this._nextScene; }

    [Symbol.iterator]()
    {
        return this.registry[Symbol.iterator]();
    }
}
Eventable$1.mixin(SceneManager);

function createExtensibleSceneFromModule(sceneModule)
{
    return {
        ...sceneModule
    };
}

/**
 * This is not required to create a scene. Any object or class
 * with any of the defined functions can be considered a valid
 * scene. This is for ease of use and readability.
 */
class SceneBase
{
    /** @abstract */
    async load(world, opts) {}
    /** @abstract */
    async unload(world) {}

    /** @abstract */
    onStart(world) {}
    /** @abstract */
    onStop(world) {}

    /** @abstract */
    onPreUpdate(dt) {}
    /** @abstract */
    onUpdate(dt) {}
    /** @abstract */
    onPostUpdate(dt) {}
}

/**
 * A camera for a view. This serves as the in-world representation of the
 * view. This is usually manipulated to move the world, zoom in, etc.
 */
class AbstractCamera
{
    /** @abstract */
    getProjectionMatrix() { return [1, 0, 0, 1, 0, 0]; }
    /** @abstract */
    getViewMatrix() { return [1, 0, 0, 1, 0, 0]; }
}

class Transform2D
{
    constructor(x = 0, y = 0)
    {
        this.matrix = [1, 0, 0, 1, x, y];
    }

    setMatrix(m11, m12, m21, m22, m31, m32)
    {
        this.matrix[0] = m11;
        this.matrix[1] = m12;
        this.matrix[2] = m21;
        this.matrix[3] = m22;
        this.matrix[4] = m31;
        this.matrix[5] = m32;
        return this;
    }

    setPosition(x, y)
    {
        this.matrix[4] = x;
        this.matrix[5] = y;
        return this;
    }

    setRotation(radians)
    {
        this.rotation = radians;
        return this;
    }

    setScale(sx, sy = sx)
    {
        let rsin = Math.sin(this.rotation);
        this.matrix[0] = sx;
        this.matrix[1] = rsin * sy;
        this.matrix[2] = -rsin * sx;
        this.matrix[3] = sy;
        return this;
    }

    // NOTE: This is for ease of access
    get x() { return this.matrix[4]; }
    set x(value) { this.matrix[4] = value; }
    get y() { return this.matrix[5]; }
    set y(value) { this.matrix[5] = value; }
    get rotation() { return Math.atan2(-this.matrix[2], this.matrix[0]); }
    set rotation(value)
    {
        let scaleX = this.scaleX;
        let scaleY = this.scaleY;
        // HACK: Rolling doesn't work...
        value = Math.abs(value);
        this.matrix[1] = Math.sin(value) * scaleY;
        this.matrix[2] = -Math.sin(value) * scaleX;
    }
    get scaleX() { return this.matrix[0]; }
    set scaleX(value)
    {
        let rotation = this.rotation;
        this.matrix[0] = value;
        this.matrix[2] = -Math.sin(rotation) * value;
    }
    get scaleY() { return this.matrix[3]; }
    set scaleY(value)
    {
        let rotation = this.rotation;
        this.matrix[1] = Math.sin(rotation) * value;
        this.matrix[3] = value;
    }

    // NOTE: This supports 2D DOMMatrix manipulation (such as transform() or setTransform())
    get a() { return this.matrix[0]; }
    get b() { return this.matrix[1]; }
    get c() { return this.matrix[2]; }
    get d() { return this.matrix[3]; }
    get e() { return this.matrix[4]; }
    get f() { return this.matrix[5]; }

    // NOTE: This supports array access (such as gl-matrix)
    get 0() { return this.matrix[0]; }
    set 0(value) { this.matrix[0] = value; }
    get 1() { return this.matrix[1]; }
    set 1(value) { this.matrix[1] = value; }
    get 2() { return this.matrix[2]; }
    set 2(value) { this.matrix[2] = value; }
    get 3() { return this.matrix[3]; }
    set 3(value) { this.matrix[3] = value; }
    get 4() { return this.matrix[4]; }
    set 4(value) { this.matrix[4] = value; }
    get 5() { return this.matrix[5]; }
    set 5(value) { this.matrix[5] = value; }
    // NOTE: These should never change for 2D transformations
    get 6() { return 0; }
    get 7() { return 0; }
    get 8() { return 1; }
    get length() { return 9; }
}

class Camera2D extends AbstractCamera
{
    static applyTransform(ctx, camera, viewOffsetX = 0, viewOffsetY = 0)
    {
        camera.setOffset(viewOffsetX, viewOffsetY);
        ctx.setTransform(...camera.getProjectionMatrix());
        ctx.transform(...camera.getViewMatrix());
    }

    static resetTransform(ctx)
    {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    static followTarget(camera, target, speed = 1)
    {
        if (target)
        {
            camera.transform.x = lerp(camera.transform.x, target.x, speed);
            camera.transform.y = lerp(camera.transform.y, target.y, speed);
        }
    }

    constructor(offsetX = 0, offsetY = 0, speed = 1)
    {
        super();
        this.target = null;
        this.speed = speed;
        this.transform = new Transform2D();

        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    setOffset(x, y)
    {
        this.offsetX = x;
        this.offsetY = y;
        return this;
    }

    /** @override */
    getProjectionMatrix()
    {
        // NOTE: Scaling must be applied here, instead of the view
        return [this.transform.matrix[0], 0, 0, this.transform.matrix[3],
            this.offsetX, this.offsetY];
    }

    /** @override */
    getViewMatrix()
    {
        let dst = [ ...this.transform.matrix ];
        dst[0] = Math.cos(this.transform.rotation);
        dst[3] = dst[0];
        dst[4] = -dst[4];
        dst[5] = -dst[5];
        return dst;
    }
}

const CELL_SIZE = 32;
const ORIGIN_POINT = new DOMPointReadOnly(0, 0, 0, 1);
const CELL_POINT = new DOMPointReadOnly(CELL_SIZE, CELL_SIZE, 0, 1);
const INV_NATURAL_LOG_2 = 1 / Math.log(2);

function drawWorldGrid(ctx, view, camera)
{
    const viewMatrix = new DOMMatrixReadOnly(camera.getViewMatrix());
    const projMatrix = new DOMMatrixReadOnly(camera.getProjectionMatrix());
    const transformMatrix = projMatrix.multiply(viewMatrix);
    const offsetPoint = transformMatrix.transformPoint(ORIGIN_POINT);
    const cellPoint = transformMatrix.transformPoint(CELL_POINT);

    const minCellWidth = cellPoint.x - offsetPoint.x;
    const minCellHeight = cellPoint.y - offsetPoint.y;
    const maxCellSize = Math.floor((Math.log(view.width) - Math.log(minCellWidth)) * INV_NATURAL_LOG_2);
    
    let cellWidth = Math.pow(2, maxCellSize) * minCellWidth;
    let cellHeight = Math.pow(2, maxCellSize) * minCellHeight;
    if (cellWidth === 0 || cellHeight === 0) return;
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth, cellHeight, 1, false);
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth / 2, cellHeight / 2, 3 / 4, false);
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth / 4, cellHeight / 4, 2 / 4, false);
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth / 8, cellHeight / 8, 1 / 4, false);
}

function drawWorldTransformGizmo(ctx, view, camera)
{
    const viewMatrix = new DOMMatrixReadOnly(camera.getViewMatrix());
    const worldPoint = viewMatrix.transformPoint(ORIGIN_POINT);
    const fontSize = view.width / CELL_SIZE;
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px monospace`;
    ctx.fillText(`(${-Math.floor(worldPoint.x)},${-Math.floor(worldPoint.y)})`, CELL_SIZE, CELL_SIZE);
    drawTransformGizmo(ctx, CELL_SIZE / 4, CELL_SIZE / 4, CELL_SIZE, CELL_SIZE);
}

function drawGrid(ctx, view, offsetX, offsetY, cellWidth = 32, cellHeight = cellWidth, lineWidth = 1, showCoords = false)
{
    ctx.beginPath();
    for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
    {
        ctx.moveTo(0, y);
        ctx.lineTo(view.width, y);
    }
    for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
    {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, view.height);
    }
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.lineWidth = 1;

    if (showCoords)
    {
        const fontSize = Math.min(cellWidth / 4, 16);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = '#333333';

        for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
        {
            for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
            {
                ctx.fillText(`(${Math.round((x - offsetX) / cellWidth)},${Math.round((y - offsetY) / cellHeight)})`, x + lineWidth * 2, y + lineWidth * 2);
            }
        }
    }
}

function drawTransformGizmo(ctx, x, y, width, height = width)
{
    const fontSize = width * 0.6;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px monospace`;

    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
    ctx.fillStyle = '#FF0000';
    ctx.fillText('x', width + fontSize, 0);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.strokeStyle = '#00FF00';
    ctx.stroke();
    ctx.fillStyle = '#00FF00';
    ctx.fillText('y', 0, height + fontSize);

    const zSize = fontSize / 4;
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(-zSize / 2, -zSize / 2, zSize, zSize);
    ctx.fillText('z', fontSize / 2, fontSize / 2);

    ctx.translate(-x, -y);
}

var CameraHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    drawWorldGrid: drawWorldGrid,
    drawWorldTransformGizmo: drawWorldTransformGizmo,
    drawGrid: drawGrid,
    drawTransformGizmo: drawTransformGizmo
});

const CONTEXT$3 = _default$1.createContext().disable();
const UP$1 = CONTEXT$3.registerState('up', {
    'key[ArrowUp].up': 0,
    'key[ArrowUp].down': 1,
    'key[w].up': 0,
    'key[w].down': 1
});
const DOWN$1 = CONTEXT$3.registerState('down', {
    'key[ArrowDown].up': 0,
    'key[ArrowDown].down': 1,
    'key[s].up': 0,
    'key[s].down': 1
});
const LEFT$1 = CONTEXT$3.registerState('left', {
    'key[ArrowLeft].up': 0,
    'key[ArrowLeft].down': 1,
    'key[a].up': 0,
    'key[a].down': 1
});
const RIGHT$1 = CONTEXT$3.registerState('right', {
    'key[ArrowRight].up': 0,
    'key[ArrowRight].down': 1,
    'key[d].up': 0,
    'key[d].down': 1
});
const ZOOM_IN = CONTEXT$3.registerState('zoomin', {
    'key[z].up': 0,
    'key[z].down': 1
});
const ZOOM_OUT = CONTEXT$3.registerState('zoomout', {
    'key[x].up': 0,
    'key[x].down': 1
});
const ROLL_LEFT = CONTEXT$3.registerState('rollleft', {
    'key[q].up': 0,
    'key[q].down': 1
});
const ROLL_RIGHT = CONTEXT$3.registerState('rollright', {
    'key[e].up': 0,
    'key[e].down': 1
});

function doCameraMove(camera, moveSpeed = 6, zoomSpeed = 0.02, rotSpeed = 0.01)
{
    const xControl = RIGHT$1.value - LEFT$1.value;
    const yControl = DOWN$1.value - UP$1.value;
    const zoomControl = ZOOM_OUT.value - ZOOM_IN.value; 
    const rollControl = ROLL_RIGHT.value - ROLL_LEFT.value;

    // let roll = rollControl * rotSpeed;
    // camera.transform.rotation += roll;

    let scale = (zoomControl * zoomSpeed) + 1;
    let scaleX = camera.transform.scaleX * scale;
    let scaleY = camera.transform.scaleY * scale;
    camera.transform.setScale(scaleX, scaleY);

    let moveX = (xControl * moveSpeed) / scaleX;
    let moveY = (yControl * moveSpeed) / scaleY;
    camera.transform.x += moveX;
    camera.transform.y += moveY;
}

var Camera2DControls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CONTEXT: CONTEXT$3,
    UP: UP$1,
    DOWN: DOWN$1,
    LEFT: LEFT$1,
    RIGHT: RIGHT$1,
    ZOOM_IN: ZOOM_IN,
    ZOOM_OUT: ZOOM_OUT,
    ROLL_LEFT: ROLL_LEFT,
    ROLL_RIGHT: ROLL_RIGHT,
    doCameraMove: doCameraMove
});

class RandomGenerator
{
    /** @abstract */
    next() { return Math.random(); }
}

// SOURCE: https://gist.github.com/blixt/f17b47c62508be59987b
class SimpleRandomGenerator extends RandomGenerator
{
    constructor(seed = 0)
    {
        super();

        this._seed = Math.abs(seed % 2147483647);
        this._next = this._seed;
    }

    /** @override */
    next()
    {
        this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
        return this._next / 2147483646;
    }

    get seed() { return this._seed; }
}

class RandomInterface
{
    constructor(generator)
    {
        this.generator = generator;
    }

    next() { return this.generator.next(); }

    choose(list)
    {
        return list[Math.floor(this.next() * list.length)];
    }

    range(min, max)
    {
        return ((max - min) * this.next()) + min;
    }

    sign()
    {
        return this.next() < 0.5 ? -1 : 1;
    }
}

class DefaultRandomInterface extends RandomInterface
{
    constructor() { super(new RandomGenerator()); }

    withGenerator(generator) { return new RandomInterface(generator); }
    withSeed(seed) { return new RandomInterface(new SimpleRandomGenerator(seed)); }
}

const DEFAULT_RANDOM_INTERFACE = new DefaultRandomInterface();



export default self;
export { AbstractCamera, AbstractInputAdapter, ActionInputAdapter, ApplicationLoop, Audio, Camera2D, Camera2DControls, CameraHelper, ComponentHelper as Component, ComponentBase, ComponentFactory, DOUBLE_ACTION_TIME, _default as Display, DisplayPort, DoubleActionInputAdapter, EntityHelper as Entity, EntityBase, EntityComponent$1 as EntityComponent, EntityManager, EntityQuery, EntitySpawner, EntityWrapper, EventKey, Eventable$1 as Eventable, FineDiffStrategy, Game, HotEntityModule, HotEntityReplacement, _default$1 as Input, InputContext, InputSource, Keyboard, MODE_CENTER, MODE_FIT, MODE_NOSCALE, MODE_STRETCH, Mouse, MouseControls, MoveControls, PriorityQueue, QueryOperator, DEFAULT_RANDOM_INTERFACE as Random, RandomGenerator, RandomInterface, RangeInputAdapter, ReflexiveEntity, SceneBase, SceneManager, SimpleRandomGenerator, SplashScene, StateInputAdapter, TagComponent, Transform2D, View, clampRange, cycleRange, direction2, distance2, lerp, lookAt2, uuid, withinRadius };
