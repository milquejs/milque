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

export { _default as Display, DisplayPort, MODE_CENTER, MODE_FIT, MODE_NOSCALE, MODE_STRETCH };
