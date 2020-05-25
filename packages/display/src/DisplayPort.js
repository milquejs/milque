export const MODE_NOSCALE = 'noscale';
export const MODE_CENTER = 'center';
export const MODE_FIT = 'fit';
export const MODE_STRETCH = 'stretch';

const DEFAULT_MODE = MODE_NOSCALE;
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 150;

const INNER_HTML = `
<div>
    <label class="hidden" id="title">display-port</label>
    <label class="hidden" id="fps">00</label>
    <label class="hidden" id="dimension">0x0</label>
    <canvas></canvas>
</div>`;
const INNER_STYLE = `
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
    image-rendering: pixelated;
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
    outline: 6px dashed rgba(0, 0, 0, 0.1);
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
}`;

const TEMPLATE_KEY = Symbol('template');
const STYLE_KEY = Symbol('style');

/**
 * @version 1.2.0
 * @description
 * # Changelog
 * ## 1.2.1
 * - Added 'contexttype' for getContext()
 * ## 1.2.0
 * - Moved template creation to static time
 * - Removed default export
 * ## 1.1.2
 * - Added clear()
 * - Added delta time for frame events
 * ## 1.1.1
 * - Added onframe and onresize attribute callbacks
 * - Added "stretch" mode
 * ## 1.1.0
 * - Changed "topleft" to "noscale"
 * - Changed default size to 640 x 480
 * - Changed "center" and "fit" to fill container instead of viewport
 * - Added "full" property to override and fill viewport
 * ## 1.0.2
 * - Moved default values to the top
 * ## 1.0.1
 * - Fixed scaling issues when dimensions do not match
 * ## 1.0.0
 * - Created DisplayPort
 * 
 * @fires frame Every time a new frame is rendered.
 * @fires resize When the display is resized.
 */
export class DisplayPort extends HTMLElement
{
    static get [TEMPLATE_KEY]()
    {
        let template = document.createElement('template');
        template.innerHTML = INNER_HTML;
        Object.defineProperty(this, TEMPLATE_KEY, { value: template });
        return template;
    }

    static get [STYLE_KEY]()
    {
        let style = document.createElement('style');
        style.innerHTML = INNER_STYLE;
        Object.defineProperty(this, STYLE_KEY, { value: style });
        return style;
    }

    /** @override */
    static get observedAttributes()
    {
        return [
            'width',
            'height',
            'disabled',
            'contexttype',
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
        this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

        this._canvasElement = this.shadowRoot.querySelector('canvas');
        this._canvasContext = null;

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

    get canvas() { return this._canvasElement; }
    
    /** @override */
    connectedCallback()
    {
        if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;
        if (!this.hasAttribute('contexttype')) this.contexttype = '2d';
        
        // Allows this element to be focusable
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);

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
            case 'contexttype':
                this._canvasContext = this._canvasElement.getContext(value);
                this._canvasContext.imageSmoothingEnabled = false;
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
                prevTime: this._prevAnimationFrameTime,
                deltaTime: delta,
                canvasContext: this._canvasContext
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

        if (canvas.clientWidth !== canvasWidth || canvas.clientHeight !== canvasHeight)
        {
            canvas.width = this._width;
            canvas.height = this._height;
            canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;
            this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
        }
    }

    /** @deprecated */
    getCanvas() { return this._canvasElement; }
    /** @deprecated */
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

    get contexttype() { return this.getAttribute('contexttype'); }
    set contexttype(value) { this.setAttribute('contexttype', value ); }

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value) { if (value) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

    // NOTE: For debugging purposes...
    get debug() { return this.hasAttribute('debug'); }
    set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
}
window.customElements.define('display-port', DisplayPort);
